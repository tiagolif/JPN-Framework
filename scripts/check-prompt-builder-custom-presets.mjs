import {
  CUSTOM_PRESET_LIMIT,
  CUSTOM_PRESET_STORAGE_KEY,
  createCustomPreset,
  exportCustomPresets,
  importCustomPresets,
  loadCustomPresets,
  normalizeCustomPreset,
  saveCustomPresets,
} from "../product-site/custom-presets.js";

const memoryStorage = () => {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, String(value)),
  };
};

if (CUSTOM_PRESET_STORAGE_KEY !== "jpn-builder-custom-presets-v1") {
  throw new Error("Chave de storage inesperada; uma mudança exige migração explícita.");
}
if (CUSTOM_PRESET_LIMIT !== 50) throw new Error("Limite de presets locais inesperado.");

const preset = createCustomPreset({
  label: "Análise recorrente",
  type: "Análise",
  idea: "Analisar o material fornecido separando fatos, inferências, lacunas e próximos passos verificáveis.",
  restrictions: "não inventar informações ausentes",
});

if (!preset?.id.startsWith("custom-analise-recorrente-")) {
  throw new Error("createCustomPreset não gerou ID local válido.");
}
if (preset.source !== "custom-local") throw new Error("Preset local sem marcador de origem.");
if (normalizeCustomPreset({ label: "sem id" }) !== null) {
  throw new Error("Preset incompleto deveria ser rejeitado.");
}

const storage = memoryStorage();
const saved = saveCustomPresets([preset], storage);
if (saved.length !== 1) throw new Error("Falha ao salvar preset válido.");
const loaded = loadCustomPresets(storage);
if (loaded.length !== 1 || loaded[0].idea !== preset.idea) {
  throw new Error("Round-trip via armazenamento local falhou.");
}

const exported = exportCustomPresets(loaded);
const parsed = JSON.parse(exported);
if (parsed.format !== "jpn-builder-custom-presets" || parsed.version !== 1) {
  throw new Error("Envelope de exportação incompatível.");
}
const imported = importCustomPresets(exported);
if (imported.length !== 1 || imported[0].label !== preset.label) {
  throw new Error("Round-trip export/import falhou.");
}

let incompatibleRejected = false;
try {
  importCustomPresets('{"format":"outro","version":1,"presets":[]}');
} catch {
  incompatibleRejected = true;
}
if (!incompatibleRejected) throw new Error("Arquivo incompatível deveria ser rejeitado.");

const many = Array.from({ length: CUSTOM_PRESET_LIMIT + 10 }, (_, index) => ({
  ...preset,
  id: `custom-${index}`,
  label: `Preset ${index}`,
}));
if (saveCustomPresets(many, storage).length !== CUSTOM_PRESET_LIMIT) {
  throw new Error("Limite de presets locais não foi aplicado.");
}

console.log("Prompt Builder custom presets OK: storage, import/export e limites válidos.");
