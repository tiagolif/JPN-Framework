import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import './check-handoff-migration.mjs';

const readJson = (relativePath) => JSON.parse(fs.readFileSync(new URL(relativePath, import.meta.url), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: true });
const stateSchema = readJson('../schemas/jpn.schema.json');
const validateState = ajv.compile(stateSchema);
const validState = {
  version: '0.3.0-draft',
  jornada: { contexto: 'Pequena empresa precisa organizar uma entrega com IA.', estado_atual: 'Requisitos iniciais conhecidos.', itens_de_contexto: [{ value: 'A saída deve ser revisável antes da publicação.', confidence_state: 'confirmed', source: 'user_message' }] },
  precisao: { objetivo: 'Produzir uma entrega verificável.', escopo: { inclui: ['estrutura JPN'], nao_inclui: ['publicação automática'] }, saidas: ['artefato revisável'], criterios_de_aceitacao: ['schema válido'] },
  narrativa: { estado_final_desejado: 'Entrega pronta para revisão humana.', sequencia_de_entrega: ['validar', 'revisar'] }
};
if (!validateState(validState)) throw new Error(`Exemplo JPN válido foi rejeitado: ${ajv.errorsText(validateState.errors)}`);
for (const testCase of [
  { name: 'campo obrigatório ausente', value: { ...validState, narrativa: {} } },
  { name: 'estado de confiança inválido', value: { ...validState, jornada: { ...validState.jornada, itens_de_contexto: [{ value: 'x', confidence_state: 'guess' }] } } },
  { name: 'propriedade raiz desconhecida', value: { ...validState, extra: true } }
]) if (validateState(testCase.value)) throw new Error(`Caso inválido aceito pelo schema JPN: ${testCase.name}`);

const handoffSchema = readJson('../schemas/jpn-handoff.schema.json');
const validateHandoff = ajv.compile(handoffSchema);
const timestampPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?(Z|([+-])(\d{2}):(\d{2}))$/;
const isSemanticallyValidTimestamp = (value) => {
  if (value === null || value === undefined) return true;
  const match = timestampPattern.exec(value); if (!match) return false;
  const [, y, mo, d, h, mi, s, , zone, , oh, om] = match;
  const year=Number(y), month=Number(mo), day=Number(d), hour=Number(h), minute=Number(mi), second=Number(s);
  if (month<1 || month>12 || hour>23 || minute>59 || second>59) return false;
  if (day<1 || day>new Date(Date.UTC(year, month, 0)).getUTCDate()) return false;
  if (zone !== 'Z' && (Number(oh)>14 || Number(om)>59 || (Number(oh)===14 && Number(om)!==0))) return false;
  return true;
};
const validateHandoffReferences = (handoff) => {
  const ids=handoff.evidence.map((item)=>item.id), unique=new Set(ids);
  if (unique.size!==ids.length) return {valid:false,reason:'IDs de evidência duplicados'};
  for (const [i,e] of handoff.evidence.entries()) if (!isSemanticallyValidTimestamp(e.captured_at)) return {valid:false,reason:`evidence[${i}].captured_at não representa data/hora ISO 8601 válida`};
  for (const [i,d] of (handoff.decisions??[]).entries()) for (const id of d.basis_evidence_ids) if (!unique.has(id)) return {valid:false,reason:`decisions[${i}] referencia evidência inexistente: ${id}`};
  return {valid:true};
};
const assertValidHandoff=(handoff,label)=>{ if(!validateHandoff(handoff)) throw new Error(`${label} foi rejeitado pelo schema: ${ajv.errorsText(validateHandoff.errors)}`); const r=validateHandoffReferences(handoff); if(!r.valid) throw new Error(`${label} falhou na integridade semântica: ${r.reason}`); };
const validHandoff={
  contract_version:'0.2.0-draft', jpn_state_version:validState.version, from_agent:'research-agent', to_agent:'delivery-agent', objective:'Transferir trabalho verificável sem promover suposições a fatos.', status:'ready_for_review',
  evidence:[{id:'EV-001',claim:'O schema JPN foi validado pelo gate local.',source_type:'test_result',source_ref:'scripts/check-jpn-schema.mjs',verification_status:'verified',captured_at:'2026-09-19T21:32:42-03:00'}],
  decisions:[{decision:'Manter publicação fora do escopo.',basis_evidence_ids:['EV-001'],reversible:true}], open_items:['Revisão humana final'], next_actions:['Revisar evidências antes da promoção'], constraints:['Não publicar automaticamente']
};
assertValidHandoff(validHandoff,'Handoff JPN válido');
for (const testCase of [
  {name:'versão antiga no contrato atual',value:{...validHandoff,contract_version:'0.1.0-draft'}},
  {name:'evidência sem referência de fonte',value:{...validHandoff,evidence:[{id:'EV-002',claim:'Claim sem fonte',source_type:'test_result',verification_status:'verified'}]}},
  {name:'status de verificação inválido',value:{...validHandoff,evidence:[{...validHandoff.evidence[0],verification_status:'assumed'}]}},
  {name:'status de handoff inválido',value:{...validHandoff,status:'published'}},
  {name:'timestamp sem timezone explícito',value:{...validHandoff,evidence:[{...validHandoff.evidence[0],captured_at:'2026-09-19T21:32:42'}]}},
  {name:'timestamp não ISO',value:{...validHandoff,evidence:[{...validHandoff.evidence[0],captured_at:'19/09/2026 21:32'}]}}
]) if(validateHandoff(testCase.value)) throw new Error(`Caso inválido aceito pelo schema de handoff: ${testCase.name}`);
for (const testCase of [
  {name:'dia inexistente',timestamp:'2026-02-30T12:00:00Z'}, {name:'mês inexistente',timestamp:'2026-13-01T12:00:00Z'}, {name:'hora inexistente',timestamp:'2026-09-19T25:00:00Z'}, {name:'offset fora do limite ISO',timestamp:'2026-09-19T21:32:42+15:00'}
]) { const value={...validHandoff,evidence:[{...validHandoff.evidence[0],captured_at:testCase.timestamp}]}; if(!validateHandoff(value)) throw new Error(`Fixture semântica deveria passar pelo formato do schema antes do gate: ${testCase.name}`); if(validateHandoffReferences(value).valid) throw new Error(`Timestamp semanticamente inválido aceito: ${testCase.name}`); }
for (const testCase of [
  {name:'decisão referencia evidência inexistente',value:{...validHandoff,decisions:[{decision:'Decisão sem base existente.',basis_evidence_ids:['EV-404'],reversible:true}]}},
  {name:'IDs de evidência duplicados',value:{...validHandoff,evidence:[validHandoff.evidence[0],{...validHandoff.evidence[0],claim:'Outra alegação com ID repetido.'}]}}
]) { if(!validateHandoff(testCase.value)) throw new Error(`Fixture de integridade referencial inválida no schema antes do teste semântico: ${testCase.name}`); if(validateHandoffReferences(testCase.value).valid) throw new Error(`Caso de referência inválida aceito: ${testCase.name}`); }
console.log('JPN schema contract OK: estado, provenance/evidence, timestamps semânticos, handoff 0.2 e integridade referencial validados.');
