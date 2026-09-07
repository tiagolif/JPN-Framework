# JPN Gestão Fácil — Rotina operacional v0.2

Status: `guia de uso interno e material-base do produto`

Este guia transforma a planilha em um sistema operacional simples para pequenas empresas. Ele usa somente os recursos já previstos no workbook e não depende de integrações, contas externas ou dados reais.

## Regra principal

A planilha deve responder quatro perguntas:

1. O que precisa de atenção agora?
2. Quais clientes e vendas têm próxima ação?
3. O que está atrasado, parado ou perto de faltar?
4. O que mudou desde a última revisão?

## Rotina diária — 10 a 15 minutos

### Abertura

1. Abrir o Dashboard sem editar suas fórmulas.
2. Conferir tarefas pendentes.
3. Revisar clientes com próxima ação vencida ou para o dia.
4. Revisar vendas abertas que ainda não têm próximo passo.
5. Conferir itens marcados como `REPOR`.

### Durante o dia

- cadastrar um cliente quando houver relação comercial relevante;
- atualizar a Etapa em vez de duplicar o cliente;
- registrar cada oportunidade importante em Vendas;
- manter Próxima ação preenchida nas oportunidades abertas;
- concluir tarefas alterando o Status, sem apagar histórico;
- atualizar estoque apenas quando houver informação operacional confiável;
- registrar somente movimentações financeiras gerenciais autorizadas.

### Fechamento

1. Encerrar tarefas concluídas.
2. Confirmar se vendas ganhas/perdidas estão na etapa correta.
3. Preencher próximos passos que ficaram vazios.
4. Verificar se houve alguma linha parcialmente preenchida que possa distorcer a leitura.

## Rotina semanal — 20 a 30 minutos

### Comercial

- revisar clientes em `Contato`, `Qualificado` e `Proposta`;
- identificar vendas sem atualização recente;
- fechar oportunidades claramente ganhas ou perdidas;
- remover ambiguidade de próximos passos.

### Execução

- revisar tarefas vencidas;
- redistribuir responsáveis quando necessário;
- reduzir tarefas abertas sem próximo passo;
- confirmar que tarefas concluídas continuam registradas para histórico.

### Estoque

- conferir itens em `REPOR`;
- revisar estoque mínimo quando houver mudança operacional real;
- confirmar que `REPOR` não foi interpretado como autorização de compra.

### Financeiro gerencial

- verificar lançamentos sem Tipo ou Valor;
- revisar Status e vencimentos;
- conferir o saldo registrado apenas como resumo dos lançamentos existentes;
- não reconciliar contas bancárias nem produzir interpretação contábil dentro desta planilha.

## Revisão mensal

A revisão mensal deve ser curta e orientada a qualidade dos dados:

- IDs duplicados;
- registros antigos sem atualização;
- opções de Listas que deixaram de ser usadas;
- linhas com campos essenciais vazios;
- fórmulas substituídas por valores;
- inconsistências de status;
- necessidade de criar cópia de segurança antes de alteração estrutural.

## Indicadores de higiene operacional

Estes indicadores podem orientar versões futuras, mas não precisam estar no Dashboard v0.1:

- vendas abertas sem Próxima ação;
- clientes qualificados sem Data da próxima ação;
- tarefas vencidas e não concluídas;
- registros sem responsável;
- vendas com Quantidade/Valor unitário incompletos;
- itens de estoque sem mínimo definido.

Eles são indicadores de qualidade de processo, não de desempenho financeiro.

## Fluxo recomendado por evento

### Novo contato
`Clientes → definir Etapa → registrar Próxima ação → criar Tarefa se houver compromisso`

### Nova oportunidade
`Vendas → Cliente → Produto/Serviço → Etapa → Responsável → Próxima ação`

### Venda concluída
`Vendas → Etapa = Ganha → revisar tarefas relacionadas → manter histórico`

### Oportunidade perdida
`Vendas → Etapa = Perdida → registrar contexto útil em Observações → não apagar`

### Item abaixo do mínimo
`Estoque → Reposição? = REPOR → revisão humana → decisão fora da planilha`

### Atividade concluída
`Tarefas → Status = Concluída → preservar a linha`

## O que a JPN Gestão Fácil não deve virar

Para preservar simplicidade e segurança, a edição base não deve incorporar:

- armazenamento de senhas ou credenciais;
- dados completos de cartão ou conta bancária;
- cálculo fiscal ou contábil oficial;
- emissão de documentos fiscais;
- automações de compra sem revisão humana;
- promessa de aumento de vendas, lucro ou produtividade;
- CRM complexo com histórico de mensagens ou dados sensíveis.

## Critério de boa utilização

A planilha está sendo bem usada quando o usuário consegue abrir o Dashboard, identificar as principais pendências e encontrar a origem de cada indicador nas abas operacionais sem precisar alterar fórmulas.