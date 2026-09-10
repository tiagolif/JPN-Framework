const FIELD_IDS = ["workspaceName", "idea", "restrictions", "presetName"];
const GUARDED_ACTIONS = new Map([
  ["saveWorkspace", "salvar este projeto localmente"],
  ["updateWorkspace", "atualizar este projeto localmente"],
  ["savePreset", "salvar este preset localmente"],
  ["exportWorkspaces", "exportar seus projetos"],
  ["exportPresets", "exportar seus presets"],
  ["download", "baixar este prompt"],
  ["downloadJson", "exportar este rascunho JSON"],
]);

const DETECTORS = [
  { id: "credential", label: "possível credencial ou segredo", pattern: /\b(?:api[_ -]?key|token|secret|senha|password|bearer)\b\s*[:=]\s*\S{6,}/iu },
  { id: "private-key", label: "possível chave privada", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/iu },
  { id: "card", label: "possível número de cartão", pattern: /\b(?:\d[ -]*?){13,19}\b/u },
  { id: "cpf", label: "possível CPF", pattern: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/u },
  { id: "email", label: "endereço de e-mail", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu },
  { id: "phone", label: "possível telefone", pattern: /(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?(?:9\s*)?\d{4}[-\s]?\d{4}\b/u },
];

function collectVisibleText() {
  const values = FIELD_IDS.map((id) => document.getElementById(id)?.value ?? "");
  values.push(document.getElementById("output")?.textContent ?? "");
  return values.filter(Boolean).join("\n");
}

export function inspectSensitiveData(text) {
  const findings = [];
  for (const detector of DETECTORS) {
    if (detector.pattern.test(text)) findings.push({ id: detector.id, label: detector.label });
  }
  return findings;
}

function ensureNotice() {
  let notice = document.getElementById("sensitiveDataNotice");
  if (notice) return notice;
  const panel = document.querySelector("#builder .panel");
  if (!panel) return null;
  notice = document.createElement("div");
  notice.id = "sensitiveDataNotice";
  notice.className = "demo-note";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  notice.setAttribute("aria-atomic", "true");
  notice.hidden = true;
  panel.prepend(notice);
  return notice;
}

function showFindings(findings) {
  const notice = ensureNotice();
  if (!notice) return;
  if (!findings.length) {
    notice.hidden = true;
    notice.textContent = "";
    return;
  }
  notice.hidden = false;
  notice.textContent = `Atenção: detectamos ${findings.map((item) => item.label).join(", ")}. Revise e remova dados desnecessários antes de salvar, copiar ou exportar.`;
}

function confirmGuardedAction(actionLabel) {
  const findings = inspectSensitiveData(collectVisibleText());
  showFindings(findings);
  if (!findings.length) return true;
  return globalThis.confirm?.(`O JPN encontrou ${findings.map((item) => item.label).join(", ")}. Isso pode ser um falso positivo. Deseja ${actionLabel} mesmo assim?`) === true;
}

for (const [id, actionLabel] of GUARDED_ACTIONS) {
  document.getElementById(id)?.addEventListener("click", (event) => {
    if (confirmGuardedAction(actionLabel)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, { capture: true });
}

document.getElementById("copy")?.addEventListener("click", (event) => {
  const findings = inspectSensitiveData(document.getElementById("output")?.textContent ?? "");
  showFindings(findings);
  if (!findings.length) return;
  const confirmed = globalThis.confirm?.(`O prompt pode conter ${findings.map((item) => item.label).join(", ")}. Deseja copiar mesmo assim?`) === true;
  if (!confirmed) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, { capture: true });

for (const id of FIELD_IDS) {
  document.getElementById(id)?.addEventListener("input", () => showFindings(inspectSensitiveData(collectVisibleText())));
}
