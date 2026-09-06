import fs from 'node:fs';
import path from 'node:path';

const roots = ['assets/covers', 'assets/social'];
const failures = [];
const warnings = [];
let checkedFiles = 0;
let checkedTexts = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function parseAttrs(raw) {
  const attrs = {};
  for (const match of raw.matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[match[1]] = match[2];
  return attrs;
}

function number(value) {
  const parsed = Number.parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : null;
}

for (const file of roots.flatMap(walk).filter((file) => file.endsWith('.svg')).sort()) {
  checkedFiles += 1;
  const svg = fs.readFileSync(file, 'utf8');
  const root = svg.match(/<svg\b([^>]*)>/i);
  if (!root) {
    failures.push(`${file}: elemento <svg> ausente`);
    continue;
  }

  const rootAttrs = parseAttrs(root[1]);
  const viewBox = (rootAttrs.viewBox ?? '').trim().split(/\s+/).map(Number);
  if (viewBox.length !== 4 || viewBox.some((value) => !Number.isFinite(value))) {
    failures.push(`${file}: viewBox inválido para preflight geométrico`);
    continue;
  }

  const [minX, minY, width, height] = viewBox;
  const maxX = minX + width;
  const maxY = minY + height;
  const edgeTolerance = Math.max(8, Math.min(width, height) * 0.008);

  for (const match of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)) {
    checkedTexts += 1;
    const attrs = parseAttrs(match[1]);
    const x = number(attrs.x);
    const y = number(attrs.y);
    const fontSize = number(attrs['font-size']) ?? 16;
    const text = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    if (x === null || y === null) {
      warnings.push(`${file}: texto sem x/y explícito: "${text.slice(0, 60)}"`);
      continue;
    }

    if (x < minX - edgeTolerance || x > maxX + edgeTolerance) {
      failures.push(`${file}: x=${x} fora do viewBox em "${text.slice(0, 60)}"`);
    }

    const estimatedTop = y - fontSize;
    const estimatedBottom = y + fontSize * 0.35;
    if (estimatedTop < minY - edgeTolerance || estimatedBottom > maxY + edgeTolerance) {
      failures.push(`${file}: baseline y=${y} pode cortar texto no limite vertical: "${text.slice(0, 60)}"`);
    }

    const anchor = attrs['text-anchor'] ?? 'start';
    if (anchor === 'start' && x > maxX - edgeTolerance) {
      warnings.push(`${file}: texto ancorado no início muito próximo da borda direita: "${text.slice(0, 60)}"`);
    }
    if (anchor === 'end' && x < minX + edgeTolerance) {
      warnings.push(`${file}: texto ancorado no fim muito próximo da borda esquerda: "${text.slice(0, 60)}"`);
    }
  }
}

if (warnings.length) {
  console.warn(`Visual bounds preflight: ${warnings.length} aviso(s)`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length) {
  console.error(`Visual bounds preflight falhou com ${failures.length} problema(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Visual bounds preflight OK: ${checkedFiles} SVG(s), ${checkedTexts} elemento(s) de texto verificados.`);
console.log('Nota: este preflight detecta coordenadas e baselines fora do quadro; não substitui renderização e inspeção humana.');
