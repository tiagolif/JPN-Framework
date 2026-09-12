# Human Release Workbench v1

## Objetivo

Consolidar em um único pacote regenerável os gates humanos ou dependentes de ambiente externo que estão realmente executáveis no estado atual do portfólio JPN.

O workbench é derivado de:

- `docs/product-system/RELEASE_EXECUTION_PLAN_v1.json`;
- `docs/product-system/PRODUCT_RELEASE_STATUS_v1.json`.

Ele não substitui nenhum dos dois arquivos e não altera estados.

## Uso

Via scripts npm:

```bash
npm run check:human-release-workbench
npm run build:human-release-workbench
```

Os comandos diretos equivalentes continuam disponíveis:

```bash
node scripts/build-human-release-workbench.mjs --check
node scripts/build-human-release-workbench.mjs
```

A validação `check:human-release-workbench` faz parte de `npm run build`. Assim, qualquer mudança que torne a fila inconsistente, inclua gate humano bloqueado ou deixe uma ação `autonomous-local` executável sem tratamento quebra o pipeline principal em vez de passar silenciosamente.

A execução de `build:human-release-workbench` gera em `dist/release-human-workbench/`:

- `HUMAN_RELEASE_WORKBENCH.md`;
- `human-release-workbench.json`.

## O que entra no pacote

Somente dependências que simultaneamente:

1. ainda não estejam em `passed` ou `not-applicable`;
2. tenham todos os `blocked_by` satisfeitos;
3. possam ser executadas sem nova autorização;
4. tenham modo `requires-human-inspection` ou `requires-external-environment`.

Gates de CI e gates `autonomous-local` bloqueados não são apresentados como trabalho humano aberto.

## Invariantes

- `publication_authorized` deve continuar `false`;
- o workbench nunca promove status;
- nenhuma revisão humana pode ser inferida por ausência de erro mecânico;
- evidência deve pertencer ao mesmo artefato efetivamente revisado;
- alteração posterior do artefato invalida a evidência anterior;
- se surgir uma ação `autonomous-local` realmente executável, o checker falha para impedir que a automação a ignore e transfira trabalho indevidamente ao humano.

## Estado atual esperado

Com o contrato vigente, o workbench reúne os gates imediatamente disponíveis de Método JPN, JPN Prompt Pack, JPN Business, JPN Prompt Builder e Gestão Fácil. Os PDFs finais, CI, pacote offline, freeze e hashes permanecem fora até que seus pré-requisitos sejam satisfeitos.

## Limites

A geração do workbench não significa aprovação editorial, visual, assistiva, de compatibilidade, CI, freeze, release ou publicação. Nenhum gasto, anúncio, checkout, dado financeiro real, criação de conta ou aceite legal é necessário ou autorizado por este mecanismo.
