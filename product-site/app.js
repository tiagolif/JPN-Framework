import {
  createJpnDraftFromText,
  assessJpnReadiness,
  buildJpnPrompt,
  validateJpnState,
} from "../dist/browser/index.js";
import { BUILDER_PRESETS, getBuilderPreset } from "./presets.js";
import {
  createCustomPreset,
  exportCustomPresets,
  importCustomPresets,
  loadCustomPresets,
  saveCustomPresets,
} from "./custom-presets.js";
import {
  createWorkspace,
  duplicateWorkspace,
  exportWorkspaces,
  importWorkspaces,
  loadWorkspaces,
  removeWorkspace,
  saveWorkspaces,
  updateWorkspace,
} from "./workspaces.js";

const $ = (id) => document.getElementById(id);
const clean = (value) => {
  const v = (value ?? "").trim();
  return v || undefined;
};

let lastDraft = null;
let customPresets = loadCustomPresets();
let workspaces = loadWorkspaces();
let activeWorkspaceId = "";

function setNotice(message, kind = "warn") {
  $("status").textContent = message;
  $("status").className = `status ${kind}`;
}

function renderPresetOptions(selectedId = "") {
  const select = $("preset");
  select.innerHTML = '<option value="">Sem preset — começar do zero</option>';
  const guidedGroup = document.createElement("optgroup");
  guidedGroup.label = "Presets guiados JPN";
  for (const preset of BUILDER_PRESETS) {
    const option = document.createElement("option");
    option.value = preset.id;
    option.textContent = preset.label;
    guidedGroup.appendChild(option);
  }
  select.appendChild(guidedGroup);
  if (customPresets.length) {
    const customGroup = document.createElement("optgroup");
    customGroup.label = "Meus presets locais";
    for (const preset of customPresets) {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = preset.label;
      customGroup.appendChild(option);
    }
    select.appendChild(customGroup);
  }
  select.value = selectedId;
}

function renderWorkspaceOptions(selectedId = "") {
  const select = $("workspace");
  select.innerHTML = '<option value="">Nenhum projeto carregado</option>';
  for (const workspace of workspaces) {
    const option = document.createElement("option");
    option.value = workspace.id;
    option.textContent = workspace.name;
    select.appendChild(option);
  }
  select.value = selectedId;
  activeWorkspaceId = selectedId && workspaces.some((item) => item.id === selectedId) ? selectedId : "";
}

function getAnyPreset(id) {
  return getBuilderPreset(id) ?? customPresets.find((preset) => preset.id === id) ?? null;
}

function applyPreset(id) {
  const preset = getAnyPreset(id);
  if (!preset) return;
  $("idea").value = preset.idea;
  $("type").value = preset.type;
  $("restrictions").value = preset.restrictions;
  setNotice("Preset carregado — revise antes de gerar");
  $("gaps").textContent = "O conteúdo é um ponto de partida editável; confirme contexto, critérios e restrições do seu caso.";
}

function loadWorkspace(id) {
  const workspace = workspaces.find((item) => item.id === id);
  if (!workspace) return;
  activeWorkspaceId = workspace.id;
  $("idea").value = workspace.idea;
  $("type").value = workspace.type || $("type").options[0].value;
  $("restrictions").value = workspace.restrictions;
  $("workspaceName").value = workspace.name;
  lastDraft = workspace.draft;
  $("output").textContent = workspace.prompt || "Projeto carregado. Gere novamente para recalcular o rascunho JPN.";
  $("score").textContent = workspace.readinessScore == null ? "—" : `${workspace.readinessScore}%`;
  setNotice("Projeto local carregado — revise antes de continuar", "good");
  $("gaps").textContent = "Projetos são snapshots locais. Gere novamente se você alterar os campos ou quiser recalcular a prontidão.";
}

function currentWorkspaceInput() {
  return {
    name: $("workspaceName").value,
    idea: $("idea").value,
    type: $("type").value,
    restrictions: $("restrictions").value,
    prompt: $("output").textContent,
    draft: lastDraft,
    readinessScore: Number.parseInt($("score").textContent, 10),
  };
}

