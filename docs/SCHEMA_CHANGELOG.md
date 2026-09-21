# Registro de evolução dos contratos JPN

Status: **candidato**. Este registro acompanha mudanças nos contratos estruturados sem promover os schemas atuais a 1.0.

## Regras de registro

Cada mudança em `schemas/jpn.schema.json` ou `schemas/jpn-handoff.schema.json` deve registrar contrato/versão, classificação SemVer, impacto, fixture ou migração aplicável, incompatibilidades em `0.x` e evidência do gate executável. O registro não substitui Git, testes ou revisão.

## Baselines candidatas

### Estado JPN — `0.3.0-draft`
Contrato: `schemas/jpn.schema.json`. Baseline funcional de Jornada, Precisão e Narrativa, com versão obrigatória e proveniência básica por `source`.

### Handoff JPN — `0.1.0-draft`
Contrato preservado: `schemas/jpn-handoff.v0.1.schema.json`. Baseline inicial com origem/destino, objetivo, status, evidências, decisões, pendências, próximas ações e restrições. `captured_at` era livre quando presente.

## Handoff JPN — `0.2.0-draft`

Classificação: **MINOR incompatível em `0.x`**.

Contrato atual: `schemas/jpn-handoff.schema.json`.

- `contract_version` passa a selecionar explicitamente `0.2.0-draft`;
- `captured_at`, quando preenchido, exige ISO 8601 com timezone explícito; o gate também verifica validade semântica de calendário e offset;
- a baseline `0.1.0-draft` permanece preservada para testes de compatibilidade;
- `scripts/check-handoff-migration.mjs` demonstra migração determinística `0.1 → 0.2` quando os dados já satisfazem o contrato novo;
- a migração altera somente `contract_version` e preserva o conteúdo suportado;
- timestamps legados incompatíveis bloqueiam a migração: não são corrigidos ou inferidos automaticamente;
- a fixture de migração também bloqueia timestamps que parecem ISO mas são semanticamente impossíveis (data/hora inexistente ou offset fora do limite), evitando divergência entre o gate do contrato atual e a rota de migração;
- o gate principal importa o teste de migração, mantendo a verificação dentro da cadeia oficial de CI.

A mudança não inventa evidência, aprovação, QA, autorização de publicação ou estado ausente e não promove o contrato para estabilidade 1.0.
