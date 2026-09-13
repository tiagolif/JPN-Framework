# JPN Gestão Fácil — Kit de importação v0.3

Status: `candidate companion / cross-app QA pending`

Este kit ajuda uma pequena empresa a preparar dados para a candidata **JPN Gestão Fácil v0.3** sem alterar fórmulas do arquivo principal e sem tratar importação como integração automática.

## O que este kit contém

- `clientes.csv`
- `vendas.csv`
- `tarefas.csv`
- `estoque.csv`
- `financeiro.csv`

Os cabeçalhos seguem `WORKBOOK_SPEC_v0.3.json`. Os arquivos são modelos de preparação: antes de colar ou importar qualquer conteúdo no XLSX, faça uma cópia de trabalho e confirme o comportamento no aplicativo usado.

## Regras de segurança

1. Use UTF-8 e separador vírgula ao editar estes modelos.
2. Preserve os nomes e a ordem das colunas.
3. Não inclua senhas, tokens, chaves, números completos de cartão ou credenciais.
4. Para treinamento e QA, prefira dados fictícios.
5. Não use `REPOR` como autorização de compra; é apenas alerta operacional.
6. O módulo Financeiro é gerencial e não substitui contabilidade, banco, fiscal ou auditoria.
7. O mesmo XLSX ainda precisa ser testado em Excel, LibreOffice Calc e Google Sheets antes de qualquer release.

## Fluxo recomendado

1. Faça uma cópia do XLSX candidato.
2. Prepare os dados em um dos CSVs deste diretório.
3. Valide IDs, datas, listas e campos obrigatórios.
4. Importe ou cole primeiro poucas linhas.
5. Confira validações, fórmulas e Dashboard.
6. Só então avance para lotes maiores.

## Cuidados por arquivo

### clientes.csv

Mantenha `ID` estável e único. Use `Próxima ação` + `Data da próxima ação` para não perder continuidade comercial.

### vendas.csv

Não confie em um `Valor total` importado como verdade final. No XLSX canônico esse campo é calculado por `Quantidade × Valor unitário`. Após importação, confira se a fórmula da planilha permanece ativa.

### tarefas.csv

Prefira alterar `Status` em vez de apagar linhas concluídas. Isso preserva histórico operacional.

### estoque.csv

A coluna `Reposição?` é calculada no XLSX e deve permanecer vazia no modelo CSV. O resultado esperado é `REPOR` quando estoque atual for menor ou igual ao mínimo; caso contrário, `OK`.

### financeiro.csv

O arquivo é entregue sem exemplos monetários. Preencha somente quando houver necessidade operacional e autorização interna. Não trate o saldo da planilha como saldo bancário, lucro contábil ou posição fiscal.

## Critério de aceitação do lote

Considere um lote preparado quando:

- IDs não estão vazios e não se repetem dentro da mesma tabela;
- datas usam um padrão consistente;
- campos categóricos correspondem às opções da aba `Listas`;
- colunas calculadas continuam sob controle da planilha;
- não há credenciais ou informação sensível desnecessária;
- uma amostra pequena foi testada antes da carga completa.

Este kit não altera o estado de release da Gestão Fácil. `release_ready` permanece `false` até conclusão dos gates físicos e multiplataforma.