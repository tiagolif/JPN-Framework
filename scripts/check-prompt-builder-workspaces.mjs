import assert from "node:assert/strict";
import {
  WORKSPACE_LIMIT,
  WORKSPACE_STORAGE_KEY,
  createWorkspace,
  duplicateWorkspace,
  exportWorkspaces,
  importWorkspaces,
  loadWorkspaces,
  removeWorkspace,
  saveWorkspaces,
  updateWorkspace,
} from "../product-site/workspaces.js";

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
}

assert.equal(WORKSPACE_STORAGE_KEY, "jpn.prompt-builder.workspaces.v1");
assert.equal(WORKSPACE_LIMIT, 30);

const workspace = createWorkspace({
  name: "Campanha teste",
  idea: "Criar um plano de campanha sem inventar preços.",
  type: "Plano / estratégia",
  restrictions: "Não inventar preços.",
  prompt: "Prompt compilado",
  readinessScore: 72,
  draft: { state: { exemplo: true } },
});
assert.ok(workspace);
assert.equal(workspace.name, "Campanha teste");
assert.equal(workspace.readinessScore, 72);
assert.equal(createWorkspace({ name: "Sem ideia", idea: "" }), null);

const storage = new MemoryStorage();
const saved = saveWorkspaces([workspace], storage);
assert.equal(saved.length, 1);
assert.equal(loadWorkspaces(storage)[0].id, workspace.id);

const updated = updateWorkspace(workspace, { name: "Campanha revisada", idea: workspace.idea });
assert.ok(updated);
assert.equal(updated.id, workspace.id);
assert.equal(updated.createdAt, workspace.createdAt);
assert.equal(updated.name, "Campanha revisada");
assert.ok(updated.updatedAt >= workspace.updatedAt);

const duplicate = duplicateWorkspace(updated);
assert.ok(duplicate);
assert.notEqual(duplicate.id, updated.id);
assert.equal(duplicate.name, "Campanha revisada — cópia");
assert.equal(duplicate.idea, updated.idea);

const afterRemoval = removeWorkspace([updated, duplicate], updated.id);
assert.equal(afterRemoval.length, 1);
assert.equal(afterRemoval[0].id, duplicate.id);

const exported = exportWorkspaces([updated, duplicate]);
const imported = importWorkspaces(exported);
assert.equal(imported.length, 2);
assert.ok(imported.some((item) => item.prompt === "Prompt compilado"));
assert.throws(() => importWorkspaces('{"format":"outro","version":1,"workspaces":[]}'), /incompatível/i);

const many = Array.from({ length: 40 }, (_, index) => createWorkspace({ name: `Projeto ${index}`, idea: `Ideia ${index}` }));
assert.equal(saveWorkspaces(many, null).length, WORKSPACE_LIMIT);

console.log("Prompt Builder local workspaces lifecycle: OK");
