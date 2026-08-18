import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const executable = process.platform === "win32"
  ? resolve("node_modules/.bin/lhci.cmd")
  : resolve("node_modules/.bin/lhci");
const command = process.platform === "win32" ? `"${executable}"` : executable;

const child = spawn(command, ["autorun"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    CHROME_PATH: chromium.executablePath()
  }
});

child.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Lighthouse stopped with signal ${signal}.`);
    process.exitCode = 1;
  } else {
    process.exitCode = code || 0;
  }
});
