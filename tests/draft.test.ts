import { describe, expect, it } from "vitest";

import {
  createJpnDraftFromText,
  validateJpnState,
} from "../src/index.js";

describe("createJpnDraftFromText", () => {
  it("creates a schema-valid conservative draft from raw text", () => {
    const result = createJpnDraftFromText(
      "Criar um plano de follow-up para leads que pararam de responder.",
    );

    expect(validateJpnState(result.state).valid).toBe(true);
    expect(result.state.jornada.itens_de_contexto?.[0]).toMatchObject({
      confidence_state: "confirmed",
      source: "raw_input",
    });
    expect(result.state.jornada.incertezas?.length).toBeGreaterThan(0);
    expect(result.unresolvedFields).toContain("/precisao/saidas");
  });

  it("uses explicit hints without marking them unresolved", () => {
    const result = createJpnDraftFromText("Preparar um resumo executivo.", {
      objetivoOperacional: "Resumir o material fornecido.",
      inclui: ["principais decisões"],
      naoInclui: ["inventar dados ausentes"],
      saidas: ["resumo executivo"],
      formatoDaResposta: "Markdown",
      criteriosDeAceitacao: ["Distinguir fatos de inferências."],
    });

    expect(validateJpnState(result.state).valid).toBe(true);
    expect(result.unresolvedFields).not.toContain("/precisao/saidas");
    expect(result.unresolvedFields).not.toContain("/narrativa/formato_da_resposta");
    expect(result.inferredFields).not.toContain("/precisao/objetivo");
    expect(result.state.precisao.saidas).toEqual(["resumo executivo"]);
  });

  it("deduplicates list hints", () => {
    const result = createJpnDraftFromText("Criar resposta.", {
      inclui: ["analisar", "analisar"],
      naoInclui: ["inventar", "inventar"],
      saidas: ["resposta", "resposta"],
    });

    expect(result.state.precisao.escopo.inclui).toEqual(["analisar"]);
    expect(result.state.precisao.escopo.nao_inclui).toEqual(["inventar"]);
    expect(result.state.precisao.saidas).toEqual(["resposta"]);
  });

  it("rejects empty raw input", () => {
    expect(() => createJpnDraftFromText("   ")).toThrow(
      "rawInput must be a non-empty string",
    );
  });
});
