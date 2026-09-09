import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docPath = path.join(root, 'docs/commercial/CUSTOMER_ONBOARDING_GUIDE_v1.md');
const pagePath = path.join(root, 'commercial-site/primeiros-passos.html');
const errors = [];

for (const file of [docPath, pagePath]) {
  if (!fs.existsSync(file)) errors.push(`${path.relative(root, file)} ausente`);
}

if (!errors.length) {
  const doc = fs.readFileSync(docPath, 'utf8');
  const page = fs.readFileSync(pagePath, 'utf8');
  const combined = `${doc}\n${page}`;

  const required = [
    'candidate companion / commercial QA pending',
    'Comece pelo menor recurso que resolva a necessidade atual',
    'Método JPN',
    'JPN Prompt Builder',
    'JPN Prompt Pack',
    'JPN Business',
    'JPN Gestão Fácil',
    'JPN Pro Kit',
    'QA físico contextual em celular',
    'GF-QA-10',
    'EM PREPARAÇÃO',
    'Método → Prompt Builder',
    'Prompt Pack → Business',
    'Business → Gestão Fácil',
    'não bundles',
  ];

  for (const token of required) {
    if (!combined.includes(token)) errors.push(`conteúdo obrigatório ausente: ${token}`);
  }

  if (!page.includes('noindex,nofollow')) errors.push('primeiros-passos.html deve permanecer noindex,nofollow');
  if (!page.includes('products/jpn-pro-kit.html')) errors.push('link relativo do Pro Kit ausente');
  if (!page.includes('casos-de-uso.html')) errors.push('link para casos de uso ausente');

  const forbidden = [
    /R\$\s*\d/i,
    /href=["']https?:\/\//i,
    /<form\b/i,
    /<input\b/i,
    /checkout/i,
    /garantia de resultado/i,
    /compre agora/i,
    /últimas vagas/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(combined)) errors.push(`padrão comercial proibido encontrado: ${pattern}`);
  }

  if (!/gasto, publicação, compra, contratação ou aceite legal/i.test(doc)) {
    errors.push('regra de parada para compromissos externos ausente no guia');
  }
}

if (errors.length) {
  console.error('Falhas no onboarding comercial JPN:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Commercial onboarding check OK.');
