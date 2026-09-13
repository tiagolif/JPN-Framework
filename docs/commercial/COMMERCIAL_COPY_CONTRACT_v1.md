# JPN — Contrato Canônico de Copy Comercial v1

Este documento torna o `COPY_BANK_v1.md` verificável sem transformar copy interna em publicação, oferta ou promessa de resultado.

## O que passa a ser canônico

Para cada um dos seis produtos JPN ficam estruturados cinco elementos: headline, subheadline, descrição curta, CTA neutro e limite obrigatório. O conteúdo continua vindo do Copy Bank existente; este contrato não cria uma segunda narrativa comercial concorrente.

A fonte estruturada é `docs/commercial/COMMERCIAL_COPY_CONTRACT_v1.json`.

## Produtos cobertos

- Método JPN
- JPN Prompt Pack
- JPN Business
- JPN Prompt Builder
- JPN Pro Kit
- JPN Gestão Fácil

A cobertura deve permanecer idêntica a `PRODUCT_PORTFOLIO_v1.json`.

## Regras de uso

A copy pode explicar problema, método, utilidade, público e limite real. Não pode inventar preço, desconto, bônus, prazo, disponibilidade, compatibilidade universal ou canal de venda.

CTAs aprováveis neste estágio são apenas informativos e reversíveis, como “Conhecer o produto”, “Ver como funciona”, “Comparar os produtos” e “Consultar as perguntas frequentes”. Verbos transacionais como comprar, assinar, pagar ou reservar permanecem fora do contrato.

## Estados que não podem desaparecer da copy

- Prompt Builder: o QA físico/contextual em celular permanece pendente enquanto o release não comprovar o contrário.
- JPN Gestão Fácil: o QA multiplataforma do mesmo XLSX candidato permanece pendente; `REPOR` continua sendo alerta operacional, não autorização de compra.
- JPN Pro Kit: permanece `EM PREPARAÇÃO` até decisão formal de release.
- Prompt Pack: 18 templates canônicos.
- JPN Business: 12 playbooks.

## Claims bloqueados

Sem evidência específica, continuam bloqueados claims como aumento de vendas, economia quantificada, eliminação de erros, compatibilidade universal, “100% privado”, substituição de profissional/ERP, garantia de resultado e urgência ou escassez inventada.

## Validação

`scripts/check-commercial-copy-contract.mjs` compara a cobertura com o portfólio canônico, verifica campos obrigatórios, CTAs, estados materiais e guardrails. O gate é executado por `scripts/check-product-portfolio.mjs`.

A validação mecânica protege consistência; ela não autoriza publicação nem substitui revisão editorial humana.

`publication_authorized: false`  
`release_effect: none`
