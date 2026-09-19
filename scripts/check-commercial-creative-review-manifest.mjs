import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve('docs/commercial/creative_sources');
const manifestPath = path.join(root, 'review-manifest.json');
const expected = [
  ['JPN-CR-01', 'JPN-CR-01-metodo-jpn-card.svg', 1080, 1080],
  ['JPN-CR-02', 'JPN-CR-02-prompt-builder-card.svg', 1080, 1080],
  ['JPN-CR-03', 'JPN-CR-03-prompt-pack-card.svg', 1080, 1080],
  ['JPN-CR-04', 'JPN-CR-04-jpn-business-card.svg', 1080, 1080],
  ['JPN-CR-05', 'JPN-CR-05-gestao-facil-card.svg', 1080, 1080],
  ['JPN-CR-06', 'JPN-CR-06-pro-kit-card.svg', 1080, 1080],
  ['JPN-CR-07', 'JPN-CR-07-ecossistema-story.svg', 1080, 1920],
  ['JPN-CR-08', 'JPN-CR-08-ecossistema-hero.svg', 1920, 1080],
];

if (!fs.existsSync(manifestPath)) throw new Error('review-manifest.json ausente; execute o builder antes deste gate.');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schema_version !== 1 || manifest.kind !== 'jpn-commercial-creative-review-manifest') throw new Error('Contrato do manifesto inválido.');
if (manifest.release_ready !== false || manifest.publication_authorized !== false) throw new Error('Guardrails globais de release/publicação foram alterados.');
if (!String(manifest.note).includes('NÃO PUBLICAR')) throw new Error('Guardrail NÃO PUBLICAR ausente.');
if (!Array.isArray(manifest.pieces) || manifest.pieces.length !== expected.length) throw new Error('O manifesto deve conter exatamente 8 peças.');

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
for (let i = 0; i < expected.length; i += 1) {
  const [id, source, width, height] = expected[i];
  const piece = manifest.pieces[i];
  if (piece.id !== id || piece.source !== source || piece.width !== width || piece.height !== height) throw new Error(`Metadados divergentes em ${id}.`);
  if (piece.review_state !== 'PENDING_HUMAN' || piece.publication_authorized !== false) throw new Error(`Guardrails divergentes em ${id}.`);
  const sourcePath = path.join(root, source);
  if (!fs.existsSync(sourcePath)) throw new Error(`Fonte ausente: ${source}`);
  if (piece.sha256 !== sha256(fs.readFileSync(sourcePath))) throw new Error(`SHA-256 divergente em ${id}.`);
}

console.log('Commercial creative review manifest OK: 8 peças, hashes, dimensões e guardrails validados.');
