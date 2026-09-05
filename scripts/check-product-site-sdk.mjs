import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../product-site/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../product-site/index.html", import.meta.url), "utf8");

const requiredImports = [
  "createJpnDraftFromText",
  "assessJpnReadiness",
  "buildJpnPrompt",
  "validateJpnState",
];

for (const name of requiredImports) {
  if (!app.includes(name)) throw new Error(`Prompt Builder não usa export obrigatório: ${name}`);
}

if (!app.includes('../dist/browser/index.js')) {
  throw new Error('Prompt Builder deve consumir ../dist/browser/index.js');
}

const forbiddenLocalImplementations = [
  /function\s+createJpnDraftFromText\s*\(/,
  /function\s+assessJpnReadiness\s*\(/,
  /function\s+buildJpnPrompt\s*\(/,
  /function\s+validateJpnState\s*\(/,
];

for (const pattern of forbiddenLocalImplementations) {
  if (pattern.test(app)) throw new Error(`Implementação duplicada detectada: ${pattern}`);
}

if (!html.includes('type="module" src="app.js"')) {
  throw new Error('index.html deve carregar app.js como ES module');
}

console.log('Prompt Builder usa o bundle browser oficial sem duplicar as funções centrais.');
