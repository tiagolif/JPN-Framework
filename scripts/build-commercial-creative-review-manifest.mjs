import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve('docs/commercial/creative_sources');
const output = path.join(root, 'review-manifest.json');
const files = [
  ['JPN-CR-01-metodo-jpn-card.svg', 1080, 1080],
  ['JPN-CR-02-prompt-builder-card.svg', 1080, 1080],
  ['JPN-CR-03-prompt-pack-card.svg', 1080, 1080],
  ['JPN-CR-04-jpn-business-card.svg', 1080, 1080],
  ['JPN-CR-05-gestao-facil-card.svg', 1080, 1080],
  ['JPN-CR-06-pro-kit-card.svg', 1080, 1080],
  ['JPN-CR-07-ecossistema-story.svg', 1080, 1920],
  ['JPN-CR-08-ecossistema-hero.svg', 1920, 1080],
];

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const pieces = files.map(([file, width, height]) => {
  const source = fs.readFileSync(path.join(root, file));
  return {
    id: file.match(/^JPN-CR-\d{2}/)[0],
    source: file,
    width,
    height,
    sha256: sha256(source),
    review_state: 'PENDING_HUMAN',
    publication_authorized: false,
  };
});

const manifest = {
  schema_version: 1,
  kind: 'jpn-commercial-creative-review-manifest',
  release_ready: false,
  publication_authorized: false,
  note: 'CANDIDATO INTERNO · NÃO PUBLICAR · revisão humana pendente',
  pieces,
};
const serialized = `${JSON.stringify(manifest, null, 2)}\n`;

if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== serialized) {
    console.error('Commercial creative review manifest is missing or stale.');
    process.exit(1);
  }
  console.log(`Commercial creative review manifest OK: ${pieces.length} peças com SHA-256 rastreado.`);
} else {
  fs.writeFileSync(output, serialized);
  console.log(`Wrote ${path.relative(process.cwd(), output)} with ${pieces.length} pieces.`);
}
