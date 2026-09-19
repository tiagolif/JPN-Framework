# JPN — Revisão da superfície comercial v1

Status: **INTERNAL / NOT RELEASE READY**  
Publicação autorizada: **não**

## Objetivo

Consolidar uma revisão única das superfícies comerciais do ecossistema JPN antes de qualquer promoção para release. Este checklist não autoriza publicação, preço, checkout, anúncio, captura de leads ou uso de depoimentos.

## Jornada principal

A revisão deve percorrer, nesta ordem:

1. `commercial-site/index.html` — visão do portfólio;
2. `commercial-site/ecossistema.html` — diagnóstico e escada de produtos;
3. `commercial-site/escolher-produto.html` — escolha orientada pela necessidade;
4. `commercial-site/comparar-produtos.html` — comparação detalhada;
5. páginas individuais em `commercial-site/products/`;
6. demonstrações e catálogo vinculados pelas páginas.

## Critérios por superfície

Marcar somente após inspeção real.

- [ ] O nome do produto é consistente com o portfólio canônico.
- [ ] A promessa descreve capacidade demonstrável, sem garantia de resultado.
- [ ] Quantidades citadas (templates, playbooks, abas) correspondem aos entregáveis versionados.
- [ ] CTAs levam apenas a destinos internos previstos enquanto a publicação estiver bloqueada.
- [ ] Não existe preço, checkout, formulário, tracking ou captura de dados.
- [ ] Não existem depoimentos, métricas ou provas sociais inventadas.
- [ ] Estados `em preparação` permanecem visíveis quando aplicáveis.
- [ ] Gestão Fácil não é descrita como ERP, sistema contábil, fiscal ou bancário.
- [ ] Prompt Builder não é descrito como executor autônomo da tarefa final.
- [ ] Prompt Pack é apresentado como estrutura adaptável, não como resposta pronta.
- [ ] Business é apresentado como conjunto de playbooks revisáveis.
- [ ] Pro Kit não sugere disponibilidade final enquanto os gates estiverem pendentes.
- [ ] Navegação por teclado e foco visível funcionam.
- [ ] Hierarquia de títulos é compreensível por leitor de tela.
- [ ] Tabelas possuem cabeçalhos de coluna/linha adequados.
- [ ] Layout permanece legível em largura móvel e desktop.

## Revisão da escada de produtos

A recomendação comercial deve seguir a menor solução suficiente:

| Necessidade | Entrada recomendada |
| --- | --- |
| Estruturar um pedido agora | JPN Prompt Builder |
| Aprender a lógica JPN | Método JPN |
| Reutilizar estruturas | JPN Prompt Pack |
| Aplicar em tarefas de negócio | JPN Business |
| Organizar controles operacionais | JPN Gestão Fácil |
| Combinar várias camadas | JPN Pro Kit |

Não transformar essa sequência em obrigação de compra progressiva. O usuário pode entrar diretamente no produto compatível com sua necessidade.

## Evidência mínima antes de release

Para cada página revisada, registrar: caminho do arquivo, commit/SHA avaliado, viewport usado, navegador usado, resultado `PASS` ou `FAIL`, observações e evidência visual quando necessária. Alteração posterior do conteúdo invalida a evidência correspondente até nova revisão.

## Bloqueios atuais

Este documento não altera os gates existentes. Permanecem pendentes, quando aplicáveis:

- QA físico/contextual do Prompt Builder em dispositivo;
- validação da Gestão Fácil no mesmo XLSX em Microsoft Excel, LibreOffice Calc e Google Sheets;
- GF3-QA-11..18;
- inspeção editorial/visual humana dos PDFs e artes;
- freeze dos artefatos aprovados e hashes finais.

Enquanto qualquer gate obrigatório permanecer pendente, manter `release_ready=false` e `publication_authorized=false`.
