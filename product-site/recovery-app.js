import { clearRecoverySnapshot, loadRecoverySnapshot, saveRecoverySnapshot } from "./recovery.js";

const $ = (id) => document.getElementById(id);
const watchedIds = ["workspaceName", "idea", "type", "restrictions"];
let timer = null;
let restored = false;
let temporaryMode = false;

function setRecoveryNotice(message) {
  const node = $("recoveryStatus");
  if (node) node.textContent = message;
}

function currentSnapshot() {
  return {
    activeWorkspaceId: $("workspace")?.value ?? "",
    workspaceName: $("workspaceName")?.value ?? "",
    idea: $("idea")?.value ?? "",
    type: $("type")?.value ?? "",
    restrictions: $("restrictions")?.value ?? "",
    prompt: $("output")?.textContent ?? "",
    score: Number.parseInt($("score")?.textContent ?? "", 10),
  };
}

function clearRecoveryForTemporaryMode() {
  clearTimeout(timer);
  try {
    clearRecoverySnapshot();
    setRecoveryNotice("Modo temporário ativo: recuperação automática local desativada e rascunho de recuperação removido.");
  } catch {
    setRecoveryNotice("Modo temporário ativo, mas o navegador não permitiu confirmar a limpeza da recuperação local.");
  }
}

function scheduleSave() {
  if (temporaryMode) {
    setRecoveryNotice("Modo temporário ativo: nenhuma recuperação automática será gravada.");
    return;
  }
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (temporaryMode) return;
    try {
      const snapshot = saveRecoverySnapshot(currentSnapshot());
      setRecoveryNotice(snapshot ? "Rascunho local protegido automaticamente." : "Sem alterações para recuperar.");
    } catch {
      setRecoveryNotice("O navegador bloqueou a recuperação automática local.");
    }
  }, 450);
}

function restore(snapshot) {
  if (!snapshot) return false;
  if ($("workspaceName")) $("workspaceName").value = snapshot.workspaceName;
  if ($("idea")) $("idea").value = snapshot.idea;
  if ($("type") && [...$("type").options].some((option) => option.value === snapshot.type)) $("type").value = snapshot.type;
  if ($("restrictions")) $("restrictions").value = snapshot.restrictions;
  if ($("output") && snapshot.prompt && !snapshot.prompt.startsWith("Seu prompt")) $("output").textContent = snapshot.prompt;
  if ($("score") && snapshot.score != null) $("score").textContent = `${snapshot.score}%`;
  restored = true;
  setRecoveryNotice(`Rascunho recuperado localmente de ${new Date(snapshot.savedAt).toLocaleString("pt-BR")}. Revise e gere novamente antes de usar.`);
  return true;
}

for (const id of watchedIds) {
  const node = $(id);
  node?.addEventListener(id === "type" ? "change" : "input", scheduleSave);
}

$("workspace")?.addEventListener("change", scheduleSave);
$("generate")?.addEventListener("click", () => setTimeout(scheduleSave, 0));
$("saveWorkspace")?.addEventListener("click", () => setTimeout(scheduleSave, 0));
$("updateWorkspace")?.addEventListener("click", () => setTimeout(scheduleSave, 0));

$("clearRecovery")?.addEventListener("click", () => {
  try {
    clearRecoverySnapshot();
    setRecoveryNotice("Recuperação local limpa. Projetos e presets salvos permanecem intactos.");
  } catch {
    setRecoveryNotice("Não foi possível limpar a recuperação local.");
  }
});

window.addEventListener("jpn:temporary-mode", (event) => {
  temporaryMode = event.detail?.enabled === true;
  if (temporaryMode) clearRecoveryForTemporaryMode();
  else setRecoveryNotice("Modo temporário desligado: a recuperação automática local pode voltar a salvar novas alterações.");
});

try {
  const snapshot = loadRecoverySnapshot();
  if (snapshot) restore(snapshot);
  else setRecoveryNotice("A recuperação automática fica somente neste navegador.");
} catch {
  setRecoveryNotice("O navegador bloqueou a recuperação automática local.");
}

window.addEventListener("pagehide", () => {
  if (temporaryMode) return;
  if (!restored || watchedIds.some((id) => $(id)?.value?.trim())) {
    try { saveRecoverySnapshot(currentSnapshot()); } catch { /* best effort */ }
  }
});
