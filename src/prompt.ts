import type {
  ContextItem,
  JpnState,
  PromptBuildOptions,
} from "./types.js";
import { assertJpnState } from "./validator.js";

function list(items: string[] | undefined): string[] {
  return (items ?? []).map((item) => `- ${item}`);
}

function optionalLine(label: string, value: string | null | undefined): string[] {
  return value ? [`${label}: ${value}`] : [];
}

function contextItems(
  items: ContextItem[] | undefined,
  includeConfidence: boolean,
): string[] {
  return (items ?? []).map((item) => {
    const confidence = includeConfidence
      ? ` [${item.confidence_state}${item.source ? ` | fonte: ${item.source}` : ""}]`
      : "";

    return `- ${item.value}${confidence}`;
  });
}

function section(title: string, lines: string[], includeEmpty: boolean): string[] {
  const meaningful = lines.filter((line) => line.trim().length > 0);

  if (!includeEmpty && meaningful.length === 0) {
    return [];
  }

  return [`## ${title}`, ...(meaningful.length > 0 ? meaningful : ["- Não informado"]), ""];
}

export function buildJpnPrompt(
  input: JpnState,
  options: PromptBuildOptions = {},
): string {
  assertJpnState(input);

  const includeConfidence = options.includeConfidence ?? true;
  const includeEmpty = options.includeEmptySections ?? false;
  const lines: string[] = [];

  if (options.preamble) {
    lines.push(options.preamble.trim(), "");
  }

  lines.push(
    `# JPN ${input.version}`,
    "Use o estado estruturado abaixo como contrato de contexto e execução.",
    "Não invente fatos ausentes. Diferencie evidência, inferência e incerteza.",
    "",
  );

  lines.push(
    ...section(
      "J — Jornada",
      [
        `Contexto: ${input.jornada.contexto}`,
        ...optionalLine("Objetivo de negócio", input.jornada.objetivo_de_negocio),
        `Estado atual: ${input.jornada.estado_atual}`,
        "",
        ...(input.jornada.historico_relevante?.length
          ? ["### Histórico relevante", ...list(input.jornada.historico_relevante)]
          : []),
        ...(input.jornada.tentativas_anteriores?.length
          ? ["### Tentativas anteriores", ...list(input.jornada.tentativas_anteriores)]
          : []),
        ...(input.jornada.recursos_disponiveis?.length
          ? ["### Recursos disponíveis", ...list(input.jornada.recursos_disponiveis)]
          : []),
        ...(input.jornada.restricoes_conhecidas?.length
          ? ["### Restrições conhecidas", ...list(input.jornada.restricoes_conhecidas)]
          : []),
        ...(input.jornada.incertezas?.length
          ? ["### Incertezas", ...list(input.jornada.incertezas)]
          : []),
        ...(input.jornada.itens_de_contexto?.length
          ? [
              "### Itens de contexto",
              ...contextItems(input.jornada.itens_de_contexto, includeConfidence),
            ]
          : []),
      ],
      includeEmpty,
    ),
  );

  lines.push(
    ...section(
      "P — Precisão",
      [
        `Objetivo operacional: ${input.precisao.objetivo}`,
        "### Escopo — inclui",
        ...list(input.precisao.escopo.inclui),
        "### Escopo — não inclui",
        ...list(input.precisao.escopo.nao_inclui),
        ...(input.precisao.entradas?.length
          ? ["### Entradas", ...list(input.precisao.entradas)]
          : []),
        "### Saídas esperadas",
        ...list(input.precisao.saidas),
        ...(input.precisao.restricoes?.length
          ? ["### Restrições", ...list(input.precisao.restricoes)]
          : []),
        ...(input.precisao.criterios_de_aceitacao?.length
          ? [
              "### Critérios de aceitação",
              ...list(input.precisao.criterios_de_aceitacao),
            ]
          : []),
        ...(input.precisao.riscos?.length
          ? ["### Riscos", ...list(input.precisao.riscos)]
          : []),
        ...(input.precisao.validacao?.length
          ? ["### Validação", ...list(input.precisao.validacao)]
          : []),
      ],
      includeEmpty,
    ),
  );

  lines.push(
    ...section(
      "N — Narrativa",
      [
        `Estado final desejado: ${input.narrativa.estado_final_desejado}`,
        ...(input.narrativa.sequencia_de_entrega?.length
          ? [
              "### Sequência de entrega",
              ...list(input.narrativa.sequencia_de_entrega),
            ]
          : []),
        ...optionalLine("Formato da resposta", input.narrativa.formato_da_resposta),
        ...optionalLine("Nível de detalhe", input.narrativa.nivel_de_detalhe),
        ...optionalLine("Próxima ação", input.narrativa.proxima_acao),
        ...(input.narrativa.continuidade?.length
          ? ["### Continuidade", ...list(input.narrativa.continuidade)]
          : []),
      ],
      includeEmpty,
    ),
  );

  lines.push(
    "## Regras de execução",
    "- Preserve fatos e decisões confirmadas.",
    "- Não transforme inferências em fatos.",
    "- Respeite o escopo e as restrições.",
    "- Valide o resultado contra os critérios de aceitação antes de concluir.",
    "- Quando houver conflito de contexto, sinalize-o em vez de escolher silenciosamente.",
  );

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
