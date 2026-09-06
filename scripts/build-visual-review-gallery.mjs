import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assetRoots = ['assets/covers', 'assets/social'];
const outDir = path.join(root, 'dist/visual-review');

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const records = [];
for (const relativeDir of assetRoots) {
  const dir = path.join(root, relativeDir);
  const entries = (await readdir(dir)).filter((name) => name.endsWith('.svg')).sort();
  for (const name of entries) {
    const relativePath = `${relativeDir}/${name}`;
    const source = await readFile(path.join(root, relativePath), 'utf8');
    const width = source.match(/\bwidth="([0-9.]+)"/)?.[1] ?? null;
    const height = source.match(/\bheight="([0-9.]+)"/)?.[1] ?? null;
    const viewBox = source.match(/\bviewBox="([^"]+)"/)?.[1] ?? null;
    const title = source.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? name;
    const desc = source.match(/<desc[^>]*>([\s\S]*?)<\/desc>/)?.[1]?.trim() ?? '';
    records.push({ relativePath, name, width, height, viewBox, title, desc });
  }
}

await mkdir(outDir, { recursive: true });
await writeFile(
  path.join(outDir, 'manifest.json'),
  `${JSON.stringify({ generated_at: new Date().toISOString(), total: records.length, assets: records }, null, 2)}\n`,
  'utf8',
);

const cards = records.map((asset, index) => {
  const src = `../../${asset.relativePath}`;
  return `<article class="card" id="asset-${index + 1}">
    <div class="preview"><img src="${escapeHtml(src)}" alt="${escapeHtml(asset.title)}"></div>
    <div class="meta">
      <strong>${index + 1}. ${escapeHtml(asset.title)}</strong>
      <code>${escapeHtml(asset.relativePath)}</code>
      <span>${asset.width ?? '?'} x ${asset.height ?? '?'} | viewBox ${escapeHtml(asset.viewBox ?? '?')}</span>
      ${asset.desc ? `<p>${escapeHtml(asset.desc)}</p>` : ''}
      <div class="checks">
        <label><input type="checkbox"> sem clipping</label>
        <label><input type="checkbox"> texto legível</label>
        <label><input type="checkbox"> contraste adequado</label>
        <label><input type="checkbox"> margens seguras</label>
        <label><input type="checkbox"> estado/claims corretos</label>
      </div>
    </div>
  </article>`;
}).join('\n');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>JPN - Visual Review Gallery</title>
<style>
:root{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#F4F8FB;background:#06121C}*{box-sizing:border-box}body{margin:0;padding:32px}header{max-width:1100px;margin:0 auto 28px}h1{margin:0 0 8px;font-size:30px}p{color:#B8C7D1;line-height:1.5}.grid{max-width:1500px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:22px}.card{background:#0B1F33;border:1px solid #16344B;border-radius:18px;overflow:hidden}.preview{background:#0E2639;display:flex;align-items:center;justify-content:center;min-height:340px;padding:18px}.preview img{display:block;max-width:100%;max-height:520px;box-shadow:0 14px 40px rgba(0,0,0,.3)}.meta{padding:18px}.meta strong{display:block;font-size:18px;margin-bottom:10px}.meta code{display:block;color:#2EC4B6;overflow-wrap:anywhere;margin-bottom:8px}.meta span{display:block;color:#B8C7D1;font-size:13px}.checks{display:grid;gap:7px;margin-top:15px;color:#DCE7ED;font-size:13px}.checks input{accent-color:#2EC4B6}.notice{border-left:4px solid #2EC4B6;padding:10px 14px;background:#0B1F33;border-radius:8px}.print{font-size:13px;color:#B8C7D1}@media print{body{padding:10mm;background:white;color:black}.card{break-inside:avoid;background:white;border:1px solid #bbb}.preview{background:#eee}.meta p,.meta span,.print{color:#333}.grid{display:block}.card{margin-bottom:8mm}}
</style>
</head>
<body>
<header>
<h1>JPN - Galeria de revisão visual</h1>
<p class="notice">Uso interno. Esta galeria não autoriza publicação. Revise cada asset em escala normal e reduzida antes de marcar o gate visual como concluído.</p>
<p>${records.length} SVGs encontrados automaticamente em <code>assets/covers</code> e <code>assets/social</code>.</p>
<p class="print">Checklist visual: clipping, legibilidade, contraste, margens e coerência de estado/claims. Os checkboxes são apenas apoio de inspeção local e não persistem como evidência.</p>
</header>
<main class="grid">${cards}</main>
</body>
</html>`;

await writeFile(path.join(outDir, 'index.html'), html, 'utf8');
console.log(`Visual review gallery: ${records.length} SVGs -> dist/visual-review/index.html`);
