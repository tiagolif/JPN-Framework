# JPN — Release Evidence Register v1

Status: controle operacional interno · evidências reais pendentes · não publicado.

## Objetivo

Consolidar em um único registro os bloqueadores que exigem evidência humana, runtime ou artefato final antes de qualquer freeze ou decisão de release. Este documento não transforma pendência em aprovação e não substitui `RELEASE_GATES.json`, `READINESS_MATRIX_v1.md`, checklists específicos ou evidências produzidas por cada QA.

## Regra central

Um item só pode sair de `PENDING` quando existir evidência reproduzível correspondente ao **mesmo artefato/commit candidato**. Ausência de evidência, teste parcial ou resultado em versão diferente mantém o item pendente.

Estados permitidos:

- `PENDING` — evidência ainda não produzida ou incompleta;
- `IN_PROGRESS` — execução iniciada, sem evidência suficiente para conclusão;
- `PASSED` — evidência real e reproduzível registrada;
- `FAILED` — evidência real registrou falha que exige correção;
- `BLOCKED` — execução depende de ambiente, dispositivo, software ou decisão ainda indisponível.

## Registro canônico

| ID | Área | Evidência exigida | Estado inicial | Pode ser automatizado como PASSED? | Bloqueia release? |
|---|---|---|---|---|---|
| EV-01 | Prompt Builder | teste físico contextual em celular real cobrindo geração, copiar, salvar, recuperar, viewport e teclado | PENDING | não | sim |
| EV-02 | Gestão Fácil | GF-QA-10 no mesmo XLSX em Microsoft Excel | PENDING | não | sim |
| EV-03 | Gestão Fácil | GF-QA-10 no mesmo XLSX em LibreOffice Calc | PENDING | não | sim |
| EV-04 | Gestão Fácil | GF-QA-10 no mesmo XLSX em Google Sheets | PENDING | não | sim |
| EV-05 | Identidade visual | inspeção visual humana das artes/fontes renderizadas | PENDING | não | sim |
| EV-06 | Comercial | revisão humana de coerência entre páginas, copies e fatos dos produtos | PENDING | não | sim |
| EV-07 | Método JPN | PDF candidato exportado e inspeção página a página | PENDING | não | sim |
| EV-08 | Prompt Pack | PDF candidato exportado e inspeção página a página | PENDING | não | sim |
| EV-09 | JPN Business | candidato renderizado inspecionado página a página | PENDING | não | sim |
| EV-10 | Gestão Fácil | manual final/PDF candidato inspecionado visualmente | PENDING | não | sim |
| EV-11 | Pro Kit | staging montado apenas com artefatos aprovados | PENDING | parcialmente | sim |
| EV-12 | Freeze | lista final de arquivos congelada e sem alteração posterior | PENDING | não | sim |
| EV-13 | Integridade | SHA-256 calculados somente após EV-12 | PENDING | sim, depois do freeze | sim |
| EV-14 | Manifesto | manifesto final preenchido com versões, caminhos e hashes do freeze | PENDING | parcialmente | sim |
| EV-15 | CI | pipeline verde no mesmo head congelado destinado ao pacote | PENDING | sim | sim |
| EV-16 | Editorial | revisão ortográfica/editorial humana final dos entregáveis de leitura | PENDING | não | sim |

## Dependências mínimas

- EV-02, EV-03 e EV-04 precisam usar exatamente o mesmo binário XLSX.
- EV-07..EV-10 devem referenciar os arquivos candidatos efetivamente inspecionados.
- EV-11 não pode incluir artefato cuja dependência bloqueadora ainda esteja `FAILED` ou sem evidência necessária.
- EV-12 só pode ocorrer depois de correções resultantes dos QAs anteriores.
- EV-13 depende de EV-12 em `PASSED`; hash anterior ao freeze não é hash final.
- EV-14 depende dos caminhos e hashes finais de EV-12/EV-13.
- EV-15 precisa ser do mesmo commit/head congelado; CI de outro commit não serve como evidência final.

## Campos obrigatórios ao registrar uma evidência

Para qualquer item promovido de `PENDING`, registrar no CSV associado:

- `evidence_id`;
- `status`;
- `artifact_or_commit`;
- `environment`;
- `executed_at`;
- `evidence_path`;
- `notes`;
- `reviewed_by` quando houver revisão humana.

Não inserir credenciais, tokens, dados financeiros reais, dados pessoais desnecessários ou informações bancárias no registro.

## Critério de evidência válida

Uma evidência é válida quando permite responder de forma verificável:

1. o que foi testado ou revisado;
2. qual versão, arquivo ou commit foi usado;
3. em qual ambiente ocorreu;
4. qual foi o resultado;
5. onde o registro correspondente está armazenado;
6. se a execução exigia revisão humana, quem a realizou.

Captura de tela isolada sem identificação do artefato pode complementar, mas não substituir o registro principal.

## Critério de falha

Se um QA encontrar problema, usar `FAILED`, registrar o achado e corrigir em uma nova versão/commit. A correção não reaproveita automaticamente o `PASSED` anterior: a área afetada deve ser revalidada quando a mudança puder alterar o resultado.

## Relação com estados de confiança JPN

No conteúdo dos produtos continuam válidos `confirmed`, `inferred`, `unknown` e `conflicting`. No registro de release, porém, o estado deve refletir evidência operacional real: uma evidência desconhecida nunca deve ser promovida silenciosamente a `PASSED`.

## O que este registro não autoriza

Mesmo com todos os itens em `PASSED`, este controle não autoriza:

- publicação de site, anúncio ou conteúdo externo;
- abertura de checkout ou venda;
- gasto de dinheiro;
- compra ou contratação;
- aceite de termos legais;
- uso de dados financeiros reais;
- criação de conta com verificação de identidade.

A prontidão técnica continua separada de qualquer autorização comercial ou externa.

## Próxima ordem segura

A ordem operacional recomendada é: EV-01..EV-10 → correções → EV-11 → EV-12 → EV-13 → EV-14 → EV-15, mantendo EV-16 concluído antes do freeze dos documentos afetados.

O arquivo `RELEASE_EVIDENCE_REGISTER_v1.csv` é o quadro atualizável deste documento e deve começar com todos os itens em `PENDING`.