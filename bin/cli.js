#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.resolve(__dirname, "..");
const PACKAGE_META = JSON.parse(
  fs.readFileSync(path.join(PACKAGE_ROOT, "package.json"), "utf8")
);

function formatTimestamp(nowDate) {
  const padTwo = (num) => String(num).padStart(2, "0");
  const year = nowDate.getFullYear();
  const month = padTwo(nowDate.getMonth() + 1);
  const day = padTwo(nowDate.getDate());
  const hour = padTwo(nowDate.getHours());
  const minute = padTwo(nowDate.getMinutes());
  return `${year}${month}${day}-${hour}${minute}`;
}

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFileSafe(sourcePath, targetPath, allowOverwrite) {
  if (!fs.existsSync(sourcePath)) {
    return "missing-source";
  }
  if (fs.existsSync(targetPath) && !allowOverwrite) {
    return "preserved";
  }
  ensureDirectory(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
  return "installed";
}

function copyDirectoryEntry(sourceDir, targetDir, dirEntry, allowOverwrite) {
  const srcEntryPath = path.join(sourceDir, dirEntry.name);
  const destEntryPath = path.join(targetDir, dirEntry.name);
  if (dirEntry.isDirectory()) {
    copyDirectoryRecursive(srcEntryPath, destEntryPath, allowOverwrite);
    return;
  }
  copyFileSafe(srcEntryPath, destEntryPath, allowOverwrite);
}

function copyDirectoryRecursive(sourceDir, targetDir, allowOverwrite) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }
  ensureDirectory(targetDir);
  const dirEntries = fs.readdirSync(sourceDir, { withFileTypes: true });
  for (const dirEntry of dirEntries) {
    copyDirectoryEntry(sourceDir, targetDir, dirEntry, allowOverwrite);
  }
}

function backupExistingAgentFiles(targetDir) {
  const stamp = formatTimestamp(new Date());
  const backupFolder = path.join(targetDir, "backups", stamp);
  const trackedRootFiles = ["AGENTS.md", "opencode.jsonc"];
  const trackedDirs = [".agents", ".opencode"];
  let hasBackedUpAny = false;

  for (const fileName of trackedRootFiles) {
    const fullFilePath = path.join(targetDir, fileName);
    if (fs.existsSync(fullFilePath)) {
      copyFileSafe(fullFilePath, path.join(backupFolder, fileName), true);
      hasBackedUpAny = true;
    }
  }
  for (const dirName of trackedDirs) {
    const fullDirPath = path.join(targetDir, dirName);
    if (fs.existsSync(fullDirPath)) {
      copyDirectoryRecursive(fullDirPath, path.join(backupFolder, dirName), true);
      hasBackedUpAny = true;
    }
  }
  return hasBackedUpAny ? backupFolder : null;
}

function installCoreFiles(targetDir, allowOverwrite) {
  const coreFiles = ["AGENTS.md", "opencode.jsonc", ".gitignore"];
  for (const fileName of coreFiles) {
    const copyStatus = copyFileSafe(
      path.join(PACKAGE_ROOT, fileName),
      path.join(targetDir, fileName),
      allowOverwrite
    );
    console.log(`  - ${fileName.padEnd(28)} : ${copyStatus}`);
  }
  for (const folderName of [".agents", ".opencode", "templates"]) {
    copyDirectoryRecursive(
      path.join(PACKAGE_ROOT, folderName),
      path.join(targetDir, folderName),
      allowOverwrite
    );
    console.log(`  - ${(folderName + "/").padEnd(28)} : installed`);
  }
}

function ensureMemoryAndDocs(targetDir) {
  const memoryFiles = ["PROJECT_MEMORY.md", "CHANGELOG.md", "ASSETS.md", "README.md"];
  for (const docName of memoryFiles) {
    const copyStatus = copyFileSafe(
      path.join(PACKAGE_ROOT, docName),
      path.join(targetDir, docName),
      false
    );
    console.log(`  - ${docName.padEnd(28)} : ${copyStatus}`);
  }
  ensureDirectory(path.join(targetDir, "backups"));
  console.log(`  - ${"backups/".padEnd(28)} : ready`);
}

function runInitCommand(targetDir, allowOverwrite) {
  console.log(
    `\n[Game Dev Partner v${PACKAGE_META.version}] Installing /game-development assistant in: ${targetDir}\n`
  );
  if (path.resolve(targetDir) !== path.resolve(PACKAGE_ROOT)) {
    installCoreFiles(targetDir, allowOverwrite);
  }
  ensureMemoryAndDocs(targetDir);
}

