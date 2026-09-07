import assert from "node:assert/strict";
import {
  WORKSPACE_LIMIT,
  WORKSPACE_STORAGE_KEY,
  createWorkspace,
  exportWorkspaces,
  importWorkspaces,
  loadWorkspaces,
  saveWorkspaces,
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

const exported = exportWorkspaces(saved);
const imported = importWorkspaces(exported);
assert.equal(imported.length, 1);
assert.equal(imported[0].prompt, "Prompt compilado");
assert.throws(() => importWorkspaces('{"format":"outro","version":1,"workspaces":[]}'), /incompatível/i);

const many = Array.from({ length: 40 }, (_, index) => createWorkspace({ name: `Projeto ${index}`, idea: `Ideia ${index}` }));
assert.equal(saveWorkspaces(many, null).length, WORKSPACE_LIMIT);

console.log("Prompt Builder local workspaces: OK");
