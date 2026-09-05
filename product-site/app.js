import {
  createJpnDraftFromText,
  assessJpnReadiness,
  buildJpnPrompt,
  validateJpnState,
} from "../dist/browser/index.js";

const $ = (id) => document.getElementById(id);
const clean = (value) => {
  const v = (value ?? "").trim();
  return v || undefined;
};

let lastDraft = null;

function build() {
  const idea = clean($("idea").value);
  const type = $("type").value;
  const restriction = clean($("restrictions").value);

  if (!idea) {
    $("status").textContent = "Escreva sua ideia";
    $("status").className = "status warn";
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
      throw new Error(
        `Rascunho inválido: ${validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ")}`,
      );
    }

    const readiness = assessJpnReadiness(result.state);
    lastDraft = result;

    $("output").textContent = buildJpnPrompt(result.state);
    $("score").textContent = `${readiness.score}%`;
    $("status").textContent = result.unresolvedFields.length
      ? `Revisar ${result.unresolvedFields.length} campo(s)`
      : readiness.ready
        ? "Estrutura utilizável"
        : "Revisão recomendada";
    $("status").className =
      `status ${result.unresolvedFields.length === 0 && readiness.ready ? "good" : "warn"}`;
    $("gaps").innerHTML = [
      ...result.unresolvedFields.map((path) => `Não confirmado: <code>${path}</code>`),
      ...result.inferredFields.map((path) => `Default operacional: <code>${path}</code>`),
      ...readiness.gaps.map((gap) => `Prontidão: ${gap}`),
    ].join("<br>");
  } catch (error) {
    lastDraft = null;
    $("score").textContent = "0%";
    $("status").textContent = "Falha de validação";
    $("status").className = "status warn";
    $("gaps").textContent = error instanceof Error ? error.message : String(error);
    $("output").textContent = "Não foi possível gerar um estado JPN válido.";
  }
}

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
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  a.href = url;
  a.download = "prompt-jpn.txt";
  a.click();
  URL.revokeObjectURL(url);
});

$("downloadJson").addEventListener("click", () => {
  if (!lastDraft) return;
  const a = document.createElement("a");
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(lastDraft, null, 2)], { type: "application/json" }),
  );
  a.href = url;
  a.download = "rascunho-jpn.json";
  a.click();
  URL.revokeObjectURL(url);
});
