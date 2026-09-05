import { describe, expect, it } from "vitest";

import {
  assessJpnReadiness,
  assertJpnState,
  buildJpnPrompt,
  isSupportedJpnVersion,
  JpnValidationError,
  SUPPORTED_JPN_VERSIONS,
  validateJpnState,
  type JpnState,
} from "../src/index.js";

const validState: JpnState = {
  version: "0.3.0-draft",
  jornada: {
    contexto: "Operação comercial com leads recebidos por WhatsApp.",
    objetivo_de_negocio: "Reduzir perda de leads.",
    estado_atual: "Follow-up manual e contexto fragmentado.",
    incertezas: ["SLA ainda não definido."],
    itens_de_contexto: [
      {
        value: "Handoff humano é obrigatório em casos sensíveis.",
        confidence_state: "confirmed",
        source: "requisito",
      },
    ],
  },
  precisao: {
    objetivo: "Estruturar um fluxo de atendimento assistido por IA.",
    escopo: {
      inclui: ["qualificação", "registro no CRM"],
      nao_inclui: ["decisão de crédito"],
    },
    saidas: ["lead qualificado", "resumo de contexto"],
    criterios_de_aceitacao: [
      "Inferências devem ser identificadas como inferências.",
    ],
    riscos: ["alucinação de dados comerciais"],
    validacao: ["executar cenários normais e conflitantes"],
  },
  narrativa: {
    estado_final_desejado: "Lead qualificado com contexto preservado.",
    sequencia_de_entrega: ["capturar", "qualificar", "validar", "entregar"],
    proxima_acao: "Executar piloto controlado.",
  },
};

describe("JPN SDK", () => {
  it("accepts a valid JPN state", () => {
    const result = validateJpnState(validState);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.precisao.objetivo).toContain("atendimento");
    }
  });

  it("declares the supported framework version", () => {
    expect(SUPPORTED_JPN_VERSIONS).toContain("0.3.0-draft");
    expect(isSupportedJpnVersion("0.3.0-draft")).toBe(true);
    expect(isSupportedJpnVersion("0.4.0-draft")).toBe(false);
  });

  it("rejects an unknown JPN version instead of coercing it", () => {
    const unknownVersion = {
      ...validState,
      version: "0.4.0-draft",
    };

    const result = validateJpnState(unknownVersion);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors).toEqual([
        expect.objectContaining({
          path: "/version",
          keyword: "unsupportedVersion",
        }),
      ]);
    }
  });

  it("rejects fields outside the schema", () => {
    const invalid = {
      ...validState,
      campo_inventado: true,
    };

    const result = validateJpnState(invalid);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some((issue) => issue.keyword === "additionalProperties")).toBe(true);
    }
  });

  it("throws a structured validation error", () => {
    const invalid = {
      version: "0.3.0-draft",
      jornada: validState.jornada,
    };

    expect(() => assertJpnState(invalid)).toThrow(JpnValidationError);
  });

  it("throws a structured validation error for unsupported versions", () => {
    const unknownVersion = {
      ...validState,
      version: "0.4.0-draft",
    };

    try {
      assertJpnState(unknownVersion);
      throw new Error("expected assertJpnState to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(JpnValidationError);
      expect((error as JpnValidationError).issues[0]).toEqual(
        expect.objectContaining({
          path: "/version",
          keyword: "unsupportedVersion",
        }),
      );
    }
  });

  it("builds an execution prompt with J, P and N", () => {
    const prompt = buildJpnPrompt(validState);

    expect(prompt).toContain("J — Jornada");
    expect(prompt).toContain("P — Precisão");
    expect(prompt).toContain("N — Narrativa");
    expect(prompt).toContain("[confirmed | fonte: requisito]");
    expect(prompt).not.toContain("undefined");
  });

  it("scores a well-specified state as ready", () => {
    const assessment = assessJpnReadiness(validState);

    expect(assessment.ready).toBe(true);
    expect(assessment.score).toBeGreaterThanOrEqual(70);
    expect(assessment.strengths.length).toBeGreaterThan(0);
  });
});
