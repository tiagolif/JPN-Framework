# JPN — Customer Onboarding Guide v1

Estado: **candidate companion / commercial QA pending**

Este guia organiza os primeiros passos depois que uma pessoa já identificou qual produto JPN faz sentido. Ele não cria checkout, promessa comercial, bundle obrigatório ou liberação de release.

## Princípio central

Comece pelo menor recurso que resolva a necessidade atual. O onboarding deve reduzir atrito sem esconder limites, QA pendente ou fatos ausentes.

## Fluxo em 5 passos

1. **Confirmar o problema** — registre objetivo, contexto, restrições e saída esperada.
2. **Escolher o ponto de entrada** — use um único produto quando ele for suficiente.
3. **Executar um caso pequeno** — faça primeiro um teste simples e reversível.
4. **Revisar resultado e lacunas** — não transforme inferência em fato.
5. **Avançar somente se necessário** — combine produtos apenas quando surgir necessidade adicional real.

## Primeiros passos por produto

### Método JPN
- Escolha uma tarefa real de baixo risco.
- Organize Jornada, Precisão e Narrativa.
- Marque fatos confirmados, inferências, desconhecidos e conflitos.
- Revise antes de delegar a tarefa à IA.

**Sinal de conclusão:** a tarefa ficou clara, verificável e com restrições explícitas.

### JPN Prompt Builder
- Comece por uma tarefa curta.
- Preencha contexto e restrições já conhecidos.
- Revise as lacunas antes de compilar o prompt.
- Teste a saída sem depender de ação externa irreversível.

**Estado preservado:** QA físico contextual em celular continua pendente.

### JPN Prompt Pack
- Escolha apenas um template PP-* compatível com a tarefa.
- Substitua campos genéricos pelos fatos do caso atual.
- Revise restrições, critérios e regra de parada.
- Salve a versão adaptada apenas quando estiver coerente.

**Sinal de conclusão:** o template deixou de ser genérico e passou a refletir o caso real.

### JPN Business
- Escolha um único processo recorrente.
- Confirme responsável, entradas, decisões, saída e validação.
- Aplique o playbook em um cenário controlado.
- Ajuste exceções antes de ampliar o uso.

**Sinal de conclusão:** o processo pode ser revisado por outra pessoa sem depender de contexto implícito.

### JPN Gestão Fácil
- Configure listas e cadastros com dados fictícios de teste.
- Registre cliente, oportunidade, tarefa e estoque de exemplo.
- Confira os indicadores e alertas.
- Só depois substitua exemplos por operação real, conforme política interna do usuário.

**Estado preservado:** GF-QA-10 multiplataforma continua pendente. `REPOR` é alerta operacional, não autorização automática de compra.

### JPN Pro Kit
- Não começar por ele apenas por ser mais abrangente.
- Usar somente quando múltiplos componentes forem realmente necessários.
- Conferir readiness e estados de QA de cada componente.

**Estado preservado:** `EM PREPARAÇÃO`.

## Rotas opcionais

- Método → Prompt Builder: quando a estrutura precisa virar prompt guiado.
- Método → Prompt Pack: quando a tarefa se repete e merece um template.
- Prompt Pack → Business: quando a tarefa virou processo operacional.
- Business → Gestão Fácil: quando o processo precisa de acompanhamento estruturado.

Essas rotas são fluxos de trabalho, não bundles, descontos ou ofertas.

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

Este material é interno e não publicado. Não contém preço, checkout, captura de lead, garantia de resultado, autorização de anúncio, aceite de termos, uso de dados financeiros reais ou criação de conta externa.