import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'commercial-site');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return entry.isFile() && entry.name.endsWith('.html') ? [absolute] : [];
  });
}

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function fail(errors, file, message) {
  errors.push(`${path.relative(root, file)}: ${message}`);
}

if (!fs.existsSync(siteRoot)) {
  console.error('commercial-site não encontrado.');
  process.exit(1);
}

const htmlFiles = walk(siteRoot).sort();
const errors = [];

if (htmlFiles.length !== 13) {
  errors.push(`esperados 13 HTMLs comerciais (landing + seletor + comparação + como funciona + casos de uso + primeiros passos + demonstração + 6 produtos), encontrados ${htmlFiles.length}`);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const lower = html.toLowerCase();

  if (!/<html\s+[^>]*lang=["']pt-BR["']/i.test(html)) fail(errors, file, 'lang="pt-BR" ausente');
  if (!/<meta\s+[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(html)) fail(errors, file, 'meta viewport responsiva ausente');
  if (!/<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*nofollow/i.test(html)) fail(errors, file, 'noindex,nofollow ausente');
  if (!/<title>[^<]{3,}<\/title>/i.test(html)) fail(errors, file, 'title útil ausente');
  if (count(html, /<h1\b/gi) !== 1) fail(errors, file, `esperado exatamente 1 h1, encontrado ${count(html, /<h1\b/gi)}`);
  if (!/<main(?:\s|>)/i.test(html)) fail(errors, file, 'elemento main ausente');
  if (!/<footer(?:\s|>)/i.test(html)) fail(errors, file, 'elemento footer ausente');
  if (!/aria-label=["'][^"']+["']/i.test(html)) fail(errors, file, 'nenhum aria-label explícito encontrado');

  const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of imgTags) {
    if (!/\balt=["'][^"']*["']/i.test(tag)) fail(errors, file, `imagem sem alt: ${tag.slice(0, 100)}`);
  }

  const anchorTags = [...html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)];
  for (const match of anchorTags) {
    const tag = match[0];
    const inner = match[1].replace(/<[^>]+>/g, '').trim();
    const hasAria = /\baria-label=["'][^"']+["']/i.test(tag);
    if (!inner && !hasAria) fail(errors, file, 'link sem nome acessível');
    if (/href=["']javascript:/i.test(tag)) fail(errors, file, 'href javascript: não permitido');
    if (/target=["']_blank["']/i.test(tag) && !/rel=["'][^"']*noopener/i.test(tag)) {
      fail(errors, file, 'target="_blank" sem rel="noopener"');
    }
  }

  if (/<details\b/i.test(html) && count(html, /<details\b/gi) !== count(html, /<summary\b/gi)) {
    fail(errors, file, 'cada details deve possuir um summary');
  }

  if (/<table\b/i.test(html)) {
    if (!/<th\b[^>]*scope=["']col["']/i.test(html)) fail(errors, file, 'tabela sem cabeçalhos scope="col"');
    if (!/<th\b[^>]*scope=["']row["']/i.test(html)) fail(errors, file, 'tabela sem cabeçalhos scope="row"');
  }

  if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i.test(lower)) {
    fail(errors, file, 'viewport não pode impedir zoom do usuário');
  }
}

const cssPath = path.join(siteRoot, 'styles.css');
if (!fs.existsSync(cssPath)) {
  errors.push('commercial-site/styles.css ausente');
} else {
  const css = fs.readFileSync(cssPath, 'utf8');
  if (!/:focus-visible/.test(css)) errors.push('styles.css: estado :focus-visible explícito ausente');
  if (!/@media\(prefers-reduced-motion:reduce\)/.test(css.replace(/\s+/g, ''))) {
    errors.push('styles.css: fallback prefers-reduced-motion ausente');
  }
}

if (errors.length) {
  console.error('Falhas de acessibilidade/robustez comercial:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Commercial accessibility check OK: ${htmlFiles.length} páginas verificadas.`);
