#!/usr/bin/env node

import { spawn } from "node:child_process";
import process from "node:process";

const DEFAULT_APP_URL = "http://127.0.0.1:4173/#/";
const DEFAULT_CDP_URL = "http://127.0.0.1:9222";
const LOCAL_CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function parseArgs(argv) {
  const args = {
    source: "",
    selector: "",
    app: DEFAULT_APP_URL,
    cdp: DEFAULT_CDP_URL,
    action: "export-html",
    launchLocal: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--source") {
      args.source = argv[index + 1] ?? "";
      index += 1;
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

    if (token === "--action") {
      args.action = argv[index + 1] ?? "export-html";
      index += 1;
      continue;
    }

    if (token === "--launch-local") {
      args.launchLocal = true;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!args.source) {
    throw new Error("Missing required --source URL.");
  }

  if (!["export-html", "copy-rich", "write-only"].includes(args.action)) {
    throw new Error("Unsupported --action. Use export-html, copy-rich, or write-only.");
  }

  return args;
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText} ${url}`);
  }
  return response.json();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureLocalChrome(cdpUrl) {
  const port = new URL(cdpUrl).port || "9222";
  const child = spawn(
    LOCAL_CHROME,
    [
      `--remote-debugging-port=${port}`,
      "--user-data-dir=/tmp/md2wechat-cdp-profile",
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
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", () => resolve());
      this.ws.addEventListener("error", (event) => reject(event.error ?? new Error("WebSocket error")));
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

  send(method, params = {}) {
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

async function openTarget(cdpUrl, targetUrl) {
  const target = await fetchJson(`${cdpUrl}/json/new?${encodeURIComponent(targetUrl)}`, {
    method: "PUT"
  });
  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await delay(1200);
  return client;
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

async function main() {
  const args = parseArgs(process.argv.slice(2));

  try {
    if (args.launchLocal) {
      await ensureLocalChrome(args.cdp);
    } else {
      await fetchJson(`${args.cdp}/json/version`);
    }

    const sourceClient = await openTarget(args.cdp, args.source);
    const extractionExpression = `(() => {
      const node = ${args.selector ? `document.querySelector(${JSON.stringify(args.selector)})` : "document.body"};
      if (!node) {
        throw new Error("Source selector not found.");
      }
      return node.innerText || node.textContent || "";
    })()`;
    const extractedText = await evaluate(sourceClient, extractionExpression);
    sourceClient.close();

    if (!extractedText || !String(extractedText).trim()) {
      throw new Error("No text extracted from source page.");
    }

    const appClient = await openTarget(args.cdp, args.app);
    await evaluate(
      appClient,
      `(() => {
        const textarea = document.querySelector('[data-role="markdown-input"]');
        if (!textarea) {
          throw new Error("Markdown input not found in app.");
        }
        textarea.value = ${JSON.stringify(String(extractedText))};
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
      })()`
    );

    await delay(1000);

    if (args.action !== "write-only") {
      const selector =
        args.action === "copy-rich"
          ? '[data-action="copy-rich"]'
          : '[data-action="export-html"]';

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

    process.stdout.write(
      `Wrote source content into ${args.app} and executed action: ${args.action}\n`
    );
    appClient.close();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

await main();
