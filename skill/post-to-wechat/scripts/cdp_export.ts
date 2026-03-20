#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import process from "node:process";

const DEFAULT_APP_URL = "https://wechat.reshub.vip";
const DEFAULT_CDP_URL = "http://127.0.0.1:9222";
const DEFAULT_DELAY_SCALE = 3;
const DEFAULT_JITTER_MS = 800;

type Frontmatter = Record<string, string>;

type LocalChromeOptions = {
  profileDir?: string;
  chromePath?: string;
};

type CDPRequestPending = {
  resolve: (value: any) => void;
  reject: (reason?: unknown) => void;
};

type CDPTarget = {
  id?: string;
  type?: string;
  url?: string;
  webSocketDebuggerUrl?: string;
};
const CHROME_CANDIDATES = {
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  ],
  win32: [
    "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    "C:\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
    "C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe"
  ],
  linux: [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
    "/usr/bin/microsoft-edge"
  ],
  wsl: [
    "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
    "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  ]
};

function printHelp() {
  process.stdout.write(
    [
      "Usage:",
      "  node scripts/cdp_export.ts --markdown-file article.md [--theme minimal] [--action copy-rich]",
      "  echo '# Title' | node scripts/cdp_export.ts --markdown-stdin --action copy-rich",
      "  node scripts/cdp_export.ts --source https://example.com/article --selector article",
      "",
      "Inputs:",
      "  --source <url>",
      "  --markdown <text>",
      "  --markdown-file <path>",
      "  --markdown-stdin",
      "",
      "Actions:",
      "  copy-rich   default",
      "  export-html",
      "  write-only",
      "",
      "Common options:",
      "  --app <url>",
      "  --theme <name>",
      "  --cdp <url>",
      "  --launch-local",
      "  --wechat",
      "  --title <text>",
      "  --author <text>",
      "  --summary <text>",
      "  --cover <path>",
      "  --no-submit",
      "  --no-original"
    ].join("\n")
  );
}

function fileExists(filePath: string) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function isWsl() {
  return Boolean(process.env.WSL_DISTRO_NAME);
}

function findChromeExecutable(chromePathOverride?: string) {
  if (chromePathOverride && fileExists(chromePathOverride)) {
    return chromePathOverride;
  }

  const envPath =
    process.env.MD2WECHAT_CHROME_PATH ||
    process.env.WECHAT_BROWSER_CHROME_PATH ||
    process.env.CHROME_PATH;
  if (envPath && fileExists(envPath)) {
    return envPath;
  }

  const platform = process.platform;
  const candidates = [
    ...(platform === "darwin" ? CHROME_CANDIDATES.darwin : []),
    ...(platform === "win32" ? CHROME_CANDIDATES.win32 : []),
    ...(platform === "linux" ? CHROME_CANDIDATES.linux : [])
  ];
  if (isWsl()) {
    candidates.push(...CHROME_CANDIDATES.wsl);
  }

  return candidates.find((candidate) => fileExists(candidate));
}

function resolveProfileDir(profileDirOverride?: string) {
  if (profileDirOverride) {
    return profileDirOverride;
  }
  const envPath =
    process.env.MD2WECHAT_PROFILE_DIR ||
    process.env.WECHAT_BROWSER_PROFILE_DIR ||
    process.env.CHROME_PROFILE_DIR;
  if (envPath) {
    return envPath;
  }
  return path.join(os.tmpdir(), "md2wechat-cdp-profile");
}

function applyThemeParam(appUrl: string, theme: string) {
  if (!theme) {
    return appUrl;
  }
  const url = new URL(appUrl);
  url.searchParams.set("theme", theme);
  return url.toString();
}

async function readStdin(): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    process.stdin.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    process.stdin.on("error", reject);
  });
}

