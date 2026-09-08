# Método JPN — Integridade cruzada v1

## Objetivo

Registrar o contrato mecânico entre o Método JPN e os dois produtos que mais reutilizam sua estrutura editorial: JPN Prompt Pack e JPN Business.

O preflight é executado por:

```bash
npm run check:metodo-cross-product
```

## O que é verificado

O gate confirma que:

- Método, Prompt Pack e Business permanecem na base metodológica `0.3.0-draft`;
- o Método preserva Jornada, Precisão e Narrativa como dimensões canônicas;
- os estados `confirmed`, `inferred`, `unknown` e `conflicting` continuam documentados;
- a política de lacunas mantém as quatro alternativas operacionais do Método;
- a seção de ecossistema continua relacionando Prompt Builder, Prompt Pack, Business, Gestão Fácil e Pro Kit;
- o Prompt Pack contém 18 templates e todos preservam J+P+N em `primary_jpn`;
- o Business contém 12 playbooks;
- cada playbook possui vínculo com ao menos um template `PP-*` existente;
- o `AUDIT.md` do Método registra a revisão cruzada como concluída sem promover revisão visual, ortográfica ou formatos finais.

## O que não é comprovado

Um PASS não significa:

- aprovação ortográfica fina;
- qualidade visual ou diagramação aprovadas;
- PDF/DOCX final;
- benchmark de modelo de IA;
- superioridade do Método sobre outras técnicas;
- autorização de publicação, venda ou campanha.

## Regra de mudança

Se a base metodológica, número de templates, número de playbooks, taxonomia J/P/N ou vínculos `JB-* → PP-*` mudarem, o gate deve falhar até que a documentação e o contrato sejam atualizados conscientemente.

Esse comportamento evita que os produtos evoluam de forma silenciosamente incompatível.
