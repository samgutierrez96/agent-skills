#!/usr/bin/env python3
"""One bounded, unauthenticated public-listing read. Standard library only."""
import argparse
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
import re
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

MAX_BYTES = 3 * 1024 * 1024
MAX_TEXT = 12000
TIMEOUT = 10


def listing_url(url):
    parsed = urlsplit(url)
    if (len(url) > 2048 or re.search(r'[\s\x00-\x1f\x7f]', url)
            or parsed.scheme != 'https' or parsed.netloc not in {'www.opendoor.com', 'opendoor.com'}
            or not parsed.path.startswith('/properties/') or parsed.query or parsed.fragment
            or not re.search(r'/aid_[0-9a-fA-F-]{36}/?$', parsed.path)):
        raise ValueError('Expected a verified HTTPS Opendoor property URL with an address token.')
    return url


class ListingRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        listing_url(newurl)  # Reject other hosts/paths before making another request.
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.hidden = []
        self.title_depth = 0
        self.title = []
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in {'script', 'style', 'svg', 'noscript', 'template'}:
            self.hidden.append(tag)
        if tag == 'title':
            self.title_depth += 1

    def handle_endtag(self, tag):
        if self.hidden and tag == self.hidden[-1]:
            self.hidden.pop()
        if tag == 'title':
            self.title_depth = max(0, self.title_depth - 1)

    def handle_data(self, data):
        if self.hidden:
            return
        if self.title_depth:
            self.title.append(data)
        else:
            self.parts.append(data)


def read_listing(url, opener=None):
    listing_url(url)
    opener = opener or build_opener(ListingRedirect())
    request = Request(url, headers={'User-Agent':'SkillRouter-PublicListing/1.0', 'Accept':'text/html'})
    with opener.open(request, timeout=TIMEOUT) as response:
        final_url = listing_url(response.geturl())
        if response.headers.get_content_type() != 'text/html':
            raise ValueError('The listing response was not HTML; no listing facts verified.')
        raw = response.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES:
            raise ValueError('Listing exceeded the bounded read; no listing facts verified.')
        charset = response.headers.get_content_charset() or 'utf-8'
        page = raw.decode(charset, errors='replace')
    parser = VisibleText()
    parser.feed(page)
    text = re.sub(r'\s+', ' ', ' '.join(parser.parts)).strip()
    if not text:
        raise ValueError('No visible listing text; no listing facts verified.')
    truncated = len(text) > MAX_TEXT
    return {'url':final_url, 'title':' '.join(parser.title).strip()[:500],
        'visible_text':text[:MAX_TEXT], 'truncated':truncated,
        'coverage':'Visible server-rendered text only; no scripts, private facts or inferred absences.'
                   + (' Output truncated; missing content remains unknown.' if truncated else ''),
        'fetched_at':datetime.now(timezone.utc).isoformat()}


def main(argv=None):
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('--url', required=True)
    values = args.parse_args(argv)
    try:
        result = read_listing(values.url)
    except Exception as exc:
        print(json.dumps({'status':'blocked', 'error':str(exc)[:300],
            'coverage':'No listing facts verified; no automatic retry.'}))
        return 1
    print(json.dumps({'status':'finished', **result}, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
