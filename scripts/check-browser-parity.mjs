import assert from "node:assert/strict";
import * as nodeSdk from "../dist/index.js";
import * as browserSdk from "../dist/browser/index.js";

const requiredExports = [
  "createJpnDraftFromText",
  "validateJpnState",
  "assessJpnReadiness",
  "buildJpnPrompt",
];

for (const name of requiredExports) {
  assert.equal(typeof nodeSdk[name], "function", `Node SDK missing ${name}`);
  assert.equal(typeof browserSdk[name], "function", `Browser SDK missing ${name}`);
}

const fixtures = [
  {
    name: "minimal raw input",
    rawInput: "Criar uma resposta de atendimento para um cliente que pediu mais informações.",
    hints: {},
  },
  {
    name: "commercial workflow with explicit scope",
    rawInput: "Criar um fluxo de follow-up para leads que pararam de responder.",
    hints: {
      objetivoDeNegocio: "Retomar conversas de forma organizada sem inventar condições comerciais.",
      objetivoOperacional: "Estruturar um follow-up utilizável pela equipe comercial.",
      inclui: ["Mensagem inicial", "Segundo contato", "Critério de encerramento"],
      naoInclui: ["Inventar preço", "Criar urgência falsa"],
      saidas: ["Sequência de mensagens", "Regras de uso"],
      formatoDaResposta: "Passo a passo",
      criteriosDeAceitacao: ["Não inventar informações comerciais"],
      validacao: ["Revisar mensagens contra as restrições"],
    },
  },
  {
    name: "deduplication and trimming",
    rawInput: "  Organizar uma rotina administrativa semanal.  ",
    hints: {
      inclui: ["Prioridades", " Prioridades ", "Pendências"],
      saidas: ["Checklist", "Checklist"],
      restricoes: ["Sem dados financeiros", " Sem dados financeiros "],
    },
  },
];

for (const fixture of fixtures) {
  const nodeDraft = nodeSdk.createJpnDraftFromText(fixture.rawInput, fixture.hints);
  const browserDraft = browserSdk.createJpnDraftFromText(fixture.rawInput, fixture.hints);

  assert.deepEqual(browserDraft, nodeDraft, `${fixture.name}: draft diverged`);

  const nodeValidation = nodeSdk.validateJpnState(nodeDraft.state);
  const browserValidation = browserSdk.validateJpnState(browserDraft.state);
  assert.deepEqual(browserValidation, nodeValidation, `${fixture.name}: validation diverged`);

  const nodeReadiness = nodeSdk.assessJpnReadiness(nodeDraft.state);
  const browserReadiness = browserSdk.assessJpnReadiness(browserDraft.state);
  assert.deepEqual(browserReadiness, nodeReadiness, `${fixture.name}: readiness diverged`);

  const nodePrompt = nodeSdk.buildJpnPrompt(nodeDraft.state);
  const browserPrompt = browserSdk.buildJpnPrompt(browserDraft.state);
  assert.equal(browserPrompt, nodePrompt, `${fixture.name}: compiled prompt diverged`);
}

for (const sdk of [nodeSdk, browserSdk]) {
  assert.throws(
    () => sdk.createJpnDraftFromText("   "),
    /rawInput must be a non-empty string/,
    "empty raw input must fail consistently",
  );
}

console.log(`Browser parity OK (${fixtures.length} fixtures, ${requiredExports.length} core exports).`);
