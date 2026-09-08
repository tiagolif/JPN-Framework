# JPN Business — Referência Rápida v1

> Superfície operacional complementar ao `JPN_BUSINESS_v1.md`. Use este mapa para escolher o playbook adequado antes de abrir o procedimento completo. Este material não substitui revisão humana, políticas da empresa nem autorização para ações externas.

## Como usar em 60 segundos

1. Identifique a situação real que precisa ser resolvida.
2. Escolha o playbook pela tabela de roteamento abaixo.
3. Confirme entradas, restrições e responsável antes de executar.
4. Abra o playbook completo `JB-*` e use somente os prompts `PP-*` indicados como apoio.
5. Revise a saída antes de enviar, registrar, publicar ou tomar uma decisão.

## Roteamento por situação

| Situação | Playbook recomendado | Área | Apoio no Prompt Pack |
| --- | --- | --- | --- |
| Chegou um novo contato ou oportunidade | **JB-01 — Entrada e triagem de novo lead** | Comercial | `PP-06`, `PP-07` |
| Um contato precisa de acompanhamento | **JB-02 — Follow-up comercial responsável** | Comercial | `PP-06` |
| É preciso entender se existe aderência real | **JB-03 — Qualificação sem inventar necessidade** | Comercial | `PP-07` |
| Há informações suficientes para preparar uma proposta | **JB-04 — Preparação de proposta sem definir condição não autorizada** | Comercial | `PP-03`, `PP-09` |
| Um cliente trouxe uma solicitação ou problema | **JB-05 — Atendimento e resolução de solicitação** | Atendimento | `PP-07` |
| O caso precisa passar para outra pessoa ou área | **JB-06 — Escalonamento e handoff interno** | Operações | `PP-18` |
| É preciso organizar conteúdo comercial | **JB-07 — Planejamento de conteúdo comercial** | Marketing | `PP-08`, `PP-09` |
| É preciso estruturar uma campanha antes de qualquer publicação | **JB-08 — Planejamento de campanha sem publicação automática** | Marketing | `PP-08`, `PP-09` |
| Um processo recorrente precisa virar procedimento | **JB-09 — Criação e manutenção de SOP** | Operações | `PP-11` |
| Uma reunião precisa terminar com decisões e responsáveis | **JB-10 — Reunião com decisão e plano de ação** | Gestão | `PP-10`, `PP-17` |
| Conhecimento disperso precisa ser organizado e recuperável | **JB-11 — Base de conhecimento operacional** | Conhecimento | `PP-16` |
| É hora de revisar operação, pendências e próximos passos | **JB-12 — Revisão semanal operacional** | Gestão | `PP-04`, `PP-10`, `PP-17` |

## Mapa por área

### Comercial

- `JB-01` — entrada e triagem;
- `JB-02` — acompanhamento;
- `JB-03` — qualificação;
- `JB-04` — preparação de proposta.

Use essa sequência como um funil lógico, não como uma obrigação rígida. Se uma etapa não se aplica ao caso, registre o motivo e siga para a próxima etapa pertinente.

### Atendimento

- `JB-05` — entender, encaminhar e validar uma solicitação.

Quando o caso sair da alçada do responsável atual, conecte com `JB-06` para que o contexto não seja perdido.

### Operações

- `JB-06` — escalonamento e handoff;
- `JB-09` — criação e manutenção de SOP.

`JB-06` organiza passagem de contexto. `JB-09` transforma uma prática recorrente já compreendida em procedimento revisável.

### Marketing

- `JB-07` — planejamento de conteúdo;
- `JB-08` — planejamento de campanha.

Nenhum desses playbooks autoriza publicação automática, gasto de mídia ou uso de claims sem evidência.

### Gestão

- `JB-10` — reunião com decisão e plano de ação;
- `JB-12` — revisão semanal operacional.

O primeiro fecha uma conversa com decisões explícitas; o segundo cria um ciclo de acompanhamento e continuidade.

### Conhecimento

- `JB-11` — base de conhecimento operacional.

Use para estruturar informação que já existe. Não trate a IA como fonte de verdade quando a resposta depende de política, contrato, dado interno ou fato que precisa ser confirmado.

## Atalhos de combinação

### Lead novo → proposta

`JB-01` → `JB-03` → `JB-02` quando houver acompanhamento → `JB-04` quando as condições necessárias estiverem confirmadas.

### Solicitação → handoff → aprendizado operacional

`JB-05` → `JB-06` → `JB-09` quando o caso revelar um processo recorrente que mereça padronização.

### Conteúdo → campanha → revisão

`JB-07` → `JB-08` → `JB-12` para revisar execução e pendências. Publicação continua sendo uma ação separada e sujeita a autorização própria.

### Reunião → execução → base de conhecimento

`JB-10` → `JB-11` para registrar decisões relevantes e tornar o contexto recuperável para ciclos futuros.

## Regra de parada

Interrompa o fluxo e peça validação apropriada quando faltar uma condição essencial, por exemplo:

- preço, desconto, prazo ou condição comercial não confirmados;
- dado pessoal ou confidencial sem necessidade e autorização de uso;
- obrigação jurídica, fiscal, trabalhista ou contratual que exija especialista;
- ação externa irreversível;
- publicação, anúncio, envio em massa, compra ou contratação;
- informação factual que não pôde ser verificada.

## Checklist antes de concluir um playbook

- [ ] O objetivo real foi confirmado.
- [ ] As entradas usadas são suficientes e rastreáveis.
- [ ] Fatos, hipóteses e lacunas estão separados.
- [ ] Nenhuma condição comercial foi inventada.
- [ ] O prompt `PP-*` usado corresponde ao vínculo canônico do playbook.
- [ ] A saída foi revisada por uma pessoa quando necessário.
- [ ] O próximo passo tem responsável e critério de conclusão.
- [ ] Nada foi publicado, comprado, contratado ou enviado externamente sem autorização correspondente.

## Estado deste material

`candidate companion / editorial and visual QA pending`

Esta referência rápida é um componente candidato do JPN Business. Ela pode entrar como apêndice ou folha de consulta no produto final somente depois da revisão editorial e visual do mesmo conjunto de release.