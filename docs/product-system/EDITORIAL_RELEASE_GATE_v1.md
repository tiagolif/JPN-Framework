# JPN — Gate editorial de artefatos finais v1

Status: `controle interno de pré-diagramação`

## Objetivo

Definir a passagem entre uma fonte editorial versionada e um artefato final diagramado. A existência de Markdown, capa ou manifesto não significa que o PDF correspondente esteja aprovado para distribuição.

## Fontes canônicas desta fase

| Produto | Fonte editorial | Capa/asset de referência | Estado |
|---|---|---|---|
| Método JPN | `docs/products/metodo-jpn/METODO_JPN_v1.md` | `assets/covers/metodo-jpn-v1.svg` | fonte consolidada; PDF final pendente |
| JPN Prompt Pack | `docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md` | `assets/covers/jpn-prompt-pack-v1.svg` | fonte consolidada; PDF final pendente |
| JPN Business | `docs/products/jpn-business/JPN_BUSINESS_v1.md` | `assets/covers/jpn-business-v1.svg` | fonte consolidada; PDF final pendente |
| Gestão Fácil — manual | `docs/products/gestao-facil/MANUAL_v0.1.md` | `assets/covers/jpn-gestao-facil-v01.svg` | fonte versionada; PDF final pendente |
| Pro Kit — leia primeiro | `docs/products/pro-kit/LEIA_PRIMEIRO.md` | `assets/covers/jpn-pro-kit-v1.svg` | fonte versionada; artefato final pendente |
| Pro Kit — release notes | `docs/products/pro-kit/RELEASE_NOTES_v1.md` | Brand Kit v1 | fonte versionada; artefato final pendente |

## Regras antes da diagramação

1. a fonte precisa existir no mesmo commit/branch usado para gerar o artefato;
2. números estruturais devem coincidir com as fontes canônicas: Prompt Pack = 18 estruturas e Business = 12 playbooks;
3. Método, Builder e materiais comerciais não podem prometer resposta perfeita, eliminação de alucinações, ROI, aumento garantido de vendas ou desempenho universal;
4. Gestão Fácil deve permanecer identificada como reconstrução v0.1 enquanto essa for a versão vigente;
5. Pro Kit deve permanecer `Em preparação` até que todos os artefatos do manifesto estejam congelados;
6. nenhum preço, checkout, urgência artificial ou desconto deve ser introduzido durante geração editorial;
7. exemplos não devem inserir dados pessoais, financeiros ou credenciais reais.

## Regras do artefato final

Cada PDF final deve registrar, no mínimo:

- nome exato do produto;
- versão;
- referência à família JPN;
- capa coerente com o Brand Kit;
- hierarquia tipográfica consistente;
- páginas sem clipping, overflow ou elementos cortados;
- links legíveis quando existirem;
- ausência de páginas vazias não intencionais;
- revisão ortográfica final;
- inspeção página a página depois da exportação.

## Registro mínimo de evidência

Para promover um item de `pending-final-artifact` para `final-artifact-reviewed`, registrar:

- caminho da fonte;
- commit da fonte;
- caminho do artefato gerado;
- SHA-256 do artefato congelado;
- ferramenta/fluxo de exportação;
- resultado da inspeção visual;
- correções realizadas;
- status final.

O hash deve ser calculado somente depois da última correção. Alterar o arquivo invalida o hash anterior.

## Ordem segura de fechamento

1. congelar fonte editorial;
2. executar gates mecânicos;
3. diagramar/exportar;
4. inspecionar o arquivo final;
5. corrigir a fonte ou template, nunca maquiar silenciosamente o PDF;
6. exportar novamente;
7. calcular hash;
8. atualizar manifesto;
9. montar pacote final;
10. somente depois considerar autorização separada para publicação.

## O que este gate não autoriza

Este documento não autoriza publicação, venda, criação de checkout, anúncio pago, gasto, contratação de serviço, aceite legal, criação de conta, uso de dado financeiro real ou disponibilização pública dos artefatos.
