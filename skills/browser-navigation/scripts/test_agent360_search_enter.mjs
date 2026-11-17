import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

// Uses only its own headless browser; no live Chrome, network or customer data.
const { chromium } = createRequire(import.meta.url)('playwright');
const guard = vm.runInNewContext(fs.readFileSync(new URL('./agent360_guard.js', import.meta.url), 'utf8'));
assert.equal(guard.searchEnter.key, String.fromCharCode(13));
assert.equal(guard.searchEnter.code, 'Enter');
assert.equal(Object.isFrozen(guard.searchEnter), true);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  // Reproduce the installed Agent 360 1.31.0 documented key/code mapping.
  const cdp = await page.context().newCDPSession(page);
  async function press({ key, code = key }) {
    const one = key.length === 1;
    const vk = key === 'Enter' ? { windowsVirtualKeyCode:13, nativeVirtualKeyCode:13 } : {};
    await cdp.send('Input.dispatchKeyEvent', {
      type:'keyDown', key, code, modifiers:0, text:one ? key : '', ...vk,
    });
    await cdp.send('Input.dispatchKeyEvent', { type:'keyUp', key, code, modifiers:0, ...vk });
  }
  async function setup() {
    await page.setContent(`<!doctype html><title>Synthetic search only</title>
      <form id="search"><input id="query" aria-label="Search" required><output id="result">Ready</output></form>
      <form id="mutation"><button>Unrelated action</button></form><output id="writes">0</output>
      <script>
      document.querySelector('#search').onsubmit=e=>{
        e.preventDefault();
        const out=document.querySelector('#result');
        out.dataset.count=String(Number(out.dataset.count||0)+1);
        out.textContent=document.querySelector('#query').value==='2025550123'?'Exact synthetic candidate':'No matches';
      };
      document.querySelector('#mutation').onsubmit=e=>{
        e.preventDefault();document.querySelector('#writes').textContent='1';
      };
      </script>`);
    await page.locator('#query').fill('2025550123');
  }
  await setup();
  await press({ key:'Enter' });
  assert.equal(await page.locator('#result').innerText(), 'Ready',
    'ordinary Enter is received but does not submit with the installed tool mapping');
  await press(guard.searchEnter);
  assert.equal(await page.locator('#result').innerText(), 'Exact synthetic candidate');
  assert.equal(await page.locator('#result').getAttribute('data-count'), '1',
    'one distinct search recovery submits exactly once');
  assert.equal(await page.locator('#query').inputValue(), '2025550123');
  assert.equal(await page.locator('#writes').innerText(), '0');

  await setup();
  await press(guard.searchEnter);
  assert.equal(await page.locator('#result').getAttribute('data-count'), '1',
    'direct search-only Enter also submits exactly once');
  await page.locator('#query').fill('');
  await press(guard.searchEnter);
  assert.equal(await page.locator('#result').getAttribute('data-count'), '1',
    'native form validation is preserved');
  assert.equal(await page.locator('#writes').innerText(), '0');
  console.log('Synthetic search Enter regression passed: old=0, recovery=1, direct=1; no live browser invoked.');
} finally {
  await browser.close();
}
