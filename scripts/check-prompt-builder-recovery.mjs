import assert from "node:assert/strict";
import {
  RECOVERY_FORMAT,
  RECOVERY_KEY,
  RECOVERY_VERSION,
  clearRecoverySnapshot,
  loadRecoverySnapshot,
  normalizeRecoverySnapshot,
  saveRecoverySnapshot,
} from "../product-site/recovery.js";

class MemoryStorage {
  #data = new Map();
  getItem(key) { return this.#data.has(key) ? this.#data.get(key) : null; }
  setItem(key, value) { this.#data.set(key, String(value)); }
  removeItem(key) { this.#data.delete(key); }
}

const storage = new MemoryStorage();
const snapshot = normalizeRecoverySnapshot({
  workspaceName: "Campanha setembro",
  idea: "Criar um plano de campanha",
  type: "Plano / estratégia",
  restrictions: "Não inventar preços",
  prompt: "Prompt compilado",
  score: 84.9,
  activeWorkspaceId: "workspace-1",
});

assert.equal(snapshot.format, RECOVERY_FORMAT);
assert.equal(snapshot.version, RECOVERY_VERSION);
assert.equal(snapshot.score, 84);
assert.equal(snapshot.activeWorkspaceId, "workspace-1");
assert.ok(snapshot.savedAt);

saveRecoverySnapshot(snapshot, storage);
assert.ok(storage.getItem(RECOVERY_KEY));
const loaded = loadRecoverySnapshot(storage);
assert.equal(loaded.idea, snapshot.idea);
assert.equal(loaded.workspaceName, snapshot.workspaceName);
assert.equal(loaded.prompt, snapshot.prompt);
assert.equal(loaded.score, 84);

clearRecoverySnapshot(storage);
assert.equal(storage.getItem(RECOVERY_KEY), null);
assert.equal(loadRecoverySnapshot(storage), null);
assert.equal(normalizeRecoverySnapshot({}), null);

storage.setItem(RECOVERY_KEY, JSON.stringify({ format: "other", version: 1, idea: "x" }));
assert.equal(loadRecoverySnapshot(storage), null);

const long = "x".repeat(25000);
const bounded = normalizeRecoverySnapshot({ idea: long, workspaceName: long, score: 999 });
assert.equal(bounded.idea.length, 20000);
assert.equal(bounded.workspaceName.length, 120);
assert.equal(bounded.score, 100);

console.log("Prompt Builder recovery gate: OK");
