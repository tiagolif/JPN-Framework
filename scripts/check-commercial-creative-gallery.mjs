import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('docs/commercial/creative_sources');
const galleryPath = path.join(root, 'index.html');
const expected = [
  'JPN-CR-01-metodo-jpn-card.svg',
  'JPN-CR-02-prompt-builder-card.svg',
  'JPN-CR-03-prompt-pack-card.svg',
  'JPN-CR-04-jpn-business-card.svg',
  'JPN-CR-05-gestao-facil-card.svg',
  'JPN-CR-06-pro-kit-card.svg',
  'JPN-CR-07-ecossistema-story.svg',
  'JPN-CR-08-ecossistema-hero.svg',
];

const errors = [];
if (!fs.existsSync(galleryPath)) {
  errors.push('index.html: galeria de revisão ausente');
} else {
  const html = fs.readFileSync(galleryPath, 'utf8');
  for (const file of expected) {
    const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = html.match(new RegExp(escaped, 'g')) ?? [];
    if (matches.length !== 1) errors.push(`${file}: esperado exatamente 1 uso na galeria, encontrado ${matches.length}`);
  }

  const required = ['CANDIDATO INTERNO', 'NÃO PUBLICAR', 'Revisão humana pendente'];
  for (const token of required) {
    if (!html.includes(token)) errors.push(`index.html: guardrail ausente: ${token}`);
  }

  const forbidden = [
    /<script\b/i,
    /javascript:/i,
    /(?:src|href)=["']https?:/i,
    /<form\b/i,
    /<iframe\b/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(html)) errors.push(`index.html: recurso proibido detectado (${pattern})`);
  }

  if (!/<meta\s+name=["']viewport["']/i.test(html)) errors.push('index.html: meta viewport ausente');
  if (!/lang=["']pt-BR["']/i.test(html)) errors.push('index.html: idioma pt-BR ausente');
}

if (errors.length) {
  console.error('Commercial creative gallery gate FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Commercial creative gallery gate OK: ${expected.length} peças locais rastreadas, sem publicação ou recursos externos.`);
