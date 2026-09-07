export const BUILDER_PRESETS = [
  {
    id: "software-development",
    label: "Desenvolvimento de software",
    type: "Produto digital / código",
    idea: "Quero implementar uma funcionalidade em um sistema existente sem quebrar o comportamento atual. Antes de propor código, organize contexto, dependências, critérios de aceite, riscos e validações necessárias.",
    restrictions: "não assumir arquitetura, dependências ou comportamento que não tenham sido informados; sinalizar lacunas antes de alterar código",
  },
  {
    id: "document-analysis",
    label: "Análise de documentos",
    type: "Análise",
    idea: "Quero analisar um documento e separar fatos explícitos, inferências, lacunas e pontos que exigem confirmação. A resposta deve manter rastreabilidade entre conclusão e evidência disponível.",
    restrictions: "não inventar conteúdo ausente; não tratar inferência como fato; indicar quando a evidência é insuficiente",
  },
  {
    id: "sales-agent",
    label: "Atendimento e vendas",
    type: "Atendimento / vendas",
    idea: "Quero estruturar um atendimento comercial que descubra a necessidade do cliente, organize informações confirmadas, proponha a próxima ação adequada e preserve pendências antes de recomendar uma solução.",
    restrictions: "não inventar preço, estoque, prazo, condição comercial, depoimento ou característica de produto; não pressionar o cliente com urgência artificial",
  },
  {
    id: "technical-support",
    label: "Suporte técnico",
    type: "Atendimento / vendas",
    idea: "Quero diagnosticar um problema técnico de forma progressiva, distinguindo sintomas, hipóteses, evidências, testes seguros e critérios para escalar o atendimento.",
    restrictions: "não afirmar causa sem evidência; não sugerir ações destrutivas sem backup, reversibilidade ou confirmação adequada",
  },
  {
    id: "backoffice-automation",
    label: "Automação de backoffice",
    type: "Automação / processo",
    idea: "Quero desenhar uma automação para uma tarefa operacional recorrente, deixando claros gatilhos, entradas, regras, exceções, validações, saídas e condições para intervenção humana.",
    restrictions: "não executar ação irreversível, financeira, legal ou externa sem autorização explícita; manter trilha de auditoria e tratamento de exceções",
  },
  {
    id: "multiagent-handoff",
    label: "Multiagentes e handoff",
    type: "Automação / processo",
    idea: "Quero estruturar um fluxo entre múltiplos agentes em que cada transferência preserve objetivo, estado atual, evidências, pendências, próxima ação e responsável atual.",
    restrictions: "não descartar contexto confirmado durante o handoff; não transferir responsabilidade sem registrar pendências e critérios de conclusão",
  },
  {
    id: "rag-conflicting-sources",
    label: "RAG com fontes conflitantes",
    type: "Análise",
    idea: "Quero responder usando múltiplas fontes recuperadas, inclusive quando elas discordam. A resposta deve separar consenso, conflito, autoridade da fonte, data, incerteza e necessidade de verificação adicional.",
    restrictions: "não escolher silenciosamente uma fonte conflitante; não ocultar divergências materiais; não apresentar síntese como fato quando a evidência continuar inconclusiva",
  },
];

export function getBuilderPreset(id) {
  return BUILDER_PRESETS.find((preset) => preset.id === id) ?? null;
}
