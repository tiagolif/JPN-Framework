import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { isSemanticallyValidTimestamp, validateHandoffReferences } from './handoff-validation.mjs';

const readJson = (relativePath) => JSON.parse(fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: true });
const validate01 = ajv.compile(readJson('../../schemas/jpn-handoff.v0.1.schema.json'));
const validate02 = ajv.compile(readJson('../../schemas/jpn-handoff.schema.json'));

/** Deterministic migration from the preserved 0.1 handoff contract to 0.2.
 * Refuses inputs that would require inventing or repairing evidence.
 */
export const migrateHandoff01to02 = (source) => {
  if (!validate01(source)) throw new Error(`Origem 0.1 inválida: ${ajv.errorsText(validate01.errors)}`);
  for (const evidence of source.evidence) {
    if (!isSemanticallyValidTimestamp(evidence.captured_at)) {
      throw new Error(`Migração bloqueada: captured_at não pode ser corrigido sem inventar evidência temporal (${evidence.id})`);
    }
  }
  const sourceIntegrity = validateHandoffReferences(source);
  if (!sourceIntegrity.valid) throw new Error(`Migração bloqueada: integridade semântica da origem inválida (${sourceIntegrity.reason})`);

  const target = { ...structuredClone(source), contract_version: '0.2.0-draft' };
  if (!validate02(target)) throw new Error(`Destino 0.2 inválido: ${ajv.errorsText(validate02.errors)}`);
  const targetIntegrity = validateHandoffReferences(target);
  if (!targetIntegrity.valid) throw new Error(`Destino 0.2 semanticamente inválido: ${targetIntegrity.reason}`);
  return target;
};
