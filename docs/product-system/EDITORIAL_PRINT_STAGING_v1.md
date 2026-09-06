# JPN — Staging editorial imprimível v1

Status: `controle interno de pré-exportação`

## Objetivo

Criar uma superfície reproduzível entre as fontes Markdown canônicas e os PDFs finais, sem promover automaticamente nenhum documento para `final-artifact-reviewed`.

O comando:

```bash
npm run build:editorial-print
```

gera uma área local em:

```text
dist/editorial-print-staging/
```

## Documentos incluídos

Nesta fase, o staging cobre os cinco artefatos editoriais prioritários do Pro Kit:

1. Método JPN v1;
2. JPN Prompt Pack v1;
3. JPN Business v1;
4. JPN Gestão Fácil — Manual v0.1;
5. JPN Pro Kit — Leia Primeiro v1.

Cada página é montada diretamente da fonte canônica e da capa SVG já versionada. Nenhum preço, checkout, desconto, urgência comercial, promessa de ROI ou claim novo é adicionado pelo gerador.

## Saídas

O gerador cria:

- `dist/editorial-print-staging/index.html` — índice interno;
- um `index.html` por documento;
- `dist/editorial-print-staging/manifest.json` — inventário da execução.

O HTML possui CSS de impressão A4 com regras para:

- capa em página dedicada;
- hierarquia de títulos;
- tabelas;
- listas;
- blocos de código;
- blockquotes;
- links;
- controle básico de órfãs/viúvas;
- redução de quebras dentro de tabelas e blocos de código.

## Estado que este staging prova

Ele prova apenas que:

- a fonte editorial canônica existe;
- a capa prevista existe;
- ambos podem ser reunidos em uma superfície imprimível reproduzível;
- a conversão Markdown → HTML não exige serviço externo, conta ou pagamento.

Ele **não** prova que o PDF final está aprovado.

## Procedimento para promover um PDF

Para cada documento:

1. executar os gates mecânicos do repositório;
2. gerar o staging imprimível;
3. exportar a página correspondente para PDF usando um fluxo controlado;
4. renderizar o PDF em imagens;
5. inspecionar todas as páginas para clipping, páginas vazias, tabelas quebradas, caracteres ausentes e contraste;
6. corrigir a fonte ou o gerador se houver problema;
7. exportar novamente;
8. repetir a inspeção;
9. calcular SHA-256 somente após a última correção;
10. registrar evidência e só então mudar o estado no manifesto.

## Guardrails

Este fluxo não autoriza:

- publicar arquivos;
- criar checkout;
- comprar domínio, ferramenta ou anúncio;
- criar conta externa;
- aceitar termos legais;
- usar dados financeiros reais;
- declarar o Pro Kit pronto enquanto seus gates bloqueantes permanecerem abertos.

## Próximo gate

A próxima etapa material é exportar os cinco HTMLs para PDF e executar inspeção página a página. Enquanto isso não acontecer, `pdfs-final` deve continuar pendente no relatório de prontidão.
