# JPN Prompt Builder — Início rápido operacional v1

> Estado: `candidate companion / physical mobile QA pending`
>
> Objetivo: ajudar a sair de uma necessidade real para um primeiro prompt estruturado com o menor atrito possível, sem transformar o Prompt Builder em automação, aprovação humana ou promessa de resultado.

## Antes de começar

Use o Prompt Builder quando você já sabe **o que quer pedir à IA**, mas precisa organizar contexto, objetivo, critérios e formato da resposta de forma mais consistente.

Se você ainda não sabe qual problema está tentando resolver, comece pelo Método JPN. Se já existe um template pronto que atende o caso, use primeiro o JPN Prompt Pack. A regra é sempre usar o **menor recurso suficiente**.

## Primeiro resultado em 5 minutos

### 1. Defina a Jornada

Responda em uma frase:

- Qual é a tarefa?
- Para quem ou para qual contexto ela existe?
- Qual resultado útil você espera?

Exemplo fictício:

`Criar uma resposta curta para um cliente que pediu prazo de entrega, sem inventar uma data que ainda não foi confirmada.`

### 2. Adicione Precisão

Inclua apenas informações verificadas e relevantes:

- fatos confirmados;
- restrições;
- dados que não podem ser inventados;
- formato desejado;
- condição de parada quando faltar informação.

Use estes estados de confiança quando necessário:

- `confirmed`: informação explicitamente confirmada;
- `inferred`: hipótese razoável, mas não comprovada;
- `unknown`: informação ausente;
- `conflicting`: fontes disponíveis entram em conflito.

Nunca transforme `inferred`, `unknown` ou `conflicting` em fato confirmado.

### 3. Defina a Narrativa

Escolha como a resposta deve chegar ao usuário final:

- tom;
- nível de detalhe;
- estrutura;
- idioma;
- tamanho aproximado;
- elementos que devem ou não aparecer.

Exemplo fictício:

`Tom profissional e cordial; até 4 frases; português do Brasil; não mencionar prazo exato se ele não estiver confirmado.`

### 4. Gere e revise

Gere o prompt e faça uma revisão rápida:

- O objetivo está explícito?
- Há contexto suficiente?
- Alguma suposição foi apresentada como fato?
- O formato da resposta está claro?
- Existe uma condição de parada quando faltar informação material?

### 5. Teste com dados fictícios ou sanitizados

Antes de usar em um processo real com risco operacional, teste o prompt com exemplos fictícios ou sanitizados.

Não use no teste:

- credenciais;
- dados financeiros reais;
- documentos de identidade;
- informações pessoais desnecessárias;
- segredos comerciais que não precisem estar no prompt.

## Fluxo rápido JPN

| Camada | Pergunta mínima | Saída esperada |
|---|---|---|
| Jornada | O que precisa acontecer e por quê? | tarefa + contexto + resultado |
| Precisão | O que é fato, limite e condição de parada? | critérios + restrições + confiança |
| Narrativa | Como a resposta deve ser apresentada? | tom + formato + estrutura |

## Presets

O Prompt Builder possui presets guiados e presets personalizados como superfícies candidatas do produto.

Use um preset somente quando ele reduzir trabalho sem esconder uma restrição importante. Revise campos herdados antes de gerar o prompt.

Não trate um preset como autorização automática para enviar, publicar, comprar, contratar, apagar, aprovar ou executar uma ação externa.

## Workspaces locais

Os workspaces locais servem para organizar trabalho no dispositivo e reduzir repetição de contexto.

Antes de reutilizar um workspace:

1. confirme que o contexto ainda é válido;
2. remova dados que não são mais necessários;
3. confira se não há informação sensível indevida;
4. atualize fatos que possam ter mudado;
5. interrompa o uso se houver conflito entre fontes.

## Quando parar

Pare e peça revisão humana quando o prompt depender de:

- preço, desconto, prazo, estoque ou condição comercial não confirmada;
- publicação ou envio externo sem autorização;
- gasto, compra, contratação ou compromisso financeiro;
- credencial, chave, token ou senha;
- dado financeiro real;
- decisão bancária, contábil, tributária, de crédito ou investimento;
- aceite de termos, contratos ou obrigações legais;
- criação de conta que exija verificação de identidade;
- fonte conflitante que altere materialmente a resposta.

## Checklist antes de copiar o prompt

- [ ] A tarefa está explícita.
- [ ] O contexto necessário foi incluído.
- [ ] Fatos e hipóteses estão separados.
- [ ] O formato da saída está definido.
- [ ] A condição de parada está clara.
- [ ] Nenhuma credencial ou dado sensível desnecessário foi incluído.
- [ ] Nenhuma ação externa foi tratada como automaticamente autorizada.

## Checklist depois do primeiro teste

- [ ] A IA entendeu a tarefa sem pedir contexto óbvio que já poderia estar no prompt.
- [ ] A saída respeitou os limites definidos.
- [ ] Nenhuma informação foi inventada como fato.
- [ ] O formato foi útil para o objetivo real.
- [ ] O prompt pode ser simplificado sem perder contexto importante.
- [ ] Se o caso for recorrente, ele pode virar candidato a preset ou template depois de revisão humana.

## Estado de QA

Este guia não altera o estado de release do Prompt Builder.

O **QA físico contextual do Prompt Builder em celular continua pendente**. Testes automáticos, documentação, staging ou inspeção de código não substituem a validação real em dispositivo móvel.

Este documento também não comprova compatibilidade universal entre navegadores, sistemas operacionais ou dispositivos.

## Relação com os demais produtos

- **Método JPN**: ajuda a estruturar o raciocínio antes da montagem.
- **Prompt Builder**: transforma contexto e critérios em um prompt estruturado.
- **Prompt Pack**: oferece 18 templates candidatos reutilizáveis para casos recorrentes.
- **JPN Business**: organiza 12 playbooks operacionais que podem reutilizar prompts.
- **Gestão Fácil**: acompanha informações de pequena empresa em planilha candidata, com GF-QA-10 ainda pendente.
- **JPN Pro Kit**: reúne componentes do ecossistema, mas permanece `EM PREPARAÇÃO`.

## Regra final

Um prompt bem estruturado melhora a clareza da instrução, mas não garante qualidade, resultado comercial, ausência de erro ou autorização para executar ações fora da conversa.
