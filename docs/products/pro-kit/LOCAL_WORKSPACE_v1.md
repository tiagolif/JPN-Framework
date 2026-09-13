# JPN Pro Kit — Workspace local v1

Status: **companion interno / EM PREPARAÇÃO**  
Efeito sobre release: **nenhum**.

## Objetivo

`pro-kit-site/index.html` é um ponto de entrada local para componentes do ecossistema JPN que já possuem superfícies ou materiais utilizáveis durante a preparação.

Ele existe para reduzir navegação e ajudar a aplicar a regra do **menor recurso suficiente**. Não representa o pacote final do JPN Pro Kit, não substitui `USAGE_ROUTING_GUIDE_v1.md` e não altera `RELEASE_GATES.json`.

## Componentes apresentados

| Componente | Entrada local | Estado material preservado |
|---|---|---|
| Método JPN | `metodo-jpn-site/index.html` | revisão editorial humana e PDF final pendentes |
| JPN Prompt Pack | `prompt-pack-site/index.html` | revisão editorial humana e PDF final pendentes |
| JPN Business | `business-site/index.html` | diagramação final em andamento; revisão editorial e PDF pendentes |
| JPN Prompt Builder | `product-site/index.html` | QA físico contextual em celular, CI final e pacote offline final pendentes |
| JPN Gestão Fácil | Quick Start + kit de importação v0.3 | QA do mesmo arquivo nas três plataformas e arquivo final validado pendentes |

A fonte canônica desses estados é `COMPONENT_READINESS_ROLLUP_v1.json`, que por sua vez espelha `docs/product-system/PRODUCT_RELEASE_STATUS_v1.json`.

## O que a página faz

- reúne atalhos **relativos e locais**;
- resume quando começar por cada componente;
- mostra quatro rotas mínimas de combinação;
- mantém os estados pendentes à vista;
- repete condições de parada para ações que exigem autorização ou evidência adicional;
- permite impressão para revisão interna.

## O que a página não faz

- não materializa o Pro Kit final;
- não cria ZIP, manifesto final ou hashes;
- não congela nenhum artefato;
- não aprova QA ou CI;
- não transforma candidatos em releases;
- não publica conteúdo, anúncio ou página comercial;
- não inclui preço, checkout ou captura de lead;
- não executa chamadas de rede;
- não usa dados financeiros reais, credenciais ou dados de identidade;
- não aceita termos legais nem cria contas.

## Gestão Fácil

O workspace **não** aponta `deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx` como entrega atual. Esse binário histórico não deve ser promovido por conveniência.

Enquanto o arquivo candidato/final validado não estiver disponível, a entrada da Gestão Fácil aponta somente documentação de início e preparação de importação.

## Critério para evolução

Uma versão futura deste workspace pode apontar artefatos congelados somente depois que os gates canônicos correspondentes estiverem aprovados. Até lá, qualquer mudança deve preservar explicitamente **EM PREPARAÇÃO** e `release_effect: none`.

## Fontes

- `docs/products/pro-kit/USAGE_ROUTING_GUIDE_v1.md`
- `docs/products/pro-kit/COMPONENT_READINESS_ROLLUP_v1.json`
- `docs/products/pro-kit/READINESS_MATRIX_v1.md`
- `docs/products/pro-kit/RELEASE_GATES.json`
- `docs/product-system/PRODUCT_RELEASE_STATUS_v1.json`