function parseArgs(argv) {
  const args = {
    help: false,
    source: "",
    markdown: "",
    markdownFile: "",
    markdownStdin: false,
    selector: "",
    app: DEFAULT_APP_URL,
    cdp: DEFAULT_CDP_URL,
    theme: "",
    action: "copy-rich",
    launchLocal: false,
    profileDir: "",
    chromePath: "",
    copyStrategy: "",
    wechat: false,
    wechatUrl: "https://mp.weixin.qq.com/",
    wechatMenu: "图文",
    wechatEditorSelector: "",
    wechatWaitLoginMs: 120000,
    wechatSubmit: false,
    noSubmit: false,
    title: "",
    author: "",
    summary: "",
    cover: "",
    delayScale: DEFAULT_DELAY_SCALE,
    jitterMs: DEFAULT_JITTER_MS,
    original: true
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }

    if (token === "--source") {
      args.source = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--markdown") {
      args.markdown = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--markdown-file") {
      args.markdownFile = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--markdown-stdin") {
      args.markdownStdin = true;
      continue;
    }

    if (token === "--selector") {
      args.selector = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--app") {
      args.app = argv[index + 1] ?? DEFAULT_APP_URL;
      index += 1;
      continue;
    }

    if (token === "--cdp") {
      args.cdp = argv[index + 1] ?? DEFAULT_CDP_URL;
      index += 1;
      continue;
    }

    if (token === "--theme") {
      args.theme = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--action") {
      args.action = argv[index + 1] ?? "export-html";
      index += 1;
      continue;
    }

    if (token === "--copy-strategy") {
      args.copyStrategy = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--wechat") {
      args.wechat = true;
      continue;
    }

    if (token === "--wechat-url") {
      args.wechatUrl = argv[index + 1] ?? args.wechatUrl;
      index += 1;
      continue;
    }

    if (token === "--wechat-menu") {
      args.wechatMenu = argv[index + 1] ?? args.wechatMenu;
      index += 1;
      continue;
    }

    if (token === "--wechat-editor") {
      args.wechatEditorSelector = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--wechat-wait") {
      const value = Number.parseInt(argv[index + 1] ?? "", 10);
      args.wechatWaitLoginMs = Number.isFinite(value) ? value : args.wechatWaitLoginMs;
      index += 1;
      continue;
    }

    if (token === "--submit") {
      args.wechatSubmit = true;
      continue;
    }

    if (token === "--no-submit") {
      args.noSubmit = true;
      continue;
    }

    if (token === "--title") {
      args.title = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--author") {
      args.author = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--summary") {
      args.summary = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--cover") {
      args.cover = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--delay-scale") {
      const value = Number.parseFloat(argv[index + 1] ?? "");
      args.delayScale = Number.isFinite(value) ? value : args.delayScale;
      index += 1;
      continue;
    }

    if (token === "--no-original") {
      args.original = false;
      continue;
    }

    if (token === "--jitter-ms") {
      const value = Number.parseInt(argv[index + 1] ?? "", 10);
      args.jitterMs = Number.isFinite(value) ? value : args.jitterMs;
      index += 1;
      continue;
    }

    if (token === "--launch-local") {
      args.launchLocal = true;
      continue;
    }

    if (token === "--profile-dir") {
      args.profileDir = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (token === "--chrome-path") {
      args.chromePath = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (args.help) {
    return args;
  }

  if (!args.source && !args.markdown && !args.markdownFile && !args.markdownStdin) {
    throw new Error(
      "Missing input: provide --source, --markdown, --markdown-file, or --markdown-stdin."
    );
  }

  if (args.wechat) {
    if (args.noSubmit) {
      args.wechatSubmit = false;
    } else if (!args.wechatSubmit) {
      args.wechatSubmit = true;
    }
  }

  if (!["export-html", "copy-rich", "write-only"].includes(args.action)) {
    throw new Error("Unsupported --action. Use export-html, copy-rich, or write-only.");
  }

  return args;
}

async function fetchJson<T = any>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText} ${url}`);
  }
  return (await response.json()) as T;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createUiDelay(delayScale, jitterMs) {
  return async (ms) => {
    const base = Math.round(ms * delayScale);
    const jitter = Math.floor(Math.random() * jitterMs);
    await delay(base + jitter);
  };
}

function stripWrappingQuotes(value: string) {
  if (!value) return value;
  return value.replace(/^["']|["']$/g, "");
}

function parseFrontmatter(markdown: string): { frontmatter: Frontmatter; body: string } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { frontmatter: {}, body: markdown };
  const raw = match[1] ?? "";
  const body = markdown.slice(match[0].length);
  const frontmatter: Frontmatter = {};
  for (const line of raw.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = stripWrappingQuotes(line.slice(idx + 1).trim());
    if (key) frontmatter[key] = value;
  }
  return { frontmatter, body };
}

function extractTitleFromMarkdown(body) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function extractSummaryFromMarkdown(body, maxLen = 120) {
  const lines = body.split(/\r?\n/);
  const parts = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("![")) continue;
    if (trimmed === "---") continue;
    parts.push(trimmed);
    if (parts.join(" ").length >= maxLen) break;
  }
  const summary = parts.join(" ");
  return summary.length > maxLen ? summary.slice(0, maxLen - 1) + "…" : summary;
}

function parseMarkdownMeta(markdown: string) {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const title =
    stripWrappingQuotes(frontmatter.title || "") || extractTitleFromMarkdown(body);
  const author = stripWrappingQuotes(frontmatter.author || "");
  const summary =
    stripWrappingQuotes(frontmatter.summary || "") ||
    stripWrappingQuotes(frontmatter.description || "") ||
    extractSummaryFromMarkdown(body);
  const cover =
    stripWrappingQuotes(frontmatter.coverImage || "") ||
    stripWrappingQuotes(frontmatter.featureImage || "") ||
    stripWrappingQuotes(frontmatter.cover || "") ||
    stripWrappingQuotes(frontmatter.image || "");
  return { title, author, summary, cover };
}

function buildPreviewSentinel(markdown) {
  const lines = markdown.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("![")) continue;
    if (line.startsWith("```")) continue;
    if (line.startsWith(">")) {
      const trimmed = line.replace(/^>\s*/, "");
      if (trimmed) return trimmed.slice(0, 20);
    }
    if (line.startsWith("#")) {
      const trimmed = line.replace(/^#+\s*/, "");
      if (trimmed) return trimmed.slice(0, 20);
    }
    return line.slice(0, 20);
  }
  return "";
}

