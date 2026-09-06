import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const read = p => fs.readFileSync(path.join(ROOT, p), "utf8");
const readJson = p => JSON.parse(read(p));
const fail = msg => { throw new Error(`[product-consistency] ${msg}`); };
const unique = (items, label) => {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item)) fail(`${label}: ID duplicado ${item}`);
    seen.add(item);
  }
};

const methodPath = "docs/products/metodo-jpn/METODO_JPN_v1.md";
const promptDocPath = "docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md";
const promptIndexPath = "docs/products/prompt-pack/PROMPT_INDEX.json";
const businessDocPath = "docs/products/jpn-business/JPN_BUSINESS_v1.md";
const businessIndexPath = "docs/products/jpn-business/BUSINESS_INDEX.json";

const method = read(methodPath);
const promptDoc = read(promptDocPath);
const promptIndex = readJson(promptIndexPath);
const businessDoc = read(businessDocPath);
const businessIndex = readJson(businessIndexPath);

const frameworkBase = promptIndex.framework_base;
if (!frameworkBase) fail("Prompt Pack sem framework_base");
if (businessIndex.framework_base !== frameworkBase) {
  fail(`framework_base divergente: Prompt Pack=${frameworkBase}; Business=${businessIndex.framework_base}`);
}
if (!method.includes(`JPN Framework \`${frameworkBase}\``)) {
  fail(`Método não declara a mesma base ${frameworkBase}`);
}

for (const term of ["Jornada", "Precisão", "Narrativa", "confirmed", "inferred", "unknown", "conflicting"]) {
  if (!method.includes(term)) fail(`Método não contém termo canônico: ${term}`);
}

const promptIds = promptIndex.templates.map(x => x.id);
const businessIds = businessIndex.playbooks.map(x => x.id);
unique(promptIds, "Prompt Pack");
unique(businessIds, "JPN Business");

for (const id of promptIds) {
  if (!/^PP-\d{2}$/.test(id)) fail(`ID de prompt fora do padrão: ${id}`);
  if (!promptDoc.includes(id)) fail(`Prompt ${id} existe no índice, mas não foi encontrado no documento`);
}
for (const id of businessIds) {
  if (!/^JB-\d{2}$/.test(id)) fail(`ID de playbook fora do padrão: ${id}`);
  if (!businessDoc.includes(id)) fail(`Playbook ${id} existe no índice, mas não foi encontrado no documento`);
}

const promptSet = new Set(promptIds);
for (const playbook of businessIndex.playbooks) {
  if (!Array.isArray(playbook.prompt_pack_links)) fail(`${playbook.id} sem prompt_pack_links`);
  for (const link of playbook.prompt_pack_links) {
    if (!promptSet.has(link)) fail(`${playbook.id} referencia prompt inexistente: ${link}`);
  }
}

for (const template of promptIndex.templates) {
  const components = template.primary_jpn || [];
  const expected = ["jornada", "precisao", "narrativa"];
  if (expected.some(x => !components.includes(x))) {
    fail(`${template.id} não declara os três componentes JPN no índice`);
  }
}

const forbiddenClaims = [
  /elimina(?:r)? alucina(?:ções|cao|ção)/i,
  /garante? (?:vendas|resultado|produtividade)/i,
  /melhora .*\d+%/i,
  /reduz .*\d+%/i
];
for (const [label, content] of [["Método", method], ["Prompt Pack", promptDoc], ["JPN Business", businessDoc]]) {
  for (const pattern of forbiddenClaims) {
    if (pattern.test(content)) fail(`${label} contém claim proibido pelo guardrail: ${pattern}`);
  }
}

console.log("PASS: consistência Método JPN + Prompt Pack + JPN Business");
console.log(JSON.stringify({
  frameworkBase,
  prompts: promptIds.length,
  playbooks: businessIds.length,
  linksValidated: businessIndex.playbooks.reduce((n, p) => n + p.prompt_pack_links.length, 0)
}, null, 2));
