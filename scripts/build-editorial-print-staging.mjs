import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const root = resolve(process.cwd());
const outRoot = join(root, 'dist', 'editorial-print-staging');

const products = [
  {
    id: 'metodo-jpn',
    title: 'Método JPN',
    version: 'v1',
    source: 'docs/products/metodo-jpn/METODO_JPN_v1.md',
    cover: 'assets/covers/metodo-jpn-v1.svg',
  },
  {
    id: 'jpn-prompt-pack',
    title: 'JPN Prompt Pack',
    version: 'v1',
    source: 'docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md',
    cover: 'assets/covers/jpn-prompt-pack-v1.svg',
  },
  {
    id: 'jpn-business',
    title: 'JPN Business',
    version: 'v1',
    source: 'docs/products/jpn-business/JPN_BUSINESS_v1.md',
    cover: 'assets/covers/jpn-business-v1.svg',
  },
  {
    id: 'gestao-facil-manual',
    title: 'JPN Gestão Fácil — Manual',
    version: 'v0.1',
    source: 'docs/products/gestao-facil/MANUAL_v0.1.md',
    cover: 'assets/covers/jpn-gestao-facil-v01.svg',
  },
  {
    id: 'pro-kit-leia-primeiro',
    title: 'JPN Pro Kit — Leia Primeiro',
    version: 'v1',
    source: 'docs/products/pro-kit/LEIA_PRIMEIRO.md',
    cover: 'assets/covers/jpn-pro-kit-v1.svg',
  },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inline(text) {
  let value = escapeHtml(text);
  value = value.replace(/`([^`]+)`/g, '<code>$1</code>');
  value = value.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  value = value.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return value;
}

function isTableSeparator(line) {
  const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((v) => v.trim());
  return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function renderTable(lines, start) {
  const header = lines[start].trim().replace(/^\||\|$/g, '').split('|').map((v) => v.trim());
  const rows = [];
  let i = start + 2;
  while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
    rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map((v) => v.trim()));
    i += 1;
  }
  const head = `<thead><tr>${header.map((cell) => `<th>${inline(cell)}</th>`).join('')}</tr></thead>`;
  const body = `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  return { html: `<table>${head}${body}</table>`, next: i };
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let paragraph = [];
  let listType = null;
  let code = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    out.push(`</${listType}>`);
    listType = null;
  };

  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    const trimmed = line.trim();

    if (code !== null) {
      if (trimmed.startsWith('```')) {
        out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
        code = null;
      } else {
        code.push(line);
      }
      i += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      flushParagraph();
      closeList();
      code = [];
      i += 1;
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      closeList();
      i += 1;
      continue;
    }

    if (i + 1 < lines.length && line.includes('|') && isTableSeparator(lines[i + 1])) {
      flushParagraph();
      closeList();
      const table = renderTable(lines, i);
      out.push(table.html);
      i = table.next;
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      closeList();
      out.push('<hr>');
      i += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph();
      closeList();
      out.push(`<blockquote>${inline(trimmed.slice(2))}</blockquote>`);
      i += 1;
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const wanted = unordered ? 'ul' : 'ol';
      if (listType !== wanted) {
        closeList();
        listType = wanted;
        out.push(`<${wanted}>`);
      }
      out.push(`<li>${inline((unordered || ordered)[1])}</li>`);
      i += 1;
      continue;
    }

    paragraph.push(trimmed);
    i += 1;
  }

  flushParagraph();
  closeList();
  if (code !== null) out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
  return out.join('\n');
}

