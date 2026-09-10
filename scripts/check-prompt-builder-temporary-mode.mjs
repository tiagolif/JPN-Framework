import { readFile } from "node:fs/promises";

const temporary = await readFile(new URL("../product-site/temporary-mode.js", import.meta.url), "utf8");
const recovery = await readFile(new URL("../product-site/recovery-app.js", import.meta.url), "utf8");
const docs = await readFile(new URL("../docs/products/prompt-builder/TEMPORARY_MODE_v1.md", import.meta.url), "utf8");

const requiredTemporaryMarkers = [
  'temporaryMode',
  'jpn:temporary-mode',
  'saveWorkspace',
  'updateWorkspace',
  'duplicateWorkspace',
  'savePreset',
  'aria-live',
  'role',
  'disabled = enabled',
];

for (const marker of requiredTemporaryMarkers) {
  if (!temporary.includes(marker)) throw new Error(`Modo temporário sem marcador obrigatório: ${marker}`);
}

const forbiddenPersistence = [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'fetch(',
  'sendBeacon',
  'WebSocket',
];

for (const marker of forbiddenPersistence) {
  if (temporary.includes(marker)) throw new Error(`Modo temporário não deve persistir/enviar estado por: ${marker}`);
}

const requiredRecoveryMarkers = [
  'import "./temporary-mode.js"',
  'let temporaryMode = false',
  'if (temporaryMode) return',
  'clearRecoverySnapshot()',
  'clearTimeout(timer)',
  'window.addEventListener("jpn:temporary-mode"',
];

for (const marker of requiredRecoveryMarkers) {
  if (!recovery.includes(marker)) throw new Error(`Recuperação não respeita requisito do modo temporário: ${marker}`);
}

for (let i = 1; i <= 8; i += 1) {
  const id = `PB-TMP-${String(i).padStart(2, "0")}`;
  if (!docs.includes(id)) throw new Error(`Documentação sem requisito ${id}`);
}

const forbiddenClaims = [
  /privacidade total/iu,
  /garante(?:\s+|.*)privacidade/iu,
  /100% privado/iu,
  /impede vazamento/iu,
];

for (const pattern of forbiddenClaims) {
  if (pattern.test(temporary)) throw new Error(`Claim excessivo detectado no modo temporário: ${pattern}`);
}

if (!docs.includes("PENDING")) throw new Error("Documentação deve manter QA físico como PENDING.");

console.log("Prompt Builder: modo temporário preserva opt-in, suspende persistência local automática e mantém QA físico pendente.");
