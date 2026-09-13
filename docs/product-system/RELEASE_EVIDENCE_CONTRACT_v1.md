# Contrato de Evidência de Release JPN v1

Este documento define **qual evidência é aceitável para fechar cada gate** de `PRODUCT_RELEASE_STATUS_v1.json`. Ele não aprova nenhum gate e não altera estado de release.

## Regra central

Um gate só pode mudar para `passed` quando existir evidência verificável e específica daquele gate. Ausência de erro, existência de fonte, checker mecânico ou arquivo candidato não substituem revisão humana, teste físico, QA visual, teste multiplataforma ou CI quando essas evidências forem explicitamente exigidas.

## Método JPN
- `revisao-editorial-humana`: registro/checklist de revisão humana ligado ao candidato revisado.
- `pdf-final`: PDF identificado + revisão página a página concluída.

## JPN Prompt Pack
- `revisao-editorial-humana`: revisão humana do conteúdo e dos templates.
- `pdf-final`: PDF identificado + inspeção página a página.

## JPN Business
- `revisao-editorial-humana`: revisão do núcleo e dos 12 playbooks.
- `diagramacao-final`: arquivo diagramado completo + QA visual. A especificação de composição, sozinha, não fecha o gate.
- `pdf-final`: PDF candidato + revisão página a página.

## JPN Prompt Builder
- `qa-fisico-contextual-celular`: teste em dispositivo móvel real. Emulação isolada não basta.
- `ci-final`: workflow associado ao commit candidato com conclusão `success`.
- `pacote-offline-final`: pacote congelado com SHA-256 + teste do pacote congelado.

## JPN Pro Kit
- `artefatos-congelados`: manifesto de componentes finais com versões/hashes imutáveis.
- `hashes-finais`: `SHA256SUMS` produzido somente depois do freeze.
- `ci-final`: CI verde no commit/bundle final.

## JPN Gestão Fácil
- `gf-qa-10`: o **mesmo XLSX**, identificado por hash, testado em Excel, LibreOffice Calc e Google Sheets, cobrindo fórmulas, validações, layout e fluxo essencial.
- `arquivo-final-validado`: XLSX congelado depois do GF-QA-10, com hash e validação final correspondentes ao mesmo arquivo.

## Guardrails

- Evidência não autoriza publicação, venda, anúncio, checkout ou preço.
- Nenhum dado financeiro real é necessário para fechar esses gates.
- Nenhum gate humano/físico pode ser aprovado por inferência de um teste diferente.
- `publication_authorized: false` e `release_effect: none` permanecem vigentes neste contrato.