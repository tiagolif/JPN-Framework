import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist', 'prompt-builder-offline');
const site = path.join(root, 'product-site');
const browserBundle = path.join(root, 'dist', 'browser', 'index.js');

const requiredSiteFiles = ['index.html', 'app.js', 'styles.css'];

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'product-site'), { recursive: true });
await mkdir(path.join(out, 'dist', 'browser'), { recursive: true });

for (const file of requiredSiteFiles) {
  await readFile(path.join(site, file));
}
await readFile(browserBundle);

await cp(site, path.join(out, 'product-site'), { recursive: true });
await cp(browserBundle, path.join(out, 'dist', 'browser', 'index.js'));

const instructions = `JPN Prompt Builder — entrega offline interna\n\n` +
  `Estado: staging local; não publicado.\n\n` +
  `Como usar:\n` +
  `1. Mantenha esta pasta com a estrutura original.\n` +
  `2. Inicie um servidor HTTP local na raiz desta pasta.\n` +
  `   Exemplo com Python instalado: python -m http.server 8000\n` +
  `3. Abra http://localhost:8000/product-site/ no navegador.\n\n` +
  `Por que HTTP local: o Builder importa o bundle oficial em /dist/browser/index.js; abrir o HTML diretamente por file:// pode bloquear módulos ES.\n\n` +
  `Limites:\n` +
  `- nenhuma URL pública é criada por este staging;\n` +
  `- nenhum checkout, login, API paga ou conta externa é necessário;\n` +
  `- esta instrução não é credencial nem promessa de hospedagem futura.\n`;

await writeFile(path.join(out, 'INSTRUCOES_DE_ACESSO.txt'), instructions, 'utf8');

const files = [
  'product-site/index.html',
  'product-site/app.js',
  'product-site/styles.css',
  'product-site/README.md',
  'dist/browser/index.js',
  'INSTRUCOES_DE_ACESSO.txt',
];

const manifest = {
  product: 'JPN Prompt Builder',
  delivery_mode: 'offline-local-http',
  status: 'internal-staging',
  public_url: null,
  requires_external_account: false,
  files: [],
};

for (const relative of files) {
  const data = await readFile(path.join(out, relative));
  manifest.files.push({ path: relative, bytes: data.length, sha256: sha256(data) });
}

await writeFile(path.join(out, 'STAGING_MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Prompt Builder offline staging criado em ${path.relative(root, out)}`);
console.log(`Arquivos rastreados: ${manifest.files.length}`);
