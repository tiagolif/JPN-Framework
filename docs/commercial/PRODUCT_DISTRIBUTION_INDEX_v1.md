# Índice de distribuição dos produtos JPN v1

> Documento interno. Não autoriza publicação, venda, checkout ou anúncio.

Este índice descreve **como os pacotes finais deverão ser organizados quando os respectivos gates de release forem concluídos**. Ele não declara que os arquivos finais já existem e não promove nenhum candidato para release.

## Regras gerais

- Arquivos finais só entram em `dist/` depois de todas as dependências canônicas aplicáveis estarem `passed`.
- Fontes internas, candidatos, evidências de QA, logs, segredos e dados reais não pertencem ao pacote do cliente.
- O nome do arquivo principal deve permanecer estável para facilitar suporte, atualização e geração futura de checksums.
- O JPN Pro Kit só pode reunir componentes congelados e versionados.
- JPN Gestão Fácil permanece uma ferramenta gerencial; não substitui contabilidade, banco, fiscal, ERP ou auditoria.

## Método JPN

Pasta futura: `dist/metodo-jpn/`

- `Metodo_JPN.pdf` — artefato principal; depende de revisão editorial humana + PDF final.
- `LEIA-ME.md` — guia rápido de início.
- `Referencia_JPN.md` — referência de Jornada, Precisão e Narrativa.
- `LIMITES_E_BOAS_PRATICAS.md` — limites e boas práticas.

Não incluir: fontes editáveis internas, checklists de revisão ou evidências de QA.

## JPN Prompt Pack

Pasta futura: `dist/jpn-prompt-pack/`

- `JPN_Prompt_Pack.pdf` — artefato principal.
- `INDICE_DE_PROMPTS.md` — índice dos prompts canônicos.
- `GUIA_DE_ADAPTACAO.md` — adaptação ao contexto.
- `USO_SEGURO.md` — revisão antes de ações externas.

Não incluir: rascunhos, fontes internas ou logs de geração.

## JPN Business

Pasta futura: `dist/jpn-business/`

- `JPN_Business.pdf` — artefato principal.
- `INDICE_PLAYBOOKS.md` — índice dos 12 playbooks.
- `PROMPT_PACK_CROSSWALK.md` — vínculo com Prompt Pack.
- `GUIA_DE_APLICACAO.md` — aplicação em processos de pequenas empresas.
- `LIMITES_OPERACIONAIS.md` — limites operacionais.

Não incluir: composição de trabalho, assets intermediários ou notas editoriais internas.

## JPN Prompt Builder

Pasta futura: `dist/jpn-prompt-builder/`

- `JPN_Prompt_Builder_Offline.zip` — pacote offline final.
- `LEIA-ME.md` — inicialização local.
- `GUIA_RAPIDO.md` — uso essencial.
- `BACKUP_E_EXPORTACAO.md` — backup e exportação.
- `PRIVACIDADE_E_LIMITES.md` — privacidade e limites da execução local.

Não incluir: dependências de desenvolvimento, segredos, logs ou fixtures de teste.

## JPN Gestão Fácil

Pasta futura: `dist/jpn-gestao-facil/`

- `JPN_Gestao_Facil.xlsx` — planilha final validada.
- `LEIA-ME.md` — onboarding.
- `GUIA_OPERACIONAL.md` — rotina diária e revisão semanal.
- `INDICADORES_E_ALERTAS.md` — legenda dos KPIs e alertas.
- `LIMITES_GERENCIAIS.md` — limites contábeis, fiscais e bancários.

Não incluir: dados de teste, dados financeiros reais, evidências de QA ou versões candidatas.

## JPN Pro Kit

Pasta futura: `dist/jpn-pro-kit/`

- `JPN_Pro_Kit.zip` — bundle final, somente após freeze.
- `MANIFEST.json` — manifesto do bundle.
- `INDEX.md` — índice de arquivos.
- `SHA256SUMS.txt` — checksums finais.
- `COMECE_AQUI.md` — guia inicial do portfólio.
- `RELEASE_NOTES.md` — versão, limites e notas de release.

Não incluir: componentes não congelados, candidatos, fontes privadas, segredos ou evidências internas de QA.

## Estado atual

Este documento é apenas uma especificação de distribuição. Os bloqueios humanos, físicos e de CI registrados nos contratos de release continuam válidos e devem ser concluídos antes da materialização de qualquer pacote final.
