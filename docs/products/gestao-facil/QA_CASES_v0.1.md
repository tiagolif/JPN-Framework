# JPN Gestão Fácil — Casos de QA v0.1

Status: `roteiro executável; execução binária pendente`

Este documento transforma os gates do QA em casos reproduzíveis. Todos os dados abaixo são fictícios e servem apenas para validar fórmulas, contagens e continuidade operacional.

## Regras do teste

- usar uma cópia limpa da edição reconstruída v0.1;
- não inserir dados pessoais, comerciais ou financeiros reais;
- registrar resultado observado antes de corrigir qualquer falha;
- após cada caso, confirmar que não surgiram `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?` ou `#N/A`;
- a aprovação final depende de execução no XLSX congelado, não apenas desta especificação.

## GF-QA-01 — Estado inicial vazio

**Objetivo:** confirmar que linhas vazias não alteram os KPIs.

**Pré-condição:** workbook novo, sem registros.

**Esperado:**
- clientes cadastrados = 0;
- clientes qualificados = 0;
- vendas abertas = 0;
- vendas ganhas = 0;
- tarefas pendentes = 0;
- itens para reposição = 0;
- saldo registrado = 0.

## GF-QA-02 — Cliente e qualificação

Cadastrar:
- ID: `CLI-001`;
- Nome/Empresa: `Empresa Exemplo A`;
- Canal: `WhatsApp`;
- Etapa inicial: `Novo`;
- Responsável: `Pessoa A`;
- Próxima ação: `Retornar contato`.

**Esperado após cadastro:** clientes cadastrados = 1.

Alterar etapa para `Qualificado`.

**Esperado após alteração:**
- clientes cadastrados = 1;
- clientes qualificados = 1.

Adicionar linhas vazias abaixo não deve mudar as contagens.

## GF-QA-03 — Venda e cálculo de total

Cadastrar uma venda fictícia:
- ID: `VEN-001`;
- Cliente: `Empresa Exemplo A`;
- Produto/Serviço: `Serviço Exemplo`;
- Etapa: `Aberta`;
- Quantidade: 3;
- Valor unitário: 40.

**Esperado:** valor total = 120 e a venda deve entrar na contagem de vendas abertas conforme a regra definida no workbook.

Alterar a etapa para `Ganha`.

**Esperado:**
- vendas ganhas aumenta em 1;
- a venda deixa de ser considerada aberta caso a implementação trate `Ganha` como etapa terminal;
- valor total permanece 120.

## GF-QA-04 — Tarefa pendente e concluída

Cadastrar:
- Tarefa: `Enviar resumo fictício`;
- Prioridade: `Média`;
- Status: um status não terminal previsto na lista;
- Responsável: `Pessoa A`.

**Esperado:** tarefas pendentes aumenta em 1.

Alterar para o status terminal de conclusão definido na planilha.

**Esperado:** tarefas pendentes retorna ao valor anterior sem necessidade de apagar a linha.

## GF-QA-05 — Estoque e reposição

Cadastrar item fictício:
- Código: `EST-001`;
- Item: `Item Exemplo`;
- Estoque atual: 2;
- Estoque mínimo: 5.

**Esperado:** `Reposição? = REPOR` e Dashboard soma 1 item para reposição.

Alterar estoque atual para 6.

**Esperado:** `Reposição? = OK` e o item sai da contagem de reposição.

Testar também estoque atual = 5.

**Esperado pela especificação v0.1:** `REPOR`, porque a regra usa menor ou igual ao mínimo.

## GF-QA-06 — Entradas, saídas e saldo registrado

Inserir dois lançamentos fictícios:
- `FIN-001`, Tipo `Entrada`, Valor 500;
- `FIN-002`, Tipo `Saída`, Valor 180.

**Esperado:** saldo registrado = 320.

Adicionar uma saída de 320.

**Esperado:** saldo registrado = 0.

O resultado não deve ser rotulado como saldo bancário, lucro contábil ou informação fiscal.

## GF-QA-07 — Campos incompletos e estabilidade

Criar registros parciais sem quantidade/valor em Vendas e sem estoque atual/mínimo em Estoque.

**Esperado:**
- fórmulas não geram erro;
- células calculadas ficam vazias ou em estado seguro conforme implementação;
- KPIs não contam registros incompletos de forma enganosa.

## GF-QA-08 — Validações de listas

Em Clientes, Vendas, Tarefas e Financeiro:
- abrir os menus de validação;
- selecionar opções existentes;
- confirmar que a seleção é gravada sem substituir fórmula adjacente.

**Esperado:** validações usam a aba Listas e não exigem digitação livre para campos controlados.

## GF-QA-09 — Integridade após edição comum

Executar em uma cópia:
1. adicionar 5 clientes;
2. adicionar 5 vendas;
3. adicionar 5 tarefas;
4. adicionar 5 itens de estoque;
5. adicionar 5 lançamentos financeiros fictícios;
6. ordenar ou filtrar uma tabela, se disponível.

**Esperado:** fórmulas e referências continuam associadas às linhas corretas e o Dashboard permanece consistente.

## GF-QA-10 — Compatibilidade cruzada

Executar no mesmo binário congelado, quando os ambientes estiverem disponíveis:
- Microsoft Excel;
- LibreOffice Calc;
- Google Sheets, por importação de uma cópia.

Validar:
- abertura sem reparo do arquivo;
- fórmulas principais;
- validações;
- formatos de data e moeda;
- legibilidade visual;
- ausência de perda estrutural crítica.

Diferenças apenas cosméticas devem ser registradas separadamente de falhas funcionais.

## Matriz de resultado

| Caso | Estado atual | Gate |
|---|---|---|
| GF-QA-01 | Parcialmente verificado na geração anterior: KPIs vazios corrigidos | revalidar no binário congelado |
| GF-QA-02 | Pendente de execução no binário | obrigatório |
| GF-QA-03 | Pendente de execução no binário | obrigatório |
| GF-QA-04 | Pendente de execução no binário | obrigatório |
| GF-QA-05 | Pendente de execução no binário | obrigatório |
| GF-QA-06 | Pendente de execução no binário | obrigatório |
| GF-QA-07 | Pendente de execução no binário | obrigatório |
| GF-QA-08 | Pendente de execução no binário | obrigatório |
| GF-QA-09 | Pendente de execução no binário | obrigatório |
| GF-QA-10 | Pendente de ambientes/binário congelado | obrigatório antes de release-candidate externo |

## Critério de aprovação

A Gestão Fácil só pode ser promovida quando:
- GF-QA-01 a GF-QA-09 passarem no binário final;
- compatibilidade mínima for registrada em GF-QA-10;
- nenhum erro crítico de fórmula permanecer;
- o manual corresponder exatamente à versão congelada;
- o XLSX for versionado e referenciado no manifesto do Pro Kit.
