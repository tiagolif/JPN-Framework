import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

const schema = JSON.parse(fs.readFileSync(new URL('../schemas/jpn.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: true });
const validate = ajv.compile(schema);

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

if (!validate(validState)) {
  throw new Error(`Exemplo JPN válido foi rejeitado: ${ajv.errorsText(validate.errors)}`);
}

const invalidCases = [
  { name: 'campo obrigatório ausente', value: { ...validState, narrativa: {} } },
  { name: 'estado de confiança inválido', value: { ...validState, jornada: { ...validState.jornada, itens_de_contexto: [{ value: 'x', confidence_state: 'guess' }] } } },
  { name: 'propriedade raiz desconhecida', value: { ...validState, extra: true } }
];

for (const testCase of invalidCases) {
  if (validate(testCase.value)) throw new Error(`Caso inválido aceito pelo schema: ${testCase.name}`);
}

console.log('JPN schema contract OK: exemplo válido aceito e casos inválidos rejeitados.');
