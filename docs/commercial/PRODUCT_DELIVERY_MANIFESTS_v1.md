# Manifestos de entrega dos produtos JPN v1

Este documento descreve **o que deve compor a entrega de cada produto JPN** quando seus respectivos gates canônicos forem concluídos. Ele não transforma materiais internos, candidatos ou fontes em release final e não autoriza publicação, venda, checkout ou anúncio.

## Regras gerais

- Nenhum item abaixo deve ser tratado como artefato final antes dos gates registrados em `PRODUCT_RELEASE_STATUS_v1.json`.
- O menor produto suficiente continua sendo a regra de escolha; os manifestos não criam bundles implícitos.
- Guias e instruções devem explicar uso, limites e próxima ação sem prometer resultado.
- JPN Gestão Fácil continua sendo ferramenta gerencial, não substituto de contabilidade, banco, fiscal, ERP ou auditoria.
- JPN Pro Kit só pode consolidar componentes depois que os artefatos elegíveis estiverem congelados e versionados.

## Método JPN

**Entrega prevista**

1. PDF final do Método JPN.
2. Guia rápido de início.
3. Referência das etapas Jornada, Precisão e Narrativa.
4. Nota de limites e boas práticas.

**Gates necessários:** `revisao-editorial-humana` e `pdf-final`.

**Sinal de conclusão:** PDF final revisado e guia de início coerente com o conteúdo canônico.

**Não declarar:** resultado garantido, precisão absoluta ou eliminação de revisão humana.

## JPN Prompt Pack

**Entrega prevista**

1. PDF final do Prompt Pack.
2. Índice dos prompts canônicos.
3. Guia de adaptação ao contexto.
4. Nota de uso seguro e revisão antes de ações externas.

**Gates necessários:** `revisao-editorial-humana` e `pdf-final`.

**Sinal de conclusão:** biblioteca final revisada, indexada e acompanhada de instruções de adaptação.

**Não declarar:** prompts universais, resultado garantido ou execução automática de ações externas.

## JPN Business

**Entrega prevista**

1. PDF final do JPN Business.
2. Índice dos 12 playbooks.
3. Crosswalk com o JPN Prompt Pack.
4. Guia de aplicação em processos de pequenas empresas.
5. Nota de limites operacionais.

**Gates necessários:** `revisao-editorial-humana`, `diagramacao-final` e `pdf-final`.

**Sinal de conclusão:** playbooks revisados, diagramados e exportados em PDF final com referências internas válidas.

**Não declarar:** automação completa da empresa, aumento garantido de vendas ou substituição de sistemas de gestão.

## JPN Prompt Builder

**Entrega prevista**

1. Pacote offline final do Prompt Builder.
2. Arquivo de abertura/inicialização local.
3. Guia rápido de uso.
4. Instruções de backup/exportação dos trabalhos.
5. Nota de privacidade e limites de execução local.

**Gates necessários:** `qa-fisico-contextual-celular`, `ci-final` e `pacote-offline-final`.

**Sinal de conclusão:** pacote offline validado após QA físico/contextual e CI final.

**Não declarar:** compatibilidade não testada, execução automática externa ou armazenamento em nuvem implícito.

## JPN Gestão Fácil

**Entrega prevista**

1. Arquivo final validado da planilha.
2. Guia Leia-me/onboarding.
3. Guia operacional para rotina diária e revisão semanal.
4. Legenda dos indicadores e alertas.
5. Nota de limites contábeis, fiscais e bancários.

**Gates necessários:** `gf-qa-10` e `arquivo-final-validado`.

**Sinal de conclusão:** arquivo final validado nos ambientes previstos e documentação de uso coerente com os KPIs canônicos.

**Não declarar:** substituição de ERP, contabilidade, banco, fiscal ou auditoria. `REPOR` continua sendo alerta operacional e nunca autorização automática de compra.

## JPN Pro Kit

**Entrega prevista**

1. Componentes JPN congelados e versionados.
2. Manifesto do bundle.
3. Índice de arquivos.
4. Checksums finais.
5. Guia Comece Aqui do portfólio.
6. Notas de versão e limites.

**Gates necessários:** `artefatos-congelados`, `hashes-finais` e `ci-final`.

**Sinal de conclusão:** todos os componentes elegíveis congelados, hashes finais registrados e CI final aprovado.

**Não declarar:** bundle pronto antes dos componentes, desconto implícito, resultado garantido ou necessidade de usar todos os produtos.

## Estado desta especificação

`publication_authorized: false`

`release_effect: none`

A fonte estruturada correspondente é `PRODUCT_DELIVERY_MANIFESTS_v1.json`, validada automaticamente por `scripts/check-product-delivery-manifests.mjs` e pelo gate principal do portfólio.
