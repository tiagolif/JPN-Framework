import {
  jpnBuildContextAwarePrompt,
  jpnExtractContext,
  jpnClean,
} from "./mobile-context-aware.js";

const $ = (id) => document.getElementById(id);

export function applyContextToMainBuilder(doc = globalThis.document) {
  const idea = jpnClean(doc?.getElementById("idea")?.value);
  if (!idea) return null;

  const outputNode = doc.getElementById("output");
  const gapsNode = doc.getElementById("gaps");
  if (!outputNode || !gapsNode) return null;

  // O SDK principal executa primeiro. Se ele rejeitar o estado, esta camada
  // não mascara a falha estrutural com uma saída contextual alternativa.
  if (outputNode.textContent.startsWith("Não foi possível gerar um estado JPN válido.")) {
    return null;
  }

  const type = doc.getElementById("type")?.value || "Plano / estratégia";
  const restrictions = jpnClean(doc.getElementById("restrictions")?.value);
  const context = jpnExtractContext(idea);
  const contextualPrompt = jpnBuildContextAwarePrompt({ idea, type, restrictions });

  outputNode.textContent = contextualPrompt;

  const sdkDiagnostics = gapsNode.innerHTML.trim();
  const contextualDiagnostics = context.missing.length
    ? context.missing.map((item) => `Pendência contextual: <code>${item}</code>`).join("<br>")
    : "Pendência contextual: nenhuma lacuna explícita extraída automaticamente; revisar antes de assumir dados adicionais.";

  gapsNode.innerHTML = [sdkDiagnostics, contextualDiagnostics].filter(Boolean).join("<br><br>");

  return {
    idea,
    type,
    restrictions,
    contextualPrompt,
    context,
  };
}

if (typeof document !== "undefined") {
  const generateButton = document.getElementById("generate");
  generateButton?.addEventListener("click", () => {
    // Executa depois dos listeners síncronos do Builder principal, preservando
    // createJpnDraftFromText -> validateJpnState -> assessJpnReadiness como gate.
    queueMicrotask(() => applyContextToMainBuilder(document));
  });
}
