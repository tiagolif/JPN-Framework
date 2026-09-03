import type { JpnState, ReadinessAssessment } from "./types.js";
import { assertJpnState } from "./validator.js";

export function assessJpnReadiness(input: JpnState): ReadinessAssessment {
  assertJpnState(input);

  const strengths: string[] = [];
  const gaps: string[] = [];
  let score = 0;

  score += 15;
  strengths.push("Contexto e estado atual definidos");

  if (input.jornada.objetivo_de_negocio) {
    score += 10;
    strengths.push("Objetivo de negócio explícito");
  } else {
    gaps.push("Objetivo de negócio não informado");
  }

  if ((input.jornada.incertezas?.length ?? 0) > 0) {
    score += 10;
    strengths.push("Incertezas explicitadas");
  } else {
    gaps.push("Nenhuma incerteza registrada; confirme se o contexto está completo");
  }

  score += 15;
  strengths.push("Objetivo operacional e escopo definidos");

  if ((input.precisao.criterios_de_aceitacao?.length ?? 0) > 0) {
    score += 15;
    strengths.push("Critérios de aceitação definidos");
  } else {
    gaps.push("Faltam critérios de aceitação verificáveis");
  }

  if ((input.precisao.validacao?.length ?? 0) > 0) {
    score += 10;
    strengths.push("Plano de validação definido");
  } else {
    gaps.push("Falta estratégia de validação");
  }

  if ((input.precisao.riscos?.length ?? 0) > 0) {
    score += 10;
    strengths.push("Riscos explicitados");
  } else {
    gaps.push("Riscos ainda não foram mapeados");
  }

  score += 10;
  strengths.push("Estado final desejado definido");

  if (
    (input.narrativa.sequencia_de_entrega?.length ?? 0) > 0 ||
    input.narrativa.proxima_acao
  ) {
    score += 5;
    strengths.push("Continuidade ou sequência de entrega definida");
  } else {
    gaps.push("Falta sequência de entrega ou próxima ação");
  }

  const boundedScore = Math.max(0, Math.min(100, score));

  return {
    score: boundedScore,
    ready: boundedScore >= 70 && gaps.length <= 3,
    strengths,
    gaps,
  };
}