async function waitForPreviewContains(client, sentinel, sleepUi, timeoutMs = 10000) {
  if (!sentinel) {
    await sleepUi(1200);
    return true;
  }
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const found = await evaluate(
      client,
      `(() => {
        const el = document.querySelector('#wechat-preview') || document.querySelector('[data-role="preview-surface"]');
        const text = el?.innerText || '';
        return text.includes(${JSON.stringify(sentinel)});
      })()`
    );
    if (found) {
      return true;
    }
    await sleepUi(400);
  }
  return false;
}

async function listTargets(cdpUrl: string): Promise<CDPTarget[]> {
  const targets = await fetchJson<CDPTarget[]>(`${cdpUrl}/json/list`);
  return Array.isArray(targets) ? targets : [];
}

async function connectToTarget(wsUrl: string) {
  const client = new CDPClient(wsUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("DOM.enable");
  await delay(1200);
  return client;
}

async function ensureLocalChrome(cdpUrl: string, options: LocalChromeOptions = {}) {
  const port = new URL(cdpUrl).port || "9222";
  const chromePath = findChromeExecutable(options.chromePath);
  if (!chromePath) {
    throw new Error("Chrome not found. Set MD2WECHAT_CHROME_PATH or WECHAT_BROWSER_CHROME_PATH.");
  }

  const profileDir = resolveProfileDir(options.profileDir);
  fs.mkdirSync(profileDir, { recursive: true });
  const child = spawn(
    chromePath,
    [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank"
    ],
    {
      detached: true,
      stdio: "ignore"
    }
  );

  child.unref();

  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await fetchJson(`${cdpUrl}/json/version`);
      return;
    } catch {
      await delay(300);
    }
  }

  throw new Error("Local Chrome launched but CDP endpoint did not become available.");
}

class CDPClient {
  ws: WebSocket;
  id: number;
  pending: Map<number, CDPRequestPending>;

