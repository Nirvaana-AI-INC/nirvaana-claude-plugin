#!/usr/bin/env node
// Your brain, for Claude Code: a stdio MCP server that hands every call to the Nirvaana app on this
// Mac, which holds ~/Nirvaana's index (SQLite full text, vectors, the graph) and answers on the
// loopback address only. Nothing here reads the index itself, and nothing leaves this computer.
//
// The app writes ~/Nirvaana/index/brain-mcp.json ({port, token}, mode 0600) while it runs. With no
// file, or an app that does not answer, this server still starts and every tool says, calmly, that
// the Nirvaana app is not running: Claude Code keeps working with the server `nirvaana` alone.
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";

const WHERE = join(process.env.NIRVAANA_HOME || join(homedir(), "Nirvaana"), "index", "brain-mcp.json");
const NOT_RUNNING = "The Nirvaana app is not running on this Mac, so your brain can't be read just now. Open Nirvaana and ask again.";

function door() {
  try {
    const d = JSON.parse(readFileSync(WHERE, "utf8"));
    if (Number.isInteger(d.port) && typeof d.token === "string" && d.token.length >= 32) return d;
  } catch {
    /* no app */
  }
  return null;
}

/**
 * One JSON-RPC message to the app, as the app's brain server takes it: the same shape, over loopback,
 * with the token. Null when the app is not there; a status when it refused (a 401 after the app
 * signed in again is tried once more with the door read afresh).
 */
async function forward(msg, again = true) {
  const d = door();
  if (!d) return null;
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20_000);
  try {
    const r = await fetch(`http://127.0.0.1:${d.port}/mcp`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${d.token}` }, body: JSON.stringify(msg), signal: ctl.signal });
    if (r.status === 401 && again) return forward(msg, false);
    if (!r.ok) return { refused: r.status };
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

const TOOLS = [
  { name: "brain_query", description: "Search what is on this Mac in ~/Nirvaana (notes, files, lecture notes, past decisions) and get a short context pack with its sources named. Use before answering about the person's own files or notes.", inputSchema: { type: "object", properties: { question: { type: "string", description: "What you want to know, in plain words." }, budget: { type: "integer", description: "At most this many tokens of context (default 1500, up to 3000)." } }, required: ["question"] } },
  { name: "brain_add", description: "File a short note into the person's brain on this Mac (~/Nirvaana/brain/inbox): a decision, a fact, a thing learned. Plain prose; it is indexed at once.", inputSchema: { type: "object", properties: { text: { type: "string", description: "The note, under 4,000 characters." }, title: { type: "string", description: "A short title (optional)." }, kind: { type: "string", enum: ["note", "decision", "fact", "handoff"], description: "What kind of note (default note)." } }, required: ["text"] } },
  { name: "brain_files", description: "Find files on this Mac under ~/Nirvaana by what they say or what they are called. Returns paths and one line each; open them with your own tools.", inputSchema: { type: "object", properties: { query: { type: "string", description: "Words from the file's name or contents." }, limit: { type: "integer", description: "At most this many (default 10, up to 40)." } }, required: ["query"] } },
];

const text = (s) => ({ content: [{ type: "text", text: s }] });

async function handle(msg) {
  const { id, method, params } = msg;
  if (method === "initialize") return { jsonrpc: "2.0", id, result: { protocolVersion: params?.protocolVersion || "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "nirvaana-brain", version: "1.1.0" } } };
  if (method === "notifications/initialized" || method === "ping") return id === undefined ? null : { jsonrpc: "2.0", id, result: {} };
  if (method === "tools/list") {
    // The app's own list while it is up (so the two never drift); this one when it is not.
    const live = await forward({ jsonrpc: "2.0", id, method, params });
    return live && !live.refused && live.result ? live : { jsonrpc: "2.0", id, result: { tools: TOOLS } };
  }
  if (method === "tools/call") {
    const name = params?.name;
    if (!TOOLS.some((t) => t.name === name)) return { jsonrpc: "2.0", id, error: { code: -32602, message: `No tool called ${String(name)}.` } };
    const answer = await forward({ jsonrpc: "2.0", id, method, params });
    if (!answer) return { jsonrpc: "2.0", id, result: text(NOT_RUNNING) };
    if (answer.refused) return { jsonrpc: "2.0", id, result: text(`The Nirvaana app refused this (${answer.refused}). Open Nirvaana, sign in, and ask again.`) };
    return answer;
  }
  if (id === undefined) return null;
  return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${String(method)}` } };
}

const out = (m) => m && process.stdout.write(JSON.stringify(m) + "\n");
createInterface({ input: process.stdin, crlfDelay: Infinity }).on("line", (line) => {
  if (!line.trim()) return;
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return out({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
  }
  handle(msg).then(out, (e) => out({ jsonrpc: "2.0", id: msg.id ?? null, error: { code: -32603, message: e instanceof Error ? e.message : String(e) } }));
});
process.stdin.on("end", () => process.exit(0));
