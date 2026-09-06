# JPN Gestão Fácil — Manual rápido v0.1

Status: `draft editorial`

Este manual acompanha a edição reconstruída v0.1 da JPN Gestão Fácil. A planilha é uma ferramenta de organização para pequenas empresas e não substitui sistemas contábeis, fiscais, jurídicos ou bancários.

## 1. Como começar

1. Abra primeiro a aba **Leia-me** e confirme a versão do arquivo.
2. Use **Listas** apenas para manter opções padronizadas de status, etapas e categorias. Evite apagar itens usados por registros existentes.
3. Cadastre clientes em **Clientes** antes de vinculá-los às vendas sempre que possível.
4. Registre oportunidades e vendas em **Vendas**.
5. Organize atividades em **Tarefas**.
6. Use **Estoque** para controle operacional simples de quantidade mínima.
7. Use **Financeiro** apenas para registros gerenciais que você esteja autorizado a manter.
8. Consulte **Dashboard** para a visão resumida.

## 2. Dashboard

O Dashboard é somente leitura operacional. Os indicadores são derivados das demais abas e não devem ser digitados manualmente.

Indicadores previstos:
- clientes cadastrados;
- clientes qualificados;
- vendas abertas;
- vendas ganhas;
- tarefas pendentes;
- itens sinalizados para reposição;
- saldo registrado.

Se um indicador parecer incorreto, revise primeiro os registros de origem em vez de substituir a fórmula.

## 3. Clientes

Use uma linha por cliente ou empresa.

Campos principais:
- **ID**: identificador interno estável;
- **Nome/Empresa**: nome usado nas consultas e contagens;
- **Contato** e **Canal**: forma de retorno;
- **Etapa**: Novo, Contato, Qualificado, Proposta, Cliente ou Inativo;
- **Responsável**: pessoa que acompanha o relacionamento;
- **Próxima ação** e **Data da próxima ação**: continuidade do atendimento;
- **Observações**: contexto útil, sem armazenar dados sensíveis desnecessários.

Boa prática: não use a planilha como repositório de documentos pessoais, senhas, números completos de cartão, dados bancários ou outras informações sensíveis.

## 4. Vendas

Use uma linha por oportunidade ou venda.

Campos principais:
- ID e data;
- cliente;
- produto/serviço;
- etapa;
- responsável;
- quantidade;
- valor unitário;
- valor total calculado;
- próxima ação;
- observações.

### Valor total

O total é derivado de **Quantidade × Valor unitário**. Não substitua a fórmula da coluna de total por números digitados, pois isso quebra a consistência do arquivo.

Ao mudar uma venda para **Ganha**, o Dashboard deve refletir essa alteração nas contagens correspondentes.

## 5. Tarefas

Use para registrar ações que precisam de acompanhamento.

Campos:
- tarefa;
- categoria;
- responsável;
- prioridade;
- status;
- início;
- prazo;
- próximo passo;
- observações.

Ao concluir uma atividade, altere o status em vez de apagar a linha. Isso preserva histórico operacional.

## 6. Estoque

Use uma linha por item controlado.

Campos principais:
- código;
- item;
- categoria;
- unidade;
- estoque atual;
- estoque mínimo;
- reposição;
- fornecedor;
- observações.

A coluna **Reposição?** é calculada. Quando o estoque atual for menor ou igual ao mínimo informado, a planilha deve sinalizar `REPOR`; caso contrário, `OK`.

O sinal é um alerta operacional, não uma ordem automática de compra. Nenhuma compra deve ser realizada somente porque a planilha exibiu `REPOR`.

## 7. Financeiro

A aba Financeiro organiza registros simples de **Entrada** e **Saída**.

Campos:
- ID;
- data;
- tipo;
- descrição;
- categoria;
- centro/projeto;
- valor;
- status;
- vencimento;
- observações.

O Dashboard calcula o saldo registrado como **Entradas − Saídas**. Esse saldo é apenas o resultado dos lançamentos existentes na planilha e não representa, por si só, saldo bancário, lucro contábil, fluxo de caixa auditado ou obrigação fiscal.

Nunca inclua senhas bancárias, tokens, números completos de cartão ou credenciais na planilha.

## 8. Listas e validações

A aba **Listas** alimenta menus suspensos. Alterações nela podem afetar as validações das demais abas.

Antes de remover uma opção:
1. verifique se ela já aparece em registros existentes;
2. substitua os registros antigos quando necessário;
3. só então remova a opção da lista.

## 9. Rotina sugerida

### Início do dia
- revisar tarefas pendentes e vencimentos;
- conferir próximas ações de clientes;
- verificar itens sinalizados para reposição.

### Durante o dia
- atualizar etapas dos clientes;
- registrar novas vendas ou oportunidades;
- marcar tarefas conforme avançam;
- lançar movimentações gerenciais autorizadas.

### Fim do dia ou da semana
- revisar registros incompletos;
- encerrar tarefas concluídas;
- conferir vendas ganhas/perdidas;
- revisar Dashboard para identificar pendências.

## 10. Cuidados para não quebrar o arquivo

- não apague fórmulas do Dashboard, Valor total ou Reposição?;
- evite colar blocos que substituam validações e fórmulas;
- não renomeie abas sem revisar referências;
- mantenha uma cópia de segurança antes de alterações estruturais;
- prefira adicionar novas linhas dentro das áreas preparadas;
- ao importar dados, teste primeiro em uma cópia.

## 11. Compatibilidade

A edição reconstruída foi desenhada para usar fórmulas e validações simples. Ainda assim, a aparência e alguns comportamentos podem variar entre Microsoft Excel, LibreOffice Calc e Google Sheets. A compatibilidade cruzada deve ser validada no binário congelado antes do release-candidate.

## 12. Suporte e evolução do produto

Ao relatar um problema, registre:
- versão do arquivo;
- aplicativo utilizado;
- aba e célula aproximada;
- ação realizada antes do erro;
- comportamento esperado e comportamento observado.

Não envie dados reais de clientes ou informações financeiras sensíveis em capturas de tela usadas para suporte.
