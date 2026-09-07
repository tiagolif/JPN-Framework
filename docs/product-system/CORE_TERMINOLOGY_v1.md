# Contrato de terminologia central JPN v1

Este documento define nomes, termos e guardrails editoriais canônicos para os produtos centrais do ecossistema JPN. O objetivo é reduzir divergências entre Método JPN, JPN Prompt Pack, JPN Business, JPN Prompt Builder, JPN Pro Kit, JPN Gestão Fácil, páginas e materiais comerciais.

## Nomes canônicos

- **JPN Framework** — expansão oficial: **Jornada, Precisão e Narrativa**.
- **Método JPN** — método de estruturação de contexto, critérios e forma de resposta.
- **JPN Prompt Pack** — biblioteca de prompts aplicados.
- **JPN Business** — coleção de playbooks orientados a fluxos de negócio.
- **JPN Prompt Builder** — ferramenta local para estruturar, validar e compilar prompts com o framework.
- **JPN Pro Kit** — pacote de entrega que reúne os artefatos definidos para a versão.
- **JPN Gestão Fácil** — planilha de gestão para pequenas empresas.

## Termos preferenciais

Use **prontidão** para readiness; **revisão humana cega** para blind review; **projeto local** para snapshots de trabalho do Prompt Builder; e **armazenamento local no navegador** ao explicar localStorage para público não técnico.

`Preset` permanece como termo de produto porque representa um ponto de partida reutilizável e é distinto de um projeto salvo. `Playbook` permanece no JPN Business para representar um fluxo operacional aplicado.

## Posicionamento mínimo

O JPN deve ser descrito como uma estrutura para organizar contexto, critérios e formato de resposta. O framework não deve ser apresentado como garantia de correção factual, aumento de vendas, ROI, ausência de erros ou eliminação de alucinações.

Conteúdo gerado por IA deve permanecer sujeito a revisão proporcional ao risco e ao contexto de uso. Os materiais comerciais podem explicar benefícios pretendidos — como clareza, organização e reutilização — sem convertê-los em resultados garantidos.

## Claims bloqueados

O contrato JSON associado mantém uma lista mecanicamente verificável de claims desencorajados, incluindo garantias de resultado, precisão absoluta, eliminação de alucinações, ROI garantido e substituição de revisão humana ou especialistas.

A presença desses termos deve falhar no gate quando usada nos arquivos monitorados. O gate não tenta avaliar linguagem semanticamente equivalente; por isso, revisão humana continua necessária.

## Escopo do gate

O checker correspondente valida:

1. integridade e unicidade dos nomes canônicos no contrato;
2. expansão oficial de JPN;
3. presença dos três pilares na ordem Jornada → Precisão → Narrativa;
4. ausência de claims bloqueados nos documentos centrais e materiais comerciais monitorados;
5. presença dos nomes canônicos nos principais documentos do produto quando aplicável.

## Limites

Este contrato não prova eficácia do framework e não substitui revisão ortográfica, jurídica, comercial, visual ou factual. Ele também não congela preços, condições de venda, canais de distribuição ou políticas externas.

Qualquer alteração de nome de produto ou do significado de um termo central deve atualizar primeiro este contrato e depois os artefatos dependentes, para evitar deriva editorial silenciosa.
