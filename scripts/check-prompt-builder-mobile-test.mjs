import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mobilePath = path.join(root, "product-site", "mobile-test.html");
const presetsPath = path.join(root, "product-site", "presets.js");

function fail(message) {
  console.error(`FAIL prompt-builder-mobile-test: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(mobilePath)) fail("product-site/mobile-test.html ausente");
if (!fs.existsSync(presetsPath)) fail("product-site/presets.js ausente");
if (process.exitCode) process.exit();

const mobile = fs.readFileSync(mobilePath, "utf8");
const presets = fs.readFileSync(presetsPath, "utf8");
const canonicalIds = [...presets.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);

if (canonicalIds.length !== 7) fail(`esperados 7 presets canônicos; encontrados ${canonicalIds.length}`);
for (const id of canonicalIds) {
  if (!mobile.includes(`value="${id}"`)) fail(`preset ${id} ausente no seletor mobile`);
  if (!mobile.includes(`"${id}":{`)) fail(`preset ${id} ausente no mapa autocontido`);
}

const required = [
  'name="viewport"',
  'name="robots" content="noindex,nofollow"',
  "JORNADA · PRECISÃO · NARRATIVA",
  "TESTE MOBILE",
  "Criar rascunho JPN",
  "localStorage",
  "navigator.clipboard",
  "Este é o Builder final?",
  "não representa publicação do produto",
];
for (const marker of required) if (!mobile.includes(marker)) fail(`marcador obrigatório ausente: ${marker}`);

const forbidden = [
  /https?:\/\//i,
  /fetch\s*\(/i,
  /XMLHttpRequest/i,
  /WebSocket/i,
  /openai/i,
  /gemini/i,
  /anthropic/i,
  /checkout/i,
  /comprar agora/i,
];
for (const pattern of forbidden) if (pattern.test(mobile)) fail(`padrão proibido encontrado: ${pattern}`);

if (!mobile.includes("@media(max-width:480px)")) fail("breakpoint móvel explícito ausente");
if (!mobile.includes("font-size:16px")) fail("inputs sem proteção explícita contra zoom involuntário em mobile");

if (!process.exitCode) {
  console.log(`PASS prompt-builder-mobile-test: fixture autocontida com ${canonicalIds.length} presets, noindex, armazenamento local e sem rede/API.`);
}
