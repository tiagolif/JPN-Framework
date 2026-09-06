# JPN Gestão Fácil — edição reconstruída v0.1

Status: `draft controlado`

> Esta edição é uma reconstrução nova. Ela **não** é apresentada como o XLSX original produzido anteriormente, que continua não localizado.

## Objetivo

Criar uma base simples de gestão para pequenas empresas que organize clientes, vendas, tarefas, estoque e registros financeiros em um único arquivo, mantendo o Dashboard como visão resumida.

## Estrutura do workbook

### Dashboard
Indicadores calculados automaticamente:
- clientes cadastrados;
- clientes qualificados;
- vendas abertas;
- vendas ganhas;
- tarefas pendentes;
- itens que precisam de reposição;
- saldo registrado.

O arquivo vazio inicia os indicadores em zero.

### Clientes
Campos: ID, nome/empresa, contato, canal, etapa, responsável, próxima ação, data da próxima ação, observações e atualização.

Etapas controladas: Novo, Contato, Qualificado, Proposta, Cliente e Inativo.

### Vendas
Campos: ID, data, cliente, produto/serviço, etapa, responsável, quantidade, valor unitário, valor total, próxima ação e observações.

`Valor total` é calculado pela planilha a partir de quantidade × valor unitário.

### Tarefas
Campos: ID, tarefa, categoria, responsável, prioridade, status, início, prazo, próximo passo e observações.

Possui listas controladas de prioridade, status e categoria.

### Estoque
Campos: código, item, categoria, unidade, estoque atual, estoque mínimo, reposição, fornecedor e observações.

`Reposição?` é calculado automaticamente e sinaliza `REPOR` quando o estoque atual é menor ou igual ao mínimo informado.

### Financeiro
Campos: ID, data, tipo, descrição, categoria, centro/projeto, valor, status, vencimento e observações.

O Dashboard calcula saldo registrado como Entradas − Saídas. Nenhum dado financeiro real foi incluído na edição-base.

### Listas
Aba técnica usada pelas validações de dados. Centraliza status, prioridades, etapas e categorias para reduzir digitação inconsistente.

## Regras de produto

1. Nenhum dado real de cliente, venda ou financeiro acompanha o arquivo-base.
2. A planilha é ferramenta organizacional e não substitui orientação contábil, fiscal ou jurídica.
3. Fórmulas devem permanecer derivadas de células, sem valores empresariais reais embutidos.
4. Novas versões devem preservar a identificação `reconstruída` até que o artefato original seja recuperado ou a equipe decida substituir oficialmente a edição histórica.
5. O arquivo deve passar por QA de fórmulas e inspeção visual antes de qualquer release.

## Identidade visual

A edição utiliza a identidade JPN definida em `docs/brand/BRAND_KIT_v1.md`, com base escura e accent turquesa para cabeçalhos e destaques.

## Próximos gates

- versionar o XLSX binário no pacote final;
- executar QA com casos fictícios de ponta a ponta;
- revisar impressão e uso em Excel/LibreOffice/Google Sheets sem depender de recursos proprietários críticos;
- produzir manual curto ilustrado;
- integrar o arquivo e manual ao manifesto do JPN Pro Kit após congelamento.
