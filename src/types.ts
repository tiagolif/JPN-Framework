export type ConfidenceState =
  | "confirmed"
  | "inferred"
  | "unknown"
  | "conflicting";

export interface ContextItem {
  value: string;
  confidence_state: ConfidenceState;
  source?: string | null;
}

export interface Jornada {
  contexto: string;
  objetivo_de_negocio?: string | null;
  estado_atual: string;
  historico_relevante?: string[];
  tentativas_anteriores?: string[];
  recursos_disponiveis?: string[];
  restricoes_conhecidas?: string[];
  incertezas?: string[];
  itens_de_contexto?: ContextItem[];
}

export interface Escopo {
  inclui: string[];
  nao_inclui: string[];
}

export interface Precisao {
  objetivo: string;
  escopo: Escopo;
  entradas?: string[];
  saidas: string[];
  restricoes?: string[];
  criterios_de_aceitacao?: string[];
  riscos?: string[];
  validacao?: string[];
}

export interface Narrativa {
  estado_final_desejado: string;
  sequencia_de_entrega?: string[];
  formato_da_resposta?: string | null;
  nivel_de_detalhe?: string | null;
  proxima_acao?: string | null;
  continuidade?: string[];
}

export interface JpnState {
  version: string;
  jornada: Jornada;
  precisao: Precisao;
  narrativa: Narrativa;
}

export interface ValidationIssue {
  path: string;
  keyword: string;
  message: string;
}

export type ValidationResult<T> =
  | { valid: true; data: T; errors: [] }
  | { valid: false; errors: ValidationIssue[] };

export interface PromptBuildOptions {
  includeConfidence?: boolean;
  includeEmptySections?: boolean;
  preamble?: string;
}

export interface ReadinessAssessment {
  score: number;
  ready: boolean;
  strengths: string[];
  gaps: string[];
}
