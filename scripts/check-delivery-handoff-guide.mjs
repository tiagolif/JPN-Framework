import fs from 'node:fs';

const path = 'docs/product-system/CUSTOMER_DELIVERY_HANDOFF_v1.md';

if (!fs.existsSync(path)) {
  throw new Error(`Arquivo obrigatório ausente: ${path}`);
}

const text = fs.readFileSync(path, 'utf8');

const required = [
  '# JPN — Guia de entrega e handoff ao cliente v1',
  'RASCUNHO',
  'CANDIDATO',
  'QA_PENDENTE',
  'APROVADO_PARA_FREEZE',
  'FROZEN',
  'ENTREGAVEL',
  'BLOQUEADO',
  'Método JPN',
  'JPN Prompt Pack',
  'JPN Business',
  'JPN Prompt Builder',
  'JPN Gestão Fácil',
  'JPN Pro Kit',
  '18 templates canônicos',
  '12 playbooks canônicos',
  'confirmed',
  'inferred',
  'unknown',
  'conflicting',
  'GF-QA-10',
  'REPOR',
  'EM PREPARAÇÃO',
  'MANIFEST.txt',
  'SHA256SUMS.txt',
  'README_ENTREGA.md',
  'CHANGELOG_RESUMIDO.md',
  'QA físico contextual',
  'Microsoft Excel',
  'LibreOffice Calc',
  'Google Sheets',
  'dados financeiros reais',
  'credenciais',
  'aceitar termos legais',
  'verificação de identidade',
];

for (const token of required) {
  if (!text.includes(token)) {
    throw new Error(`CUSTOMER_DELIVERY_HANDOFF_v1.md não contém marcador obrigatório: ${token}`);
  }
}

const productSections = [
  '### 6.1 Método JPN',
  '### 6.2 JPN Prompt Pack',
  '### 6.3 JPN Business',
  '### 6.4 JPN Prompt Builder',
  '### 6.5 JPN Gestão Fácil',
  '### 6.6 JPN Pro Kit',
];

for (const section of productSections) {
  if (!text.includes(section)) {
    throw new Error(`Seção de produto obrigatória ausente: ${section}`);
  }
}

const checklistMatches = text.match(/- \[ \]/g) ?? [];
if (checklistMatches.length < 15) {
  throw new Error(`Checklist de pré-handoff incompleto: esperado >=15 itens, encontrado ${checklistMatches.length}`);
}

const blockedPatterns = [
  /R\$\s*\d/i,
  /US\$\s*\d/i,
  /compre\s+agora/i,
  /garantia\s+de\s+(resultado|vendas|lucro)/i,
  /100%\s+(garantido|eficaz|compatível)/i,
  /checkout\s*:\s*https?:\/\//i,
  /token\s*=\s*[A-Za-z0-9_-]{12,}/i,
  /api[_ -]?key\s*=\s*[A-Za-z0-9_-]{12,}/i,
];

for (const pattern of blockedPatterns) {
  if (pattern.test(text)) {
    throw new Error(`Padrão bloqueado encontrado no guia de handoff: ${pattern}`);
  }
}

const pendingAssertions = [
  /QA físico contextual do JPN Prompt Builder em celular permanece pendente/,
  /`GF-QA-10` da Gestão Fácil permanece pendente/,
  /`REPOR` permanece somente alerta/,
  /JPN Pro Kit permanece `EM PREPARAÇÃO`/,
];

for (const assertion of pendingAssertions) {
  if (!assertion.test(text)) {
    throw new Error(`Estado pendente não preservado: ${assertion}`);
  }
}

if (!/hash comprova integridade do arquivo, não qualidade/i.test(text)) {
  throw new Error('O guia deve separar integridade criptográfica de qualidade/aprovação.');
}

if (!/não representa publicação, disponibilidade comercial, checkout, aceite jurídico, promessa de resultado ou decisão de release/i.test(text)) {
  throw new Error('O estado interno e não-publicado do guia precisa permanecer explícito.');
}

const templateFiles = {
  'deliverables/templates/README_ENTREGA.template.md': [
    '{{PRODUCT_NAME}}',
    '{{PACKAGE_STATE}}',
    '{{VERSION}}',
    '{{PRIMARY_FILES}}',
    '{{PENDING_ITEMS}}',
    'confirmed',
    'inferred',
    'unknown',
    'conflicting',
    'Hash comprova integridade do arquivo, não qualidade',
  ],
  'deliverables/templates/CHANGELOG_RESUMIDO.template.md': [
    '{{PRODUCT_NAME}}',
    '{{VERSION}}',
    '{{PACKAGE_STATE}}',
    '{{ADDED}}',
    '{{CHANGED}}',
    '{{FIXED}}',
    '{{PENDING}}',
  ],
  'deliverables/templates/MANIFEST.template.txt': [
    '{{PRODUCT_NAME}}',
    '{{VERSION}}',
    '{{PACKAGE_STATE}}',
    '{{FILE_LIST}}',
    '{{PENDING_ITEMS}}',
    'SHA256SUMS.txt',
  ],
  'deliverables/templates/SHA256SUMS.template.txt': [
    'TEMPLATE ONLY',
    '{{SHA256}}',
    '{{RELATIVE_FILE_PATH}}',
    'Hash comprova integridade do arquivo, não qualidade',
  ],
};

for (const [templatePath, markers] of Object.entries(templateFiles)) {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template de entrega obrigatório ausente: ${templatePath}`);
  }

  const templateText = fs.readFileSync(templatePath, 'utf8');
  for (const marker of markers) {
    if (!templateText.includes(marker)) {
      throw new Error(`${templatePath} não contém marcador obrigatório: ${marker}`);
    }
  }

  for (const pattern of blockedPatterns) {
    if (pattern.test(templateText)) {
      throw new Error(`Padrão bloqueado encontrado em ${templatePath}: ${pattern}`);
    }
  }
}

const checksumTemplate = fs.readFileSync('deliverables/templates/SHA256SUMS.template.txt', 'utf8');
if (/\b[a-f0-9]{64}\b/i.test(checksumTemplate)) {
  throw new Error('O template de checksum não deve conter hash SHA-256 real antes do freeze.');
}

console.log('OK: guia de entrega/handoff e templates preservam estados, estrutura mínima e guardrails.');
