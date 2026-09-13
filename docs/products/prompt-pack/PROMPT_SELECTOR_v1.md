# JPN Prompt Pack — Seletor local v1

> Estado: `candidate utility / editorial QA pending`
>
> Fontes canônicas: `PROMPT_INDEX.json` + `PROMPT_SELECTION_WORKBOOK_v1.md`
>
> Interface: `prompt-pack-site/index.html`

## Objetivo

Reduzir o atrito para escolher um dos 18 templates do JPN Prompt Pack sem transformar a seleção em automação, autorização externa ou recomendação opaca.

O seletor funciona inteiramente no navegador. Ele não usa API externa, não exige login, não envia o objetivo digitado para servidor e não grava histórico.

## Como usar

1. Descreva o objetivo real da tarefa.
2. Opcionalmente selecione uma categoria.
3. Marque riscos presentes na tarefa.
4. Clique em **Recomendar templates**.
5. Avalie até três candidatos e escolha o primeiro que resolva a necessidade sem ampliar o escopo.
6. Aplique o teste de aderência do workbook antes de executar o prompt.

Também é possível usar `Ctrl+Enter` ou `Cmd+Enter` no campo do objetivo.

## Como a recomendação funciona

A recomendação usa correspondência local e determinística entre:

- categoria do template;
- palavras ligadas ao objetivo;
- sinais de uso descritos no workbook.

Não há modelo de IA por trás da escolha. Isso é intencional: a ferramenta é um atalho de navegação, não um substituto da avaliação do usuário.

Quando não existe correspondência textual forte, a interface informa isso e mantém a decisão manual.

## Proteções

O seletor trata como condição de parada, sem executar nada:

- publicação, envio ou outra ação externa não autorizada;
- gasto, compra ou contratação;
- credencial, segredo ou dado sensível desnecessário;
- preço, estoque, desconto, prazo ou condição comercial não confirmados;
- decisão jurídica, médica, financeira, tributária, contábil ou especializada sem base e revisão adequadas.

Marcar um risco não bloqueia a leitura dos templates. Ele exibe o limite que deve permanecer visível antes da próxima ação.

## Privacidade e operação offline

Arquivos necessários:

- `prompt-pack-site/index.html`
- `prompt-pack-site/styles.css`
- `prompt-pack-site/app.js`

Abra `index.html` diretamente no navegador. Como o catálogo dos 18 templates está embutido no `app.js`, a ferramenta não depende de `fetch()`, CDN, fonte web, analytics ou outro serviço remoto.

## Fonte de verdade

`PROMPT_INDEX.json` continua sendo o índice canônico de IDs, nomes e categorias. O seletor deve espelhar exatamente seus 18 registros.

O checker `scripts/check-prompt-pack-selector.mjs` existe para impedir divergência silenciosa entre a interface e o índice.

## Limites de release

Este utilitário não muda o estado de release do JPN Prompt Pack. Ele não conclui revisão editorial humana, não gera PDF final e não autoriza materialização ou publicação comercial.
