# JPN Prompt Builder — integração com SDK oficial

Esta versão do produto remove a implementação local das regras centrais do JPN.

## Fluxo

1. Execute `npm install`.
2. Execute `npm run build` para gerar `dist/browser/index.js`.
3. Sirva a raiz do repositório por HTTP.
4. Abra `/product-site/`.

O `product-site/app.js` importa diretamente do bundle browser oficial:

- `createJpnDraftFromText()`;
- `validateJpnState()`;
- `assessJpnReadiness()`;
- `buildJpnPrompt()`.

## Guardrail

`npm run check:product-site` falha se o site deixar de importar o bundle oficial, perder um dos exports centrais ou reintroduzir implementações locais duplicadas.

## Limites

A página é uma demonstração local. Não publica checkout, não envia dados para APIs externas e não afirma superioridade quantitativa do JPN. Preço e publicação permanecem fora desta branch.
