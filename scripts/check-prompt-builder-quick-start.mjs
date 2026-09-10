import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'docs/products/prompt-builder/PROMPT_BUILDER_QUICK_START_v1.md');

const fail = (message) => {
  console.error(`Prompt Builder quick start check failed: ${message}`);
  process.exit(1);
};

if (!fs.existsSync(file)) fail('missing PROMPT_BUILDER_QUICK_START_v1.md');

const text = fs.readFileSync(file, 'utf8');

const required = [
  'candidate companion / physical mobile QA pending',
  'Jornada',
  'Precisão',
  'Narrativa',
  'confirmed',
  'inferred',
  'unknown',
  'conflicting',
  'menor recurso suficiente',
  'presets guiados',
  'presets personalizados',
  'workspaces locais',
  'QA físico contextual do Prompt Builder em celular continua pendente',
  '18 templates',
  '12 playbooks',
  'GF-QA-10 ainda pendente',
  'EM PREPARAÇÃO',
  'credencial',
  'dado financeiro real',
  'publicação ou envio externo sem autorização',
  'aceite de termos',
  'verificação de identidade',
  'não garante qualidade',
];

for (const marker of required) {
  if (!text.includes(marker)) fail(`required marker not found: ${marker}`);
}

const checklistItems = (text.match(/^- \[ \]/gm) || []).length;
if (checklistItems < 12) fail(`expected at least 12 checklist items, found ${checklistItems}`);

const forbidden = [
  /garantia de resultado/i,
  /100% sem erros/i,
  /compatibilidade universal comprovada/i,
  /qa móvel (aprovado|concluído|finalizado)/i,
  /release_ready\s*[:=]\s*true/i,
  /comprar agora/i,
  /checkout/i,
  /https?:\/\//i,
];

for (const pattern of forbidden) {
  if (pattern.test(text)) fail(`forbidden pattern found: ${pattern}`);
}

console.log('Prompt Builder quick start check passed.');
