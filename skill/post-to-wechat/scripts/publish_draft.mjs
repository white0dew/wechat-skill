#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.dirname(scriptDir);
const vendorScript = path.join(
  scriptDir,
  "vendor",
  "baoyu-post-to-wechat",
  "scripts",
  "wechat-api.ts",
);

function printHelp() {
  process.stdout.write(`Save an HTML fragment as a non-original WeChat draft through the API.

Usage:
  node publish_draft.mjs --html <file> [options]

Options:
  --html <file>                    HTML fragment file (required)
  --title <text>                   Article title
  --author <text>                  Author name
  --summary <text>                 Article summary
  --cover <path-or-url>            Cover image
  --account <alias>                Account alias
  --article-type <news|newspic>    Draft article type (default: news)
  --dry-run                        Parse without calling the WeChat API
  --need-open-comment [0|1]        Enable comments; bare flag means 1
  --only-fans-can-comment [0|1]    Restrict comments to followers; bare flag means 1
  --help                           Show this help

Credentials are read from process environment first, then
${path.join(skillDir, ".baoyu-skills", ".env")} for missing values.
`);
}

function readBooleanValue(argv, index) {
  const next = argv[index + 1];
  if (next === "0" || next === "1") return { value: next, consumed: 1 };
  return { value: "1", consumed: 0 };
}

function parseArgs(argv) {
  const options = { articleType: "news" };
  const valueFlags = new Map([
    ["--html", "html"],
    ["--title", "title"],
    ["--author", "author"],
    ["--summary", "summary"],
    ["--cover", "cover"],
    ["--account", "account"],
    ["--article-type", "articleType"],
  ]);

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--need-open-comment" || arg === "--only-fans-can-comment") {
      const parsed = readBooleanValue(argv, index);
      options[arg === "--need-open-comment" ? "needOpenComment" : "onlyFansCanComment"] = parsed.value;
      index += parsed.consumed;
      continue;
    }
    const key = valueFlags.get(arg);
    if (!key) throw new Error(`Unknown option: ${arg}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
    options[key] = value;
    index += 1;
  }

  if (!options.help && !options.html) throw new Error("--html <file> is required");
  if (!new Set(["news", "newspic"]).has(options.articleType)) {
    throw new Error("--article-type must be news or newspic");
  }
  return options;
}

function parseEnvFile(content) {
  const values = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim().replace(/^export\s+/, "");
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

async function buildChildEnv() {
  const childEnv = { ...process.env };
  const envPath = path.join(skillDir, ".baoyu-skills", ".env");
  try {
    const fileValues = parseEnvFile(await fs.readFile(envPath, "utf8"));
    for (const [key, value] of Object.entries(fileValues)) {
      if (!childEnv[key]) childEnv[key] = value;
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return childEnv;
}

function escapeTitle(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function runChild(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["-y", "bun", vendorScript, ...args], {
      cwd: skillDir,
      env,
      shell: false,
      stdio: ["inherit", "pipe", "pipe"],
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.once("error", reject);
    child.once("close", (code, signal) => {
      if (signal) reject(new Error(`Publisher terminated by signal ${signal}`));
      else resolve(code ?? 1);
    });
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return 0;
  }

  const inputPath = path.resolve(options.html);
  if (path.extname(inputPath).toLowerCase() !== ".html") {
    throw new Error("--html must point to an .html file containing already formatted HTML");
  }
  const fragment = await fs.readFile(inputPath, "utf8");
  if (!fragment.trim()) {
    throw new Error("--html file is empty");
  }
  const title = options.title ? `<title>${escapeTitle(options.title)}</title>` : "";
  const document = `<!doctype html>\n<html><head><meta charset="utf-8">${title}</head><body>${fragment}</body></html>\n`;
  const tempPath = path.join(
    path.dirname(inputPath),
    `.wechat-draft-${process.pid}-${Date.now()}.html`,
  );

  const childArgs = [tempPath, "--type", options.articleType];
  for (const [key, flag] of [
    ["title", "--title"],
    ["author", "--author"],
    ["summary", "--summary"],
    ["cover", "--cover"],
    ["account", "--account"],
    ["needOpenComment", "--need-open-comment"],
    ["onlyFansCanComment", "--only-fans-can-comment"],
  ]) {
    if (options[key] !== undefined) childArgs.push(flag, options[key]);
  }
  if (options.dryRun) childArgs.push("--dry-run");

  await fs.writeFile(tempPath, document, { flag: "wx" });
  try {
    return await runChild(childArgs, await buildChildEnv());
  } finally {
    await fs.unlink(tempPath).catch(() => {});
  }
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
