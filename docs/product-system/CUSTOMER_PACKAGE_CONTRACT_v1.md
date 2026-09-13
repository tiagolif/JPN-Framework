# JPN — Contrato de pacote ao cliente v1

**Estado:** candidato interno · release evidence pendente  
**Publicação autorizada:** não  
**Efeito de release:** nenhum

Este contrato transforma o guia de handoff existente em uma estrutura verificável para os futuros pacotes entregáveis dos seis produtos JPN. Ele não cria ZIP, PDF, XLSX final, hashes finais nem disponibilidade comercial.

## Estrutura padrão

```text
JPN_<PRODUTO>_<VERSAO>/
├── 00_COMECE_AQUI/
│   ├── README_ENTREGA.md
│   └── CHANGELOG_RESUMIDO.md
├── 01_PRODUTO/
├── 02_GUIAS/
├── 03_EXEMPLOS/
├── 04_REFERENCIAS/
└── 99_INTEGRIDADE/
    ├── MANIFEST.txt
    └── SHA256SUMS.txt
```

Pastas sem conteúdo útil podem ser omitidas. A estrutura é uma projeção de entrega, não autorização para materializar pacote final.

## Regras de materialização

1. Todas as dependências canônicas do produto precisam estar aprovadas por evidência válida.
2. O artefato principal deve ser o mesmo artefato efetivamente aprovado no gate correspondente.
3. `MANIFEST.txt` só lista arquivos presentes no pacote congelado.
4. `SHA256SUMS.txt` só é gerado depois do freeze.
5. Qualquer alteração de byte invalida hashes anteriores.
6. Materiais comerciais, artes, preços, checkout e tracking não são componentes automáticos do pacote.
7. Credenciais, dados pessoais e dados financeiros reais não pertencem ao pacote.

## Projeção por produto

| Produto | Artefato principal projetado | Gates que permanecem obrigatórios |
|---|---|---|
| Método JPN | `Metodo_JPN.pdf` | revisão editorial humana + PDF final |
| JPN Prompt Pack | `JPN_Prompt_Pack.pdf` | revisão editorial humana + PDF final |
| JPN Business | `JPN_Business.pdf` | revisão editorial humana + diagramação final + PDF final |
| JPN Prompt Builder | `JPN_Prompt_Builder_Offline.zip` | QA físico/contextual em celular + CI final + pacote offline final |
| JPN Gestão Fácil | `JPN_Gestao_Facil_FINAL.xlsx` | GF-QA-10 + arquivo final validado |
| JPN Pro Kit | `COMPONENTES_CONGELADOS` | artefatos congelados + hashes finais + CI final |

## Relação com os contratos existentes

- `CUSTOMER_DELIVERY_HANDOFF_v1.md` define a experiência e as regras de handoff.
- `DELIVERABLE_CATALOG_v1.json` registra candidatos existentes, sem confundir presença com release.
- `PRODUCT_DELIVERY_MANIFESTS_v1.json` define o que o cliente deve receber por produto.
- `PRODUCT_RELEASE_STATUS_v1.json` continua sendo a fonte de verdade das dependências.

O novo `CUSTOMER_PACKAGE_CONTRACT_v1.json` não substitui nenhuma dessas fontes; ele conecta as quatro para reduzir ambiguidade na montagem futura.

## Fronteira atual

Todos os seis produtos permanecem com `materialization_allowed: false`. Isso é intencional. O contrato pode avançar autonomamente, mas a materialização final depende dos gates humanos, físicos, multiplataforma e de CI já registrados no projeto.
