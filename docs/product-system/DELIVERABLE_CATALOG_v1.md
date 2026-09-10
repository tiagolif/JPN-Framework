# Catálogo de Entregáveis JPN v1

**Estado:** candidate inventory / release evidence pending  
**Fonte estruturada:** `docs/product-system/DELIVERABLE_CATALOG_v1.json`

## Objetivo

Este catálogo responde a uma pergunta operacional simples: **quais arquivos já existem hoje para cada produto e o que ainda impede tratá-los como entrega final?**

Presença no repositório não equivale a aprovação humana, compatibilidade final, PDF final, freeze, hash final, CI verde ou autorização de publicação.

## Método JPN

Candidatos principais:
- `METODO_JPN_v1.md`;
- `METODO_JPN_QUICK_REFERENCE_v1.md`;
- `METODO_JPN_PRACTICE_WORKBOOK_v1.md`.

Ainda depende de revisão editorial humana e PDF final antes de release.

## JPN Prompt Pack

Candidatos principais:
- `JPN_PROMPT_PACK_v1.md`;
- `JPN_PROMPT_PACK_QUICK_REFERENCE_v1.md`;
- `PROMPT_INDEX.json`;
- `PROMPT_SELECTION_WORKBOOK_v1.md`.

Ainda depende de revisão editorial humana e PDF final.

## JPN Business

Candidatos principais:
- documento dos 12 playbooks;
- referência rápida;
- índice canônico;
- especificação do candidato imprimível;
- workbook de implementação;
- scorecard operacional;
- sprint de 30 dias e tracker;
- revisão operacional semanal e log.

Ainda depende de revisão editorial humana, diagramação final e PDF final.

## JPN Prompt Builder

Candidatos principais:
- aplicação local principal;
- ponte contextual do fluxo principal;
- fixture contextual móvel;
- roteiro de QA móvel;
- guia de início rápido.

A camada contextual é candidata. O **QA físico contextual em celular continua pendente**. O catálogo não transforma regressões determinísticas em evidência de uso real nem declara o pacote offline final congelado.

## JPN Gestão Fácil

Candidatos principais:
- `JPN_Gestao_Facil_v0.1_reconstruida.xlsx`;
- manual;
- início rápido;
- registro de QA;
- dicionário operacional de dados;
- Starter Data Kit.

GF-QA-01..09 podem ter evidência local própria, mas **GF-QA-10 continua pendente** até a verificação do mesmo XLSX em Microsoft Excel, LibreOffice Calc e Google Sheets. `REPOR` permanece alerta operacional, não autorização automática de compra.

## JPN Pro Kit

Candidatos principais:
- `LEIA_PRIMEIRO.md`;
- mapa de entrega;
- matriz de prontidão;
- template de manifesto;
- gates de release;
- guia de uso e combinação.

O produto continua **EM PREPARAÇÃO**. Freeze, hashes finais e CI no head definitivo continuam dependências de release.

## Superfícies compartilhadas

O catálogo também registra como candidatas as páginas comerciais internas, FAQ, sistema de artes sociais, kit de produção visual, messaging, Copy Bank, biblioteca de objeções, biblioteca/board de conteúdo social, one-pagers, guia de handoff, registro central de evidências, **guia/checklist de onboarding do cliente**, **playbook/template de triagem de suporte ao cliente** e templates de empacotamento. Essas superfícies continuam internas/candidatas e não constituem publicação comercial nem comprovam release.

## Regra operacional

1. Primeiro confirmar que o arquivo candidato existe.
2. Depois conferir a dependência de release correspondente.
3. Só promover estado quando houver evidência do próprio gate.
4. Se a evidência for humana, multiplataforma, física ou de CI, não substituí-la por inferência automatizada.
5. Hash só pode ser chamado de final depois do freeze do artefato correspondente.
6. Ao criar um novo material candidato relevante para um produto ou para o ecossistema, atualizar este catálogo na mesma cadeia de trabalho ou registrar explicitamente a pendência.

## Regra de parada

Interromper qualquer promoção de estado se houver arquivo ausente, divergência entre catálogo e portfólio canônico, dependência sem evidência, QA executado em outro artefato, hash anterior ao freeze ou CI associado a outro commit.

## Guardrails

Este catálogo não autoriza gasto, anúncio, publicação, checkout, coleta de dados, criação de conta, uso de dado financeiro real, aceite legal nem qualquer ação externa irreversível.