function downloadBlob(content, type, filename) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([content], { type }));
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function build() {
  const idea = clean($("idea").value);
  const type = $("type").value;
  const restriction = clean($("restrictions").value);
  if (!idea) {
    setNotice("Escreva sua ideia");
    $("score").textContent = "0%";
    $("gaps").textContent = "";
    return;
  }
  try {
    const result = createJpnDraftFromText(idea, {
      formatoDaResposta: type,
      naoInclui: restriction ? [restriction] : undefined,
      nivelDeDetalhe: "Suficiente para uso imediato, sem conteúdo irrelevante.",
    });
    const validation = validateJpnState(result.state);
    if (!validation.valid) {
      throw new Error(`Rascunho inválido: ${validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ")}`);
    }
    const readiness = assessJpnReadiness(result.state);
    lastDraft = result;
    $("output").textContent = buildJpnPrompt(result.state);
    $("score").textContent = `${readiness.score}%`;
    $("status").textContent = result.unresolvedFields.length
      ? `Revisar ${result.unresolvedFields.length} campo(s)`
      : readiness.ready ? "Estrutura utilizável" : "Revisão recomendada";
    $("status").className = `status ${result.unresolvedFields.length === 0 && readiness.ready ? "good" : "warn"}`;
    $("gaps").innerHTML = [
      ...result.unresolvedFields.map((path) => `Não confirmado: <code>${path}</code>`),
      ...result.inferredFields.map((path) => `Default operacional: <code>${path}</code>`),
      ...readiness.gaps.map((gap) => `Prontidão: ${gap}`),
    ].join("<br>");
  } catch (error) {
    lastDraft = null;
    $("score").textContent = "0%";
    setNotice("Falha de validação");
    $("gaps").textContent = error instanceof Error ? error.message : String(error);
    $("output").textContent = "Não foi possível gerar um estado JPN válido.";
  }
}

renderPresetOptions();
renderWorkspaceOptions();

$("preset").addEventListener("change", (event) => {
  const id = event.target.value;
  if (id) applyPreset(id);
});

$("workspace").addEventListener("change", (event) => {
  const id = event.target.value;
  activeWorkspaceId = id;
  if (id) loadWorkspace(id);
});

$("saveWorkspace").addEventListener("click", () => {
  const workspace = createWorkspace(currentWorkspaceInput());
  if (!workspace) {
    setNotice("Informe um nome e uma ideia antes de salvar o projeto");
    return;
  }
  try {
    workspaces = saveWorkspaces([workspace, ...workspaces]);
    renderWorkspaceOptions(workspace.id);
    setNotice("Novo projeto salvo somente neste navegador", "good");
    $("gaps").textContent = "O projeto guarda um snapshot independente. Exporte o backup JSON para transferência manual.";
  } catch {
    setNotice("O navegador bloqueou o armazenamento local");
  }
});

$("updateWorkspace").addEventListener("click", () => {
  const existing = workspaces.find((item) => item.id === activeWorkspaceId);
  if (!existing) {
    setNotice("Carregue um projeto antes de atualizar");
    return;
  }
  const updated = updateWorkspace(existing, currentWorkspaceInput());
  if (!updated) {
    setNotice("O projeto precisa manter nome e ideia");
    return;
  }
  try {
    workspaces = saveWorkspaces([updated, ...removeWorkspace(workspaces, existing.id)]);
    renderWorkspaceOptions(updated.id);
    setNotice("Projeto carregado atualizado localmente", "good");
    $("gaps").textContent = "A atualização preserva o mesmo identificador e a data de criação, registrando um novo updatedAt.";
  } catch {
    setNotice("O navegador bloqueou o armazenamento local");
  }
});

$("duplicateWorkspace").addEventListener("click", () => {
  const existing = workspaces.find((item) => item.id === activeWorkspaceId);
  if (!existing) {
    setNotice("Carregue um projeto antes de duplicar");
    return;
  }
  const copy = duplicateWorkspace(existing);
  if (!copy) return;
  try {
    workspaces = saveWorkspaces([copy, ...workspaces]);
    renderWorkspaceOptions(copy.id);
    loadWorkspace(copy.id);
    setNotice("Cópia independente criada localmente", "good");
    $("gaps").textContent = "A duplicação cria outro identificador para permitir versões paralelas sem sobrescrever o original.";
  } catch {
    setNotice("O navegador bloqueou o armazenamento local");
  }
});

