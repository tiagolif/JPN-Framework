import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../product-site/index.html", import.meta.url), "utf8");
const guard = await readFile(new URL("../product-site/sensitive-data-guard.js", import.meta.url), "utf8");
const errors = [];

if (!html.includes('type="module" src="sensitive-data-guard.js"')) {
  errors.push('index.html deve carregar sensitive-data-guard.js como ES module.');
}

for (const marker of [
  'inspectSensitiveData',
  'saveWorkspace',
  'updateWorkspace',
  'savePreset',
  'exportWorkspaces',
  'exportPresets',
  'downloadJson',
  'copy',
  'possível credencial ou segredo',
  'possível chave privada',
  'possível número de cartão',
  'possível CPF',
  'endereço de e-mail',
  'possível telefone',
  'falso positivo',
  'stopImmediatePropagation',
  'capture: true',
  'aria-live',
]) {
  if (!guard.includes(marker)) errors.push(`Proteção de dados perdeu marcador obrigatório: ${marker}`);
}

if (/fetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|WebSocket|EventSource/.test(guard)) {
  errors.push('Proteção de dados não pode enviar conteúdo para rede.');
}

if (/localStorage|sessionStorage|indexedDB/.test(guard)) {
  errors.push('Proteção não deve criar armazenamento próprio de dados detectados.');
}

if (!/confirmGuardedAction/.test(guard)) errors.push('Ações sensíveis devem passar por confirmação contextual.');
if (!/return findings/.test(guard)) errors.push('Detector deve retornar somente categorias encontradas.');
if (/console\.(?:log|debug|info)\([^)]*(?:text|value|content)/.test(guard)) {
  errors.push('Proteção não deve registrar conteúdo analisado no console.');
}

if (errors.length) {
  console.error('Prompt Builder sensitive-data guard check falhou:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Prompt Builder sensitive-data guard OK: aviso local, confirmação e ausência de envio/armazenamento próprio verificados.');
