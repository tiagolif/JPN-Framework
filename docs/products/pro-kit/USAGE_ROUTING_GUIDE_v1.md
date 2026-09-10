# JPN Pro Kit v1 — Guia de Uso e Combinação

Base: JPN Framework `0.3.0-draft`.

Status deste documento: **candidate companion / operational QA pending**.

O JPN Pro Kit reúne componentes diferentes do ecossistema JPN. Isso não significa que todos devem ser usados ao mesmo tempo. Este guia existe para ajudar a escolher o **menor recurso suficiente** para o problema atual e só combinar componentes quando houver uma necessidade concreta.

> Regra principal: comece pequeno, valide o resultado, registre o que funcionou e só então adicione outra camada.

## 1. Mapa rápido de decisão

| Necessidade atual | Comece por | Avance para | Pare se |
|---|---|---|---|
| Organizar uma ideia ou tarefa mal definida | Método JPN | Prompt Builder ou Prompt Pack | ainda não houver objetivo, contexto ou saída esperada |
| Montar um prompt específico | JPN Prompt Builder | Prompt Pack | o contexto necessário não estiver disponível ou confirmado |
| Reutilizar uma tarefa frequente | JPN Prompt Pack | JPN Business | o template ainda não tiver sido testado com um caso pequeno |
| Transformar uma tarefa em processo repetível | JPN Business | Gestão Fácil | não houver responsável, critério de revisão ou condição de parada |
| Acompanhar clientes, vendas, tarefas, estoque ou registros financeiros operacionais | JPN Gestão Fácil | JPN Business, quando houver processo associado | os dados forem sensíveis, não confirmados ou exigirem decisão financeira real |
| Combinar várias camadas | JPN Pro Kit | somente os componentes necessários | a combinação estiver aumentando complexidade sem resolver uma necessidade real |

## 2. O papel de cada componente

### Método JPN

Use quando o problema ainda está mal estruturado. O Método organiza a tarefa pelas três dimensões **Jornada, Precisão e Narrativa** antes da execução.

**Entrada mínima:** objetivo, contexto disponível e resultado esperado.

**Saída mínima:** tarefa estruturada o suficiente para ser executada ou transformada em prompt.

**Não usar como:** garantia de qualidade, resultado comercial ou substituição de revisão humana.

### JPN Prompt Builder

Use quando a tarefa já está clara e você precisa construir um prompt específico com contexto organizado.

**Entrada mínima:** objetivo confirmado, contexto necessário e formato de saída.

**Saída mínima:** prompt estruturado pronto para revisão e teste.

**Estado atual:** arquitetura candidata local/offline. O QA físico contextual em celular continua pendente; portanto, o Builder não deve ser apresentado como compatibilidade móvel final comprovada.

### JPN Prompt Pack

Use quando uma tarefa semelhante já aparece com frequência e um template reutilizável reduz retrabalho.

**Conteúdo atual:** **18 templates** versionados no índice canônico.

**Entrada mínima:** um template adequado e dados do caso atual.

**Saída mínima:** prompt adaptado ao cenário específico.

**Regra:** não adaptar cinco templates quando um único template resolve a necessidade.

### JPN Business

Use quando uma tarefa deixa de ser pontual e passa a fazer parte de uma rotina de trabalho.

**Conteúdo atual:** **12 playbooks** operacionais versionados no índice canônico.

**Entrada mínima:** processo delimitado, responsável, entradas, saída, revisão humana e condição de parada.

**Saída mínima:** rotina candidata, testada em pequena escala e registrada.

**Regra:** nenhum score, semáforo ou checklist transforma uma rotina automaticamente em autorização para publicar, enviar, gastar, contratar ou tomar decisão financeira.

### JPN Gestão Fácil

Use quando a pequena empresa precisa registrar e acompanhar informações operacionais em uma planilha organizada.

**Estrutura atual:** 8 abas canônicas — Leia-me, Dashboard, Clientes, Vendas, Tarefas, Estoque, Financeiro e Listas — e 7 KPIs principais.

**Entrada mínima:** dados operacionais confirmados e apropriados para registro.

**Saída mínima:** registros consistentes e indicadores de acompanhamento.

**Limites atuais:** GF-QA-10 continua pendente porque a compatibilidade do mesmo binário ainda precisa ser validada em Microsoft Excel, LibreOffice Calc e Google Sheets. `REPOR` é somente um alerta operacional; nunca é autorização automática de compra. Registros financeiros operacionais não equivalem a saldo bancário, lucro contábil ou decisão financeira.

### JPN Pro Kit

Use quando uma necessidade real atravessa dois ou mais componentes anteriores e a combinação melhora o fluxo sem criar complexidade desnecessária.

**Estado atual:** **EM PREPARAÇÃO**. O Pro Kit organiza o pacote, mas não promove automaticamente componentes pendentes para release final.

## 3. Rotas recomendadas

As rotas abaixo são fluxos de trabalho. **Não são bundles, ofertas, descontos ou exigência de compra conjunta.**

### Rota A — Da ideia ao primeiro prompt

`Método JPN → Prompt Builder`

