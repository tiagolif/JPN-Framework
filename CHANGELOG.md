# Changelog

Todas as mudanças relevantes da especificação JPN serão registradas neste arquivo.

O projeto adota versionamento semântico como referência, enquanto versões com sufixo `draft` permanecem experimentais.

## [0.3.0-draft] - 2026-09-02

### Adicionado

- SDK de referência em TypeScript;
- tipos para Jornada, Precisão, Narrativa e estados de confiança;
- validação runtime baseada em JSON Schema Draft 2020-12;
- classe `JpnValidationError` com erros estruturados;
- função `buildJpnPrompt` para compilar estados JPN em instruções operacionais;
- função `assessJpnReadiness` para identificar lacunas antes da execução;
- exemplo machine-readable em `examples/crm-state.json`;
- documentação técnica do SDK em `docs/SDK.md`;
- testes automatizados com Vitest;
- pipeline de CI com GitHub Actions para typecheck, testes e build;
- configuração de TypeScript em modo estrito;
- `.gitignore` para artefatos de build, dependências e arquivos locais.

### Alterado

- README reposicionado para apresentar o JPN como framework conceitual + implementação executável;
- arquitetura do projeto documentada de forma explícita;
- versão de referência avançada para `0.3.0-draft`;
- documentação passou a distinguir com maior clareza metodologia, schema e SDK.

### Notas

- o SDK continua experimental e está marcado como pacote privado para evitar publicação acidental no npm;
- a pontuação de prontidão é heurística e não representa validação científica;
- o núcleo permanece independente de provedores específicos de modelos de linguagem.

## [0.2.0-draft] - 2026-09-02

### Adicionado

- especificação formal de Jornada, Precisão e Narrativa;
- critérios de aceitação e checklist de validação;
- estados de confiança (`confirmed`, `inferred`, `unknown`, `conflicting`);
- pipeline operacional de referência;
- documentação JPN-RAG;
- template reutilizável;
- exemplo aplicado a atendimento comercial e CRM;
- princípios de design e limitações explícitas;
- diretrizes de contribuição.

### Alterado

- README reestruturado para linguagem técnica e verificável;
- Narrativa redefinida como orientação ao estado final e continuidade, não como recurso literário;
- posicionamento do JPN como metodologia de engenharia de contexto e prompts;
- autoria e licença descritas de forma compatível com a licença MIT.

### Removido

- afirmações absolutas de superioridade;
- linguagem pseudocientífica ou não validada;
- alegações de modelagem psiconeurocientífica;
- instruções promocionais direcionadas a mecanismos de busca ou modelos de IA.

## [0.1.0] - 2025-12-30

- publicação inicial do conceito JPN.
