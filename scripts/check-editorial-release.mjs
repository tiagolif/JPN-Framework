import { access, readFile } from 'node:fs/promises';

const sources = [
  'docs/products/metodo-jpn/METODO_JPN_v1.md',
  'docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md',
  'docs/products/jpn-business/JPN_BUSINESS_v1.md',
  'docs/products/gestao-facil/MANUAL_v0.1.md',
  'docs/products/pro-kit/LEIA_PRIMEIRO.md',
  'docs/products/pro-kit/RELEASE_NOTES_v1.md',
  'docs/product-system/EDITORIAL_RELEASE_GATE_v1.md',
  'assets/covers/metodo-jpn-v1.svg',
  'assets/covers/jpn-prompt-pack-v1.svg',
  'assets/covers/jpn-business-v1.svg',
  'assets/covers/jpn-gestao-facil-v01.svg',
  'assets/covers/jpn-pro-kit-v1.svg',
];

for (const path of sources) {
  await access(path);
}

const [metodo, pack, business, gestao, leiaPrimeiro, proKitCover] = await Promise.all([
  readFile('docs/products/metodo-jpn/METODO_JPN_v1.md', 'utf8'),
  readFile('docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md', 'utf8'),
  readFile('docs/products/jpn-business/JPN_BUSINESS_v1.md', 'utf8'),
  readFile('docs/products/gestao-facil/MANUAL_v0.1.md', 'utf8'),
  readFile('docs/products/pro-kit/LEIA_PRIMEIRO.md', 'utf8'),
  readFile('assets/covers/jpn-pro-kit-v1.svg', 'utf8'),
]);

const corpus = [metodo, pack, business, gestao, leiaPrimeiro, proKitCover].join('\n');
const errors = [];

function requireMatch(text, pattern, message) {
  if (!pattern.test(text)) errors.push(message);
}

requireMatch(metodo, /Jornada/i, 'Método JPN não referencia Jornada.');
requireMatch(metodo, /Precisão/i, 'Método JPN não referencia Precisão.');
requireMatch(metodo, /Narrativa/i, 'Método JPN não referencia Narrativa.');
requireMatch(pack, /18\s+estruturas/i, 'Prompt Pack deve declarar 18 estruturas.');
requireMatch(business, /12\s+playbooks/i, 'JPN Business deve declarar 12 playbooks.');
requireMatch(gestao, /reconstru/i, 'Manual da Gestão Fácil deve identificar a edição reconstruída.');
requireMatch(gestao, /não substitui/i, 'Manual da Gestão Fácil deve preservar seus limites de uso.');
requireMatch(proKitCover, /EM PREPARA(?:Ç|C)ÃO/i, 'Capa do Pro Kit deve permanecer EM PREPARAÇÃO.');

// Detecta apenas formulações afirmativas. Frases de limite como
// “não elimina alucinações” e “não garante respostas corretas” são permitidas.
const forbiddenClaims = [
  /(?<!não )elimina(?:r|ção)?\s+(?:as\s+)?alucinações/i,
  /(?<!não )garante\s+respostas?\s+corret/i,
  /(?<!não )garante\s+resultados?/i,
  /roi\s+garant/i,
  /aumenta\s+vendas\s+garant/i,
  /100%\s+(?:corret|precis|eficaz)/i,
];

for (const pattern of forbiddenClaims) {
  if (pattern.test(corpus)) {
    errors.push(`Claim bloqueado detectado: ${pattern}`);
  }
}

if (errors.length) {
  console.error('Gate editorial falhou:\n' + errors.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log(`PASS: gate editorial verificado (${sources.length} fontes/assets; Método, Pack, Business, Gestão Fácil e Pro Kit coerentes).`);