$("deleteWorkspace").addEventListener("click", () => {
  const existing = workspaces.find((item) => item.id === activeWorkspaceId);
  if (!existing) {
    setNotice("Carregue um projeto antes de excluir");
    return;
  }
  const confirmation = globalThis.confirm?.(`Excluir o projeto local “${existing.name}”? Esta ação não pode ser desfeita sem um backup exportado.`);
  if (confirmation !== true) {
    setNotice("Exclusão cancelada");
    return;
  }
  try {
    workspaces = saveWorkspaces(removeWorkspace(workspaces, existing.id));
    renderWorkspaceOptions();
    activeWorkspaceId = "";
    setNotice("Projeto local excluído", "good");
    $("gaps").textContent = "A exclusão remove somente o snapshot armazenado neste navegador; backups JSON exportados não são alterados.";
  } catch {
    setNotice("O navegador bloqueou o armazenamento local");
  }
});

$("exportWorkspaces").addEventListener("click", () => {
  if (!workspaces.length) {
    setNotice("Nenhum projeto local para exportar");
    return;
  }
  downloadBlob(exportWorkspaces(workspaces), "application/json;charset=utf-8", "jpn-projetos-locais.json");
});

$("importWorkspaces").addEventListener("click", () => $("workspaceFile").click());
$("workspaceFile").addEventListener("change", async (event) => {
  const [file] = event.target.files ?? [];
  event.target.value = "";
  if (!file) return;
  try {
    const imported = importWorkspaces(await file.text());
    const merged = [...imported, ...workspaces];
    const unique = Array.from(new Map(merged.map((workspace) => [workspace.id, workspace])).values());
    workspaces = saveWorkspaces(unique);
    renderWorkspaceOptions();
    setNotice(`${imported.length} projeto(s) importado(s) localmente`, "good");
    $("gaps").textContent = "Arquivos importados são tratados como snapshots editáveis e nunca são executados automaticamente.";
  } catch (error) {
    setNotice("Não foi possível importar os projetos");
    $("gaps").textContent = error instanceof Error ? error.message : String(error);
  }
});

$("savePreset").addEventListener("click", () => {
  const preset = createCustomPreset({
    label: $("presetName").value,
    type: $("type").value,
    idea: $("idea").value,
    restrictions: $("restrictions").value,
  });
  if (!preset) {
    setNotice("Informe um nome e uma ideia antes de salvar o preset");
    return;
  }
  try {
    customPresets = saveCustomPresets([preset, ...customPresets]);
    renderPresetOptions(preset.id);
    $("presetName").value = "";
    setNotice("Preset salvo somente neste navegador", "good");
    $("gaps").textContent = "O preset foi armazenado localmente. Exporte um backup JSON se quiser levá-lo para outro navegador ou dispositivo.";
  } catch {
    setNotice("O navegador bloqueou o armazenamento local");
  }
});

$("exportPresets").addEventListener("click", () => {
  if (!customPresets.length) {
    setNotice("Nenhum preset local para exportar");
    return;
  }
  downloadBlob(exportCustomPresets(customPresets), "application/json;charset=utf-8", "jpn-presets-locais.json");
});
$("importPresets").addEventListener("click", () => $("presetFile").click());
$("presetFile").addEventListener("change", async (event) => {
  const [file] = event.target.files ?? [];
  event.target.value = "";
  if (!file) return;
  try {
    const imported = importCustomPresets(await file.text());
    const merged = [...imported, ...customPresets];
    const unique = Array.from(new Map(merged.map((preset) => [preset.id, preset])).values());
    customPresets = saveCustomPresets(unique);
    renderPresetOptions();
    setNotice(`${imported.length} preset(s) importado(s) localmente`, "good");
    $("gaps").textContent = "Revise presets importados antes de usá-los; o Builder não executa automaticamente o conteúdo do arquivo.";
  } catch (error) {
    setNotice("Não foi possível importar os presets");
    $("gaps").textContent = error instanceof Error ? error.message : String(error);
  }
});

$("generate").addEventListener("click", build);
$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("output").textContent);
    $("copy").textContent = "Copiado";
    setTimeout(() => ($("copy").textContent = "Copiar"), 1300);
  } catch {
    $("copy").textContent = "Não foi possível copiar";
  }
});
$("download").addEventListener("click", () => {
  const text = $("output").textContent;
  if (!text || text.startsWith("Seu prompt") || text.startsWith("Não foi possível")) return;
  downloadBlob(text, "text/plain;charset=utf-8", "prompt-jpn.txt");
});
$("downloadJson").addEventListener("click", () => {
  if (!lastDraft) return;
  downloadBlob(JSON.stringify(lastDraft, null, 2), "application/json", "rascunho-jpn.json");
});
