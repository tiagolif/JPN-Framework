import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const roots = ['assets/covers', 'assets/social'];
const palette = new Set(['#06121C', '#0B1F33', '#0E2639', '#102A3C', '#173A50', '#21455E', '#2EC4B6', '#86E2D9', '#9AF0E7', '#F5F9FC', '#FFFFFF', '#A7BDCC', '#B9CAD8']);
const requiredCandidateAssets = [
  'assets/social/jpn-prompt-builder-contexto-1080x1350.svg',
  'assets/social/jpn-gestao-facil-inicio-1080x1350.svg',
];
const forbiddenClaims = [
  /elimina(?:r|ção)?\s+(?:as\s+)?alucina/i,
  /zero\s+alucina/i,
  /garant(?:e|ia|ido|ir).*resultado/i,
  /garant(?:e|ia|ido|ir).*venda/i,
  /roi\s+garant/i,
  /100%\s+(?:precis|corret|eficaz)/i,
];

async function listSvgFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listSvgFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.svg')) files.push(full);
  }
  return files;
}

function fail(errors, file, message) {
  errors.push(`${relative('.', file)}: ${message}`);
}

const files = (await Promise.all(roots.map(listSvgFiles))).flat();
const errors = [];

if (files.length < 10) {
  errors.push(`Esperados ao menos 10 SVGs versionados; encontrados ${files.length}.`);
}

for (const required of requiredCandidateAssets) {
  if (!files.includes(required)) errors.push(`Arte social candidata obrigatória ausente: ${required}.`);
}

const socialArtSystem = await readFile('docs/brand/SOCIAL_ART_SYSTEM_v1.md', 'utf8');
for (const marker of [
  'Status: candidate companion / visual QA pending.',
  'assets/social/jpn-prompt-builder-contexto-1080x1350.svg',
  'assets/social/jpn-gestao-facil-inicio-1080x1350.svg',
  'GF-QA-10 continua pendente',
  'QA móvel real ainda pendente',
  'não exportar nem publicar',
]) {
  if (!socialArtSystem.includes(marker)) errors.push(`SOCIAL_ART_SYSTEM_v1.md não preserva marcador obrigatório: ${marker}`);
}

for (const file of files) {
  const svg = await readFile(file, 'utf8');
  const filename = file.split('/').pop();

  if (!/^<svg\b/.test(svg.trim())) fail(errors, file, 'arquivo não inicia com <svg>.');
  if (!/role="img"/.test(svg)) fail(errors, file, 'role="img" ausente.');
  if (!/<title\b[^>]*>[^<]+<\/title>/.test(svg)) fail(errors, file, '<title> acessível ausente.');
  if (!/<desc\b[^>]*>[^<]+<\/desc>/.test(svg)) fail(errors, file, '<desc> acessível ausente.');
  if (!/aria-labelledby="[^"]+"/.test(svg)) fail(errors, file, 'aria-labelledby ausente.');

  const width = svg.match(/\bwidth="(\d+)"/)?.[1];
  const height = svg.match(/\bheight="(\d+)"/)?.[1];
  const viewBox = svg.match(/\bviewBox="0 0 (\d+) (\d+)"/);
  if (!width || !height) fail(errors, file, 'width/height numéricos ausentes.');
  if (!viewBox) fail(errors, file, 'viewBox esperado no formato "0 0 W H".');
  else if (width !== viewBox[1] || height !== viewBox[2]) fail(errors, file, `viewBox ${viewBox[1]}×${viewBox[2]} diverge de width/height ${width}×${height}.`);

  const namedSize = filename.match(/-(\d+)x(\d+)\.svg$/);
  if (namedSize && (width !== namedSize[1] || height !== namedSize[2])) {
    fail(errors, file, `dimensão do arquivo não corresponde ao nome (${namedSize[1]}×${namedSize[2]}).`);
  }

  const colors = [...svg.matchAll(/#[0-9A-Fa-f]{6}/g)].map((m) => m[0].toUpperCase());
  for (const color of new Set(colors)) {
    if (!palette.has(color)) fail(errors, file, `cor fora da paleta mestre: ${color}.`);
  }

  for (const claim of forbiddenClaims) {
    if (claim.test(svg)) fail(errors, file, `claim comercial bloqueado detectado: ${claim}.`);
  }

  if (/pro-kit/i.test(filename) && !/EM PREPARA(?:Ç|C)ÃO/i.test(svg)) {
    fail(errors, file, 'Pro Kit deve permanecer explicitamente “EM PREPARAÇÃO”.');
  }
  if (/gestao-facil/i.test(filename) && !/reconstru/i.test(svg)) {
    fail(errors, file, 'Gestão Fácil deve permanecer identificada como reconstrução controlada.');
  }
  if (/prompt-builder-contexto/i.test(filename) && !/QA móvel real ainda pendente/i.test(svg)) {
    fail(errors, file, 'Peça contextual do Prompt Builder deve preservar QA móvel real como pendente.');
  }
  if (/gestao-facil-inicio/i.test(filename) && !/GF-QA-10 ainda pendente/i.test(svg)) {
    fail(errors, file, 'Peça de início da Gestão Fácil deve preservar GF-QA-10 como pendente.');
  }

  if (/font-family="(?!Inter,Arial,sans-serif)[^"]+"/.test(svg)) {
    fail(errors, file, 'fallback tipográfico diverge de Inter,Arial,sans-serif.');
  }
}

if (errors.length) {
  console.error('QA visual falhou:\n' + errors.map((e) => `- ${e}`).join('\n'));
  process.exit(1);
}

console.log(`QA visual aprovado para ${files.length} SVGs (${roots.join(', ')}), incluindo o sistema social candidato.`);
