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

Then type `/mcp`, choose nirvaana, and press Allow in your browser, once. The plugin brings the connector, the guidance Claude follows (the `working-with-nirvaana` skill) and `/wrap-up`.

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
plugins/nirvaana/commands/wrap-up.md               /wrap-up
gemini-extension.json, GEMINI.md                   the Gemini CLI extension
```

Copyright Nirvaana AI, Inc. All rights reserved.
