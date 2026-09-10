# Método JPN Casebook v1 — exemplos completos de aplicação

**Status:** candidate companion / editorial and visual QA pending  
**Base metodológica:** JPN Framework `0.3.0-draft`  
**Fonte canônica:** `METODO_JPN_v1.md`

## Objetivo

Este casebook mostra o Método JPN aplicado do pedido bruto até a revisão final. Os casos são fictícios, não usam dados financeiros reais, credenciais, URLs privadas ou informações pessoais reais.

O foco não é oferecer uma “resposta perfeita”, e sim tornar visível como Jornada, Precisão e Narrativa reduzem ambiguidades antes da execução.

## Como ler os casos

Cada caso segue a mesma sequência:

1. solicitação original;
2. Jornada;
3. estados de confiança;
4. Precisão;
5. Narrativa;
6. instrução JPN consolidada;
7. saída candidata resumida;
8. revisão pelos critérios de aceitação;
9. decisão e próxima ação.

Estados de confiança usados:

- `confirmed` — informação fornecida ou verificada;
- `inferred` — inferência razoável ainda não confirmada;
- `unknown` — informação ausente;
- `conflicting` — informações incompatíveis.

A regra permanece: inferência não vira fato apenas porque parece provável.

---

## Caso CJ-01 — transformar pedido vago em mensagem comercial revisável

### 1. Solicitação original

> “Crie uma mensagem profissional para divulgar um serviço novo.”

### 2. Jornada

**Contexto:** pequena empresa fictícia quer avisar clientes sobre um serviço novo.  
**Estado atual:** existe a intenção de comunicação, mas não há canal, público ou benefício confirmado.  
**Recursos:** somente a solicitação original.  
**Limites:** não inventar preço, prazo, garantia, desconto ou disponibilidade.

### 3. Estados de confiança

- existência de um serviço novo: `confirmed`;
- público provável ser clientes atuais: `inferred`;
- canal de envio: `unknown`;
- preço e condições comerciais: `unknown`;
- garantia de resultado: `unknown` e não deve ser inventada.

### 4. Precisão

**Objetivo operacional:** produzir uma mensagem curta que possa ser adaptada depois ao canal correto.  
**Inclui:** abertura, apresentação do serviço, benefício genérico sem promessa e chamada para contato.  
**Não inclui:** preço, desconto, prazo, garantia, depoimento ou urgência artificial.  
**Saída esperada:** texto de até 90 palavras.  
**Critérios de aceitação:** não inventar fatos; deixar lacunas explícitas; permitir adaptação posterior.

### 5. Narrativa

**Estado final desejado:** rascunho utilizável, mas claramente identificado como dependente de dados comerciais ainda não confirmados.  
**Sequência:** saudação → novidade → utilidade → convite para saber mais.  
**Formato:** mensagem curta.

### 6. Instrução JPN consolidada

> Escreva uma mensagem curta para apresentar um serviço novo de uma pequena empresa fictícia. Considere confirmado apenas que o serviço existe. Não invente preço, desconto, prazo, garantia ou disponibilidade. Use linguagem clara e profissional. Entregue um texto de até 90 palavras e, ao final, liste quais dados precisam ser confirmados antes de publicação.

### 7. Saída candidata resumida

> Temos uma novidade: um novo serviço foi adicionado ao nosso atendimento para ampliar as opções disponíveis aos clientes. Se quiser entender como ele funciona e se faz sentido para sua necessidade, fale com nossa equipe para receber as informações completas.

**Dados ainda necessários antes de publicação:** nome do serviço, público, canal, condições e disponibilidade.

### 8. Revisão

- inventou preço? **não**;
- inventou benefício específico? **não**;
- identificou lacunas? **sim**;
- pode ser publicado imediatamente? **não**, faltam dados `unknown`.

### 9. Decisão

**AJUSTAR antes de uso externo.** A entrega é parcial útil, não publicação autorizada.

---

## Caso CJ-02 — comparar opções sem esconder conflito de informação

### 1. Solicitação original

> “Compare duas ferramentas e diga qual é melhor para minha equipe.”

### 2. Jornada

**Contexto:** equipe fictícia precisa escolher entre Ferramenta A e Ferramenta B.  
**Estado atual:** existem anotações internas conflitantes sobre suporte offline.  
**Recursos:** requisitos da equipe e informações incompletas das ferramentas.  
**Limites:** não declarar vencedora uma opção quando um requisito decisivo estiver conflitante.

### 3. Estados de confiança

- colaboração entre quatro pessoas é necessária: `confirmed`;
- uso offline é requisito importante: `confirmed`;
- Ferramenta A oferece exportação local: `confirmed` no cenário;
- Ferramenta B possui suporte offline: `conflicting`;
- preferência por interface simples: `inferred` a partir do pedido, não confirmada.

### 4. Precisão

