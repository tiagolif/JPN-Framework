export const JPN_MOBILE_CONTEXT_RULES = Object.freeze({
  "Atendimento / vendas": {
    finalState: "Entregar uma resposta comercial curta, natural e utilizável que avance a conversa sem inventar informações ausentes.",
    format: [
      "Entregar primeiro a mensagem pronta para uso, sem expor raciocínio interno.",
      "Transformar lacunas comerciais em perguntas naturais ao cliente, em vez de perguntar ao operador o que já pode ser descoberto na conversa.",
      "Fazer poucas perguntas por vez e preservar tom profissional, cordial e sem pressão.",
    ],
  },
  "Análise": {
    finalState: "Entregar uma análise rastreável que diferencie fatos, inferências, conflitos e lacunas relevantes.",
    format: ["Apresentar conclusão e evidência de suporte.", "Separar explicitamente incertezas e pontos que exigem verificação."],
  },
  "Automação / processo": {
    finalState: "Entregar um fluxo operacional revisável com entradas, regras, exceções, validações e condições de intervenção humana.",
    format: ["Organizar o fluxo em ordem de execução.", "Explicitar exceções, guardrails e critérios de parada."],
  },
  "Produto digital / código": {
    finalState: "Entregar uma proposta implementável sem assumir arquitetura, dependências ou comportamento não confirmados.",
    format: ["Separar contexto confirmado de hipóteses técnicas.", "Definir critérios de aceite e validação antes de alterações destrutivas."],
  },
  "Texto / conteúdo": {
    finalState: "Entregar conteúdo pronto para o canal e objetivo informados, preservando fatos e restrições confirmados.",
    format: ["Priorizar a peça final solicitada.", "Não criar fatos, números, depoimentos ou condições ausentes."],
  },
  "Plano / estratégia": {
    finalState: "Entregar um plano acionável, proporcional ao contexto confirmado e com próximos passos verificáveis.",
    format: ["Organizar ações por sequência e dependência.", "Sinalizar premissas e lacunas que alterem materialmente o plano."],
  },
});

export function jpnClean(value) { return (value || "").trim(); }
export function jpnSentences(text) { return jpnClean(text).split(/(?<=[.!?])\s+/).map((item) => item.trim()).filter(Boolean); }

export function jpnExtractContext(idea) {
  const sentences = jpnSentences(idea);
  const confirmed = sentences.length ? sentences : [idea];
  const missing = [];
  const lower = idea.toLocaleLowerCase("pt-BR");
  const missingPatterns = [
    [/não (?:informou|informa|foi informado|tenho|temos)\s+([^.;]+)/gi, "Informação explicitamente indicada como ausente: $1"],
    [/ainda não (?:informou|informa|foi informado|sei|sabemos)\s+([^.;]+)/gi, "Informação ainda não confirmada: $1"],
    [/falta(?:m)?\s+([^.;]+)/gi, "Pendente explicitamente mencionado: $1"],
  ];
  for (const [pattern, template] of missingPatterns) {
    for (const match of idea.matchAll(pattern)) {
      const value = jpnClean(match[1]);
      if (value) missing.push(template.replace("$1", value));
    }
  }
  if (lower.includes("não informou orçamento") || lower.includes("não informou o orçamento")) missing.push("Orçamento/faixa de valor ainda não confirmado.");
  if (lower.includes("tamanho disponível") || lower.includes("espaço disponível")) missing.push("Espaço ou medida disponível ainda não confirmado.");
  if (lower.includes("forma de pagamento")) missing.push("Forma de pagamento ainda não confirmada.");
  return { confirmed, missing: [...new Set(missing)] };
}

export function jpnBuildContextAwarePrompt({ idea, type, restrictions }) {
  const context = jpnExtractContext(idea);
  const rule = JPN_MOBILE_CONTEXT_RULES[type] || JPN_MOBILE_CONTEXT_RULES["Plano / estratégia"];
  const pending = context.missing.length ? context.missing.map((item) => `- ${item}`).join("\n") : "- Nenhuma lacuna explícita extraída automaticamente; revisar antes de assumir dados adicionais.";
  const restrictionText = restrictions ? `- ${restrictions}` : "- Não informadas pelo usuário; aplicar apenas guardrails gerais e manter isso explícito.";
  const format = rule.format.map((item) => `- ${item}`).join("\n");
  return `# JPN — Jornada · Precisão · Narrativa\n\n## J — Jornada\nContexto confirmado:\n${context.confirmed.map((item) => `- ${item}`).join("\n")}\n\nEstado atual e pendências extraídas do próprio pedido:\n${pending}\n\n## P — Precisão\nObjetivo operacional:\n- Produzir: ${type}.\n\nRestrições informadas:\n${restrictionText}\n\nCritérios de aceitação:\n- Usar o contexto confirmado sem reclassificá-lo como “não informado”.\n- Não inventar fatos, condições ou dados ausentes.\n- Tratar lacunas de acordo com a tarefa: perguntar somente quando bloquearem a execução; quando forem parte natural do atendimento, incorporá-las à própria resposta.\n- Separar fatos, inferências e pendências quando isso for material para a tarefa.\n\n## N — Narrativa\nEstado final desejado:\n- ${rule.finalState}\n\nFormato e sequência:\n${format}\n- Encerrar com a próxima ação adequada ao tipo de tarefa, sem criar obrigação externa.\n\n## Regra de execução\nProduza a entrega solicitada diretamente quando o contexto for suficiente. Não faça um preâmbulo de raciocínio nem devolva ao operador perguntas que podem ser tratadas naturalmente dentro da própria entrega. Se uma lacuna realmente impedir uma resposta segura, faça somente a pergunta essencial e explique brevemente por que ela bloqueia a execução.`;
}

export function jpnApplyContextAwareBuild(doc = globalThis.document) {
  const idea = jpnClean(doc?.getElementById("idea")?.value);
  if (!idea) return null;
  const type = doc.getElementById("type")?.value || "Plano / estratégia";
  const restrictions = jpnClean(doc.getElementById("restrictions")?.value);
  const output = jpnBuildContextAwarePrompt({ idea, type, restrictions });
  const score = Math.min(100, 45 + (idea.length >= 80 ? 20 : 0) + (restrictions ? 20 : 0) + 15);
  doc.getElementById("output").textContent = output;
  doc.getElementById("score").textContent = `${score}%`;
  doc.getElementById("status").textContent = score >= 80 ? "Estrutura contextual utilizável" : "Revisão recomendada";
  doc.getElementById("status").className = `status ${score >= 80 ? "good" : ""}`;
  const context = jpnExtractContext(idea);
  doc.getElementById("gaps").innerHTML = context.missing.length
    ? context.missing.map((item) => `• ${item}`).join("<br>")
    : "• Nenhuma pendência explícita extraída; revise fatos e restrições antes de executar.";
  globalThis.localStorage?.setItem("jpn-mobile-draft", JSON.stringify({ idea, type, restrictions, prompt: output, score }));
  return { idea, type, restrictions, output, score, context };
}

if (typeof document !== "undefined") {
  document.getElementById("generate")?.addEventListener("click", () => jpnApplyContextAwareBuild(document));
}
