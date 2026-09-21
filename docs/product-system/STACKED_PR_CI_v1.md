# JPN — CI para pull requests empilhados v1

## Objetivo

Garantir que mudanças de produto e documentação recebam validação automática mesmo quando um pull request usa outro branch de produto como base temporária.

O projeto trabalha com PRs empilhados para avançar entregas sem misturar trabalhos ainda não integrados ao `main`. O workflow anterior restringia `pull_request` a `main`, o que deixava branches empilhados sem execução automática até serem retargeteados.

## Política

O workflow `.github/workflows/ci.yml` deve:

- executar em todo evento `pull_request`, independentemente do branch-base;
- continuar executando `push` somente em `main`;
- usar permissões mínimas de leitura de conteúdo;
- cancelar uma execução anterior da mesma PR quando surgir um head mais novo;
- preparar Node.js 22;
- preparar Python 3.12, necessário para a build reproduzível da Gestão Fácil v0.3;
- executar typecheck, testes e todos os comandos mecânicos cobertos pelo build canônico;
- validar também contratos de pacote/entrega ao cliente, onboarding e suporte, operação comercial, roteamento de distribuição e registros de evidência de release;
- falhar se a build deixar arquivos rastreados fora de sincronia.

## Cobertura adicional de produto

Além dos gates centrais de cada produto, o CI valida camadas que ficam entre “produto pronto no repositório” e “pacote apto a ser entregue”:

- manifestos e contrato dos pacotes de entrega;
- guia de handoff, onboarding, suporte e tratamento seguro de dados;
- discovery, demonstração guiada, onboarding comercial, diagnóstico e FAQ/objeções;
- índice e mapa de distribuição, incluindo dependências e slots projetados de cada produto;
- contrato e registro de evidências necessários para o futuro freeze.

Esses checks são locais e somente leitura/validação. Eles não materializam pacotes finais nem executam ações externas.

## O que este CI prova

Uma execução verde demonstra apenas que os checks mecânicos configurados passaram no SHA executado.

Ela **não** substitui:

- revisão editorial humana;
- QA físico/contextual em celular do Prompt Builder;
- abertura do mesmo XLSX da Gestão Fácil em Excel, LibreOffice Calc e Google Sheets;
- inspeção visual de PDF;
- freeze de artefatos;
- hashes finais após freeze;
- o `ci-final` de um produto quando esse gate exigir explicitamente o SHA definitivo do candidato.

## Relação com a fila de release

Executar CI em PR empilhada melhora feedback durante desenvolvimento, mas não promove automaticamente nenhum item de `PRODUCT_RELEASE_STATUS_v1.json`.

Em especial, um CI verde antes dos pré-requisitos humanos ou externos continuar pendentes deve ser tratado como **evidência de desenvolvimento**, não como aprovação de release.

## Guardrails

Este mecanismo não publica site, anúncio ou artefato comercial; não habilita checkout; não cria conta externa; não usa credenciais do usuário; não exige dados financeiros reais; e não aceita termos legais em nome do proprietário do projeto.
