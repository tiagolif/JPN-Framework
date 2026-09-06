# QA — JPN Gestão Fácil reconstruída v0.1

Status: `draft QA`

## Escopo

A edição foi criada como workbook novo, sem importar dados financeiros, comerciais ou pessoais reais.

## Verificações executadas na geração inicial

### Estrutura
- workbook criado com abas Dashboard, Clientes, Vendas, Tarefas, Estoque, Financeiro, Listas e Leia-me;
- cabeçalhos e áreas de uso formatados;
- tabelas preparadas para expansão controlada;
- datas e valores monetários recebem formatação adequada;
- listas de apoio alimentam validações de dados.

### Fórmulas
- Vendas: `Valor total = Quantidade × Valor unitário` quando ambos os campos estão preenchidos;
- Estoque: `Reposição?` retorna `REPOR` quando estoque atual <= estoque mínimo, e `OK` nos demais casos preenchidos;
- Dashboard: contagem de clientes, qualificados, vendas abertas/ganhas, tarefas pendentes e itens para repor;
- Dashboard: saldo = soma de Entradas − soma de Saídas.

### Correção realizada

A primeira fórmula de `Clientes cadastrados` contava linhas pré-formatadas vazias como preenchidas. Foi substituída por uma contagem que exige pelo menos um caractere no campo Nome/Empresa. Depois da correção, um workbook vazio apresenta `0` clientes cadastrados.

### Scan de erros

Foi executada busca por:
- `#REF!`
- `#DIV/0!`
- `#VALUE!`
- `#NAME?`
- `#N/A`

Resultado da geração inicial: nenhum erro encontrado nas fórmulas inspecionadas.

## Casos reproduzíveis

Os testes funcionais agora estão especificados em `QA_CASES_v0.1.md`, com IDs `GF-QA-01` a `GF-QA-10`. O roteiro cobre:
- estado inicial vazio;
- cliente e qualificação;
- venda e cálculo de total;
- tarefa pendente/concluída;
- estoque e reposição;
- entradas, saídas e saldo registrado;
- campos incompletos;
- validações de listas;
- integridade após edição comum;
- compatibilidade Excel, LibreOffice Calc e Google Sheets.

A existência do roteiro não equivale à aprovação. Os casos devem ser executados novamente no XLSX final congelado.

## Artefatos de QA vinculados

- `REBUILD_v0.1.md`: especificação da reconstrução;
- `QA_CASES_v0.1.md`: casos reproduzíveis;
- `MANUAL_v0.1.md`: comportamento esperado para o usuário.

## Critério de promoção

A edição só deve avançar de `draft controlado` para `release-candidate` depois que:
1. `GF-QA-01` a `GF-QA-09` passarem no binário final;
2. a compatibilidade mínima de `GF-QA-10` estiver registrada;
3. o arquivo binário final estiver congelado e versionado;
4. o manual corresponder à mesma versão do workbook;
5. o manifesto do Pro Kit apontar para os artefatos reais, sem hashes inventados.
