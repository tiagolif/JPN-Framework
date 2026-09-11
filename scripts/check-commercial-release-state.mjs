import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const releasePath = path.join(root, 'docs/product-system/PRODUCT_RELEASE_STATUS_v1.json');
const commercialPath = path.join(root, 'docs/commercial/COMMERCIAL_RELEASE_STATE_v1.json');

const release = JSON.parse(await readFile(releasePath, 'utf8'));
const commercial = JSON.parse(await readFile(commercialPath, 'utf8'));
const errors = [];

const releaseById = new Map(release.products.map((product) => [product.id, product]));
const commercialById = new Map(commercial.products.map((product) => [product.id, product]));
const allowedStates = new Set(commercial.allowed_commercial_states ?? []);
const safeDone = new Set(['passed', 'not-applicable']);

if (releaseById.size !== release.products.length) errors.push('Release contract contains duplicate product IDs.');
if (commercialById.size !== commercial.products.length) errors.push('Commercial release state contains duplicate product IDs.');
if (!allowedStates.has('internal-review') || !allowedStates.has('release-ready')) {
  errors.push('Commercial state must declare internal-review and release-ready states.');
}

for (const [id, releaseProduct] of releaseById) {
  const record = commercialById.get(id);
  if (!record) {
    errors.push(`${id}: missing from commercial release state.`);
    continue;
  }

  if (!allowedStates.has(record.commercial_state)) {
    errors.push(`${id}: invalid commercial_state '${record.commercial_state}'.`);
  }

  const open = releaseProduct.dependencies
    .filter((dependency) => !safeDone.has(dependency.status))
    .map((dependency) => dependency.id);
  const declared = record.open_dependencies ?? [];

  if (new Set(declared).size !== declared.length) errors.push(`${id}: duplicate open_dependencies.`);
  if (open.length !== declared.length || open.some((dependency, index) => dependency !== declared[index])) {
    errors.push(`${id}: open_dependencies diverge from canonical release status. Expected [${open.join(', ')}], got [${declared.join(', ')}].`);
  }

  const isReleaseReady = open.length === 0;
  const expectedState = isReleaseReady ? 'release-ready' : 'internal-review';
  if (record.commercial_state !== expectedState) {
    errors.push(`${id}: commercial_state must be '${expectedState}' for the current release dependencies.`);
  }
  if (record.public_presentation_allowed !== isReleaseReady) {
    errors.push(`${id}: public_presentation_allowed must be ${isReleaseReady}.`);
  }

  if (typeof record.page !== 'string' || !record.page.startsWith('commercial-site/products/')) {
    errors.push(`${id}: invalid commercial product page path.`);
  } else {
    try {
      const pageStat = await stat(path.join(root, record.page));
      if (!pageStat.isFile()) errors.push(`${id}: commercial page is not a file.`);
      const html = await readFile(path.join(root, record.page), 'utf8');
      if (!html.includes(`data-product="${id}"`)) errors.push(`${id}: page data-product does not match canonical ID.`);
      if (!/<meta\s+name="robots"\s+content="noindex,nofollow"\s*\/?>/i.test(html)) {
        errors.push(`${id}: internal commercial page must keep noindex,nofollow.`);
      }
      if (!isReleaseReady) {
        const forbidden = [
          /dispon[ií]vel\s+agora/i,
          /pronto\s+para\s+venda/i,
          /liberado\s+para\s+venda/i,
          /compre\s+agora/i,
          /release\s+aprovado/i,
          /produto\s+lan[cç]ado/i,
        ];
        for (const pattern of forbidden) {
          if (pattern.test(html)) errors.push(`${id}: page contains premature readiness/sales wording matched by ${pattern}.`);
        }
      }
    } catch {
      errors.push(`${id}: commercial page not found at ${record.page}.`);
    }
  }
}

for (const id of commercialById.keys()) {
  if (!releaseById.has(id)) errors.push(`${id}: commercial state contains product absent from release contract.`);
}

if (!Array.isArray(commercial.guardrails) || commercial.guardrails.length < 4) {
  errors.push('Commercial release state must contain explicit guardrails.');
}

if (errors.length > 0) {
  console.error('Commercial release-state check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const openCount = release.products.reduce(
  (sum, product) => sum + product.dependencies.filter((dependency) => !safeDone.has(dependency.status)).length,
  0,
);
const readyCount = commercial.products.filter((product) => product.commercial_state === 'release-ready').length;
console.log(`Commercial release state OK: ${commercial.products.length} products, ${readyCount} release-ready, ${openCount} open dependencies.`);
