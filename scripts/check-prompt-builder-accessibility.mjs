import fs from 'node:fs';

const htmlPath = 'product-site/index.html';
const cssPath = 'product-site/styles.css';
const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requiredHtml = [
  'lang="pt-BR"',
  'class="skip-link"',
  'href="#conteudo-principal"',
  'id="conteudo-principal"',
  'tabindex="-1"',
  '<nav aria-label="Navegação principal">',
  'label for="idea"',
  'label for="type"',
  'label for="restrictions"',
  'aria-describedby="workspace-help"',
  'aria-describedby="preset-help"',
  'aria-describedby="idea-help"',
  'role="status"',
  'aria-live="polite"',
  'aria-atomic="true"',
  'aria-label="Prompt JPN gerado"',
  'type="button"'
];

const requiredCss = [
  '.skip-link',
  ':focus-visible',
  'outline:3px solid var(--focus)',
  'min-height:44px',
  '@media(prefers-reduced-motion:reduce)',
  'scroll-behavior:auto'
];

const missingHtml = requiredHtml.filter((token) => !html.includes(token));
const missingCss = requiredCss.filter((token) => !css.includes(token));

const labels = [...html.matchAll(/<label\s+for="([^"]+)"/g)].map((m) => m[1]);
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const brokenLabels = labels.filter((id) => !ids.has(id));

if (missingHtml.length || missingCss.length || brokenLabels.length) {
  console.error('Prompt Builder accessibility gate failed.');
  if (missingHtml.length) console.error('Missing HTML markers:', missingHtml.join(', '));
  if (missingCss.length) console.error('Missing CSS markers:', missingCss.join(', '));
  if (brokenLabels.length) console.error('Labels without matching controls:', brokenLabels.join(', '));
  process.exit(1);
}

if (/outline\s*:\s*none/i.test(css) && !/:focus-visible/.test(css)) {
  console.error('Prompt Builder accessibility gate failed: outline removed without focus-visible fallback.');
  process.exit(1);
}

console.log('Prompt Builder accessibility gate passed.');
