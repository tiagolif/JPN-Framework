# JPN Guided Demo Playbook v1

Status: `candidate companion / commercial QA pending`

## Objetivo

Criar uma demonstração curta, segura e repetível do ecossistema JPN sem usar dados reais, preço, checkout, promessa de resultado, publicação ou ação externa irreversível.

A demonstração serve para responder uma pergunta simples: **qual é o menor recurso JPN que resolve esta necessidade agora?**

## Regra principal

Toda demo deve seguir a sequência:

1. **Contextualizar** — declarar o problema e os limites do exemplo.
2. **Escolher** — selecionar o menor produto suficiente.
3. **Demonstrar** — executar apenas um caso pequeno com dados fictícios.
4. **Revisar** — separar fatos, inferências, lacunas e estados de QA.
5. **Parar** — não avançar para outro produto sem uma necessidade adicional real.

## Dados permitidos na demo

Use somente dados fictícios ou explicitamente sanitizados. Não utilizar:

- credenciais;
- dados bancários ou financeiros reais;
- documentos pessoais;
- informações internas de clientes ou empresas;
- preços, condições comerciais ou promessas não confirmadas;
- tokens, chaves, senhas ou identificadores sensíveis.

## Roteiro de 8 minutos

### Minuto 0–1 — problema

Exemplo fictício: “Uma pequena loja quer organizar o atendimento de clientes que pedem orçamento de móveis e sempre perde contexto entre mensagens.”

### Minuto 1–2 — escolha do menor recurso

Pergunta de decisão:

> O problema atual é estruturar melhor uma tarefa, montar um prompt, reutilizar uma rotina, operacionalizar um processo ou acompanhar dados?

Escolha somente um produto inicial.

### Minuto 2–5 — demonstração

Execute um único cenário dos blocos abaixo.

### Minuto 5–7 — revisão

Conferir:

- o que foi confirmado;
- o que foi inferido;
- o que permanece desconhecido;
- quais restrições foram preservadas;
- se existe QA pendente relevante.

### Minuto 7–8 — regra de parada

Se o recurso atual resolveu o problema demonstrado, pare. Combinar produtos é opcional e deve ser justificado por nova necessidade.

## Cenários por produto

### DEMO-01 — Método JPN

**Problema:** transformar uma solicitação vaga em tarefa estruturada.

Entrada fictícia: “Preciso melhorar o atendimento da loja.”

Demonstrar:

- Jornada: contexto atual, objetivo e próximo passo;
- Precisão: fatos, inferências, desconhecidos e restrições;
- Narrativa: formato final que o usuário realmente precisa.

Resultado esperado: uma tarefa clara e revisável, não uma promessa de desempenho.

### DEMO-02 — JPN Prompt Builder

**Problema:** montar um prompt preservando contexto e restrições.

Entrada fictícia: “Cliente procura guarda-roupa até 2 m, orçamento ainda não confirmado e entrega depende da região.”

Demonstrar:

- contexto confirmado separado de lacunas;
- restrições preservadas;
- perguntas úteis sem inventar condição comercial;
- saída orientada a atendimento.

Estado obrigatório: **QA físico contextual em celular pendente**. A demo não pode ser apresentada como comprovação de compatibilidade final ou compreensão semântica universal.

### DEMO-03 — JPN Prompt Pack

**Problema:** reutilizar uma tarefa recorrente.

Entrada fictícia: responder cliente após ausência de resposta por alguns dias.

Demonstrar:

- escolher apenas um template PP-* adequado;
- adaptar o template aos fatos do caso;
- remover qualquer afirmação não confirmada;
- revisar antes de usar a saída.

### DEMO-04 — JPN Business

**Problema:** transformar uma rotina informal em processo operacional.

Cenário fictício: recebimento e triagem de solicitações de clientes.

Demonstrar:

- responsável;
- entrada;
- decisão;
- saída;
- validação;
- exceção/regra de parada.

Não executar mensagens, integrações, cadastros externos ou automações reais.

### DEMO-05 — JPN Gestão Fácil

**Problema:** acompanhar operação simples de pequena empresa.

Usar exclusivamente dados fictícios.

Demonstrar:

- cadastro de cliente de teste;
- item/produto fictício;
- oportunidade ou venda fictícia;
- tarefa;
- alerta `OK/REPOR`;
- leitura dos indicadores sem tratar a planilha como banco, ERP ou contabilidade oficial.

Estado obrigatório: **GF-QA-10 multiplataforma pendente**. `REPOR` é alerta operacional, não autorização de compra.

### DEMO-06 — JPN Pro Kit

Estado obrigatório: **EM PREPARAÇÃO**.

A demonstração deve explicar composição e critérios de uso, não apresentar o Pro Kit como produto automaticamente recomendado por ser mais abrangente.

Usar o Pro Kit somente para explicar como múltiplos componentes podem se relacionar quando houver necessidade real de mais de uma camada.

## Frases seguras para apresentação

- “Neste exemplo, estamos usando dados fictícios.”
- “Este é o menor recurso suficiente para o problema demonstrado.”
- “O estado de QA deste componente continua pendente onde indicado.”
- “Esta rota de uso não é um bundle nem uma obrigação de seguir para outro produto.”
- “A saída deve ser revisada antes de qualquer uso externo.”

## Frases proibidas

Não usar afirmações como:

- “funciona em qualquer situação”;
- “garante resultado”;
- “substitui um especialista”;
- “elimina erros”;
- “é compatível com tudo”;
- “já está pronto para produção” quando o respectivo QA não estiver aprovado.

A demo não promete eliminar erros, substituir especialistas ou garantir desempenho; ela demonstra estrutura, limites e rastreabilidade.

## Critérios de aprovação da demo

A demonstração candidata só pode ser considerada internamente consistente quando:

- usa apenas dados fictícios/sanitizados;
- identifica o menor recurso suficiente;
- preserva estados reais de QA;
- não apresenta preço, checkout, urgência, ROI ou garantia;
- não executa ação externa;
- termina com revisão e regra de parada.

## Regra de parada

Interrompa a demonstração se surgir qualquer necessidade de:

- usar dado real sensível;
- gastar dinheiro;
- publicar ou enviar conteúdo externamente;
- aceitar termos;
- criar conta;
- realizar compra;
- assumir condição comercial não confirmada;
- promover um estado de QA ainda pendente.

## Próxima etapa segura

Após QA editorial e visual interno, a demo pode servir como superfície auxiliar de apresentação. Isso não autoriza publicação, anúncio, captação de lead, checkout ou venda.