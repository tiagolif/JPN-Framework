import type { JpnState } from "./types.js";

export interface JpnDraftHints {
  objetivoDeNegocio?: string | null;
  objetivoOperacional?: string;
  inclui?: string[];
  naoInclui?: string[];
  entradas?: string[];
  saidas?: string[];
  restricoes?: string[];
  criteriosDeAceitacao?: string[];
  riscos?: string[];
  validacao?: string[];
  formatoDaResposta?: string | null;
  nivelDeDetalhe?: string | null;
  proximaAcao?: string | null;
}

export interface JpnDraftResult {
  state: JpnState;
  inferredFields: string[];
  unresolvedFields: string[];
}

const clean = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const unique = (values: string[] | undefined): string[] =>
  [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];

/**
 * Creates a schema-valid JPN draft from free text without pretending to
 * understand missing facts. The raw request is preserved as confirmed input;
 * missing operational details are surfaced as explicit uncertainties.
 */
export function createJpnDraftFromText(
  rawInput: string,
  hints: JpnDraftHints = {},
): JpnDraftResult {
  const input = rawInput.trim();

  if (!input) {
    throw new Error("rawInput must be a non-empty string");
  }

  const objetivoOperacional =
    clean(hints.objetivoOperacional) ??
    "Estruturar e executar a solicitação fornecida, preservando o contexto e sinalizando lacunas relevantes.";

  const inclui = unique(hints.inclui);
  const naoInclui = unique(hints.naoInclui);
  const saidas = unique(hints.saidas);

  const inferredFields: string[] = [];
  const unresolvedFields: string[] = [];

  if (!clean(hints.objetivoOperacional)) inferredFields.push("/precisao/objetivo");
  if (inclui.length === 0) unresolvedFields.push("/precisao/escopo/inclui");
  if (naoInclui.length === 0) unresolvedFields.push("/precisao/escopo/nao_inclui");
  if (saidas.length === 0) unresolvedFields.push("/precisao/saidas");
  if (!clean(hints.formatoDaResposta ?? undefined)) unresolvedFields.push("/narrativa/formato_da_resposta");

  const uncertaintyMessages = [
    ...(inclui.length === 0 ? ["Escopo positivo ainda não foi confirmado."] : []),
    ...(naoInclui.length === 0 ? ["Limites explícitos do escopo ainda não foram confirmados."] : []),
    ...(saidas.length === 0 ? ["Saídas esperadas ainda não foram confirmadas."] : []),
    ...(!clean(hints.formatoDaResposta ?? undefined)
      ? ["Formato final da resposta ainda não foi confirmado."]
      : []),
  ];

  const state: JpnState = {
    version: "0.3.0-draft",
    jornada: {
      contexto: input,
      objetivo_de_negocio: clean(hints.objetivoDeNegocio ?? undefined) ?? null,
      estado_atual:
        "Solicitação bruta recebida. O estado foi inicializado como rascunho e requer revisão dos campos não confirmados.",
      incertezas: uncertaintyMessages,
      itens_de_contexto: [
        {
          value: input,
          confidence_state: "confirmed",
          source: "raw_input",
        },
      ],
    },
    precisao: {
      objetivo: objetivoOperacional,
      escopo: {
        inclui: inclui.length > 0 ? inclui : ["Interpretar a solicitação fornecida."],
        nao_inclui:
          naoInclui.length > 0
            ? naoInclui
            : ["Inventar fatos, fontes ou requisitos não fornecidos."],
      },
      entradas: unique(hints.entradas),
      saidas:
        saidas.length > 0
          ? saidas
          : ["Resultado principal alinhado à solicitação, com lacunas relevantes explicitadas."],
      restricoes: [
        "Não transformar inferências em fatos confirmados.",
        "Não preencher silenciosamente informações ausentes.",
        ...unique(hints.restricoes),
      ],
      criterios_de_aceitacao: unique(hints.criteriosDeAceitacao),
      riscos: unique(hints.riscos),
      validacao: unique(hints.validacao),
    },
    narrativa: {
      estado_final_desejado:
        "Solicitação transformada em um estado JPN revisável, com contexto preservado e lacunas explicitadas antes da execução final.",
      formato_da_resposta: clean(hints.formatoDaResposta ?? undefined) ?? null,
      nivel_de_detalhe: clean(hints.nivelDeDetalhe ?? undefined) ?? null,
      proxima_acao:
        clean(hints.proximaAcao ?? undefined) ??
        "Revisar os campos não confirmados antes de tratar o rascunho como especificação final.",
    },
  };

  return { state, inferredFields, unresolvedFields };
}
