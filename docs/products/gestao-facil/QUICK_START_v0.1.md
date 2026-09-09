# JPN Gestão Fácil — Guia de início rápido v0.1

Status: `candidate companion / human spreadsheet QA pending`

Este guia é um complemento operacional ao `MANUAL_v0.1.md`, ao `DATA_MODEL_v0.2.md` e ao `OPERATING_RHYTHM_v0.2.md`. Ele foi feito para colocar uma pequena empresa em uso organizado da planilha sem alterar fórmulas, criar dados fictícios como se fossem reais ou transformar a planilha em sistema contábil, fiscal, bancário ou ERP completo.

## Objetivo dos primeiros 30 minutos

Ao final da configuração inicial, a empresa deve ter:

1. responsáveis e listas básicas revisados;
2. pelo menos um cliente registrado corretamente;
3. uma oportunidade/venda de teste registrada;
4. uma tarefa vinculada ao próximo passo;
5. um item de estoque de teste com mínimo definido;
6. um lançamento financeiro fictício ou de demonstração, quando necessário para treinamento;
7. Dashboard conferido sem edição manual dos indicadores.

Use dados fictícios durante implantação, treinamento, demonstração e QA. Dados reais só devem ser inseridos quando houver necessidade operacional, autorização interna e cuidado adequado com privacidade.

## Antes de preencher

- Faça uma cópia de trabalho antes de alterações estruturais.
- Confirme que as abas esperadas existem: `Leia-me`, `Dashboard`, `Clientes`, `Vendas`, `Tarefas`, `Estoque`, `Financeiro` e `Listas`.
- Não renomeie abas durante a configuração inicial.
- Não apague fórmulas do Dashboard, da coluna de valor total ou da coluna `Reposição?`.
- Não cole blocos sobre áreas com validação sem testar antes em uma cópia.
- Não armazene senhas, tokens, credenciais, números completos de cartão ou dados bancários sensíveis.

## Passo 1 — Leia-me

Abra a aba **Leia-me** e confirme:

- versão do arquivo;
- finalidade da planilha;
- avisos de uso;
- orientações específicas do binário recebido.

Se a versão exibida divergir da documentação que acompanha o arquivo, pare a implantação até confirmar qual binário deve ser usado.

## Passo 2 — Listas

Revise as opções existentes antes de cadastrar dados.

Priorize apenas ajustes realmente necessários em:

- etapas de clientes;
- etapas de vendas;
- status de tarefas;
- prioridades;
- categorias;
- unidades e outros campos padronizados disponíveis.

### Regra segura

Não remova uma opção que já esteja sendo usada por registros existentes. Primeiro substitua os registros antigos; depois, se ainda fizer sentido, retire a opção da lista.

## Passo 3 — Cadastre um cliente de teste

Na aba **Clientes**, crie um registro fictício e revise os campos principais:

- ID;
- Nome/Empresa;
- Contato;
- Canal;
- Etapa;
- Responsável;
- Próxima ação;
- Data da próxima ação;
- Observações.

### Conferência

- O ID deve permanecer estável.
- A etapa deve vir da lista esperada.
- Próxima ação e data devem permitir continuidade do atendimento.
- Observações devem guardar apenas contexto útil, sem informação sensível desnecessária.

## Passo 4 — Crie uma oportunidade/venda de teste

Na aba **Vendas**, registre uma oportunidade fictícia vinculada ao cliente criado.

Preencha:

- ID e data;
- cliente;
- produto/serviço;
- etapa;
- responsável;
- quantidade;
- valor unitário;
- próxima ação;
- observações.

Não digite manualmente o total se a coluna estiver preparada com fórmula. A regra canônica é **Quantidade × Valor unitário**.

### Teste rápido

1. use quantidade `2`;
2. use valor unitário fictício `100`;
3. confira se o total calculado é `200`;
4. altere a etapa apenas para validar o fluxo visual e os indicadores aplicáveis;
5. reverta ou remova o registro fictício conforme a política de teste adotada.

Esse exemplo é apenas um teste funcional; não representa preço, faturamento ou dado financeiro real.

## Passo 5 — Crie a próxima tarefa

Na aba **Tarefas**, registre uma ação fictícia relacionada ao teste anterior.

Exemplo de estrutura:

- tarefa: `Retornar cliente de demonstração`;
- categoria: uma opção existente;
- responsável: pessoa ou papel de teste;
- prioridade: uma opção existente;
- status: pendente;
- início e prazo: datas de teste;
- próximo passo: ação observável;
- observações: contexto mínimo.

