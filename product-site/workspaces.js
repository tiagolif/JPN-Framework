const STORAGE_KEY = "jpn.prompt-builder.workspaces.v1";
const FORMAT = "jpn-prompt-builder-workspaces";
const VERSION = 1;
const MAX_WORKSPACES = 30;

const clip = (value, max) => String(value ?? "").trim().slice(0, max);
const nowIso = () => new Date().toISOString();

function normalizeWorkspace(input = {}) {
  const name = clip(input.name, 120);
  const idea = clip(input.idea, 8000);
  if (!name || !idea) return null;

  const createdAt = clip(input.createdAt, 40) || nowIso();
  const updatedAt = clip(input.updatedAt, 40) || createdAt;
  const id = clip(input.id, 160) || `workspace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id,
    name,
    idea,
    type: clip(input.type, 120),
    restrictions: clip(input.restrictions, 4000),
    prompt: clip(input.prompt, 30000),
    draft: input.draft && typeof input.draft === "object" ? input.draft : null,
    readinessScore: Number.isFinite(Number(input.readinessScore)) ? Math.max(0, Math.min(100, Number(input.readinessScore))) : null,
    createdAt,
    updatedAt,
  };
}

export function createWorkspace(input) {
  return normalizeWorkspace({ ...input, createdAt: nowIso(), updatedAt: nowIso() });
}

export function updateWorkspace(existing, input) {
  if (!existing?.id) return null;
  return normalizeWorkspace({
    ...existing,
    ...input,
    id: existing.id,
    createdAt: existing.createdAt || nowIso(),
    updatedAt: nowIso(),
  });
}

export function duplicateWorkspace(existing, name) {
  if (!existing) return null;
  return createWorkspace({
    ...existing,
    id: undefined,
    name: clip(name, 120) || `${existing.name} — cópia`,
    createdAt: undefined,
    updatedAt: undefined,
  });
}

export function removeWorkspace(items, id) {
  const targetId = clip(id, 160);
  return (Array.isArray(items) ? items : []).filter((item) => item?.id !== targetId);
}

export function loadWorkspaces(storage = globalThis.localStorage) {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeWorkspace).filter(Boolean).slice(0, MAX_WORKSPACES);
  } catch {
    return [];
  }
}

export function saveWorkspaces(items, storage = globalThis.localStorage) {
  const normalized = (Array.isArray(items) ? items : [])
    .map(normalizeWorkspace)
    .filter(Boolean)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, MAX_WORKSPACES);
  if (!storage) return normalized;
  storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function exportWorkspaces(items) {
  const workspaces = saveWorkspaces(items, null);
  return JSON.stringify({ format: FORMAT, version: VERSION, exportedAt: nowIso(), workspaces }, null, 2);
}

export function importWorkspaces(text) {
  const parsed = JSON.parse(text);
  if (!parsed || parsed.format !== FORMAT || parsed.version !== VERSION || !Array.isArray(parsed.workspaces)) {
    throw new Error("Arquivo incompatível com o formato de projetos locais do JPN Prompt Builder.");
  }
  return parsed.workspaces.map(normalizeWorkspace).filter(Boolean).slice(0, MAX_WORKSPACES);
}

export const WORKSPACE_STORAGE_KEY = STORAGE_KEY;
export const WORKSPACE_LIMIT = MAX_WORKSPACES;
