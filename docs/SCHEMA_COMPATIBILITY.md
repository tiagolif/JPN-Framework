# Política de compatibilidade dos contratos JPN

Status: **candidata**. Esta política disciplina a evolução dos schemas antes de qualquer promoção para 1.0; não declara estabilidade dos contratos atuais.

## Escopo

Aplica-se a `schemas/jpn.schema.json` e `schemas/jpn-handoff.schema.json` e aos consumidores que validam, persistem ou transferem documentos compatíveis com esses contratos.

## Regra de versão

Os contratos seguem SemVer como regra de evolução documental:

- **PATCH**: correção que não altera o conjunto de documentos aceitos nem a interpretação de campos existentes.
- **MINOR**: mudança retrocompatível para produtores existentes, como novo campo opcional ou novo valor que consumidores tolerantes possam ignorar com segurança.
- **MAJOR**: mudança incompatível, incluindo remover/renomear campo, tornar campo opcional obrigatório, alterar tipo, estreitar limites ou mudar semântica já publicada.

Enquanto a especificação estiver em `0.x`, qualquer mudança incompatível deve incrementar ao menos a versão minor e ser explicitamente marcada como breaking no registro de mudanças. A promoção para `1.0.0` exige os critérios do roadmap.

## Compatibilidade

1. Um documento deve declarar a versão do contrato/especificação aplicável quando o schema exigir esse campo.
2. Consumidores não devem inferir compatibilidade apenas pelo nome do arquivo.
3. Mudanças que façam um documento anteriormente válido tornar-se inválido são breaking, salvo correção de um contrato que nunca tenha sido promovido e cuja quebra esteja documentada como tal.
4. Novos campos opcionais são preferíveis a mudanças de significado em campos existentes.
5. Campos existentes não devem ser reutilizados com semântica diferente.
6. IDs usados em referências internas devem permanecer estáveis dentro do documento; referências quebradas são inválidas mesmo quando o JSON Schema estrutural as aceite.
7. Evidências e decisões não podem ganhar estado de verificação por migração automática sem evidência correspondente.

## Evolução de enums

Adicionar valor a enum é compatível para produtores antigos, mas pode quebrar consumidores exaustivos. Portanto, durante `0.x`, qualquer expansão de enum exige:

- registro explícito da alteração;
- fixture cobrindo o novo valor;
- atualização do validador de referência antes de uso em artefatos oficiais.

Remover ou renomear valor de enum é breaking.

## Migrações

Uma migração deve ser determinística, preservar a informação original sempre que possível e nunca inventar evidência, aprovação, resultado de QA ou autorização. Quando não houver conversão segura, o processo deve falhar de forma explícita e exigir revisão humana.

## Gate mínimo para mudança de contrato

Toda alteração de schema deve:

- manter fixtures válidas da versão suportada ou registrar formalmente a quebra;
- incluir fixture negativa para nova restrição relevante;
- passar `scripts/check-jpn-schema.mjs` no CI;
- atualizar documentação quando houver mudança semântica;
- não promover automaticamente `release_ready`, `publication_authorized` ou estados equivalentes.

## Promoção para contrato estável

A marcação estável só pode ocorrer após política de compatibilidade validada, rodada de avaliação reproduzível e revisão explícita dos contratos. Até lá, os schemas permanecem candidatos.