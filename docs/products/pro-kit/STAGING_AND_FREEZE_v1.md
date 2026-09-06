# JPN Pro Kit — Staging e congelamento v1

Status: `controle interno`

## Objetivo

Separar três estados que não podem ser confundidos:

1. **fonte versionada** — conteúdo existe e está sob controle de versão;
2. **staging interno** — arquivos já elegíveis são reunidos localmente para inspeção;
3. **artefato final congelado** — versão revisada, com hash calculado depois da última correção.

O staging não publica, não vende e não transforma um item pendente em artefato final.

## Comando

```bash
npm run stage:pro-kit
```

O comando recria `dist/pro-kit-staging/` do zero e gera `STAGING_REPORT.json`.

## O que pode entrar diretamente

Arquivos que já são binários/dados distribuíveis e cujo estado permite staging podem ser copiados, por exemplo:

- `JPN_Gestao_Facil_v0.1_reconstruida.xlsx`;
- índices JSON do Prompt Pack e JPN Business.

O relatório calcula SHA-256 desses arquivos para rastreabilidade interna. Esses hashes **não substituem** os hashes do manifesto final enquanto o pacote não estiver congelado.

## O que não pode ser promovido automaticamente

Fontes Markdown cujo destino final é PDF permanecem apenas como evidência de origem. O script não cria nem finge criar:

- Método JPN PDF;
- Prompt Pack PDF;
- JPN Business PDF;
- Manual Gestão Fácil PDF;
- Leia Primeiro PDF.

Esses itens precisam seguir `EDITORIAL_RELEASE_GATE_v1.md`: gerar, renderizar, inspecionar página a página, corrigir e somente então calcular o hash final.

## Prompt Builder

`04_PROMPT_BUILDER/instrucoes_de_acesso.txt` continua `pending-release-decision`. O staging não inventa URL pública, credencial, conta, checkout ou instrução de acesso antes de uma decisão explícita de release.

## Critério de congelamento

Um item só pode receber `final-artifact-reviewed` quando houver:

- fonte canônica identificada;
- artefato final presente;
- inspeção visual/funcional concluída conforme o tipo do arquivo;
- nenhuma correção pendente conhecida;
- SHA-256 calculado sobre exatamente o arquivo aprovado.

Alterar um artefato depois disso invalida o hash e exige nova inspeção.

## Guardrails

Este fluxo é exclusivamente local/interno. Não autoriza publicação, anúncio, gasto, checkout, criação de conta, uso de dados financeiros reais, aceite de termos legais ou disponibilização pública.
