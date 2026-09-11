# JPN Gestão Fácil — Guia operacional para pequenas empresas v1

Status: `candidate operating guide / cross-app QA pending`

## Objetivo

Transformar a estrutura da Gestão Fácil v0.2 em uma rotina simples de uso diário e semanal para pequenas empresas, sem substituir ERP, contabilidade, sistema fiscal, banco ou revisão humana.

Este guia usa somente a estrutura canônica de oito abas definida em `DATA_MODEL_v0.2.md` e não altera `GF-QA-10`, que permanece pendente até teste físico em Excel, LibreOffice Calc e Google Sheets.

## Princípio de uso

A planilha funciona melhor quando cada informação tem uma única origem operacional:

- `Clientes`: relacionamento e próxima ação;
- `Vendas`: oportunidades, pedidos e andamento comercial;
- `Tarefas`: execução e pendências;
- `Estoque`: quantidade operacional e alerta de reposição;
- `Financeiro`: registro gerencial de entradas e saídas;
- `Dashboard`: leitura, nunca origem de dados;
- `Listas`: valores controlados;
- `Leia-me`: instruções, versão e limites.

## Rotina diária — 10 a 15 minutos

### 1. Atualizar Clientes

Para cada contato trabalhado no dia:

1. confirme `Nome/Empresa`;
2. ajuste a `Etapa` somente quando houver evidência operacional;
3. registre uma `Próxima ação` concreta;
4. quando fizer sentido, preencha `Data da próxima ação`;
5. use `Observações` apenas para contexto necessário.

Evite senhas, tokens, números completos de cartão, documentos desnecessários ou outras credenciais.

### 2. Atualizar Vendas

Para cada venda ou oportunidade movimentada:

1. confirme o cliente;
2. atualize a etapa do funil;
3. confira produto/serviço e quantidade;
4. informe valor unitário somente quando esse dado fizer parte do uso real da empresa;
5. não sobrescreva manualmente `Valor total`;
6. registre a próxima ação.

`Ganha` e `Perdida` são estados terminais. Uma venda ganha não deve continuar sendo tratada como venda aberta.

### 3. Revisar Tarefas

Priorize tarefas com status diferente de `Concluída`.

Use as prioridades canônicas:

- `Alta`: precisa de atenção primeiro;
- `Média`: importante, mas pode seguir a fila normal;
- `Baixa`: pode aguardar sem comprometer a rotina atual.

Cada tarefa ativa deve, sempre que possível, ter um próximo passo claro.

### 4. Conferir Estoque

Atualize `Estoque atual` quando houver movimentação operacional relevante.

A coluna `Reposição?` é calculada. `REPOR` significa apenas que o estoque atual está menor ou igual ao mínimo configurado. **REPOR é somente alerta operacional e nunca autoriza compra automática.**

### 5. Registrar Financeiro gerencial

Registre somente informações necessárias para a visão gerencial da planilha. O campo `Tipo` usa `Entrada` ou `Saída`.

O saldo registrado é uma visão operacional baseada no que foi preenchido. Ele não deve ser descrito como saldo bancário, lucro contábil, caixa auditado ou posição fiscal e não substitui contabilidade.

## Rotina semanal — 20 a 30 minutos

Uma vez por semana:

1. abra o `Dashboard` e procure mudanças que exigem ação;
2. revise clientes sem próxima ação;
3. revise vendas abertas que não tiveram avanço;
4. confira tarefas vencidas ou sem responsável;
5. analise itens marcados como `REPOR` antes de qualquer decisão externa;
6. confira se entradas e saídas gerenciais foram registradas de forma coerente;
7. corrija registros incompletos na aba de origem, nunca diretamente no Dashboard.

## Roteiro de decisão do Dashboard

O Dashboard responde a perguntas operacionais, não contábeis:

| Indicador | Pergunta útil | Próxima ação segura |
|---|---|---|
| Clientes cadastrados | A base está sendo mantida? | revisar novos contatos sem etapa |
| Clientes qualificados | Existem oportunidades com contexto suficiente? | definir próxima ação comercial |
| Vendas abertas | Há negociações que precisam de acompanhamento? | revisar etapa e próxima ação |
| Vendas ganhas | Quantas vendas chegaram ao estado terminal ganho? | conferir execução e tarefas relacionadas |
| Tarefas pendentes | O que ainda precisa ser executado? | priorizar por prazo e prioridade |
| Itens para reposição | Quais itens atingiram o mínimo configurado? | conferir necessidade real antes de comprar |
| Saldo registrado | O que foi registrado como entradas menos saídas? | conferir origem dos registros; não tratar como saldo bancário |

## Cenário de treinamento fictício

Use este cenário apenas para aprender o fluxo, nunca como dado comercial real.

### Segunda-feira

- cadastrar um cliente fictício `Empresa Exemplo A` em `Clientes`;
- definir etapa `Novo`;
- criar próxima ação `Fazer contato inicial`;
- criar uma venda fictícia ligada ao mesmo cliente;
- adicionar uma tarefa `Preparar proposta de exemplo`.

### Quarta-feira

- atualizar o cliente fictício para `Qualificado` se o cenário de treinamento justificar;
- mover a venda fictícia para uma etapa intermediária disponível em `Listas`;
- concluir a tarefa anterior e criar o próximo passo.

### Sexta-feira

- encerrar a venda fictícia como `Ganha` ou `Perdida`;
- revisar se o Dashboard reagiu conforme o modelo canônico;
- apagar ou manter os dados fictícios conforme a finalidade do arquivo de treinamento.

## Regras de qualidade de cadastro

- uma linha representa um registro;
- IDs devem permanecer estáveis;
- não reutilize o mesmo ID para registros diferentes;
- não sobrescreva campos calculados;
- não invente valores apenas para preencher células;
- se uma informação não é conhecida, deixe-a vazia ou registre contexto apropriado;
- dados fictícios e dados reais não devem ser misturados em arquivos usados para demonstração pública.

## Sinais de problema

Interrompa a edição e registre evidência antes de continuar se ocorrer qualquer um destes casos:

- `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?` ou `#N/A` em fórmulas esperadas;
- listas suspensas deixarem de funcionar;
- fórmula de `Valor total` for substituída por valor manual;
- `Reposição?` não reagir às quantidades;
- Dashboard não acompanhar as abas de origem;
- datas ou números forem reinterpretados ao abrir em outro aplicativo;
- tabela, gráfico ou formatação ficar estruturalmente quebrada.

Esses eventos devem alimentar o QA multiplataforma, não ser corrigidos silenciosamente no arquivo final.

## Limites

- a planilha não autoriza compras, pagamentos, cobranças ou movimentações bancárias;
- não substitui contabilidade, ERP, sistema fiscal, jurídico ou auditoria;
- não exige dados financeiros reais para demonstração ou QA;
- não armazene credenciais ou segredos;
- compatibilidade em Excel, LibreOffice Calc e Google Sheets continua não comprovada até evidência física;
- `GF-QA-10` continua `PENDING`;
- este guia não implica `release_ready=true`.
