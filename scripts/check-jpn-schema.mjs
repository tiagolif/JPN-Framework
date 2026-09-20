import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

const readJson = (relativePath) => JSON.parse(fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: true });

const stateSchema = readJson('../schemas/jpn.schema.json');
const validateState = ajv.compile(stateSchema);

const validState = {
  version: '0.3.0-draft',
  jornada: {
    contexto: 'Pequena empresa precisa organizar uma entrega com IA.',
    estado_atual: 'Requisitos iniciais conhecidos.',
    itens_de_contexto: [
      { value: 'A saída deve ser revisável antes da publicação.', confidence_state: 'confirmed', source: 'user_message' }
    ]
  },
  precisao: {
    objetivo: 'Produzir uma entrega verificável.',
    escopo: { inclui: ['estrutura JPN'], nao_inclui: ['publicação automática'] },
    saidas: ['artefato revisável'],
    criterios_de_aceitacao: ['schema válido']
  },
  narrativa: {
    estado_final_desejado: 'Entrega pronta para revisão humana.',
    sequencia_de_entrega: ['validar', 'revisar']
  }
};

if (!validateState(validState)) {
  throw new Error(`Exemplo JPN válido foi rejeitado: ${ajv.errorsText(validateState.errors)}`);
}

const invalidStateCases = [
  { name: 'campo obrigatório ausente', value: { ...validState, narrativa: {} } },
  { name: 'estado de confiança inválido', value: { ...validState, jornada: { ...validState.jornada, itens_de_contexto: [{ value: 'x', confidence_state: 'guess' }] } } },
  { name: 'propriedade raiz desconhecida', value: { ...validState, extra: true } }
];

for (const testCase of invalidStateCases) {
  if (validateState(testCase.value)) throw new Error(`Caso inválido aceito pelo schema JPN: ${testCase.name}`);
}

const handoffSchema = readJson('../schemas/jpn-handoff.schema.json');
const validateHandoff = ajv.compile(handoffSchema);

const validateHandoffReferences = (handoff) => {
  const evidenceIds = handoff.evidence.map((item) => item.id);
  const uniqueEvidenceIds = new Set(evidenceIds);
  if (uniqueEvidenceIds.size !== evidenceIds.length) {
    return { valid: false, reason: 'IDs de evidência duplicados' };
  }

  for (const [decisionIndex, decision] of (handoff.decisions ?? []).entries()) {
    for (const evidenceId of decision.basis_evidence_ids) {
      if (!uniqueEvidenceIds.has(evidenceId)) {
        return {
          valid: false,
          reason: `decisions[${decisionIndex}] referencia evidência inexistente: ${evidenceId}`
        };
      }
    }
  }

  return { valid: true };
};

const assertValidHandoff = (handoff, label) => {
  if (!validateHandoff(handoff)) {
    throw new Error(`${label} foi rejeitado pelo schema: ${ajv.errorsText(validateHandoff.errors)}`);
  }
  const referenceResult = validateHandoffReferences(handoff);
  if (!referenceResult.valid) {
    throw new Error(`${label} falhou na integridade referencial: ${referenceResult.reason}`);
  }
};

const validHandoff = {
  contract_version: '0.1.0-draft',
  jpn_state_version: validState.version,
  from_agent: 'research-agent',
  to_agent: 'delivery-agent',
  objective: 'Transferir trabalho verificável sem promover suposições a fatos.',
  status: 'ready_for_review',
  evidence: [
    {
      id: 'EV-001',
      claim: 'O schema JPN foi validado pelo gate local.',
      source_type: 'test_result',
      source_ref: 'scripts/check-jpn-schema.mjs',
      verification_status: 'verified',
      captured_at: '2026-09-19T21:32:42-03:00'
    }
  ],
  decisions: [
    { decision: 'Manter publicação fora do escopo.', basis_evidence_ids: ['EV-001'], reversible: true }
  ],
  open_items: ['Revisão humana final'],
  next_actions: ['Revisar evidências antes da promoção'],
  constraints: ['Não publicar automaticamente']
};

assertValidHandoff(validHandoff, 'Handoff JPN válido');

const invalidHandoffCases = [
  { name: 'evidência sem referência de fonte', value: { ...validHandoff, evidence: [{ id: 'EV-002', claim: 'Claim sem fonte', source_type: 'test_result', verification_status: 'verified' }] } },
  { name: 'status de verificação inválido', value: { ...validHandoff, evidence: [{ ...validHandoff.evidence[0], verification_status: 'assumed' }] } },
  { name: 'status de handoff inválido', value: { ...validHandoff, status: 'published' } },
  { name: 'timestamp sem timezone explícito', value: { ...validHandoff, evidence: [{ ...validHandoff.evidence[0], captured_at: '2026-09-19T21:32:42' }] } },
  { name: 'timestamp não ISO', value: { ...validHandoff, evidence: [{ ...validHandoff.evidence[0], captured_at: '19/09/2026 21:32' }] } }
];

for (const testCase of invalidHandoffCases) {
  if (validateHandoff(testCase.value)) throw new Error(`Caso inválido aceito pelo schema de handoff: ${testCase.name}`);
}

const invalidReferenceCases = [
  {
    name: 'decisão referencia evidência inexistente',
    value: { ...validHandoff, decisions: [{ decision: 'Decisão sem base existente.', basis_evidence_ids: ['EV-404'], reversible: true }] }
  },
  {
    name: 'IDs de evidência duplicados',
    value: { ...validHandoff, evidence: [validHandoff.evidence[0], { ...validHandoff.evidence[0], claim: 'Outra alegação com ID repetido.' }] }
  }
];

for (const testCase of invalidReferenceCases) {
  if (!validateHandoff(testCase.value)) {
    throw new Error(`Fixture de integridade referencial inválida no schema antes do teste semântico: ${testCase.name}`);
  }
  const referenceResult = validateHandoffReferences(testCase.value);
  if (referenceResult.valid) throw new Error(`Caso de referência inválida aceito: ${testCase.name}`);
}

console.log('JPN schema contract OK: estado, provenance/evidence, timestamps, handoff e integridade referencial validados.');
