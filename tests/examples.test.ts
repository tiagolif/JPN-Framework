import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { validateJpnState } from "../src/index.js";

const exampleFiles = [
  "software-development.json",
  "document-analysis.json",
  "sales-agent.json",
  "technical-support.json",
  "backoffice-automation.json",
  "multi-agent-handoff.json",
  "rag-conflicting-sources.json",
] as const;

describe("JPN examples", () => {
  for (const filename of exampleFiles) {
    it(`${filename} matches the public JPN schema`, () => {
      const raw = readFileSync(resolve("examples", filename), "utf8");
      const state: unknown = JSON.parse(raw);
      const result = validateJpnState(state);

      expect(result.valid).toBe(true);
      if (!result.valid) {
        throw new Error(
          `${filename} is invalid: ${result.errors
            .map((issue) => `${issue.instancePath || "/"}: ${issue.message}`)
            .join("; ")}`,
        );
      }
    });
  }
});
