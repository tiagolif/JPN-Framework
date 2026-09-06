# JPN Pro Kit v1 — Mapa de Entrega

Base: JPN Framework `0.3.0-draft`.

Este mapa distingue **fonte canônica**, **formato de entrega futuro** e **status real**. Ele não apresenta rascunhos ou artefatos pendentes como concluídos.

| Componente | Fonte canônica atual | Entrega planejada | Status no candidato |
|---|---|---|---|
| Método JPN | `docs/products/metodo-jpn/METODO_JPN_v1.md` | PDF + DOCX/Markdown fonte | presente como draft consolidado |
| JPN Prompt Pack | `docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md` | PDF + índice JSON | presente como draft consolidado, 18 cartões |
| Índice Prompt Pack | `docs/products/prompt-pack/PROMPT_INDEX.json` | JSON | presente |
| JPN Business | `docs/products/jpn-business/JPN_BUSINESS_v1.md` | PDF + Markdown fonte | presente como draft consolidado, 12 playbooks |
| Índice Business | `docs/products/jpn-business/BUSINESS_INDEX.json` | JSON | presente |
| Prompt Builder | `product-site/` | aplicação web estática | integração SDK em cadeia de PRs; não publicada |
| JPN Gestão Fácil | `deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx` | XLSX | binário versionado; GF-QA-01 a GF-QA-09 aprovados localmente; compatibilidade cruzada pendente |
| Manual Gestão Fácil | `docs/products/gestao-facil/MANUAL_v0.1.md` | PDF | fonte editorial versionada; artefato PDF final pendente |
| Guia inicial | `docs/products/pro-kit/LEIA_PRIMEIRO.md` | PDF/TXT/Markdown | presente |
| Checklist de release | `docs/products/pro-kit/RELEASE_CHECKLIST.md` | Markdown interno | presente |
| Manifesto | `docs/products/pro-kit/MANIFEST.template.json` | JSON final com hashes | template presente; congelamento pendente |
| Release notes | `docs/products/pro-kit/RELEASE_NOTES_v1.md` | Markdown/PDF opcional | presente |

## Estrutura de pasta prevista para o pacote final

```text
JPN_Pro_Kit_v1/
├── 00_LEIA_PRIMEIRO/
│   └── LEIA_PRIMEIRO.pdf
├── 01_METODO_JPN/
│   ├── METODO_JPN_v1.pdf
│   └── METODO_JPN_v1.docx
├── 02_PROMPT_PACK/
│   ├── JPN_PROMPT_PACK_v1.pdf
│   └── PROMPT_INDEX.json
├── 03_JPN_BUSINESS/
│   ├── JPN_BUSINESS_v1.pdf
│   └── BUSINESS_INDEX.json
├── 04_PROMPT_BUILDER/
│   └── instrucoes_de_acesso.txt
├── 05_GESTAO_FACIL/
│   ├── JPN_Gestao_Facil_v0.1_reconstruida.xlsx
│   └── MANUAL_GESTAO_FACIL_v1.pdf
├── 90_DOCUMENTACAO/
│   ├── RELEASE_NOTES_v1.pdf
│   └── MANIFEST.json
└── 99_FONTES_EDITAVEIS/  (somente se decidido para a oferta)
```

Essa árvore é uma especificação de empacotamento, não uma afirmação de que todos os binários já estão finalizados.

## Estado específico da Gestão Fácil

A edição reconstruída v0.1 está rastreada no repositório. Os testes funcionais GF-QA-01 a GF-QA-09 foram registrados em `docs/products/gestao-facil/QA_EXECUTION_v0.1.md`. O gate GF-QA-10 continua pendente porque requer validar o mesmo binário em Microsoft Excel, LibreOffice Calc e Google Sheets. O manual final em PDF também continua pendente.

## Política de inclusão

Um item só entra na pasta final quando:

1. possui versão;
2. está no mínimo em `release-candidate`;
3. abre corretamente no formato final;
4. não contém placeholders acidentais;
5. não contém segredo, chave, dado financeiro ou dado pessoal não necessário;
6. sua origem está registrada no manifesto;
7. seu conteúdo não contradiz a versão-base declarada do JPN.

## Política de fontes editáveis

Fontes Markdown, arquivos de design e versões editáveis não são automaticamente parte da entrega comercial. A decisão de incluí-los pertence à definição final da oferta. Até lá, devem ficar separados da pasta destinada ao cliente.
