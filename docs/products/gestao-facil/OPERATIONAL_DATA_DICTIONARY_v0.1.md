# JPN Gestão Fácil — Dicionário operacional de dados v0.1

Status: `candidate companion / human spreadsheet QA pending`

Este documento transforma o `DATA_MODEL_v0.2.md` em uma referência prática de preenchimento para pequenas empresas. Ele complementa `MANUAL_v0.1.md`, `QUICK_START_v0.1.md` e `OPERATING_RHYTHM_v0.2.md`; não substitui o XLSX candidato nem comprova compatibilidade final entre Microsoft Excel, LibreOffice Calc e Google Sheets.

Todos os exemplos abaixo são fictícios. Não use senhas, tokens, credenciais, números completos de cartão, dados bancários sensíveis ou dados financeiros reais em testes e documentação.

## Como usar este dicionário

Antes de inserir ou corrigir um registro:

1. identifique a aba correta;
2. confirme se o campo é manual, controlado ou calculado;
3. preencha somente o contexto necessário;
4. não sobrescreva fórmulas ou KPIs;
5. mantenha IDs estáveis;
6. quando faltar informação, deixe o campo vazio ou registre a pendência em vez de inventar um valor;
7. revise o Dashboard apenas como saída derivada.

Regra de parada: se o preenchimento exigir credencial, dado sensível, decisão financeira real, compra, contratação, publicação ou informação não confirmada, interrompa e peça revisão humana apropriada.

## Tipos de campo

| Tipo | Significado | Regra operacional |
|---|---|---|
| Manual | digitado pelo usuário | preencher somente com informação conhecida |
| Lista controlada | selecionado a partir da aba Listas | não criar variações de grafia fora da lista |
| Calculado | fórmula/indicador | não editar manualmente |
| Opcional | pode ficar vazio | vazio é preferível a dado inventado |
| Identificador | chave estável | não reutilizar para outro registro |

## Aba Leia-me

Papel: orientar uso, versão, limites e estado do arquivo.

| Campo/conteúdo | Tipo | Preenchimento correto | Evitar |
|---|---|---|---|
| Versão | informativo | manter a versão distribuída com o arquivo | alterar para sugerir release não aprovado |
| Instruções | informativo | seguir como referência de uso | tratar como autorização para ações externas |
| Limites | informativo | preservar avisos de uso | remover ressalvas de QA |

A aba Leia-me não é fonte de KPI.

## Aba Dashboard

Papel: apresentar indicadores derivados das abas operacionais.

Regra central: **não digite sobre o Dashboard para corrigir um número**. Corrija a origem do dado na aba correspondente.

### KPIs canônicos

| KPI | Fonte principal | Regra resumida | Não significa |
|---|---|---|---|
| Clientes cadastrados | Clientes | conta registros com Nome/Empresa preenchido | base comercial validada externamente |
| Clientes qualificados | Clientes | conta registros válidos em etapa `Qualificado` | probabilidade garantida de venda |
| Vendas abertas | Vendas | oportunidades não terminais | receita futura garantida |
| Vendas ganhas | Vendas | registros em etapa `Ganha` | faturamento contábil/auditado |
| Tarefas pendentes | Tarefas | Tarefa preenchida e Status diferente de `Concluída` | obrigação jurídica ou SLA externo |
| Itens para reposição | Estoque | itens cujo cálculo retorna `REPOR` | autorização de compra |
| Saldo registrado | Financeiro | Entradas − Saídas registradas | saldo bancário, lucro contábil ou posição fiscal |

Linhas estruturalmente vazias devem ser ignoradas e base vazia não deve produzir erro.

## Aba Clientes

Uma linha representa um cliente ou empresa no CRM leve.

| Campo | Tipo | Obrigatório | Exemplo fictício | Regra de qualidade |
|---|---|---:|---|---|
| ID | Identificador | sim para registro válido | CLI-001 | único, estável e nunca reciclado |
| Nome/Empresa | Manual | sim | Loja Exemplo | não usar linha sem nome como cliente válido |
| Contato | Manual | não | contato de teste | registrar somente o necessário |
| Canal | Lista controlada | não | WhatsApp | usar valor existente em Listas |
| Etapa | Lista controlada | sim | Qualificado | usar estado canônico |
| Responsável | Manual/lista | não | Pessoa A | manter responsável atual |
| Próxima ação | Manual | não | Retornar proposta | escrever ação concreta |
| Data da próxima ação | Data | não | 15/09/2026 | usar data válida quando preenchida |
| Observações | Manual | não | Prefere contato à tarde | evitar dados sensíveis desnecessários |

