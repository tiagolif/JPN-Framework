import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  JPN_MOBILE_CONTEXT_RULES,
  jpnBuildContextAwarePrompt,
  jpnExtractContext,
} from "../product-site/mobile-context-aware.js";

const salesIdea = "Quero criar uma abordagem de venda pelo WhatsApp para um cliente que demonstrou interesse em um guarda-roupa, mas ainda não informou orçamento, tamanho disponível no quarto nem forma de pagamento. Quero uma resposta profissional, curta e natural, que avance a conversa sem pressionar o cliente.";
const salesRestrictions = "Não inventar preço, estoque, prazo de entrega, medidas, condição de pagamento ou promoção. Não usar urgência artificial e não pressionar o cliente.";

const cases = [
  {
    id: "PB-CTX-01",
    type: "Atendimento / vendas",
    idea: salesIdea,
    restrictions: salesRestrictions,
    mustInclude: [
      "demonstrou interesse em um guarda-roupa",
      "Orçamento/faixa de valor ainda não confirmado.",
      "Espaço ou medida disponível ainda não confirmado.",
      "Forma de pagamento ainda não confirmada.",
      salesRestrictions,
      "Entregar primeiro a mensagem pronta para uso",
      "perguntas naturais ao cliente",
    ],
    mustNotInclude: ["Estado atual:\n- Não informado", "Restrições:\n- Não informadas"],
  },
  {
    id: "PB-CTX-02",
    type: "Análise",
    idea: "Quero analisar um relatório que informa queda nas vendas em agosto, mas ainda não sei a causa e faltam dados por canal. Preciso separar evidências, hipóteses e lacunas.",
    restrictions: "Não atribuir causa sem evidência.",
    mustInclude: ["análise rastreável", "Não atribuir causa sem evidência.", "faltam dados por canal"],
  },
  {
    id: "PB-CTX-03",
    type: "Automação / processo",
    idea: "Quero desenhar um fluxo para receber solicitações internas, validar campos obrigatórios e encaminhar exceções para uma pessoa antes de qualquer ação externa.",
    restrictions: "Não executar ações externas automaticamente.",
    mustInclude: ["fluxo operacional revisável", "condições de intervenção humana", "Não executar ações externas automaticamente."],
  },
  {
    id: "PB-CTX-04",
    type: "Produto digital / código",
    idea: "Quero adicionar uma função a um sistema existente, mas ainda não sei quais dependências estão instaladas. Preciso preservar o comportamento atual.",
    restrictions: "Não assumir arquitetura nem alterar dependências sem confirmação.",
    mustInclude: ["proposta implementável", "hipóteses técnicas", "Não assumir arquitetura nem alterar dependências sem confirmação."],
  },
  {
    id: "PB-CTX-05",
    type: "Texto / conteúdo",
    idea: "Quero escrever um post curto para divulgar uma novidade da empresa no Instagram, usando apenas informações confirmadas no briefing.",
    restrictions: "Não inventar números, depoimentos ou condições comerciais.",
    mustInclude: ["conteúdo pronto para o canal", "Não inventar números, depoimentos ou condições comerciais."],
  },
  {
    id: "PB-CTX-06",
    type: "Plano / estratégia",
    idea: "Quero organizar um plano de 30 dias para melhorar o atendimento, mas ainda não tenho uma linha de base de tempo de resposta.",
    restrictions: "Não criar metas numéricas sem dados de referência.",
    mustInclude: ["plano acionável", "premissas e lacunas", "Não criar metas numéricas sem dados de referência."],
  },
];

assert.deepEqual(Object.keys(JPN_MOBILE_CONTEXT_RULES), [
  "Atendimento / vendas",
  "Análise",
  "Automação / processo",
  "Produto digital / código",
  "Texto / conteúdo",
  "Plano / estratégia",
]);

for (const testCase of cases) {
  const prompt = jpnBuildContextAwarePrompt(testCase);
  assert.match(prompt, /^# JPN — Jornada · Precisão · Narrativa/m, `${testCase.id}: cabeçalho ausente`);
  assert.match(prompt, /## J — Jornada[\s\S]*## P — Precisão[\s\S]*## N — Narrativa/, `${testCase.id}: ordem JPN inválida`);
  for (const expected of testCase.mustInclude ?? []) {
    assert.ok(prompt.includes(expected), `${testCase.id}: conteúdo esperado ausente: ${expected}`);
  }
  for (const forbidden of testCase.mustNotInclude ?? []) {
    assert.ok(!prompt.includes(forbidden), `${testCase.id}: regressão detectada: ${forbidden}`);
  }
}

const salesContext = jpnExtractContext(salesIdea);
assert.ok(salesContext.confirmed.some((item) => item.includes("guarda-roupa")), "PB-CTX-01: contexto confirmado perdido");
assert.ok(salesContext.missing.some((item) => item.includes("Orçamento/faixa de valor")), "PB-CTX-01: orçamento não reconhecido como pendência");
assert.ok(salesContext.missing.some((item) => item.includes("Espaço ou medida")), "PB-CTX-01: medida/espaço não reconhecido como pendência");
assert.ok(salesContext.missing.some((item) => item.includes("Forma de pagamento")), "PB-CTX-01: forma de pagamento não reconhecida como pendência");

// A regressão contextual agora também protege a superfície principal do Builder.
// O SDK continua sendo o gate estrutural; a ponte só substitui a apresentação
// depois que os listeners síncronos do app.js terminaram.
const mainHtml = readFileSync(new URL("../product-site/index.html", import.meta.url), "utf8");
const mainBridge = readFileSync(new URL("../product-site/context-main-bridge.js", import.meta.url), "utf8");
const mainApp = readFileSync(new URL("../product-site/app.js", import.meta.url), "utf8");

assert.ok(mainHtml.includes('<script type="module" src="app.js"></script>'), "PB-CTX-MAIN: app principal ausente do HTML");
assert.ok(mainHtml.includes('<script type="module" src="context-main-bridge.js"></script>'), "PB-CTX-MAIN: ponte contextual ausente do HTML principal");
assert.ok(mainHtml.indexOf('src="app.js"') < mainHtml.indexOf('src="context-main-bridge.js"'), "PB-CTX-MAIN: ponte contextual deve carregar após o app principal");
assert.ok(mainBridge.includes('from "./mobile-context-aware.js"'), "PB-CTX-MAIN: ponte não reutiliza a camada contextual testada");
assert.ok(mainBridge.includes("queueMicrotask"), "PB-CTX-MAIN: ponte deve executar depois do gate síncrono do SDK");
assert.ok(mainBridge.includes('startsWith("Não foi possível gerar um estado JPN válido.")'), "PB-CTX-MAIN: ponte não protege falha estrutural do SDK");
assert.ok(!/fetch\s*\(|XMLHttpRequest|WebSocket|EventSource/.test(mainBridge), "PB-CTX-MAIN: ponte não pode adicionar rede/API");
assert.ok(mainApp.includes("createJpnDraftFromText"), "PB-CTX-MAIN: SDK canônico deixou de criar o rascunho");
assert.ok(mainApp.includes("validateJpnState"), "PB-CTX-MAIN: validação canônica removida");
assert.ok(mainApp.includes("assessJpnReadiness"), "PB-CTX-MAIN: prontidão canônica removida");

console.log(`PASS check-prompt-builder-context-regressions: ${cases.length} casos estruturais + integração principal verificados.`);
console.log("Nota: este gate valida transformação determinística e ligação do Builder principal; não substitui inspeção humana móvel, benchmark semântico ou QA do bundle final.");
