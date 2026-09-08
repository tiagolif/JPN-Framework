import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, 'commercial-site');
const fail = (message) => {
  console.error(`commercial navigation: ${message}`);
  process.exitCode = 1;
};

const walkHtml = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return walkHtml(full);
  return entry.isFile() && entry.name.endsWith('.html') ? [full] : [];
});

const htmlFiles = walkHtml(siteRoot);
const idsByFile = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  idsByFile.set(path.resolve(file), ids);
}

const productTargets = new Map([
  ['metodo-jpn', 'products/metodo-jpn.html'],
  ['jpn-prompt-builder', 'products/jpn-prompt-builder.html'],
  ['jpn-prompt-pack', 'products/jpn-prompt-pack.html'],
  ['jpn-business', 'products/jpn-business.html'],
  ['jpn-gestao-facil', 'products/jpn-gestao-facil.html'],
  ['jpn-pro-kit', 'products/jpn-pro-kit.html'],
]);

const landingPath = path.join(siteRoot, 'index.html');
const landing = fs.readFileSync(landingPath, 'utf8');
for (const [id, target] of productTargets) {
  const cardPattern = new RegExp(`<article[^>]+data-product="${id}"[\\s\\S]*?<a[^>]+href="${target}"`, 'i');
  if (!cardPattern.test(landing)) fail(`landing: card ${id} não aponta para ${target}`);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)].map((m) => m[1]);

  for (const href of hrefs) {
    if (/^(?:https?:|mailto:|tel:|javascript:)/i.test(href)) {
      fail(`${path.relative(root, file)}: link externo/protocolo não permitido em ${href}`);
      continue;
    }

    const [rawTarget, fragment = ''] = href.split('#', 2);
    const targetFile = rawTarget
      ? path.resolve(path.dirname(file), rawTarget)
      : path.resolve(file);

    if (rawTarget && !fs.existsSync(targetFile)) {
      fail(`${path.relative(root, file)}: destino inexistente ${href}`);
      continue;
    }

    if (rawTarget && fs.existsSync(targetFile) && fs.statSync(targetFile).isDirectory()) {
      fail(`${path.relative(root, file)}: href aponta para diretório, não arquivo: ${href}`);
      continue;
    }

    if (fragment) {
      const ids = idsByFile.get(targetFile);
      if (!ids) {
        fail(`${path.relative(root, file)}: não foi possível validar fragmento em ${href}`);
      } else if (!ids.has(fragment)) {
        fail(`${path.relative(root, file)}: fragmento inexistente em ${href}`);
      }
    }
  }
}

if (!process.exitCode) {
  console.log(`commercial navigation: OK — ${htmlFiles.length} páginas, links relativos e destinos internos válidos.`);
}