  constructor(wsUrl: string) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map<number, CDPRequestPending>();
  }

  async connect(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.ws.addEventListener("open", () => resolve());
      this.ws.addEventListener("error", (event) =>
        reject((event as ErrorEvent).error ?? new Error("WebSocket error"))
      );
    });

    this.ws.addEventListener("message", (event) => {
      const payload = JSON.parse(String(event.data));
      if (!payload.id) {
        return;
      }

      const pending = this.pending.get(payload.id);
      if (!pending) {
        return;
      }

      this.pending.delete(payload.id);
      if (payload.error) {
        pending.reject(new Error(payload.error.message));
        return;
      }

      pending.resolve(payload.result);
    });
  }

  send(method: string, params: Record<string, unknown> = {}) {
    const id = ++this.id;
    const message = { id, method, params };
    this.ws.send(JSON.stringify(message));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  close() {
    this.ws.close();
  }
}

async function openTarget(cdpUrl: string, targetUrl: string) {
  const target = await fetchJson<CDPTarget>(`${cdpUrl}/json/new?${encodeURIComponent(targetUrl)}`, {
    method: "PUT"
  });
  if (!target.webSocketDebuggerUrl) {
    throw new Error("CDP target did not include webSocketDebuggerUrl.");
  }
  return await connectToTarget(target.webSocketDebuggerUrl);
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? "Runtime evaluation failed.");
  }

  return result.result?.value;
}

function activateChrome() {
  if (process.platform !== "darwin") {
    return true;
  }
  const result = spawnSync("osascript", [
    "-e",
    'tell application "Google Chrome" to activate'
  ]);
  return result.status === 0;
}

function sendShortcut(kind, client) {
  if (process.platform === "darwin") {
    activateChrome();
    const key = kind === "copy" ? "c" : "v";
    const result = spawnSync("osascript", [
      "-e",
      `tell application "System Events" to keystroke "${key}" using command down`
    ]);
    return result.status === 0;
  }
  if (process.platform === "linux") {
    const key = kind === "copy" ? "ctrl+c" : "ctrl+v";
    const result = spawnSync("xdotool", ["key", key]);
    return result.status === 0;
  }
  if (process.platform === "win32") {
    const key = kind === "copy" ? "^c" : "^v";
    const ps = [
      "Add-Type -AssemblyName System.Windows.Forms",
      `[System.Windows.Forms.SendKeys]::SendWait("${key}")`
    ].join("; ");
    const result = spawnSync("powershell.exe", ["-NoProfile", "-Command", ps]);
    return result.status === 0;
  }

  if (client) {
    const modifiers = 2;
    const key = kind === "copy" ? "c" : "v";
    const code = kind === "copy" ? "KeyC" : "KeyV";
    const keyCode = kind === "copy" ? 67 : 86;
    return client
      .send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key,
        code,
        modifiers,
        windowsVirtualKeyCode: keyCode
      })
      .then(() =>
        client.send("Input.dispatchKeyEvent", {
          type: "keyUp",
          key,
          code,
          modifiers,
          windowsVirtualKeyCode: keyCode
        })
      )
      .then(() => true)
      .catch(() => false);
  }

  return false;
}

async function clickBySelector(client, selector) {
  await evaluate(
    client,
    `(function() {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) {
        throw new Error("Element not found: " + ${JSON.stringify(selector)});
      }
      el.scrollIntoView({ block: "center" });
      const rect = el.getBoundingClientRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      return { x, y };
    })()`
  ).then(async (pos) => {
    if (!pos || typeof pos.x !== "number" || typeof pos.y !== "number") {
      throw new Error("Failed to resolve element position.");
    }
    await client.send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      x: pos.x,
      y: pos.y,
      button: "left",
      clickCount: 1
    });
    await delay(50);
    await client.send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x: pos.x,
      y: pos.y,
      button: "left",
      clickCount: 1
    });
  });
}

