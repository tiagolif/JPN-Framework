# JPN Gestão Fácil — Starter Data Kit v0.1

Status: `candidate companion / human spreadsheet QA pending`

Este kit reduz a fricção do primeiro preenchimento da JPN Gestão Fácil sem alterar o arquivo XLSX candidato. Ele oferece modelos CSV simples, coerentes com o `DATA_MODEL_v0.2.md`, para preparar dados fictícios, sanitizados ou já revisados antes de copiá-los para as abas operacionais.

> Os CSVs são modelos de preparação de dados. Eles não comprovam importação automática pelo XLSX e não substituem o arquivo principal, o manual, o dicionário operacional ou o QA multiplataforma.

## 1. Conteúdo do kit

| ID | Arquivo | Aba de destino | Papel |
|---|---|---|---|
| GF-SD-01 | `starter-data/clientes.csv` | Clientes | CRM leve e próxima ação |
| GF-SD-02 | `starter-data/vendas.csv` | Vendas | oportunidades e vendas |
| GF-SD-03 | `starter-data/tarefas.csv` | Tarefas | execução e acompanhamento |
| GF-SD-04 | `starter-data/estoque.csv` | Estoque | controle operacional de itens |
| GF-SD-05 | `starter-data/financeiro.csv` | Financeiro | registros gerenciais de entrada/saída |

Todos os registros de exemplo são fictícios. Antes de substituir exemplos por dados reais, remova informações desnecessariamente sensíveis e mantenha somente o contexto operacional necessário.

## 2. Fluxo seguro de uso

1. Escolha somente o CSV da aba que precisa iniciar.
2. Preserve a linha de cabeçalho.
3. Substitua o exemplo fictício por registros revisados.
4. Mantenha IDs únicos e estáveis quando houver campo de ID.
5. Use os valores controlados do modelo de dados.
6. Não preencha manualmente campos calculados do XLSX.
7. Copie ou importe os dados apenas por um procedimento compatível com o aplicativo de planilha utilizado.
8. Revise o resultado na aba antes de considerar o preenchimento concluído.

Não assumir que Excel, LibreOffice Calc e Google Sheets tratam CSV, datas, acentos, separadores ou fórmulas da mesma forma. `GF-QA-10` continua pendente.

## 3. Regras por modelo

### GF-SD-01 — Clientes

Cabeçalhos: `ID`, `Nome/Empresa`, `Contato`, `Canal`, `Etapa`, `Responsável`, `Próxima ação`, `Data da próxima ação`, `Observações`.

Etapas canônicas: `Novo`, `Contato`, `Qualificado`, `Proposta`, `Cliente`, `Inativo`.

O campo Contato deve evitar dados sensíveis desnecessários. O exemplo usa apenas um contato fictício claramente marcado.

### GF-SD-02 — Vendas

Cabeçalhos: `ID`, `Data`, `Cliente`, `Produto/Serviço`, `Etapa`, `Responsável`, `Quantidade`, `Valor unitário`, `Próxima ação`, `Observações`.

O modelo CSV não inclui `Valor total`, pois no XLSX esse campo é calculado por fórmula. Não sobrescrever campos calculados.

Estados terminais previstos incluem `Ganha` e `Perdida`. Uma venda em estado terminal não deve permanecer tratada como venda aberta.

### GF-SD-03 — Tarefas

Cabeçalhos: `Tarefa`, `Categoria`, `Responsável`, `Prioridade`, `Status`, `Início`, `Prazo`, `Próximo passo`, `Observações`.

Prioridades canônicas: `Baixa`, `Média`, `Alta`. Status terminal canônico: `Concluída`.

### GF-SD-04 — Estoque

Cabeçalhos: `Código`, `Item`, `Categoria`, `Unidade`, `Estoque atual`, `Estoque mínimo`, `Fornecedor`, `Observações`.

O modelo CSV não inclui `Reposição?`, pois esse campo é calculado. No XLSX, `REPOR` é somente um alerta operacional e nunca autorização automática de compra.

### GF-SD-05 — Financeiro

Cabeçalhos: `ID`, `Data`, `Tipo`, `Descrição`, `Categoria`, `Centro/Projeto`, `Valor`, `Status`, `Vencimento`, `Observações`.

Tipos canônicos: `Entrada`, `Saída`.

Os valores presentes no CSV são totalmente fictícios e servem apenas para demonstrar estrutura. Não usar dados financeiros reais neste kit de exemplo. O indicador `Saldo registrado` é gerencial e não representa saldo bancário, lucro contábil, caixa auditado ou posição fiscal.

## 4. Política de datas e números

- Datas de exemplo usam `AAAA-MM-DD` para reduzir ambiguidade.
- Quantidade e valores usam ponto como separador decimal nos modelos CSV.
- Antes de copiar para o XLSX, confirme como o aplicativo em uso interpreta datas e separadores.
- Se o aplicativo converter um identificador em número, preserve-o como texto quando isso for necessário para manter o ID estável.

## 5. Checklist antes de usar dados preparados

- [ ] Cabeçalhos continuam intactos.
- [ ] IDs estão únicos e estáveis.
- [ ] Datas foram reconhecidas corretamente.
- [ ] Valores controlados seguem o modelo canônico.
- [ ] Nenhum campo calculado do XLSX será sobrescrito.
- [ ] Dados desnecessariamente sensíveis foram removidos.
- [ ] Dados financeiros reais não foram inseridos nos modelos de exemplo.
- [ ] `REPOR` continua entendido como alerta, não autorização de compra.
- [ ] O resultado será revisado manualmente após inserção.
- [ ] `GF-QA-10` permanece pendente até teste real em Microsoft Excel, LibreOffice Calc e Google Sheets.

## 6. O que este kit não faz

Este kit não:

- altera o XLSX candidato;
- cria importador automático;
- executa compra, pagamento, transferência ou decisão financeira;
- autoriza reposição de estoque;
- coleta senhas, tokens, cartões ou credenciais;
- comprova compatibilidade multiplataforma;
- publica arquivos ou anúncios;
- cria conta externa;
- aceita termos legais;
- transforma dados fictícios em evidência de desempenho.

## 7. Relação com os demais materiais

Use este kit junto de:

- `DATA_MODEL_v0.2.md` para estrutura canônica;
- `OPERATIONAL_DATA_DICTIONARY_v0.1.md` para regras de cada campo;
- `QUICK_START_v0.1.md` para início orientado;
- `MANUAL_v0.1.md` para operação geral;
- `QA_CASES_v0.1.md` e `QA_EXECUTION_v0.1.md` para validação;
- `deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx` como workbook candidato.

Estado preservado: o XLSX continua candidato, `GF-QA-10` continua pendente e nenhum release final é declarado por este documento.
