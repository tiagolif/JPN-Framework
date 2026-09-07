const STORAGE_KEY = "jpn-builder-custom-presets-v1";
const MAX_PRESETS = 50;
const MAX_TEXT = 4000;

const cleanText = (value, max = MAX_TEXT) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export function normalizeCustomPreset(input) {
  if (!input || typeof input !== "object") return null;

  const id = cleanText(input.id, 120);
  const label = cleanText(input.label, 120);
  const type = cleanText(input.type, 120);
  const idea = cleanText(input.idea);
  const restrictions = cleanText(input.restrictions);

  if (!id || !label || !type || !idea) return null;

  return {
    id,
    label,
    type,
    idea,
    restrictions,
    source: "custom-local",
  };
}

export function createCustomPreset({ label, type, idea, restrictions }) {
  const normalizedLabel = cleanText(label, 120);
  const normalizedIdea = cleanText(idea);
  if (!normalizedLabel || !normalizedIdea) return null;

  const safeId = normalizedLabel
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "preset";

  return normalizeCustomPreset({
    id: `custom-${safeId}-${Date.now().toString(36)}`,
    label: normalizedLabel,
    type,
    idea: normalizedIdea,
    restrictions,
  });
}

export function loadCustomPresets(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeCustomPreset).filter(Boolean).slice(0, MAX_PRESETS);
  } catch {
    return [];
  }
}

export function saveCustomPresets(presets, storage = globalThis.localStorage) {
  const normalized = Array.isArray(presets)
    ? presets.map(normalizeCustomPreset).filter(Boolean).slice(0, MAX_PRESETS)
    : [];
  storage?.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function exportCustomPresets(presets) {
  const normalized = Array.isArray(presets)
    ? presets.map(normalizeCustomPreset).filter(Boolean).slice(0, MAX_PRESETS)
    : [];
  return JSON.stringify(
    {
      format: "jpn-builder-custom-presets",
      version: 1,
      exportedAt: new Date().toISOString(),
      presets: normalized,
    },
    null,
    2,
  );
}

export function importCustomPresets(text) {
  const parsed = JSON.parse(text);
  if (parsed?.format !== "jpn-builder-custom-presets" || parsed?.version !== 1) {
    throw new Error("Arquivo de presets JPN incompatível.");
  }
  if (!Array.isArray(parsed.presets)) throw new Error("Lista de presets ausente.");

  const normalized = parsed.presets.map(normalizeCustomPreset).filter(Boolean);
  if (!normalized.length && parsed.presets.length) {
    throw new Error("Nenhum preset válido encontrado no arquivo.");
  }
  return normalized.slice(0, MAX_PRESETS);
}

export const CUSTOM_PRESET_STORAGE_KEY = STORAGE_KEY;
export const CUSTOM_PRESET_LIMIT = MAX_PRESETS;