function buildStatusChecks(targetDir) {
  const skillDir = path.join(targetDir, ".agents", "skills");
  const gameDevRefDir = path.join(skillDir, "game-development", "references");
  return [
    ["AGENTS.md (7-Stage Hierarchy + 6 Roles)", path.join(targetDir, "AGENTS.md")],
    ["Memory: PROJECT_MEMORY.md", path.join(targetDir, "PROJECT_MEMORY.md")],
    ["Memory: CHANGELOG.md", path.join(targetDir, "CHANGELOG.md")],
    ["Registry: ASSETS.md (6 Categories)", path.join(targetDir, "ASSETS.md")],
    ["OpenCode Config: opencode.jsonc", path.join(targetDir, "opencode.jsonc")],
    ["OpenCode Command: /game-development", path.join(targetDir, ".opencode", "commands", "game-development.md")],
    ["Always-On Rule: game-dev-partner.md", path.join(targetDir, ".agents", "rules", "game-dev-partner.md")],
    ["Main Skill: /game-development", path.join(skillDir, "game-development", "SKILL.md")],
    ["Ref: asset-and-reference-research.md", path.join(gameDevRefDir, "asset-and-reference-research.md")],
    ["Ref: team-roles-and-workflow.md", path.join(gameDevRefDir, "team-roles-and-workflow.md")],
    ["Ref: engineering-and-design-standards.md", path.join(gameDevRefDir, "engineering-and-design-standards.md")],
    ["Skill: supabase (Online/Auth/DB/RLS)", path.join(skillDir, "supabase", "SKILL.md")],
    ["Skill: supabase-matchmaking", path.join(skillDir, "supabase-matchmaking", "SKILL.md")],
    ["Skill: supabase-voice-chat", path.join(skillDir, "supabase-voice-chat", "SKILL.md")],
    ["Skill: matchmaking-dedicated", path.join(skillDir, "matchmaking-dedicated", "SKILL.md")],
    ["Skill: voice-chat-sfu", path.join(skillDir, "voice-chat-sfu", "SKILL.md")],
    ["Safety Folder: backups/", path.join(targetDir, "backups")]
  ];
}

function runStatusCommand(targetDir) {
  const checks = buildStatusChecks(targetDir);
  console.log(
    `\n[Game Dev Partner v${PACKAGE_META.version}] Workspace Status: ${targetDir}\n`
  );
  for (const [labelName, checkPath] of checks) {
    const existsFlag = fs.existsSync(checkPath) ? "READY" : "MISSING";
    console.log(`  [${existsFlag.padEnd(7)}] ${labelName}`);
  }
  console.log(
    `\nReady! Type "/game-development <คำสั่ง>" in Antigravity IDE or OpenCode.\n`
  );
}

function runSmartSingleCommand(targetDir) {
  if (path.resolve(targetDir) !== path.resolve(PACKAGE_ROOT)) {
    const backupLocation = backupExistingAgentFiles(targetDir);
    if (backupLocation) {
      console.log(
        `\n[Game Dev Partner v${PACKAGE_META.version}] Backed up existing files to: ${backupLocation}`
      );
    }
  }
  runInitCommand(targetDir, true);
  runStatusCommand(targetDir);
}

function printHelpBanner() {
  console.log(`
Game Dev Partner v${PACKAGE_META.version} — Personal Assistant AI Agent (/game-development)

Single-Command Usage (Recommended):
  npx ai-game-init          Auto-backup, install/update /game-development assistant, and verify status

Optional Subcommands:
  npx ai-game-init init      Install without overwriting existing files
  npx ai-game-init status    Check installed /game-development skills, rules, and memory files
  npx ai-game-init --version Print version
`);
}

function main() {
  const cliArgs = process.argv.slice(2);
  const commandName = cliArgs[0] || "auto";
  const targetDir = process.cwd();

  if (commandName === "--version" || commandName === "-v") {
    console.log(PACKAGE_META.version);
    return;
  }
  if (commandName === "--help" || commandName === "-h") {
    printHelpBanner();
    return;
  }
  if (commandName === "init") {
    runInitCommand(targetDir, cliArgs.includes("--force"));
    return;
  }
  if (commandName === "status") {
    runStatusCommand(targetDir);
    return;
  }
  runSmartSingleCommand(targetDir);
}

main();