async function clickByText(client, textCandidates) {
  const texts = Array.isArray(textCandidates) ? textCandidates : [textCandidates];
  const pos = await evaluate(
    client,
    `(function() {
      const candidates = ${JSON.stringify(texts)};
      const selectors = [
        "button",
        "a",
        "[role='button']",
        ".weui-desktop-btn",
        ".weui-desktop-btn_primary",
        ".weui-desktop-btn_default",
        ".weui-desktop-btn_warn",
        ".js_cover",
        ".js_select_cover"
      ];
      const seen = new Set();
      const elements = [];
      for (const sel of selectors) {
        document.querySelectorAll(sel).forEach((el) => {
          if (!seen.has(el)) {
            seen.add(el);
            elements.push(el);
          }
        });
      }

      for (const target of candidates) {
        for (const el of elements) {
          const label = (el.textContent || "").trim();
          if (!label) continue;
          if (label.includes(target)) {
            el.scrollIntoView({ block: "center" });
            const rect = el.getBoundingClientRect();
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
          }
        }
      }
      return null;
    })()`
  );

  if (!pos) {
    return false;
  }

  await client.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: pos.x,
    y: pos.y,
    button: "left",
    clickCount: 1
  });
  await delay(50);
  await client.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: pos.x,
    y: pos.y,
    button: "left",
    clickCount: 1
  });
  return true;
}

async function getWechatMenuTexts(client) {
  return await evaluate(
    client,
    `(function() {
      const items = document.querySelectorAll(".new-creation__menu .new-creation__menu-item");
      return Array.from(items).map((item) => {
        const title = item.querySelector(".new-creation__menu-title");
        return (title?.textContent || item.textContent || "").trim();
      });
    })()`
  );
}

async function clickMenuByText(client, candidates) {
  const texts = Array.isArray(candidates) ? candidates : [candidates];
  const result = await evaluate(
    client,
    `(function() {
      const candidates = ${JSON.stringify(texts)};
      const items = document.querySelectorAll(".new-creation__menu .new-creation__menu-item");
      for (const target of candidates) {
        for (const item of items) {
          const title = item.querySelector(".new-creation__menu-title");
          const label = (title?.textContent || item.textContent || "").trim();
          if (label === target) {
            item.scrollIntoView({ block: "center" });
            const rect = item.getBoundingClientRect();
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, label };
          }
        }
      }
      return null;
    })()`
  );

  if (!result) {
    const menuTexts = await getWechatMenuTexts(client);
    throw new Error(`Menu not found. Candidates: ${texts.join(", ")}. Available: ${menuTexts}`);
  }

  await client.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: result.x,
    y: result.y,
    button: "left",
    clickCount: 1
  });
  await delay(50);
  await client.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: result.x,
    y: result.y,
    button: "left",
    clickCount: 1
  });
}

async function waitForWechatLogin(client, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const url = await evaluate(client, "window.location.href");
    if (typeof url === "string" && url.includes("/cgi-bin/home")) {
      return true;
    }
    await delay(2000);
  }
  return false;
}

async function waitForNewEditorTarget(cdpUrl, initialIds, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const targets = await listTargets(cdpUrl);
    const next = targets.find((target) => {
      if (!target || target.type !== "page") {
        return false;
      }
      if (initialIds.has(target.id)) {
        return false;
      }
      const url = String(target.url || "");
      return url.includes("mp.weixin.qq.com") && !url.includes("/cgi-bin/home");
    });
    if (next) {
      return next;
    }
    await delay(500);
  }
  throw new Error("WeChat editor tab not found.");
}

async function focusWechatEditor(client, selector) {
  const selectors = selector
    ? [selector]
    : [".js_pmEditorArea", "#js_editor_area", ".editor_area", "[contenteditable='true']"];

  for (const sel of selectors) {
    const found = await evaluate(
      client,
      `Boolean(document.querySelector(${JSON.stringify(sel)}))`
    );
    if (found) {
      await clickBySelector(client, sel);
      return;
    }
  }

  throw new Error("Editor area not found.");
}

async function pasteFromClipboard(client) {
  const ok = await sendShortcut("paste", client);
  if (!ok) {
    throw new Error("Paste shortcut failed.");
  }
}

async function waitForSelector(client, selector, sleepUi, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const exists = await evaluate(
      client,
      `Boolean(document.querySelector(${JSON.stringify(selector)}))`
    );
    if (exists) {
      return true;
    }
    await sleepUi(300);
  }
  return false;
}

