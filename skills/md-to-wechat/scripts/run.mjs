#!/usr/bin/env node
import { spawn } from "node:child_process";

const child = spawn(
  "node",
  ["packages/cli/dist/cli.js", ...process.argv.slice(2)],
  {
    stdio: "inherit"
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