Etapas canônicas: `Novo`, `Contato`, `Qualificado`, `Proposta`, `Cliente`, `Inativo`.

## Aba Vendas

Uma linha representa uma oportunidade ou venda acompanhada.

| Campo | Tipo | Obrigatório | Exemplo fictício | Regra de qualidade |
|---|---|---:|---|---|
| ID | Identificador | sim | VEN-001 | único e estável |
| Data | Data | não | 10/09/2026 | data operacional válida |
| Cliente | Manual/referência | sim para KPI confiável | Loja Exemplo | preferir cliente já cadastrado |
| Produto/Serviço | Manual | sim | Serviço exemplo | descrição curta e objetiva |
| Etapa | Lista controlada | sim | Proposta | usar valor canônico |
| Responsável | Manual/lista | não | Pessoa A | registrar dono atual |
| Quantidade | Número | não | 2 | aceitar somente valor >= 0 |
| Valor unitário | Número/moeda | não | 50,00 fictício | em QA usar somente valor demonstrativo |
| Valor total | Calculado | não editável | 100,00 fictício | `Quantidade × Valor unitário`; vazio se faltar insumo |
| Próxima ação | Manual | não | Confirmar decisão | ação concreta |
| Observações | Manual | não | exemplo de teste | não registrar condição não confirmada como fato |

Estados terminais previstos: `Ganha` e `Perdida`. Uma venda `Ganha` não deve permanecer em vendas abertas.

## Aba Tarefas

Uma linha representa uma atividade operacional.

| Campo | Tipo | Obrigatório | Exemplo fictício | Regra de qualidade |
|---|---|---:|---|---|
| Tarefa | Manual | sim para registro válido | Revisar proposta | usar verbo + objeto |
| Categoria | Manual/lista | não | Comercial | classificação simples |
| Responsável | Manual/lista | não | Pessoa A | indicar quem acompanha |
| Prioridade | Lista controlada | não | Alta | usar `Baixa`, `Média` ou `Alta` |
| Status | Lista controlada | sim para rotina | Em andamento | `Concluída` é o status terminal canônico |
| Início | Data | não | 10/09/2026 | data válida |
| Prazo | Data | não | 12/09/2026 | data válida quando houver compromisso interno |
| Próximo passo | Manual | não | Enviar rascunho para revisão | ação concreta |
| Observações | Manual | não | exemplo fictício | registrar contexto, não credenciais |

KPI: `Tarefas pendentes` conta registros com Tarefa preenchida e Status diferente de `Concluída`.

## Aba Estoque

Uma linha representa um item controlado operacionalmente.

| Campo | Tipo | Obrigatório | Exemplo fictício | Regra de qualidade |
|---|---|---:|---|---|
| Código | Identificador | sim | EST-001 | único por item |
| Item | Manual | sim | Produto exemplo | descrição reconhecível |
| Categoria | Manual/lista | não | Categoria A | padronizar quando possível |
| Unidade | Lista controlada | não | un | usar valor da aba Listas |
| Estoque atual | Número | não | 4 | aceitar somente valor >= 0 |
| Estoque mínimo | Número | não | 5 | aceitar somente valor >= 0 |
| Reposição? | Calculado | não editável | REPOR | vazio sem insumos; `REPOR` se atual <= mínimo; senão `OK` |
| Fornecedor | Manual | não | Fornecedor exemplo | referência operacional, sem criar pedido automático |
| Observações | Manual | não | Conferir contagem física | contexto útil |

`REPOR` é somente alerta operacional. Não autoriza compra, pedido a fornecedor, gasto ou contratação.

## Aba Financeiro

Uma linha representa um lançamento gerencial simples. Esta aba não substitui contabilidade, banco, fluxo de caixa auditado, ERP ou obrigação fiscal.

