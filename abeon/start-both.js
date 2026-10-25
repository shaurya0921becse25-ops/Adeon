import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

console.log("=================================================");
console.log("🚀 Starting Abeon Guide & User Guide Ecosystem");
console.log("   • Guide Dashboard: http://localhost:5173");
console.log("   • User Guide:      http://localhost:5174");
console.log("=================================================\n");

const guide = spawn(npmCmd, ["run", "dev:guide"], {
  cwd: path.join(__dirname, "guide"),
  stdio: "pipe",
  shell: true,
});

const userGuide = spawn(npmCmd, ["run", "dev"], {
  cwd: path.join(__dirname, "user guide"),
  stdio: "pipe",
  shell: true,
});

function pipeOutput(child, prefix, colorCode) {
  child.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}`);
      }
    });
  });

  child.stderr.on("data", (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`\x1b[31m[${prefix} ERR]\x1b[0m ${line}`);
      }
    });
  });
}

pipeOutput(guide, "Guide", "36");      // Cyan
pipeOutput(userGuide, "UserGuide", "32"); // Green

function cleanup() {
  console.log("\nStopping all development servers...");
  guide.kill();
  userGuide.kill();
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
