import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('docs/commercial/creative_sources');
const specs = [
  ['JPN-CR-01-metodo-jpn-card.svg', 1080, 1080, ['JPN-CR-01', 'Método JPN', 'Jornada', 'Precisão', 'Narrativa']],
  ['JPN-CR-02-prompt-builder-card.svg', 1080, 1080, ['JPN-CR-02', 'Prompt Builder']],
  ['JPN-CR-03-prompt-pack-card.svg', 1080, 1080, ['JPN-CR-03', 'Prompt Pack', '18']],
  ['JPN-CR-04-jpn-business-card.svg', 1080, 1080, ['JPN-CR-04', 'JPN Business', '12']],
  ['JPN-CR-05-gestao-facil-card.svg', 1080, 1080, ['JPN-CR-05', 'Gestão Fácil', 'REPOR']],
  ['JPN-CR-06-pro-kit-card.svg', 1080, 1080, ['JPN-CR-06', 'Pro Kit', 'EM PREPARAÇÃO']],
  ['JPN-CR-07-ecossistema-story.svg', 1080, 1920, ['JPN-CR-07', 'Ecossistema JPN', 'EM PREPARAÇÃO']],
  ['JPN-CR-08-ecossistema-hero.svg', 1920, 1080, ['JPN-CR-08', 'Ecossistema JPN', 'EM PREPARAÇÃO']],
];

const errors = [];
const forbidden = [/<script\b/i, /javascript:/i, /<foreignObject\b/i, /(?:href|xlink:href)=["']https?:/i];

for (const [name, width, height, required] of specs) {
  const file = path.join(root, name);
  if (!fs.existsSync(file)) {
    errors.push(`${name}: arquivo ausente`);
    continue;
  }
  const svg = fs.readFileSync(file, 'utf8');
  if (!/<svg\b/i.test(svg)) errors.push(`${name}: raiz SVG ausente`);
  const viewBox = svg.match(/viewBox=["']\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  if (!viewBox || Number(viewBox[1]) !== width || Number(viewBox[2]) !== height) {
    errors.push(`${name}: viewBox esperado 0 0 ${width} ${height}`);
  }
  for (const token of required) {
    if (!svg.includes(token)) errors.push(`${name}: conteúdo obrigatório ausente: ${token}`);
  }
  for (const pattern of forbidden) {
    if (pattern.test(svg)) errors.push(`${name}: recurso proibido detectado (${pattern})`);
  }
  if (!/NÃO PUBLICAR/i.test(svg)) errors.push(`${name}: guardrail NÃO PUBLICAR ausente`);
}

const actual = fs.existsSync(root) ? fs.readdirSync(root).filter((name) => name.endsWith('.svg')).sort() : [];
const expected = specs.map(([name]) => name).sort();
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  errors.push(`inventário SVG divergente: esperado ${expected.length}, encontrado ${actual.length}`);
}

if (errors.length) {
  console.error('Commercial creative source gate FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Commercial creative source gate OK: ${specs.length} fontes SVG editáveis validadas.`);
