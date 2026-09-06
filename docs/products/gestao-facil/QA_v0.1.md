# QA — JPN Gestão Fácil reconstruída v0.1

Status: `draft QA`

## Escopo desta rodada

A edição foi criada como workbook novo, sem importar dados financeiros, comerciais ou pessoais reais.

## Verificações executadas

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

### Correção realizada nesta rodada

A primeira fórmula de `Clientes cadastrados` contava linhas pré-formatadas vazias como preenchidas. Foi substituída por uma contagem que exige pelo menos um caractere no campo Nome/Empresa. Depois da correção, um workbook vazio apresenta `0` clientes cadastrados.

### Scan de erros

Foi executada busca por:
- `#REF!`
- `#DIV/0!`
- `#VALUE!`
- `#NAME?`
- `#N/A`

Resultado desta rodada: nenhum erro encontrado nas fórmulas inspecionadas.

## Casos fictícios ainda necessários antes de release-candidate

1. cadastrar um cliente e avançá-lo de Novo para Qualificado;
2. criar uma venda e validar cálculo de valor total;
3. alterar a venda para Ganha e confirmar atualização do Dashboard;
4. criar tarefa em andamento e depois concluí-la;
5. cadastrar item abaixo do estoque mínimo e confirmar sinalização `REPOR`;
6. inserir Entrada e Saída fictícias e confirmar saldo;
7. confirmar que linhas vazias não alteram KPIs;
8. abrir uma cópia em ambientes compatíveis para verificar apresentação e fórmulas.

## Critério de promoção

A edição só deve avançar de `draft controlado` para `release-candidate` depois que todos os casos acima passarem e o arquivo binário final estiver congelado e versionado junto do manual correspondente.
