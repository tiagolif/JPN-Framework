import assert from 'node:assert/strict';
import Ajv2020 from 'ajv/dist/2020.js';
import fs from 'node:fs';
import { migrateHandoff01to02 } from './lib/handoff-migration.mjs';

const readJson=(p)=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const ajv=new Ajv2020({allErrors:true,strict:true});
const validate01=ajv.compile(readJson('../schemas/jpn-handoff.v0.1.schema.json'));
const legacy={contract_version:'0.1.0-draft',jpn_state_version:'0.3.0-draft',from_agent:'agent-a',to_agent:'agent-b',objective:'Transferir estado verificável.',status:'ready_for_review',evidence:[{id:'EV-01',claim:'Fixture preservada.',source_type:'test_result',source_ref:'migration-fixture',verification_status:'verified',captured_at:'2026-09-20T00:00:00-03:00'}],decisions:[{decision:'Migrar apenas dados determinísticos.',basis_evidence_ids:['EV-01'],reversible:true}],open_items:[],next_actions:['Validar destino'],constraints:['Não inventar evidência']};
if(!validate01(legacy)) throw new Error(`Fixture 0.1 deveria ser válida: ${ajv.errorsText(validate01.errors)}`);
const migrated=migrateHandoff01to02(legacy);
assert.deepEqual({...migrated,contract_version:legacy.contract_version},legacy,'Migração 0.1→0.2 alterou conteúdo além da versão.');
assert.notEqual(migrated,legacy,'Migração deve produzir novo objeto.');
assert.notEqual(migrated.evidence,legacy.evidence,'Migração deve clonar estruturas aninhadas.');
migrated.evidence[0].claim='mutação de prova';
assert.equal(legacy.evidence[0].claim,'Fixture preservada.','Destino não pode compartilhar estruturas mutáveis com a origem.');
for(const captured_at of ['20/09/2026 00:00','2026-02-30T00:00:00Z','2026-13-01T00:00:00Z','2026-09-20T25:00:00Z','2026-09-20T00:00:00+15:00']){
  const unsafe={...legacy,evidence:[{...legacy.evidence[0],captured_at}]};
  if(!validate01(unsafe)) throw new Error('Fixture legada incompatível deveria ser aceita pela baseline 0.1.');
  let blocked=false; try{migrateHandoff01to02(unsafe);}catch(error){blocked=/captured_at não pode ser corrigido/.test(error.message);} if(!blocked) throw new Error(`Migração insegura deveria bloquear timestamp semântico/formal inválido: ${captured_at}`);
}
for(const unsafe of [
  {...legacy,evidence:[legacy.evidence[0],{...legacy.evidence[0]}]},
  {...legacy,decisions:[{...legacy.decisions[0],basis_evidence_ids:['EV-404']}]}
]){
  if(!validate01(unsafe)) throw new Error('Fixture legada semanticamente incompatível deveria ser estruturalmente aceita pela baseline 0.1.');
  let blocked=false; try{migrateHandoff01to02(unsafe);}catch(error){blocked=/integridade semântica da origem inválida/.test(error.message);} if(!blocked) throw new Error('Migração deve bloquear IDs de evidência duplicados e referências inexistentes antes de promover o contrato.');
}
const invalidSource={...legacy,objective:''};
let invalidBlocked=false; try{migrateHandoff01to02(invalidSource);}catch(error){invalidBlocked=/Origem 0.1 inválida/.test(error.message);} if(!invalidBlocked) throw new Error('Origem inválida deve ser bloqueada antes da migração.');
console.log('JPN handoff migration OK: migrador reutilizável 0.1→0.2 preserva conteúdo e bloqueia reparos inventados.');
