import { readFile } from "node:fs/promises";

const bundlePath = new URL("../dist/browser/index.js", import.meta.url);
const bundle = await readFile(bundlePath, "utf8");

const forbidden = [
  /from\s+["']node:/,
  /require\(["']node:/,
  /readFileSync/,
  /process\.versions\.node/,
];

const failures = forbidden
  .filter((pattern) => pattern.test(bundle))
  .map((pattern) => pattern.toString());

if (failures.length) {
  console.error("Browser bundle contains Node-specific references:", failures);
  process.exit(1);
}

for (const expectedExport of ["validateJpnState", "buildJpnPrompt", "assessJpnReadiness"]) {
  if (!bundle.includes(expectedExport)) {
    console.error(`Browser bundle is missing expected export: ${expectedExport}`);
    process.exit(1);
  }
}

console.log(`Browser bundle OK (${bundle.length} bytes, no forbidden Node references).`);