async function setFileInputFiles(client, selector, filePath) {
  const document = await client.send("DOM.getDocument", { depth: -1, pierce: true });
  const rootId = document?.root?.nodeId;
  if (!rootId) {
    throw new Error("DOM root not found.");
  }
  const query = await client.send("DOM.querySelector", {
    nodeId: rootId,
    selector
  });
  const nodeId = query?.nodeId;
  if (!nodeId) {
    return false;
  }
  await client.send("DOM.setFileInputFiles", {
    nodeId,
    files: [filePath]
  });
  return true;
}

async function uploadCoverImage(client, coverPath, sleepUi) {
  if (!coverPath) {
    return false;
  }

  const absPath = path.isAbsolute(coverPath)
    ? coverPath
    : path.resolve(process.cwd(), coverPath);
  if (!fileExists(absPath)) {
    throw new Error(`Cover image not found: ${absPath}`);
  }

  const triggerSelectors = [
    ".js_cover",
    "#js_cover",
    ".js_select_cover",
    ".appmsg_cover",
    ".appmsg_cover__mask",
    ".appmsg_cover__add",
    ".cover__btn",
    "[data-role='cover']"
  ];

  let triggered = false;
  for (const selector of triggerSelectors) {
    const exists = await evaluate(
      client,
      `Boolean(document.querySelector(${JSON.stringify(selector)}))`
    );
    if (exists) {
      await clickBySelector(client, selector);
      triggered = true;
      break;
    }
  }

  if (!triggered) {
    triggered = await clickByText(client, ["封面", "封面图", "设置封面", "选择封面"]);
  }

  if (!triggered) {
    return false;
  }

  await sleepUi(1500);

  const inputSelectors = [
    ".weui-desktop-dialog input[type=file]",
    ".weui-desktop-dialog__hd ~ .weui-desktop-dialog__bd input[type=file]",
    "input[type=file][accept*=image]",
    "input[type=file]"
  ];

  for (const selector of inputSelectors) {
    const ok = await setFileInputFiles(client, selector, absPath);
    if (ok) {
      await sleepUi(3000);
      return true;
    }
  }

  return false;
}

