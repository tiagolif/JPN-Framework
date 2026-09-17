import fs from 'node:fs';

const protocolPath = 'docs/commercial/creative_sources/REVIEW_PROTOCOL.md';
const protocol = fs.readFileSync(protocolPath, 'utf8');

const requiredPieces = Array.from({ length: 8 }, (_, index) => `JPN-CR-${String(index + 1).padStart(2, '0')}`);
const requiredTerms = [
  'CANDIDATO INTERNO',
  'NÃO PUBLICAR',
  'release_ready=false',
  'publication_authorized=false',
  'PENDING_HUMAN',
  'SHA-256',
  'PASS',
  'FAIL',
  'Hierarquia',
  'Legibilidade',
  'Consistência',
  'Claims',
  'Marca',
  'Segurança',
  'review-manifest.json',
];

const missingPieces = requiredPieces.filter((id) => !protocol.includes(id));
const missingTerms = requiredTerms.filter((term) => !protocol.includes(term));

if (missingPieces.length || missingTerms.length) {
  if (missingPieces.length) console.error(`Review protocol missing creative IDs: ${missingPieces.join(', ')}`);
  if (missingTerms.length) console.error(`Review protocol missing required controls: ${missingTerms.join(', ')}`);
  process.exit(1);
}

const inventoryRows = protocol.match(/^\| JPN-CR-\d{2} \|/gm) ?? [];
if (inventoryRows.length !== 8) {
  console.error(`Review protocol must inventory exactly 8 creatives; found ${inventoryRows.length}.`);
  process.exit(1);
}

if (!protocol.includes('1080×1920') || !protocol.includes('1920×1080') || !protocol.includes('1080×1080')) {
  console.error('Review protocol is missing one or more canonical dimensions.');
  process.exit(1);
}

if (!/não substitui revisão humana/i.test(protocol) || !/não autoriza publicação/i.test(protocol)) {
  console.error('Review protocol must explicitly preserve human review and publication guardrails.');
  process.exit(1);
}

console.log('Commercial creative review protocol OK: 8 peças, critérios, hashes e guardrails rastreados.');
