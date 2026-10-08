# Nirvaana for Claude Code, Gemini CLI and every MCP app

[Nirvaana](https://nirvaana.ai) keeps one person's world: what they told it, decided and promised, and the shared worlds (teams) they are in. This repository connects it to your AI apps. Every app reaches the same address, `https://nirvaana.ai/api/mcp`, and every install ends on Nirvaana's own Allow page, so nothing connects without your consent. There is no key to paste.

## Add Nirvaana

**Claude Code** (this repo is a plugin marketplace). In Claude Code:

```
/plugin marketplace add Nirvaana-AI-INC/nirvaana-claude-plugin
/plugin install nirvaana@nirvaana
```

Or from a terminal:

```
claude plugin marketplace add Nirvaana-AI-INC/nirvaana-claude-plugin && claude plugin install nirvaana@nirvaana
```

Then type `/mcp`, choose nirvaana, and press Allow in your browser, once. The plugin brings the connector, the guidance Claude follows (the `working-with-nirvaana` skill), a catch-up when each session starts, `/catch-up` and `/wrap-up`.

**Claude on the web, the desktop app, your phone and Cowork.** [Add to Claude](https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Nirvaana&connectorUrl=https%3A%2F%2Fnirvaana.ai%2Fapi%2Fmcp): Claude opens with Nirvaana filled in. Press Add, then Allow.

**Cursor.** [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=nirvaana&config=eyJ1cmwiOiJodHRwczovL25pcnZhYW5hLmFpL2FwaS9tY3AifQ%3D%3D)

**VS Code.** [Add to VS Code](vscode:mcp/install?%7B%22name%22%3A%22nirvaana%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fnirvaana.ai%2Fapi%2Fmcp%22%7D)

**Codex.**

```
codex mcp add nirvaana --url https://nirvaana.ai/api/mcp
```

**Gemini CLI** (this repo is also a Gemini CLI extension):

```
gemini extensions install https://github.com/Nirvaana-AI-INC/nirvaana-claude-plugin
```

Then run `/mcp auth nirvaana` in Gemini CLI and press Allow.

**Everything at once.** `npx nirvaana setup` in a project folder adds Nirvaana to Claude Code (this plugin), and to Codex and Gemini CLI where they are installed, after asking.

The steps, app by app: https://nirvaana.ai/help/connect-claude

## Nirvaana without saying "Nirvaana"

With the plugin on, you don't have to name Nirvaana. Ask "what's due this week?", "remind me to call Sam Friday" or "run my Monday summary", and Claude uses Nirvaana by itself; ask it to fix a TypeScript error, and it leaves Nirvaana alone. Claude stays Claude, with Nirvaana behind it.

- **Every session starts caught up.** The plugin's SessionStart hook brings in the compact catch-up: late and due promises in full, and only what else changed since your last one. Where this computer's terminal is signed in to Nirvaana (`npx nirvaana login`), it runs `npx nirvaana@0.32.0 catch-up --compact`, which only reads. It always runs that exact release, the one this plugin release names, never a newer one on its own. It runs in an empty folder of its own, never the project you opened, so a repository's `node_modules` or `.npmrc` can't choose what runs. Its words reach Claude marked as stored data, never instructions. Otherwise, or if Nirvaana doesn't answer within about 20 seconds (then the whole process is stopped), it asks Claude to call `catch_me_up` once through the connector. It stays quiet when your own Claude settings already start sessions with setup's catch-up hook (it only reads them), or when a catch-up came in the last minute. It never stops a session. To turn it off, set `NIRVAANA_CATCH_UP=off` in your environment.
- **The skill covers everyday work**: what's due, reminders and promises, people, plans, decisions, calendar, teams, your saved automations (worker bees), telling a teammate, and catching up or wrapping up. Claude picks it up without the word Nirvaana.
- **`/catch-up`** asks for the catch-up again; **`/wrap-up`** keeps a short summary of the session in your own world only.

`npx nirvaana setup` can also add your Nirvaana preferences to `~/.claude/CLAUDE.md` and `~/.codex/AGENTS.md`, after showing them to you and asking. For Claude on the web, ChatGPT and Muse, copy them from https://nirvaana.ai/help/connect-claude#preferences.

## What it can and can't do

It reads as you: exactly what you can see in Nirvaana, and nothing else. What it hands back goes past Nirvaana's doorkeeper, which decides what to keep, and anything for a shared world waits for your approval. To disconnect, sign it out in Nirvaana under Settings, Apps and terminals.

- Privacy: https://nirvaana.ai/privacy
- Terms: https://nirvaana.ai/terms
- Support: hello@nirvaana.ai

## What is in here

```
.claude-plugin/marketplace.json                    the Claude Code marketplace (one plugin, nirvaana)
plugins/nirvaana/.claude-plugin/plugin.json        the plugin
plugins/nirvaana/.mcp.json                         the connector: https://nirvaana.ai/api/mcp
plugins/nirvaana/skills/working-with-nirvaana/     the guidance Claude follows
plugins/nirvaana/hooks/                            the catch-up when a session starts
plugins/nirvaana/commands/catch-up.md              /catch-up
plugins/nirvaana/commands/wrap-up.md               /wrap-up
tests/                                             the hook's tests (node --test tests/*.test.mjs; CI runs them)
gemini-extension.json, GEMINI.md                   the Gemini CLI extension
```

Copyright Nirvaana AI, Inc. All rights reserved.