async function markOriginalDeclaration(client, sleepUi) {
  const status = await evaluate(
    client,
    `(() => {
      const el = document.querySelector('.js_unset_original_title') || document.querySelector('.js_original_title');
      if (!el) return null;
      return (el.textContent || '').trim();
    })()`
  );

  if (!status) {
    return false;
  }

  if (!status.includes("未声明")) {
    return true;
  }

  let clicked = false;
  try {
    await clickBySelector(client, ".js_unset_original_title");
    clicked = true;
  } catch {
    clicked = await clickByText(client, ["未声明", "原创声明", "原创"]);
  }

  if (!clicked) {
    return false;
  }

  await sleepUi(1200);

  const modalReady = await waitForSelector(
    client,
    ".original_agreement",
    sleepUi,
    12000
  );
  if (!modalReady) {
    return false;
  }

  const checkboxSelector = ".original_agreement input.weui-desktop-form__checkbox";
  const checkboxExists = await waitForSelector(
    client,
    checkboxSelector,
    sleepUi,
    5000
  );
  if (checkboxExists) {
    try {
      await clickBySelector(client, ".original_agreement .weui-desktop-icon-checkbox");
    } catch {
      try {
        await clickBySelector(client, ".original_agreement .weui-desktop-form__check-content");
      } catch {
        await clickBySelector(client, checkboxSelector);
      }
    }
    await sleepUi(600);
    await evaluate(
      client,
      `(() => {
        const input = document.querySelector(${JSON.stringify(checkboxSelector)});
        if (!input) return false;
        if (!input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return input.checked === true;
      })()`
    );
  } else {
    await clickByText(client, ["我已阅读并同意", "原创声明"]);
  }

  await sleepUi(1000);

  let confirmed = await clickByText(client, ["确定"]);
  if (!confirmed) {
    try {
      await clickBySelector(client, ".weui-desktop-btn.weui-desktop-btn_primary");
      confirmed = true;
    } catch {
      confirmed = false;
    }
  }

  await sleepUi(1000);
  if (!confirmed) {
    return false;
  }

  const nextStatus = await evaluate(
    client,
    `(() => {
      const el = document.querySelector('.js_unset_original_title') || document.querySelector('.js_original_title');
      if (!el) return null;
      return (el.textContent || '').trim();
    })()`
  );
  if (nextStatus && !String(nextStatus).includes("未声明")) {
    return true;
  }

  // If the UI does not immediately reflect, treat as best-effort success after confirm.
  return confirmed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  const appUrl = applyThemeParam(args.app, args.theme);
  const copyStrategy = args.copyStrategy?.trim() || "button";
  const sleepUi = createUiDelay(args.delayScale, args.jitterMs);

  try {
    if (args.launchLocal) {
      await ensureLocalChrome(args.cdp, {
        profileDir: args.profileDir,
        chromePath: args.chromePath
      });
    } else {
      await fetchJson(`${args.cdp}/json/version`);
    }

    let extractedText = "";
    let markdownBaseDir = "";
    if (args.markdown) {
      extractedText = args.markdown;
    } else if (args.markdownFile) {
      const absPath = path.isAbsolute(args.markdownFile)
        ? args.markdownFile
        : path.resolve(process.cwd(), args.markdownFile);
      if (!fileExists(absPath)) {
        throw new Error(`Markdown file not found: ${absPath}`);
      }
      extractedText = fs.readFileSync(absPath, "utf-8");
      markdownBaseDir = path.dirname(absPath);
    } else if (args.markdownStdin) {
      extractedText = await readStdin();
    } else {
      if (!args.source) {
        throw new Error("Missing required --source URL.");
      }
      const sourceClient = await openTarget(args.cdp, args.source);
      const extractionExpression = `(() => {
        const node = ${args.selector ? `document.querySelector(${JSON.stringify(args.selector)})` : "document.body"};
        if (!node) {
          throw new Error("Source selector not found.");
        }
        return node.innerText || node.textContent || "";
      })()`;
      extractedText = await evaluate(sourceClient, extractionExpression);
      sourceClient.close();
    }

    if (!extractedText || !String(extractedText).trim()) {
      throw new Error("No markdown extracted from input.");
    }

    const meta = parseMarkdownMeta(extractedText);
    const effectiveTitle = args.title || meta.title;
    const effectiveAuthor = args.author || meta.author;
    const effectiveSummary = args.summary || meta.summary;
    let effectiveCover = args.cover || meta.cover;
    if (effectiveCover && markdownBaseDir && !path.isAbsolute(effectiveCover)) {
      effectiveCover = path.resolve(markdownBaseDir, effectiveCover);
    }

    const appClient = await openTarget(args.cdp, appUrl);
    const markdownText = String(extractedText);
    await evaluate(
      appClient,
      `(() => {
        const textarea = document.querySelector('[data-role="markdown-input"]');
        if (!textarea) {
          throw new Error("Markdown input not found in app.");
        }
        textarea.focus();
        textarea.select();
        return true;
      })()`
    );
    await appClient.send("Input.insertText", { text: markdownText });
    await sleepUi(600);
    await evaluate(
      appClient,
      `(() => {
        const textarea = document.querySelector('[data-role="markdown-input"]');
        if (!textarea) return false;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      })()`
    );

    const sentinel = buildPreviewSentinel(markdownText);
    const ready = await waitForPreviewContains(appClient, sentinel, sleepUi, 12000);
    if (!ready) {
      // Try one more time by nudging the textarea value to trigger React.
      await evaluate(
        appClient,
        `(() => {
          const textarea = document.querySelector('[data-role="markdown-input"]');
          if (!textarea) return false;
          const current = textarea.value || "";
          textarea.value = current + " ";
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          textarea.value = current;
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
          return true;
        })()`
      );
      const retry = await waitForPreviewContains(appClient, sentinel, sleepUi, 8000);
      if (!retry) {
        throw new Error("Preview did not update in time after markdown injection.");
      }
    }

    if (args.action !== "write-only") {
      if (args.action === "copy-rich" && copyStrategy !== "selection") {
        const selector = '[data-action="copy-rich"]';
        await evaluate(
          appClient,
          `(() => {
            const button = document.querySelector(${JSON.stringify(selector)});
            if (!button) {
              throw new Error("Target action button not found.");
            }
            button.click();
            return true;
          })()`
        );
      }

      if (args.action === "copy-rich" && copyStrategy === "selection") {
        await evaluate(
          appClient,
          `(() => {
            const preview = document.querySelector('#wechat-preview') || document.querySelector('[data-role="preview-surface"]') || document.body;
            const range = document.createRange();
            range.selectNodeContents(preview);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            return true;
          })()`
        );
        await sleepUi(400);
        const copied = await sendShortcut("copy", appClient);
        if (!copied) {
          throw new Error("Copy shortcut failed.");
        }
      }

      if (args.action === "export-html") {
        const selector = '[data-action="export-html"]';
        await evaluate(
          appClient,
          `(() => {
            const button = document.querySelector(${JSON.stringify(selector)});
            if (!button) {
              throw new Error("Target action button not found.");
            }
            button.click();
            return true;
          })()`
        );
      }
    }

    process.stdout.write(
      `Wrote content into ${appUrl} and executed action: ${args.action}\n`
    );
    appClient.close();

    if (args.wechat) {
      let wechatClient;
      let editorClient;
      try {
        wechatClient = await openTarget(args.cdp, args.wechatUrl);
        const loggedIn = await waitForWechatLogin(wechatClient, args.wechatWaitLoginMs);
        if (!loggedIn) {
          throw new Error("WeChat login timeout. Please scan QR code and retry.");
        }

        const initialTargets = await listTargets(args.cdp);
        const initialIds = new Set(initialTargets.map((target) => target.id));
        await clickMenuByText(wechatClient, [
          args.wechatMenu,
          "写文章",
          "图文消息",
          "图文",
          "文章"
        ]);
        await sleepUi(3000);

        const editorTarget = await waitForNewEditorTarget(args.cdp, initialIds, 30000);
        editorClient = await connectToTarget(editorTarget.webSocketDebuggerUrl);
        await focusWechatEditor(editorClient, args.wechatEditorSelector);
        await sleepUi(800);

        if (effectiveTitle) {
          await evaluate(
            editorClient,
            `(() => {
              const el = document.querySelector('#title');
              if (!el) return false;
              el.value = ${JSON.stringify(effectiveTitle)};
              el.dispatchEvent(new Event('input', { bubbles: true }));
              return true;
            })()`
          );
          await sleepUi(600);
        }

        if (effectiveAuthor) {
          await evaluate(
            editorClient,
            `(() => {
              const el = document.querySelector('#author');
              if (!el) return false;
              el.value = ${JSON.stringify(effectiveAuthor)};
              el.dispatchEvent(new Event('input', { bubbles: true }));
              return true;
            })()`
          );
          await sleepUi(600);
        }

        await pasteFromClipboard(editorClient);
        await sleepUi(3000);

        if (effectiveSummary) {
          await evaluate(
            editorClient,
            `(() => {
              const el = document.querySelector('#js_description');
              if (!el) return false;
              el.focus();
              el.select?.();
              el.value = ${JSON.stringify(effectiveSummary)};
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
              el.dispatchEvent(new Event('blur', { bubbles: true }));
              return true;
            })()`
          );
          await sleepUi(800);
        }

        if (args.original) {
          const ok = await markOriginalDeclaration(editorClient, sleepUi);
          if (!ok) {
            process.stderr.write("Original declaration not applied.\n");
          }
        }

        if (effectiveCover) {
          const coverOk = await uploadCoverImage(editorClient, effectiveCover, sleepUi);
          if (!coverOk) {
            process.stderr.write("Cover upload skipped: cover trigger not found.\n");
          }
        }

        if (args.wechatSubmit) {
          await evaluate(
            editorClient,
            `(() => {
              const btn = document.querySelector('#js_submit button');
              if (!btn) return false;
              btn.click();
              return true;
            })()`
          );
          await sleepUi(3000);
          const saved = await evaluate(
            editorClient,
            `Boolean(document.querySelector('.weui-desktop-toast'))`
          );
          if (!saved) {
            await sleepUi(5000);
          }
        }

        process.stdout.write("Pasted content into WeChat editor.\n");
      } finally {
        if (editorClient) {
          editorClient.close();
        }
        if (wechatClient) {
          wechatClient.close();
        }
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

await main();