1. Estruture o problema com Jornada, Precisão e Narrativa.
2. Confirme objetivo, contexto e saída.
3. Monte um prompt no Builder.
4. Revise o prompt antes de executar.
5. Teste com um caso pequeno.

Pare se o contexto necessário estiver ausente ou não confirmado.

### Rota B — Do primeiro prompt à reutilização

`Método JPN → Prompt Builder → Prompt Pack`

Use quando a mesma estrutura começa a se repetir.

1. Resolva um caso específico.
2. Identifique o padrão reutilizável.
3. Escolha o template mais próximo no Prompt Pack.
4. Adapte somente o necessário.
5. Registre o que mudou entre os casos.

Pare se o template exigir suposições sobre preço, prazo, política, disponibilidade ou qualquer fato não confirmado.

### Rota C — Do prompt à rotina operacional

`Prompt Pack → JPN Business`

Use quando um template já foi testado e precisa fazer parte de um processo recorrente.

1. Selecione um único processo.
2. Defina responsável, entrada e saída.
3. Associe o prompt ou prompts necessários.
4. Faça execuções controladas.
5. Revise erros e lacunas.
6. Só considere rotina recorrente após evidência suficiente e decisão humana.

Pare se houver publicação, envio externo, contratação, gasto, credencial ou decisão financeira sem autorização apropriada.

### Rota D — Operação + acompanhamento

`JPN Business → Gestão Fácil`

Use quando um processo recorrente precisa de registro simples para acompanhamento.

Exemplo fictício: um pequeno negócio registra tarefas de retorno de clientes em um playbook e acompanha o status dessas tarefas na planilha.

A planilha registra fatos operacionais; ela não toma decisões pelo responsável.

### Rota E — Estrutura completa, mas mínima

`Método JPN → Prompt Pack → JPN Business → Gestão Fácil`

Use somente quando cada camada tiver uma função clara.

Exemplo fictício:

- Método JPN estrutura uma rotina de atendimento;
- um template do Prompt Pack ajuda a preparar a resposta;
- um playbook do Business define a sequência de revisão e acompanhamento;
- a Gestão Fácil registra tarefas e resultados operacionais.

Se uma etapa não agrega valor observável, remova-a do fluxo.

## 4. Teste de necessidade antes de adicionar uma camada

Antes de combinar outro produto, responda:

1. Qual problema específico a nova camada resolve?
2. Esse problema já apareceu mais de uma vez?
3. O componente atual sozinho é insuficiente?
4. Existe entrada confiável para a nova camada?
5. Existe responsável pela revisão?
6. Existe uma condição clara de parada?

Se as respostas não forem claras, mantenha o fluxo atual.

## 5. Níveis de combinação

### Nível 1 — Pontual

Um único componente resolve uma tarefa específica.

Exemplo: usar o Método JPN para estruturar uma solicitação complexa.

### Nível 2 — Reutilizável

Dois componentes reduzem retrabalho em tarefas semelhantes.

Exemplo: Método JPN + Prompt Pack.

### Nível 3 — Operacional

Um prompt ou template passa a fazer parte de um processo revisável.

Exemplo: Prompt Pack + JPN Business.

### Nível 4 — Acompanhado

O processo gera fatos que precisam ser registrados e acompanhados.

Exemplo: JPN Business + Gestão Fácil.

O nível maior não é automaticamente melhor. A escolha correta é o menor nível que resolve o problema atual.

## 6. Regras de segurança e parada

Interrompa o fluxo e peça decisão humana apropriada quando surgir qualquer um destes pontos:

- preço, desconto, prazo, estoque ou condição comercial não confirmados;
- publicação de conteúdo, anúncio ou envio externo não autorizado;
- compra de mídia, contratação, compra de produto ou qualquer gasto;
- senha, token, chave de API, credencial ou segredo;
- dado financeiro real desnecessário para a tarefa;
- decisão bancária, contábil, tributária, de crédito ou investimento;
- aceite de termos legais;
- criação de conta que exija verificação de identidade;
- promessa de resultado, ROI, aumento de vendas, redução de custos ou garantia sem evidência;
- resultado que dependa de compatibilidade ainda não validada.

## 7. Checklist antes de combinar componentes

- [ ] o problema atual está definido;
- [ ] o componente atual já foi testado em pequena escala;
- [ ] a nova camada resolve uma lacuna concreta;
- [ ] as entradas estão confirmadas;
- [ ] o responsável pela revisão está definido;
- [ ] a condição de parada está definida;
- [ ] não há publicação, gasto ou envio externo implícito;
- [ ] não há credenciais ou dados financeiros reais desnecessários;
- [ ] estados pendentes de QA continuam visíveis;
- [ ] a combinação continua simples o suficiente para ser explicada e revisada.

## 8. Critério de sucesso deste guia

Este guia é bem-sucedido quando ajuda alguém a **usar menos componentes, com mais clareza**, e não quando incentiva utilizar todo o pacote.

O Pro Kit permanece **EM PREPARAÇÃO** até que seus gates reais sejam concluídos. Este documento não substitui `READINESS_MATRIX_v1.md`, `RELEASE_CHECKLIST.md`, `RELEASE_GATES.json`, o manifesto final, QA físico/multiplataforma, freeze, hashes ou CI do head definitivo.
