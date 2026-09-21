# Auditoria de compatibilidade dos contratos JPN

Status: **pré-migração / candidata**.

## Objetivo

Registrar o ponto de controle necessário antes da primeira migração executável entre versões dos contratos JPN, sem declarar estabilidade ou compatibilidade que ainda não foi demonstrada.

## Estado observado

- O estado JPN usa `version: 0.3.0-draft` nas fixtures de referência.
- O handoff usa `contract_version: 0.1.0-draft` na fixture executável atual.
- `captured_at` passou a exigir formato ISO 8601 com timezone explícito e o gate executável também verifica validade semântica de calendário e offset.
- O campo `contract_version` do schema de handoff ainda aceita qualquer string não vazia. Portanto, hoje ele funciona como metadado declarado pelo produtor, não como seletor rígido de versão no próprio schema.

## Achado de governança

A política `SCHEMA_COMPATIBILITY.md` determina que mudanças incompatíveis durante `0.x` devem incrementar ao menos a versão minor. Endurecer a validação de `captured_at` pode tornar um documento antes aceito inválido; por isso, a próxima consolidação desse contrato não deve simplesmente trocar silenciosamente a versão da fixture atual.

## Regra para a primeira migração

Antes de marcar a tarefa de fixtures de migração como concluída:

1. preservar uma fixture representativa `0.1.0-draft`;
2. introduzir explicitamente a versão sucessora do handoff;
3. demonstrar por teste quais documentos antigos continuam válidos;
4. fornecer migração determinística apenas para mudanças que não exijam inventar informação;
5. falhar explicitamente quando a conversão depender de timestamp, evidência, aprovação ou outro dado ausente;
6. validar origem e destino no CI;
7. atualizar `SCHEMA_CHANGELOG.md` e `ROADMAP.md` no mesmo conjunto de mudanças.

## Não objetivos

Esta auditoria não promove os schemas para estáveis, não altera `release_ready`, não autoriza publicação e não considera QA físico/humano como concluído.
