import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const build = fileURLToPath(new URL('./build-jpn-business-composed-candidate.mjs', import.meta.url));
const rendered = fileURLToPath(new URL('./check-jpn-business-rendered-candidate.mjs', import.meta.url));
const compositionIntegrity = fileURLToPath(new URL('./verify-jpn-business-composed-candidate.mjs', import.meta.url));

execFileSync(process.execPath, [build], { stdio: 'inherit' });
execFileSync(process.execPath, [rendered], { stdio: 'inherit' });
execFileSync(process.execPath, [compositionIntegrity, '--no-build'], { stdio: 'inherit' });

console.log('JPN Business composed render gate OK: candidato gerado, integridade editorial existente preservada e camada de composição validada; revisão humana continua obrigatória.');
