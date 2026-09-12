# JPN — mapa de fontes para distribuição v1

> Estado: especificação interna. Não autoriza publicação, venda, checkout, anúncio ou promoção de release.

Este documento liga o `PRODUCT_DISTRIBUTION_INDEX_v1.json` às fontes reais já existentes no repositório. O objetivo é retirar ambiguidade da futura montagem dos pacotes sem transformar candidatos em arquivos finais.

## Regra central

Cada slot de distribuição possui três conceitos separados:

- **fonte (`source_paths`)**: conteúdo existente que pode alimentar o artefato futuro;
- **referência de candidato (`candidate_reference_paths`)**: arquivo útil como evidência de trabalho, mas que não pode ser promovido por inferência;
- **gates (`generated_after_gate`)**: dependências que precisam estar `passed` com evidência antes da materialização do target.

Nenhum caminho em `dist/` é aceito como fonte. O mapa também não executa renderização, cópia, compactação, geração de hashes ou freeze.

## Método JPN

O PDF futuro deriva do núcleo `METODO_JPN_v1.md`, apoiado pelo casebook, practice workbook e quick reference. Os arquivos de início, referência e limites também derivam dessas fontes e do contrato de tratamento seguro de dados. O PDF e os derivados continuam bloqueados pela revisão editorial humana e pelo gate de PDF final quando aplicável.

## JPN Prompt Pack

O PDF futuro deriva de `JPN_PROMPT_PACK_v1.md`, do índice canônico e da quick reference. O índice de prompts deve nascer de `PROMPT_INDEX.json`; o guia de adaptação usa o workbook de seleção; a nota de segurança também considera `SAFE_DATA_HANDLING_v1.md`. Nada disso promove os candidatos editoriais atuais.

## JPN Business

O PDF futuro parte do conteúdo Business, do índice, do workbook e da quick reference. `PRINT_CANDIDATE_v1.md` foi registrado somente como **referência de candidato**, nunca como final. O crosswalk reutiliza a fonte canônica já existente. O produto continua condicionado à revisão humana, diagramação e PDF final.

## JPN Prompt Builder

O ZIP futuro será montado a partir da aplicação local em `product-site/` e da especificação de entrega offline, somente depois de QA físico/contextual, CI final e freeze do pacote offline. Quick start, recuperação/workspaces e guardas de dados alimentam a documentação que acompanhará o pacote.

## JPN Gestão Fácil

O arquivo `JPN_Gestao_Facil_v0.1_reconstruida.xlsx` aparece apenas como **referência de candidato**. Ele não é fonte automática do futuro `JPN_Gestao_Facil.xlsx`. O binário final só pode ser congelado após `gf-qa-10` e `arquivo-final-validado`. Quick start, manual, ritmo operacional, guia para pequenas empresas e dicionário operacional alimentam a documentação de acompanhamento.

## JPN Pro Kit

O bundle principal não possui `source_paths` fixos porque deve ser montado somente a partir dos componentes que estiverem congelados e elegíveis no momento do release. `DELIVERY_MAP.md` e `READINESS_MATRIX_v1.md` são apenas referências de candidato para essa montagem. Manifesto, índice, checksums, Comece Aqui e release notes reutilizam templates/documentos existentes, sempre atrás dos gates correspondentes.

## O que este mapa impede

- usar um candidato antigo como se fosse release final;
- gerar um artefato em `dist/` antes dos gates;
- confundir existência no Git com aprovação humana;
- incluir evidências internas, segredos ou dados reais no pacote do cliente;
- produzir hashes finais antes do freeze;
- consolidar o Pro Kit com componentes ainda não elegíveis.

## Próximo passo quando os gates passarem

Somente depois das evidências canônicas, um processo de montagem poderá consumir este mapa para criar os targets definidos no índice de distribuição. Até lá, o mapa funciona como contrato de proveniência e planejamento, não como autorização de build final.
