# JPN SDK no navegador

Status: draft experimental para `0.3.0-draft`.

## Objetivo

Disponibilizar o mesmo núcleo do SDK JPN em um bundle ESM compatível com navegador, sem manter uma segunda implementação manual para produtos estáticos como o JPN Prompt Builder.

## Build

```bash
npm install
npm run build:browser
```

Saída:

```text
dist/browser/index.js
```

O bundle é gerado com `esbuild` a partir de `src/index.ts`, portanto usa os mesmos módulos TypeScript do SDK principal.

## Import

```js
import {
  validateJpnState,
  buildJpnPrompt,
  assessJpnReadiness
} from "jpn-framework-sdk/browser";
```

Quando `createJpnDraftFromText()` estiver incorporado ao SDK principal, ele será incluído automaticamente no bundle porque o target parte do mesmo `src/index.ts`.

## Decisão de arquitetura

O bundle browser não é uma implementação paralela. Ele é um artefato de build do SDK oficial. Isso reduz o risco de divergência entre:

- SDK Node;
- Prompt Builder;
- Validator local;
- futuras páginas e ferramentas comerciais.

## Validador

O carregamento do JSON Schema não depende mais de `node:fs`. O schema é importado como módulo JSON e empacotado no bundle de navegador.

## Verificação automática

`scripts/check-browser-build.mjs` falha o build se encontrar referências conhecidas a runtime Node ou se exports essenciais desaparecerem.

## Limites atuais

- este PR não publica pacote npm nem site;
- não altera o JSON Schema;
- não altera a semântica de validação;
- não adiciona chamadas de rede;
- não inclui checkout, analytics ou serviços externos.

## Próxima integração

Depois que o parser conservador de texto bruto entrar no SDK principal, o JPN Prompt Builder deve importar `createJpnDraftFromText`, `validateJpnState`, `assessJpnReadiness` e `buildJpnPrompt` diretamente deste target browser, removendo a lógica duplicada da demo comercial.