**Objetivo operacional:** produzir comparação baseada somente em critérios disponíveis.  
**Critérios:** colaboração, exportação, uso offline, complexidade operacional.  
**Saída:** matriz de decisão com lacunas visíveis.  
**Critério de aceitação:** não transformar `conflicting` em `confirmed`.

### 5. Narrativa

**Formato:** tabela curta + conclusão condicional + próximo passo.  
**Estado final:** decisão ainda reversível até esclarecer suporte offline.

### 6. Instrução JPN consolidada

> Compare Ferramenta A e Ferramenta B usando somente colaboração, exportação, uso offline e complexidade operacional. Marque qualquer informação conflitante. Não escolha uma vencedora definitiva se o requisito offline continuar sem confirmação. Termine com a informação mínima que precisa ser verificada.

### 7. Saída candidata resumida

| Critério | Ferramenta A | Ferramenta B |
| --- | --- | --- |
| Colaboração | disponível | disponível |
| Exportação | confirmada | informação insuficiente |
| Offline | informação insuficiente | `conflicting` |
| Complexidade | ainda não testada | ainda não testada |

**Conclusão:** ainda não há evidência suficiente para declarar uma opção melhor.

### 8. Revisão

- conflito foi preservado? **sim**;
- houve recomendação definitiva indevida? **não**;
- requisito decisivo ficou explícito? **sim**.

### 9. Decisão

**TESTAR/VERIFICAR antes de escolher.** Buscar a informação em fonte autorizada ou teste controlado.

---

## Caso CJ-03 — criar uma rotina operacional sem automatizar decisão humana

### 1. Solicitação original

> “Monte uma rotina para eu acompanhar estoque e saber o que repor.”

### 2. Jornada

**Contexto:** pequena empresa fictícia acompanha itens em planilha.  
**Estado atual:** existe contagem de estoque e estoque mínimo, mas não existe regra aprovada de compra automática.  
**Limites:** qualquer indicação de `REPOR` é somente alerta operacional, nunca autorização automática de compra.

### 3. Estados de confiança

- estoque atual existe: `confirmed` no cenário;
- estoque mínimo existe: `confirmed`;
- fornecedor preferencial: `unknown`;
- orçamento para compra: `unknown`;
- autorização para compra automática: `unknown` e deve permanecer fora do escopo.

### 4. Precisão

**Objetivo operacional:** criar rotina de revisão, não rotina de compra.  
**Inclui:** conferir contagens, comparar com mínimo, gerar alerta e registrar revisão humana.  
**Exclui:** pedido automático, pagamento, contratação ou uso de dados financeiros reais.  
**Critérios de aceitação:** todo alerta deve exigir decisão humana posterior.

### 5. Narrativa

**Formato:** checklist diário curto e fechamento semanal.  
**Estado final:** lista de itens para revisão, sem ação financeira executada.

### 6. Instrução JPN consolidada

> Crie uma rotina simples para uma pequena empresa acompanhar estoque atual e estoque mínimo. Quando um item atingir o limite, sinalize `REPOR`, deixando explícito que isso é apenas alerta operacional e não autorização de compra. Não use valores financeiros, não faça pedidos e inclua revisão humana antes de qualquer ação externa.

### 7. Saída candidata resumida

1. atualizar contagem;
2. comparar estoque atual com mínimo;
3. marcar `REPOR` quando atingir o limite;
4. revisar a lista manualmente;
5. investigar necessidade real e disponibilidade;
6. somente depois seguir o processo autorizado da empresa.

### 8. Revisão

- alertas geram compra automática? **não**;
- dados financeiros foram exigidos? **não**;
- decisão humana foi preservada? **sim**.

### 9. Decisão

**CANDIDATO A TESTE CONTROLADO.** A rotina pode ser praticada com dados fictícios antes de adoção.

---

## Caso CJ-04 — trabalhar com informação sensível sem persistir conteúdo desnecessário

### 1. Solicitação original

> “Organize esse texto que contém informações internas e transforme em um prompt reutilizável.”

### 2. Jornada

**Contexto:** usuário possui conteúdo interno e quer reutilizar a estrutura.  
**Estado atual:** não é necessário preservar valores, nomes ou identificadores para criar o modelo.  
**Limites:** minimizar dados e substituir detalhes por placeholders.

### 3. Estados de confiança

- estrutura do processo precisa ser preservada: `confirmed`;
- nomes e identificadores precisam aparecer no modelo: `inferred` como desnecessários;
- autorização para compartilhar conteúdo externamente: `unknown`.

### 4. Precisão

**Objetivo operacional:** transformar estrutura em template reutilizável.  
**Inclui:** campos abstratos e placeholders.  
**Exclui:** credenciais, dados pessoais reais, informações financeiras reais e URLs privadas.  
**Critério de aceitação:** modelo continua útil depois da sanitização.

### 5. Narrativa

**Formato:** template com campos `[CONTEXTO]`, `[OBJETIVO]`, `[RESTRICOES]`, `[CRITERIOS]` e `[FORMATO]`.  
**Estado final:** nenhum detalhe sensível necessário para reutilização permanece no exemplo.

