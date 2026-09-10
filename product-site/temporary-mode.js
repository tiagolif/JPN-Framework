const PERSISTENCE_ACTION_IDS = [
  "saveWorkspace",
  "updateWorkspace",
  "duplicateWorkspace",
  "savePreset",
];

let enabled = false;
let status = null;

function ensureControls() {
  let toggle = document.getElementById("temporaryMode");
  if (toggle) return toggle;

  const recoveryStatus = document.getElementById("recoveryStatus");
  const recoveryNote = recoveryStatus?.closest(".demo-note");
  if (!recoveryNote) return null;

  const wrapper = document.createElement("div");
  wrapper.className = "temporary-mode-control";

  const label = document.createElement("label");
  label.setAttribute("for", "temporaryMode");
  label.className = "temporary-mode-label";

  toggle = document.createElement("input");
  toggle.id = "temporaryMode";
  toggle.type = "checkbox";
  toggle.setAttribute("aria-describedby", "temporaryModeStatus");

  const text = document.createElement("span");
  text.textContent = "Modo temporário — não criar novos salvamentos locais";

  status = document.createElement("span");
  status.id = "temporaryModeStatus";
  status.className = "field-help";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");

  label.append(toggle, text);
  wrapper.append(label, status);
  recoveryNote.append(wrapper);
  return toggle;
}

function setStatus(message) {
  status ??= document.getElementById("temporaryModeStatus");
  if (status) status.textContent = message;
}

function applyMode(nextEnabled) {
  enabled = Boolean(nextEnabled);
  document.documentElement.dataset.jpnTemporaryMode = enabled ? "on" : "off";

  for (const id of PERSISTENCE_ACTION_IDS) {
    const control = document.getElementById(id);
    if (!control) continue;
    control.disabled = enabled;
    control.setAttribute("aria-disabled", enabled ? "true" : "false");
  }

  window.dispatchEvent(new CustomEvent("jpn:temporary-mode", { detail: { enabled } }));
  setStatus(enabled
    ? "Ativo nesta sessão: recuperação automática e novos snapshots/presets locais ficam desativados. Exportações e cópia continuam sendo ações explícitas do usuário."
    : "Desligado: a recuperação automática local e os botões de salvar podem funcionar normalmente.");
}

export function isTemporaryModeEnabled() {
  return enabled;
}

const toggle = ensureControls();
if (toggle) {
  toggle.checked = false;
  toggle.addEventListener("change", () => applyMode(toggle.checked));
}

applyMode(false);
