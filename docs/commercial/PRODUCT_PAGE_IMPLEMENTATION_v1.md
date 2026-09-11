# JPN — Product Page Implementation v1

Status: `candidate / internal / not published`

Base: `PRODUCT_PAGE_COPY_v1.md` + superfície existente em `commercial-site/products/`.

## Objetivo

Sincronizar as páginas comerciais internas com fatos e estados adicionados nas camadas de produto mais recentes, sem criar oferta, preço, checkout, anúncio, publicação ou coleta de dados.

## Alterações aplicadas

### JPN Prompt Builder

A página passa a explicitar:

- proteção local para possível conteúdo sensível sem claim de DLP/compliance;
- Modo Temporário e seu limite real;
- montagem do prompt sem dependência de API externa;
- QA físico contextual em celular real ainda pendente;
- verificações assistivas humanas ainda pendentes.

### JPN Business

A página passa a explicitar:

- 12 playbooks canônicos;
- uso gradual em vendas, atendimento, marketing e operação;
- revisão de resultado em 30 dias com evidência qualitativa não financeira;
- decisões `MANTER`, `AJUSTAR`, `PAUSAR` e `DESCARTAR_NESTE_CASO`;
- ausência de promessa de aumento de vendas, retorno financeiro ou produtividade garantida.

### JPN Gestão Fácil

A página passa a explicitar:

- candidata v0.2;
- oito abas canônicas: Leia-me, Dashboard, Clientes, Vendas, Tarefas, Estoque, Financeiro e Listas;
- `REPOR` apenas como alerta operacional;
- Financeiro apenas como registro gerencial;
- `GF-QA-10` ainda pendente;
- necessidade de validar o mesmo XLSX em Microsoft Excel, LibreOffice Calc e Google Sheets.

## Páginas preservadas

Método JPN, JPN Prompt Pack e JPN Pro Kit já continham os principais fatos e estados necessários nesta camada. Foram preservados para evitar reescrita sem ganho de informação.

Invariantes mantidos:

- Prompt Pack: 18 templates canônicos;
- JPN Business: 12 playbooks canônicos;
- Pro Kit: `EM PREPARAÇÃO`;
- ausência de preço e checkout;
- `noindex,nofollow`;
- nenhuma URL externa ou formulário de coleta.

## Gate de sincronização

Foi adicionado `scripts/check-commercial-page-copy-sync.mjs`.

Execução manual:

```bash
node scripts/check-commercial-page-copy-sync.mjs
```

O gate verifica fatos selecionados nas seis páginas, estados bloqueantes, `noindex,nofollow` e padrões comerciais proibidos. Ele complementa os gates já existentes da superfície comercial; não substitui QA visual, acessibilidade manual ou revisão editorial humana.

O verificador também está encadeado em `scripts/check-commercial-copy.mjs`. Como `check:commercial-copy` já participa de `npm run build`, divergências futuras entre a copy canônica e as seis páginas passam a bloquear o build principal em vez de depender somente da execução manual do checker.

## Estado que continua pendente

- QA visual das páginas em desktop e mobile reais;
- teste manual de teclado e leitor de tela;
- QA físico contextual do Prompt Builder em celular;
- `GF-QA-10` da Gestão Fácil;
- revisão editorial humana final;
- validação dos PDFs candidatos;
- freeze dos entregáveis;
- manifesto e SHA-256 somente depois do freeze;
- CI no mesmo head definitivo.

## Guardrails

Este material não autoriza publicação, anúncio, venda, preço, checkout, coleta de pagamento, criação de conta, aceite legal ou contratação de serviço. Nenhum dado financeiro real é necessário para esta camada.
