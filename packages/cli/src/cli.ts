#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";
import { listThemes, renderMarkdownToWechat } from "@md2wechat/core";

type CliArgs = {
  input?: string;
  markdown?: string;
  out?: string;
  theme: string;
  help: boolean;
};

function printHelp() {
  const themeNames = listThemes()
    .map((theme) => theme.name)
    .join(", ");

  process.stdout.write(
    [
      "Usage:",
      "  md2wechat [file] [--theme default] [--out output.html]",
      "  echo '# Title' | md2wechat --theme minimal",
      "  md2wechat --markdown '# Title'",
      "",
      `Themes: ${themeNames}`
    ].join("\n")
  );
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    theme: "default",
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }

    if (token === "--theme") {
      args.theme = argv[index + 1] ?? "default";
      index += 1;
      continue;
    }

    if (token === "--out") {
      args.out = argv[index + 1];
      index += 1;
      continue;
    }

    if (token === "--markdown") {
      args.markdown = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (!token.startsWith("-") && !args.input) {
      args.input = token;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return args;
}

async function readStdin() {
  if (process.stdin.isTTY) {
    return "";
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function resolveMarkdown(args: CliArgs) {
  if (args.markdown) {
    return args.markdown;
  }

  if (args.input) {
    return readFile(args.input, "utf8");
  }

  const stdinContent = await readStdin();
  if (stdinContent.trim()) {
    return stdinContent;
  }

  throw new Error("No markdown input found. Pass a file, --markdown, or stdin.");
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      printHelp();
      return;
    }

    const markdown = await resolveMarkdown(args);
    const result = renderMarkdownToWechat(markdown, {
      theme: args.theme
    });

    if (args.out) {
      await writeFile(args.out, result.html, "utf8");
      process.stdout.write(`Wrote ${args.out}\n`);
      return;
    }

    process.stdout.write(result.html);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

void main();