| Campo | Tipo | Obrigatório | Exemplo fictício | Regra de qualidade |
|---|---|---:|---|---|
| ID | Identificador | sim | FIN-001 | único e estável |
| Data | Data | não | 10/09/2026 | data válida |
| Tipo | Lista controlada | sim para cálculo | Entrada | somente `Entrada` ou `Saída` |
| Descrição | Manual | sim para registro útil | Lançamento fictício | descrição curta |
| Categoria | Manual/lista | não | Demonstração | padronizar quando possível |
| Centro/Projeto | Manual/lista | não | Projeto teste | referência gerencial |
| Valor | Número/moeda | sim para cálculo | 100,00 fictício | em QA usar valor demonstrativo, nunca dado financeiro real |
| Status | Lista controlada | não | Previsto | usar lista canônica do arquivo |
| Vencimento | Data | não | 20/09/2026 | data válida |
| Observações | Manual | não | registro de teste | evitar dados bancários sensíveis |

Tipos canônicos: `Entrada`, `Saída`.

Saldo registrado = `Entradas − Saídas`. O indicador não representa saldo bancário, lucro contábil, caixa auditado ou posição fiscal.

## Aba Listas

Papel: concentrar valores de validação usados pelas abas operacionais.

Listas mínimas:

- Canal de cliente;
- Etapa de cliente;
- Etapa de venda;
- Prioridade de tarefa;
- Status de tarefa;
- Tipo financeiro;
- Status financeiro;
- Unidade de estoque.

Ao expandir uma lista, preserve os valores canônicos existentes e valide se fórmulas/validações continuam funcionando. Não renomeie um valor controlado apenas por preferência visual sem revisar impactos.

## Regras para IDs

Use um identificador legível e estável. Exemplos fictícios: `CLI-001`, `VEN-001`, `EST-001`, `FIN-001`.

Regras:

- não dependa do número da linha;
- não reutilize ID de registro excluído para outro objeto;
- não troque o ID quando mudar etapa, responsável ou status;
- antes de importar dados, procure duplicidades;
- se houver conflito, pare e resolva manualmente antes de consolidar.

## Regras para datas e números

- datas devem ser datas válidas, não texto ambíguo;
- números operacionais devem respeitar os limites definidos no modelo;
- Quantidade, Valor unitário, Estoque atual e Estoque mínimo não devem ser negativos;
- campo calculado vazio por falta de insumo é preferível a erro ou valor inventado;
- em QA e demonstrações, qualquer valor monetário deve ser explicitamente fictício.

## Erros comuns de preenchimento

| Erro | Efeito provável | Correção segura |
|---|---|---|
| criar nova grafia para um status | quebra filtros e contagens | selecionar valor da aba Listas |
| editar Valor total | divergência entre fórmula e origem | restaurar fórmula e corrigir Quantidade/Valor unitário |
| editar Reposição? | mascara condição de estoque | corrigir Estoque atual/Estoque mínimo |
| digitar KPI no Dashboard | mascara problema da base | corrigir a aba operacional de origem |
| reutilizar ID | mistura registros diferentes | criar novo ID único |
| inventar informação ausente | degrada rastreabilidade | deixar vazio ou registrar pendência |
| tratar `REPOR` como ordem de compra | cria ação não autorizada | submeter decisão a revisão humana |

## Checklist antes de salvar

- [ ] Usei a aba correta.
- [ ] Não alterei campo calculado.
- [ ] Mantive IDs únicos e estáveis.
- [ ] Usei valores da aba Listas quando o campo é controlado.
- [ ] Não inventei dado ausente.
- [ ] Não inseri senha, token, credencial, cartão completo ou dado bancário sensível.
- [ ] Em QA, usei somente dados e valores fictícios.
- [ ] `REPOR` foi tratado apenas como alerta.
- [ ] Corrigi a fonte, não o Dashboard.
- [ ] Se houver dúvida material, deixei pendente para revisão humana.

## Estado de QA

Este dicionário é um `candidate companion / human spreadsheet QA pending`.

GF-QA-10 continua pendente. A compatibilidade do mesmo XLSX candidato entre Microsoft Excel, LibreOffice Calc e Google Sheets só pode ser marcada como aprovada após evidência de execução real nos três ambientes e registro coerente no gate de QA.

A existência deste documento não altera o estado do binário, não promove release, não autoriza publicação e não substitui inspeção humana das fórmulas, validações, formatação e comportamento do Dashboard.
