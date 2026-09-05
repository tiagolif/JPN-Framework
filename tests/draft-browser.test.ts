import { describe, expect, it } from "vitest";

import {
  assessJpnReadiness,
  buildJpnPrompt,
  createJpnDraftFromText,
  validateJpnState,
} from "../src/index.js";

describe("browser + draft integration", () => {
  it("keeps the raw request confirmed and compiles a reusable prompt", () => {
    const result = createJpnDraftFromText(
      "Criar um plano de follow-up para leads que pararam de responder.",
      {
        naoInclui: ["inventar preço ou estoque"],
        saidas: ["plano de follow-up", "mensagens sugeridas"],
      },
    );

    const validation = validateJpnState(result.state);
    const readiness = assessJpnReadiness(result.state);
    const prompt = buildJpnPrompt(result.state);

    expect(validation.valid).toBe(true);
    expect(result.state.jornada.itens_de_contexto?.[0]).toMatchObject({
      confidence_state: "confirmed",
      source: "raw_input",
    });
    expect(result.unresolvedFields).toContain("/narrativa/formato_da_resposta");
    expect(readiness.score).toBeGreaterThan(0);
    expect(prompt).toContain("follow-up");
    expect(prompt).toContain("inventar preço ou estoque");
  });
});
