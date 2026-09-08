import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cssPath = path.join(root, 'commercial-site', 'styles.css');
const css = fs.readFileSync(cssPath, 'utf8');

const tokenNames = ['bg', 'bg2', 'surface', 'surface2', 'text', 'muted', 'accent', 'accent2'];
const tokens = Object.fromEntries(tokenNames.map((name) => {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Token --${name} não encontrado em commercial-site/styles.css`);
  return [name, match[1].toLowerCase()];
}));

function linearize(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const value = hex.slice(1);
  const r = linearize(Number.parseInt(value.slice(0, 2), 16));
  const g = linearize(Number.parseInt(value.slice(2, 4), 16));
  const b = linearize(Number.parseInt(value.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

const checks = [
  ['texto principal / fundo', 'text', 'bg', 4.5],
  ['texto principal / fundo secundário', 'text', 'bg2', 4.5],
  ['texto principal / superfície', 'text', 'surface', 4.5],
  ['texto principal / superfície 2', 'text', 'surface2', 4.5],
  ['texto secundário / fundo', 'muted', 'bg', 4.5],
  ['texto secundário / superfície', 'muted', 'surface', 4.5],
  ['texto secundário / superfície 2', 'muted', 'surface2', 4.5],
  ['destaque claro / fundo', 'accent2', 'bg', 4.5],
  ['destaque claro / superfície', 'accent2', 'surface', 4.5],
  ['destaque claro / superfície 2', 'accent2', 'surface2', 4.5],
  ['texto escuro / botão de destaque', 'bg', 'accent', 4.5],
  ['foco / fundo', 'accent2', 'bg', 3],
  ['foco / superfície', 'accent2', 'surface', 3],
  ['foco / superfície 2', 'accent2', 'surface2', 3],
];

const failures = [];
for (const [label, foregroundToken, backgroundToken, minimum] of checks) {
  const ratio = contrast(tokens[foregroundToken], tokens[backgroundToken]);
  if (ratio + Number.EPSILON < minimum) {
    failures.push(`${label}: ${ratio.toFixed(2)}:1 < ${minimum}:1`);
  }
}

if (failures.length) {
  console.error('Falha no contraste comercial:\n- ' + failures.join('\n- '));
  process.exit(1);
}

console.log(`Contraste comercial OK: ${checks.length} pares canônicos validados.`);
