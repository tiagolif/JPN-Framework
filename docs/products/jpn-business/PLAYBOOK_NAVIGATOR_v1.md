# JPN Business — Navegador local de playbooks v1

## Objetivo

Ajudar a escolher o menor playbook suficiente entre os 12 playbooks canônicos de `BUSINESS_INDEX.json`, sem API externa, login, analytics, publicação ou execução automática.

## Como usar

1. Descreva a situação real em poucas linhas.
2. Se souber a área, filtre por comercial, atendimento, operações, marketing, gestão ou conhecimento.
3. Marque limites materiais quando houver ação externa, gasto, dados sensíveis ou decisão especializada.
4. Clique em **Sugerir playbooks**.
5. Revise até três candidatos e confirme manualmente a aderência.
6. Use os IDs do Prompt Pack indicados como apoio quando isso reduzir o trabalho sem ampliar o escopo.

## Fonte de verdade

Os IDs, nomes, categorias e vínculos com Prompt Pack vêm de `docs/products/jpn-business/BUSINESS_INDEX.json`. O navegador deve permanecer sincronizado com os 12 playbooks desse índice.

## Privacidade e operação

A ferramenta roda no navegador e não usa API externa. Não envia o texto digitado, não possui formulário de envio, não faz tracking e não grava dados em servidor.

## Limites

O ranking é uma heurística determinística baseada em palavras-chave e categoria. Ele não substitui leitura do playbook, revisão humana, autorização para ações externas ou aconselhamento profissional. Marcar um risco não bloqueia tecnicamente o navegador; exibe uma condição de parada para orientar a decisão.

## Estado

Ferramenta candidata e interna. `noindex,nofollow`. Não altera o estado de release do JPN Business e não materializa o PDF final.
