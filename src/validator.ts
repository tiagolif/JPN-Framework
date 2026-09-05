import { readFileSync } from "node:fs";
import type { ErrorObject } from "ajv";
import { Ajv2020 } from "ajv/dist/2020.js";

import type { JpnState, ValidationIssue, ValidationResult } from "./types.js";

const schemaUrl = new URL("../schemas/jpn.schema.json", import.meta.url);
const schema = JSON.parse(readFileSync(schemaUrl, "utf8")) as object;

export const SUPPORTED_JPN_VERSIONS = ["0.3.0-draft"] as const;

const supportedJpnVersions = new Set<string>(SUPPORTED_JPN_VERSIONS);

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
});

const validateSchema = ajv.compile<JpnState>(schema);

function normalizePath(error: ErrorObject): string {
  if (error.keyword === "required") {
    const missing = (error.params as { missingProperty?: string }).missingProperty;
    return `${error.instancePath || "/"}${missing ? `/${missing}` : ""}`;
  }

  return error.instancePath || "/";
}

function toIssue(error: ErrorObject): ValidationIssue {
  return {
    path: normalizePath(error),
    keyword: error.keyword,
    message: error.message ?? "Schema validation failed",
  };
}

function unsupportedVersionIssue(version: string): ValidationIssue {
  return {
    path: "/version",
    keyword: "unsupportedVersion",
    message: `unsupported JPN version '${version}'; supported versions: ${SUPPORTED_JPN_VERSIONS.join(", ")}`,
  };
}

export function isSupportedJpnVersion(version: string): boolean {
  return supportedJpnVersions.has(version);
}

export class JpnValidationError extends Error {
  readonly issues: ValidationIssue[];

  constructor(issues: ValidationIssue[]) {
    const summary = issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join("; ");

    super(`Invalid JPN state${summary ? ` — ${summary}` : ""}`);
    this.name = "JpnValidationError";
    this.issues = issues;
  }
}

export function validateJpnState(input: unknown): ValidationResult<JpnState> {
  const valid = validateSchema(input);

  if (!valid) {
    return {
      valid: false,
      errors: (validateSchema.errors ?? []).map(toIssue),
    };
  }

  const state = input as JpnState;

  if (!isSupportedJpnVersion(state.version)) {
    return {
      valid: false,
      errors: [unsupportedVersionIssue(state.version)],
    };
  }

  return {
    valid: true,
    data: state,
    errors: [],
  };
}

export function assertJpnState(input: unknown): asserts input is JpnState {
  const result = validateJpnState(input);

  if (!result.valid) {
    throw new JpnValidationError(result.errors);
  }
}