function stylesheet() {
  return `
:root { --ink:#13202b; --muted:#5f6f7b; --navy:#06121c; --panel:#0b1f33; --accent:#2ec4b6; --paper:#fff; --line:#dbe4ea; }
* { box-sizing:border-box; }
@page { size:A4; margin:18mm 17mm 18mm 17mm; }
html { background:#dfe5e9; }
body { margin:0 auto; max-width:210mm; color:var(--ink); background:var(--paper); font-family:Arial,Helvetica,sans-serif; font-size:10.6pt; line-height:1.55; }
.cover { min-height:261mm; margin:-18mm -17mm 0; padding:0; display:flex; align-items:stretch; justify-content:stretch; page-break-after:always; background:var(--navy); }
.cover svg { width:100%; height:100%; display:block; }
.meta { margin:0 0 8mm; padding:5mm 6mm; border-left:4px solid var(--accent); background:#f2f8f7; color:var(--muted); font-size:9pt; }
h1,h2,h3,h4 { color:var(--navy); line-height:1.18; page-break-after:avoid; }
h1 { font-size:24pt; margin:0 0 8mm; border-bottom:2px solid var(--accent); padding-bottom:4mm; }
h2 { font-size:17pt; margin:10mm 0 4mm; }
h3 { font-size:13pt; margin:7mm 0 3mm; }
h4 { font-size:11pt; margin:5mm 0 2mm; }
p { margin:0 0 4mm; orphans:3; widows:3; }
ul,ol { margin:0 0 5mm 6mm; padding-left:5mm; }
li { margin:0 0 1.8mm; }
blockquote { margin:5mm 0; padding:4mm 5mm; border-left:4px solid var(--accent); background:#f5f9fa; color:#31424f; }
code { font-family:"DejaVu Sans Mono",monospace; background:#eef3f5; padding:.15em .35em; border-radius:3px; font-size:.9em; }
pre { white-space:pre-wrap; overflow-wrap:anywhere; background:#071a28; color:#eef7f7; padding:5mm; border-radius:5px; page-break-inside:avoid; }
pre code { background:transparent; padding:0; color:inherit; }
table { width:100%; border-collapse:collapse; margin:5mm 0 7mm; font-size:9pt; page-break-inside:auto; }
th { background:var(--panel); color:#fff; text-align:left; }
th,td { border:1px solid var(--line); padding:2.6mm 3mm; vertical-align:top; }
tr { page-break-inside:avoid; }
hr { border:0; border-top:1px solid var(--line); margin:8mm 0; }
a { color:#0b6f69; text-decoration:none; overflow-wrap:anywhere; }
.footer-note { margin-top:10mm; padding-top:4mm; border-top:1px solid var(--line); color:var(--muted); font-size:8.5pt; }
@media screen { body { padding:18mm 17mm; box-shadow:0 0 20px rgba(0,0,0,.12); } .cover { margin:-18mm -17mm 18mm; } }
`;
}

async function buildProduct(product) {
  const sourcePath = join(root, product.source);
  const coverPath = join(root, product.cover);
  const [markdown, coverSvg] = await Promise.all([
    readFile(sourcePath, 'utf8'),
    readFile(coverPath, 'utf8'),
  ]);

  const body = markdownToHtml(markdown);
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(product.title)} ${escapeHtml(product.version)} — staging editorial</title>
<style>${stylesheet()}</style>
</head>
<body>
<section class="cover">${coverSvg}</section>
<div class="meta"><strong>JPN Framework</strong> · ${escapeHtml(product.title)} · ${escapeHtml(product.version)} · staging interno para revisão. Este arquivo HTML não representa PDF final aprovado nem autorização de publicação.</div>
${body}
<div class="footer-note">Gerado a partir de <code>${escapeHtml(product.source)}</code>. A promoção para artefato final exige exportação PDF, inspeção página a página e hash após a última correção.</div>
</body>
</html>`;

  const dir = join(outRoot, product.id);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html, 'utf8');

  return {
    id: product.id,
    title: product.title,
    version: product.version,
    source: product.source,
    cover: product.cover,
    output: `dist/editorial-print-staging/${product.id}/index.html`,
    status: 'print-html-generated-pdf-review-pending',
  };
}

await rm(outRoot, { recursive: true, force: true });
await mkdir(outRoot, { recursive: true });

const built = [];
for (const product of products) built.push(await buildProduct(product));

const indexRows = built.map((item) => `<li><a href="./${item.id}/index.html">${escapeHtml(item.title)} ${escapeHtml(item.version)}</a> — PDF final ainda pendente</li>`).join('\n');
const index = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>JPN — staging editorial imprimível</title><style>${stylesheet()}</style></head><body><h1>JPN — staging editorial imprimível</h1><div class="meta">Superfície interna para revisão e exportação. Não é pacote publicado nem artefato final.</div><ol>${indexRows}</ol></body></html>`;
await writeFile(join(outRoot, 'index.html'), index, 'utf8');
await writeFile(join(outRoot, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), status: 'internal-print-staging', products: built }, null, 2) + '\n', 'utf8');

console.log(`Editorial print staging gerado: ${built.length} documentos em ${outRoot}`);
