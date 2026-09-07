# JPN Gestão Fácil — Modelo de dados v0.2

Status: `fonte funcional para evolução do workbook`

Este documento define a estrutura canônica da JPN Gestão Fácil para pequenas empresas. Ele complementa o manual v0.1 e serve como referência para reconstrução, QA e futuras versões da planilha. Todos os exemplos devem usar dados fictícios. A planilha é operacional e não substitui sistemas contábeis, fiscais, jurídicos, bancários ou ERP.

## Princípios

1. Uma linha representa um registro operacional.
2. IDs são estáveis e não devem depender da posição da linha.
3. Campos calculados não devem ser sobrescritos manualmente.
4. Campos controlados usam listas de validação.
5. Linhas vazias não podem alterar KPIs.
6. Registros incompletos devem permanecer em estado seguro, sem erros de fórmula.
7. O Dashboard é derivado das abas operacionais; não é fonte de dados.

## Abas canônicas

| Aba | Papel | Escrita manual | Campos calculados |
|---|---|---:|---:|
| Leia-me | versão, instruções e limites | limitada | não |
| Dashboard | visão executiva | não | sim |
| Clientes | CRM leve | sim | não obrigatório |
| Vendas | oportunidades e vendas | sim | Valor total |
| Tarefas | execução e acompanhamento | sim | opcional |
| Estoque | controle operacional | sim | Reposição? |
| Financeiro | entradas/saídas gerenciais | sim | não obrigatório |
| Listas | valores para validação | sim, com cuidado | não |

## Clientes

Campos mínimos:

| Campo | Tipo lógico | Obrigatório | Regra |
|---|---|---:|---|
| ID | texto | sim para registro válido | único e estável |
| Nome/Empresa | texto | sim | não contar linha vazia |
| Contato | texto | não | evitar dados sensíveis desnecessários |
| Canal | lista | não | origem em Listas |
| Etapa | lista | sim | Novo, Contato, Qualificado, Proposta, Cliente ou Inativo |
| Responsável | texto/lista | não | livre na v0.2 |
| Próxima ação | texto | não | ação concreta |
| Data da próxima ação | data | não | data válida quando preenchida |
| Observações | texto | não | contexto operacional |

Regra de KPI: `clientes cadastrados` conta registros com Nome/Empresa preenchido; `clientes qualificados` conta registros válidos em etapa `Qualificado`.

## Vendas

| Campo | Tipo lógico | Obrigatório | Regra |
|---|---|---:|---|
| ID | texto | sim | único |
| Data | data | não | data operacional |
| Cliente | texto | sim para KPI confiável | preferir cliente já cadastrado |
| Produto/Serviço | texto | sim | descrição curta |
| Etapa | lista | sim | estado do funil |
| Responsável | texto/lista | não | responsável atual |
| Quantidade | número | não | >= 0 |
| Valor unitário | moeda/número | não | >= 0 |
| Valor total | fórmula | não editável | `Quantidade × Valor unitário`; vazio se insumos faltarem |
| Próxima ação | texto | não | continuidade |
| Observações | texto | não | contexto |

Estados terminais previstos: `Ganha` e `Perdida`. Uma venda `Ganha` não deve continuar em `vendas abertas`.

## Tarefas

Campos mínimos: Tarefa, Categoria, Responsável, Prioridade, Status, Início, Prazo, Próximo passo e Observações.

Status terminal canônico: `Concluída`. O KPI `tarefas pendentes` conta registros com Tarefa preenchida e Status diferente de `Concluída`.

Prioridades canônicas: `Baixa`, `Média`, `Alta`.

## Estoque

| Campo | Tipo lógico | Obrigatório | Regra |
|---|---|---:|---|
| Código | texto | sim | identificador do item |
| Item | texto | sim | descrição |
| Categoria | texto/lista | não | classificação |
| Unidade | texto/lista | não | ex.: un, cx, kg |
| Estoque atual | número | não | >= 0 |
| Estoque mínimo | número | não | >= 0 |
| Reposição? | fórmula | não editável | vazio se faltarem insumos; `REPOR` se atual <= mínimo; senão `OK` |
| Fornecedor | texto | não | referência operacional |
| Observações | texto | não | contexto |

O sinal `REPOR` é apenas alerta e nunca autoriza compra automática.

## Financeiro

Campos mínimos: ID, Data, Tipo, Descrição, Categoria, Centro/Projeto, Valor, Status, Vencimento e Observações.

Tipos canônicos: `Entrada`, `Saída`.

Saldo registrado: soma de Entradas menos soma de Saídas. Linhas sem Tipo ou Valor válido não devem distorcer o indicador. O resultado não deve ser descrito como saldo bancário, lucro contábil, caixa auditado ou posição fiscal.

## Listas controladas

A aba Listas deve concentrar, no mínimo:
- Canal de cliente;
- Etapa de cliente;
- Etapa de venda;
- Prioridade de tarefa;
- Status de tarefa;
- Tipo financeiro;
- Status financeiro;
- Unidade de estoque.

As listas devem ser expansíveis sem exigir edição de fórmulas do Dashboard.

## KPIs canônicos do Dashboard

1. Clientes cadastrados.
2. Clientes qualificados.
3. Vendas abertas.
4. Vendas ganhas.
5. Tarefas pendentes.
6. Itens para reposição.
7. Saldo registrado.

Cada KPI deve ignorar linhas estruturalmente vazias e nunca retornar erro quando a base estiver vazia.

## Regras de evolução v0.2+

- Novos campos só entram quando tiverem finalidade operacional clara.
- Nenhum campo de senha, token, cartão completo ou credencial deve ser criado.
- Automação futura deve respeitar a mesma semântica de status e IDs.
- Qualquer mudança de nomes de abas, colunas ou valores controlados exige atualização conjunta do manual, casos de QA e gate de release.
