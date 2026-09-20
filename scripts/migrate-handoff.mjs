#!/usr/bin/env node
import fs from 'node:fs';
import { migrateHandoff01to02 } from './lib/handoff-migration.mjs';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath) {
  console.error('Uso: node scripts/migrate-handoff.mjs <entrada.json> [saida.json]');
  process.exit(2);
}

try {
  const source = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  if (source.contract_version !== '0.1.0-draft') {
    throw new Error(`Versão de origem não suportada: ${source.contract_version ?? 'ausente'}. Esperado 0.1.0-draft.`);
  }
  const migrated = migrateHandoff01to02(source);
  const serialized = `${JSON.stringify(migrated, null, 2)}\n`;
  if (outputPath) {
    fs.writeFileSync(outputPath, serialized, 'utf8');
    console.error(`Handoff migrado para 0.2.0-draft: ${outputPath}`);
  } else {
    process.stdout.write(serialized);
  }
} catch (error) {
  console.error(`Falha na migração: ${error.message}`);
  process.exit(1);
}
