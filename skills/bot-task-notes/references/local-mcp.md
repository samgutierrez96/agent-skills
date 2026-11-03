# Local OpsHub MCP connection

Verified November 2, 2026 on Sam's Mac. These are connection observations,
not a guarantee of future availability or authentication.

## What was established

- OpsHub is configured in ~/.codex/config.toml and ~/.cursor/mcp.json.
  The Codex configuration selects the local source at
  ~/Documents/superdojo/services/opshub-mcp; the Cursor configuration used a
  GitHub package source. Do not copy one over the other without reconciliation.
- This chat's native startup logged "No such file or directory (os error 2)"
  for opshub, followed by omission of the server's tools.
- The configured executable was the bare name uvx. The executable exists at
  ~/.local/bin/uvx. Launching with that absolute path, the configured local
  package, and the existing environment-file path succeeded.
- MCP initialize and list_tools returned server opendoor_opshub_mcp and
  121 tools, including list_properties, get_customer_profile, get_task,
  create_acq_note, log_status_note, and complete_task.
- A launcher/PATH mismatch is a likely explanation, not a proven exclusive
  root cause. The native connection was not repaired or retested after editing.
- Only handshake and tool listing were tested. No live note write or readback,
  credential validity check against a customer record, or task completion was
  performed. Do not claim posting has already been end-to-end tested.

## Safe fallback

Prefer native tools when available. Otherwise inspect the relevant MCP
configuration without printing environment values, tokens, or cookies. Adapt
paths deliberately on another machine. Do not edit shared configuration merely
because a native startup failed.

On the verified machine the server's .venv/bin/python includes the MCP client.
The following probe initializes and lists tools only. Use the existing
credentials by reference; never read or reproduce the secret file in the chat:

```python
import asyncio
import os
from pathlib import Path
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def probe():
    user_dir = Path.home()
    package = user_dir / "Documents/superdojo/services/opshub-mcp"
    env = dict(
        os.environ,
        OPSHUB_ENV_FILE=str(user_dir / ".opshub-mcp.env"),
        PYTHONUTF8="1",
        PYTHONIOENCODING="utf-8",
    )
    params = StdioServerParameters(
        command=str(user_dir / ".local/bin/uvx"),
        args=["--from", str(package), "opendoor-opshub-mcp"],
        env=env,
    )
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            initialized = await session.initialize()
            listing = await session.list_tools()
            print(initialized.serverInfo.name)
            print([tool.name for tool in listing.tools])

asyncio.run(asyncio.wait_for(probe(), 45))
```

For an actual requested workflow, initialize a fresh client session, inspect
the required tool schemas, and invoke them with session.call_tool(name,
arguments=...). Apply the skill's target verification and write/readback gates.
A successful local client does not restore native tool visibility by itself.
If the fallback fails, report the concrete blocker and keep the note as a draft;
do not keep retrying mutations or silently change authentication/settings.
