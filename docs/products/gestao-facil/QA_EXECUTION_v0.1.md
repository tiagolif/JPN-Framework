# JPN Gestão Fácil — evidência de QA do binário v0.1

Status: `GF-QA-01 a GF-QA-09 executados; GF-QA-10 pendente`

Artefato testado: `deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx`

SHA-256 local do binário testado: `46b6fff3b366b2ac3467f443643c12e6aa8ba9958b8b54e0797ec91176c9dded`

Todos os dados usados abaixo são fictícios.

## Resultado

| Caso | Resultado | Evidência observada |
|---|---|---|
| GF-QA-01 | PASS | workbook vazio iniciou com todos os KPIs em zero |
| GF-QA-02 | PASS | 1 cliente cadastrado; ao mudar para Qualificado, clientes qualificados passou de 0 para 1 |
| GF-QA-03 | PASS | quantidade 3 × valor unitário 40 = valor total 120; etapa Aberta contou 1 e Ganha moveu a contagem corretamente |
| GF-QA-04 | PASS | tarefa Pendente contou 1; ao marcar Concluída voltou a 0 |
| GF-QA-05 | PASS | estoque 2/5 = REPOR; 6/5 = OK; 5/5 = REPOR |
| GF-QA-06 | PASS | entrada 500 e saída 180 = saldo registrado 320; nova saída 320 = saldo 0 |
| GF-QA-07 | PASS | venda sem quantidade/valor e estoque sem atual/mínimo mantiveram células calculadas vazias, sem erros |
| GF-QA-08 | PASS funcional | seleções controladas usadas em Clientes, Vendas, Tarefas e Financeiro sem sobrescrever fórmulas adjacentes |
| GF-QA-09 | PASS | inserção adicional em todas as áreas preservou fórmulas e Dashboard consistente |
| GF-QA-10 | PENDENTE | exige abertura do mesmo binário em Excel, LibreOffice Calc e Google Sheets |

## Varredura de erros

Após os casos GF-QA-01 a GF-QA-09, a varredura não encontrou ocorrências de:

- `#REF!`
- `#DIV/0!`
- `#VALUE!`
- `#NAME?`
- `#N/A`

## Estado de release

Esta evidência promove o XLSX de `pendente de versionamento` para `binário versionado com QA funcional local`.

Ainda **não** autoriza release externo. Permanecem obrigatórios:

1. GF-QA-10 de compatibilidade cruzada;
2. inspeção visual em pelo menos um aplicativo de planilha de desktop;
3. congelamento do manual correspondente;
4. hashes finais somente quando o pacote completo for congelado.

Nenhum dado financeiro real, credencial, conta externa, gasto, anúncio ou aceite legal foi usado neste QA.
