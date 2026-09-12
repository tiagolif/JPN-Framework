# JPN — Customer Onboarding Guide v1

Estado: **candidate companion / commercial QA pending**

Este guia organiza os primeiros passos depois que uma pessoa já identificou qual produto JPN faz sentido. Ele não cria checkout, promessa comercial, bundle obrigatório ou liberação de release.

Fonte estruturada: `docs/commercial/CUSTOMER_ONBOARDING_GUIDE_v1.json`.

## Princípio central

Comece pelo menor recurso que resolva a necessidade atual. O onboarding deve reduzir atrito sem esconder limites, QA pendente ou fatos ausentes.

## Fluxo em 5 passos

1. **Confirmar o problema** — registre objetivo, contexto, restrições e saída esperada.
2. **Escolher o ponto de entrada** — use um único produto quando ele for suficiente.
3. **Executar um caso pequeno** — faça primeiro um teste simples, controlado e reversível.
4. **Revisar resultado e lacunas** — separe fatos, inferências, desconhecidos e conflitos.
5. **Avançar somente se necessário** — combine produtos apenas quando surgir necessidade adicional real.

## Primeiros passos por produto

### Método JPN
- Escolha uma tarefa real de baixo risco.
- Organize Jornada, Precisão e Narrativa.
- Marque fatos confirmados, inferências, desconhecidos e conflitos.
- Revise antes de delegar a tarefa à IA.

**Sinal de conclusão:** a tarefa ficou clara, verificável e com restrições explícitas.

**Estado preservado:** revisão editorial humana e PDF final continuam dependentes de evidência real.

### JPN Prompt Pack
- Escolha apenas um template PP-* compatível com a tarefa.
- Substitua campos genéricos pelos fatos do caso atual.
- Revise restrições, critérios e regra de parada.
- Salve a versão adaptada apenas quando estiver coerente.

**Sinal de conclusão:** o template deixou de ser genérico e passou a refletir o caso real.

**Estado preservado:** revisão editorial humana e PDF final continuam dependentes de evidência real.

### JPN Prompt Builder
- Comece por uma tarefa curta.
- Preencha contexto e restrições já conhecidos.
- Revise as lacunas antes de compilar o prompt.
- Teste a saída sem depender de ação externa irreversível.

**Sinal de conclusão:** o prompt compilado pode ser revisado e reutilizado sem esconder fatos ausentes.

**Estado preservado:** QA físico contextual em celular continua pendente.

### JPN Business
- Escolha um único processo recorrente.
- Confirme responsável, entradas, decisões, saída e validação.
- Aplique o playbook em um cenário controlado.
- Ajuste exceções antes de ampliar o uso.

**Sinal de conclusão:** o processo pode ser revisado por outra pessoa sem depender de contexto implícito.

**Estado preservado:** revisão editorial humana, diagramação final e PDF final continuam dependentes de evidência real.

### JPN Gestão Fácil
- Configure listas e cadastros com dados fictícios de teste.
- Registre cliente, oportunidade, tarefa e estoque de exemplo.
- Confira os indicadores e alertas.
- Só depois substitua exemplos por operação real, conforme a política interna do usuário.

**Sinal de conclusão:** a operação de teste pode ser acompanhada sem transformar alertas em autorizações automáticas.

**Estado preservado:** GF-QA-10 multiplataforma continua pendente. `REPOR` é alerta operacional, não autorização automática de compra.

### JPN Pro Kit
- Não comece por ele apenas por ser mais abrangente.
- Use somente quando múltiplos componentes forem realmente necessários.
- Confira readiness e estados de QA de cada componente antes de tratar o conjunto como entrega final.

**Sinal de conclusão:** o conjunto só faz sentido quando produtos isolados deixaram de ser suficientes e os componentes necessários estão validados.

**Estado preservado:** rota apenas arquitetural enquanto houver dependências abertas; produto continua em preparação.

## Rotas canônicas de uso

As rotas abaixo espelham `docs/product-system/PRODUCT_USAGE_ROUTES_v1.json` e devem permanecer sincronizadas com esse contrato.

1. **rota-aprender — Método JPN → Prompt Pack → Prompt Builder**  
   Use quando a pessoa ainda precisa dominar a lógica JPN antes de acelerar a execução. Pare no Método se ele já resolver o objetivo imediato.

2. **rota-executar — Prompt Pack → Prompt Builder**  
   Use quando a necessidade já é conhecida e um template reutilizável reduz trabalho de estruturação. Pare no Pack se o template adaptado já for suficiente.

3. **rota-operar — JPN Business → Prompt Pack → Prompt Builder → Gestão Fácil**  
   Use quando uma pequena empresa precisa transformar uma necessidade recorrente em playbook, prompt e acompanhamento operacional. Pare assim que o processo já estiver executável com os materiais necessários.

4. **rota-gestao — Gestão Fácil → JPN Business**  
   Use quando a necessidade principal é organizar clientes, vendas, tarefas, estoque e controle gerencial básico. Só avance para Business quando surgir necessidade de playbook adicional.

5. **rota-conjunto — JPN Pro Kit**  
   Esta rota é somente arquitetural enquanto houver dependências abertas. Mesmo depois de validada, o menor produto suficiente continua sendo preferido.

Essas rotas são fluxos de trabalho, não bundles, descontos, ofertas ou obrigação de usar todos os produtos.

## Regra de parada

Interrompa antes de avançar quando:
- houver fato material ausente ou conflitante;
- a próxima ação exigir gasto, publicação, compra, contratação ou aceite legal;
- houver credenciais, dados financeiros reais ou informações sensíveis desnecessárias;
- o uso depender de QA ainda não aprovado;
- houver risco de transformar um alerta ou recomendação em autorização automática.

## Checklist de onboarding

- [ ] problema real confirmado;
- [ ] menor produto suficiente escolhido;
- [ ] primeiro caso pequeno definido;
- [ ] fatos e restrições revisados;
- [ ] QA pendente continua explicitamente pendente;
- [ ] nenhuma ação externa irreversível foi executada;
- [ ] próximo passo só existe se uma nova necessidade real aparecer.

## Limites

Este material é interno e não publicado. Não contém preço, checkout, captura de lead, garantia de resultado, autorização de anúncio, aceite de termos, uso de dados financeiros reais ou criação de conta externa. A Gestão Fácil é controle gerencial complementar e não substitui contabilidade, banco, fiscal, ERP ou auditoria.
