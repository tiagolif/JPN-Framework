const RECOVERY_KEY = "jpn.prompt-builder.recovery.v1";
const RECOVERY_FORMAT = "jpn-prompt-builder-recovery";
const RECOVERY_VERSION = 1;
const MAX_TEXT = 20000;

function cleanText(value, max = MAX_TEXT) {
  return String(value ?? "").slice(0, max);
}

export function normalizeRecoverySnapshot(input = {}) {
  const snapshot = {
    format: RECOVERY_FORMAT,
    version: RECOVERY_VERSION,
    savedAt: new Date().toISOString(),
    activeWorkspaceId: cleanText(input.activeWorkspaceId, 200),
    workspaceName: cleanText(input.workspaceName, 120),
    idea: cleanText(input.idea),
    type: cleanText(input.type, 200),
    restrictions: cleanText(input.restrictions),
    prompt: cleanText(input.prompt),
    score: Number.isFinite(input.score) ? Math.max(0, Math.min(100, Math.trunc(input.score))) : null,
  };
  return snapshot.idea.trim() || snapshot.workspaceName.trim() || snapshot.restrictions.trim() || snapshot.prompt.trim()
    ? snapshot
    : null;
}

export function saveRecoverySnapshot(input, storage = globalThis.localStorage) {
  const snapshot = normalizeRecoverySnapshot(input);
  if (!storage) return snapshot;
  if (!snapshot) {
    storage.removeItem(RECOVERY_KEY);
    return null;
  }
  storage.setItem(RECOVERY_KEY, JSON.stringify(snapshot));
  return snapshot;
}

export function loadRecoverySnapshot(storage = globalThis.localStorage) {
  if (!storage) return null;
  const raw = storage.getItem(RECOVERY_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.format !== RECOVERY_FORMAT || parsed?.version !== RECOVERY_VERSION) return null;
    return normalizeRecoverySnapshot(parsed);
  } catch {
    return null;
  }
}

export function clearRecoverySnapshot(storage = globalThis.localStorage) {
  storage?.removeItem(RECOVERY_KEY);
}

export { RECOVERY_KEY, RECOVERY_FORMAT, RECOVERY_VERSION };
