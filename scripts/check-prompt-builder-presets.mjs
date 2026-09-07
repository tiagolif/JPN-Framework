import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../product-site/presets.js", import.meta.url), "utf8");
const requiredIds = [
  "software-development",
  "document-analysis",
  "sales-agent",
  "technical-support",
  "backoffice-automation",
  "multiagent-handoff",
  "rag-conflicting-sources",
];

const unsafePatterns = [
  /garant(?:e|ir|ido)/i,
  /100%/i,
  /resultado garantido/i,
  /comprar agora/i,
  /últimas vagas/i,
];

const normalized = source
  .replace(/export const BUILDER_PRESETS\s*=\s*/, "globalThis.BUILDER_PRESETS = ")
  .replace(/export function getBuilderPreset[\s\S]*$/, "");

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(normalized, sandbox, { filename: "product-site/presets.js" });

const presets = sandbox.BUILDER_PRESETS;
if (!Array.isArray(presets)) throw new Error("BUILDER_PRESETS precisa ser um array.");

const ids = presets.map((preset) => preset.id);
if (new Set(ids).size !== ids.length) throw new Error("IDs de presets duplicados.");

for (const id of requiredIds) {
  if (!ids.includes(id)) throw new Error(`Preset obrigatório ausente: ${id}`);
}

for (const preset of presets) {
  for (const field of ["id", "label", "type", "idea", "restrictions"]) {
    if (typeof preset[field] !== "string" || !preset[field].trim()) {
      throw new Error(`Preset ${preset.id ?? "sem-id"}: campo ${field} ausente ou vazio.`);
    }
  }
  if (preset.idea.length < 80) throw new Error(`Preset ${preset.id}: ideia curta demais para servir como guia.`);
  if (preset.restrictions.length < 40) throw new Error(`Preset ${preset.id}: restrições insuficientes.`);
  const combined = `${preset.label} ${preset.idea} ${preset.restrictions}`;
  for (const pattern of unsafePatterns) {
    if (pattern.test(combined)) throw new Error(`Preset ${preset.id}: claim/CTA proibido detectado (${pattern}).`);
  }
}

console.log(`Prompt Builder presets OK: ${presets.length} presets válidos.`);