### 6. Instrução JPN consolidada

> Extraia apenas a estrutura operacional do conteúdo. Substitua nomes, identificadores, dados pessoais, credenciais, valores financeiros reais e URLs privadas por placeholders genéricos. Não repita os valores removidos. Entregue um template reutilizável e liste quais campos o usuário deverá preencher conscientemente a cada uso.

### 7. Saída candidata resumida

```text
Contexto: [CONTEXTO NECESSÁRIO]
Objetivo: [RESULTADO OPERACIONAL]
Restrições: [LIMITES]
Critérios: [COMO VALIDAR]
Formato: [FORMATO DE SAÍDA]
```

### 8. Revisão

- conteúdo sensível foi necessário no resultado? **não**;
- modelo preserva utilidade? **sim**;
- publicação externa foi autorizada? **não**.

### 9. Decisão

**MANTER COMO MODELO INTERNO SANITIZADO.** Qualquer publicação continua fora do escopo.

---

## Caso CJ-05 — entregar progresso útil quando uma validação física está indisponível

### 1. Solicitação original

> “Finalize a validação de uma interface mobile e marque como pronta.”

### 2. Jornada

**Contexto:** existe uma interface candidata e verificações estáticas podem ser executadas.  
**Estado atual:** não há evidência de teste físico em celular real.  
**Limites:** não declarar QA físico aprovado sem evidência correspondente.

### 3. Estados de confiança

- arquivos da interface existem: `confirmed`;
- verificações estáticas passaram: `confirmed` somente se houver execução registrada;
- ergonomia em celular real: `unknown`;
- comportamento de teclado/leitor de tela em dispositivo real: `unknown`.

### 4. Precisão

**Objetivo operacional:** avançar tudo que for verificável sem promover estado indevido.  
**Inclui:** checklist estático, inventário de pendências e roteiro de teste físico.  
**Exclui:** marcar QA físico como aprovado sem execução real.  
**Critério de aceitação:** distinguir evidência automática de evidência humana/física.

### 5. Narrativa

**Formato:** resultado parcial + pendências + próximo teste.  
**Estado final:** candidato melhor preparado para QA, mas ainda não `release_ready`.

### 6. Instrução JPN consolidada

> Execute todas as verificações estáticas disponíveis e registre seus resultados. Para itens que exigem dispositivo físico, mantenha estado `PENDING`, explique a evidência necessária e prepare um roteiro reproduzível. Não use `release_ready: true` nem linguagem equivalente sem a evidência final.

### 7. Saída candidata resumida

- estrutura estática: verificável;
- navegação real em celular: `PENDING`;
- legibilidade/reflow físico: `PENDING`;
- leitor de tela/teclado real: `PENDING`;
- release final: não aprovado.

### 8. Revisão

- trabalho possível foi avançado? **sim**;
- lacuna foi escondida? **não**;
- release foi promovido artificialmente? **não**.

### 9. Decisão

**ENTREGA PARCIAL ÚTIL.** Regra de parada aplicada corretamente: concluir o que é seguro e preservar pendências reais.

---

## Padrões observados nos cinco casos

Os casos mostram cinco comportamentos recorrentes do Método JPN:

1. pedido vago deve virar critérios observáveis;
2. `conflicting` não deve ser achatado em uma conclusão conveniente;
3. automação operacional não implica autorização para ação externa;
4. sanitização deve preservar estrutura e remover o que não é necessário;
5. ausência de evidência física permite progresso parcial, não promoção artificial de QA.

## Relação com os produtos JPN

**JPN Prompt Builder:** pode transformar a instrução JPN consolidada em um prompt estruturado, mas QA físico contextual em celular continua pendente.  
**JPN Prompt Pack:** oferece 18 templates canônicos; o casebook ensina a reconhecer quando um template é suficiente e quando precisa de adaptação.  
**JPN Business:** oferece 12 playbooks canônicos; os casos CJ-01 e CJ-03 mostram como preservar limites operacionais antes de escolher um playbook.  
**JPN Gestão Fácil:** o caso CJ-03 reforça que `REPOR` é somente alerta, nunca autorização de compra; `GF-QA-10` multiplataforma continua pendente.  
**JPN Pro Kit:** permanece `EM PREPARAÇÃO`; o casebook é material candidato e não altera estado de release.

## Guardrails

Interrompa a execução ou mantenha a etapa como pendente quando ela exigir:

- gasto ou compra não autorizada;
- publicação, anúncio ou envio externo não autorizado;
- uso de dados financeiros reais para decisão;
- credenciais reais;
- aceite de termos legais;
- criação de conta que exija verificação de identidade;
- promoção de QA ou release sem a evidência correspondente.

## Limites deste casebook

Os casos são didáticos e fictícios. Eles não comprovam eficácia universal do Método JPN, não garantem respostas corretas, não eliminam alucinações e não substituem validação humana, técnica, editorial ou contextual.