Quando a atividade terminar, altere o status em vez de apagar a linha. O histórico é parte do controle operacional.

## Passo 6 — Valide o sinal de estoque

Na aba **Estoque**, crie um item fictício.

Teste os dois estados da regra:

- estoque atual maior que o mínimo → esperado `OK`;
- estoque atual menor ou igual ao mínimo → esperado `REPOR`.

`REPOR` é somente alerta operacional. Não autoriza compra, pedido a fornecedor, gasto ou contratação.

## Passo 7 — Financeiro com dados de demonstração

A aba **Financeiro** deve ser usada apenas para organização gerencial simples e por pessoas autorizadas.

Para treinamento, use um lançamento fictício identificado claramente como demonstração. Revise:

- ID;
- data;
- tipo `Entrada` ou `Saída`;
- descrição;
- categoria;
- centro/projeto quando aplicável;
- valor;
- status;
- vencimento;
- observações.

O saldo do Dashboard é **Entradas − Saídas** com base apenas nos registros existentes. Ele não é sinônimo de saldo bancário, lucro contábil, caixa auditado ou obrigação fiscal.

## Passo 8 — Confira o Dashboard

Volte ao **Dashboard** e confira se os indicadores respondem aos registros de teste.

Verifique, conforme aplicável:

- Clientes cadastrados;
- Clientes qualificados;
- Vendas abertas;
- Vendas ganhas;
- Tarefas pendentes;
- Itens para reposição;
- Saldo registrado.

Não corrija um indicador digitando sobre o Dashboard. Se algo estiver incorreto, revise o registro de origem e, se necessário, registre o problema para QA.

## Rotina mínima recomendada

### Todo início de dia

1. abrir Dashboard;
2. revisar tarefas pendentes/vencidas;
3. revisar próximas ações de clientes e vendas;
4. verificar `REPOR` no estoque.

### Durante o dia

1. atualizar etapas sem apagar histórico;
2. registrar novas oportunidades;
3. criar ou concluir tarefas;
4. registrar movimentações gerenciais autorizadas quando necessário.

### No fechamento semanal

1. revisar registros incompletos;
2. conferir vendas ganhas/perdidas;
3. revisar tarefas vencidas;
4. revisar itens de reposição;
5. revisar saldo registrado sem tratá-lo como saldo bancário;
6. definir próximos responsáveis e ações.

## Problemas comuns e primeira ação

| Sintoma | Primeira verificação segura |
|---|---|
| Dashboard parece errado | conferir registros de origem antes das fórmulas |
| Total da venda não calcula | verificar quantidade, valor unitário e se a fórmula foi sobrescrita |
| `REPOR` não muda | conferir estoque atual, mínimo e fórmula da coluna |
| Menu suspenso perdeu opção | conferir aba `Listas` e registros que dependiam da opção |
| Arquivo ficou estranho após colar dados | interromper edição, comparar com uma cópia e não salvar por cima sem revisar |
| Comportamento varia entre aplicativos | registrar para GF-QA-10 no mesmo XLSX em Excel, LibreOffice Calc e Google Sheets |

## Checklist de implantação inicial

- [ ] versão conferida na aba Leia-me;
- [ ] oito abas canônicas presentes;
- [ ] listas revisadas sem exclusão insegura;
- [ ] cliente fictício criado;
- [ ] oportunidade/venda fictícia criada;
- [ ] regra `Quantidade × Valor unitário` conferida;
- [ ] tarefa fictícia criada e atualizada por status;
- [ ] alerta `OK`/`REPOR` conferido;
- [ ] lançamento financeiro fictício identificado como demonstração quando usado;
- [ ] Dashboard revisado sem edição manual de indicadores;
- [ ] nenhuma senha, token, credencial ou dado financeiro sensível inserido;
- [ ] diferenças de suíte registradas como pendência, não tratadas como aprovadas.

## Limites e estado de QA

Este guia não substitui o manual completo nem comprova compatibilidade cruzada. O GF-QA-10 continua pendente até que **o mesmo XLSX candidato** seja aberto e verificado em Microsoft Excel, LibreOffice Calc e Google Sheets com evidência registrada.

O estado deste companion permanece `candidate companion / human spreadsheet QA pending`. Nenhum teste humano, arquivo final, freeze, hash final, publicação, venda ou uso de dado financeiro real é promovido por este documento.
