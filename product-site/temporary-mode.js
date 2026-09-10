const PERSISTENCE_ACTION_IDS = [
  "saveWorkspace",
  "updateWorkspace",
  "duplicateWorkspace",
  "savePreset",
];

const toggle = document.getElementById("temporaryMode");
const status = document.getElementById("temporaryModeStatus");
let enabled = false;

function setStatus(message) {
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
    ? "Modo temporário ativo: recuperação automática e novos salvamentos locais estão desativados nesta sessão."
    : "Modo temporário desligado: a recuperação automática local pode voltar a salvar alterações desta sessão.");
}

export function isTemporaryModeEnabled() {
  return enabled;
}

if (toggle) {
  toggle.checked = false;
  toggle.addEventListener("change", () => applyMode(toggle.checked));
}

applyMode(false);
