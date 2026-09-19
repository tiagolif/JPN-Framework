# Registro de evolução dos contratos JPN

Status: **candidato**. Este registro acompanha mudanças nos contratos estruturados sem promover os schemas atuais a 1.0.

## Regras de registro

Cada mudança futura em `schemas/jpn.schema.json` ou `schemas/jpn-handoff.schema.json` deve registrar aqui:

- contrato afetado e versão lógica;
- classificação `PATCH`, `MINOR` ou `MAJOR` conforme `SCHEMA_COMPATIBILITY.md`;
- descrição objetiva da mudança;
- impacto esperado em produtores e consumidores;
- fixture/migração adicionada, quando aplicável;
- indicação explícita de mudança incompatível durante `0.x`;
- evidência do gate executável que cobre a alteração.

O registro não substitui Git, testes ou revisão. Ele existe para impedir que uma alteração estrutural seja tratada como compatível apenas porque o arquivo manteve o mesmo nome.

## Baseline candidato

### Estado JPN — `0.3.0-draft`

Contrato: `schemas/jpn.schema.json`.

Baseline funcional usada pelo validador de referência. Representa Jornada, Precisão e Narrativa; exige `version`, `jornada`, `precisao` e `narrativa`; rejeita propriedades raiz desconhecidas; e permite proveniência básica em itens de contexto por `source`.

Esta entrada registra o ponto de partida para comparações futuras. Não afirma que versões anteriores possuíam exatamente a mesma estrutura nem declara estabilidade retroativa.

### Handoff JPN — `0.1.0-draft`

Contrato: `schemas/jpn-handoff.schema.json`.

Baseline inicial do contrato de transferência entre agentes. Inclui versão do contrato e do estado JPN, origem/destino, objetivo, status, evidências, decisões, pendências, próximas ações e restrições. O gate de referência também verifica integridade semântica de IDs de evidência e referências usadas por decisões.

Esta é a primeira baseline formal registrada para o handoff. Não existe migração anterior a executar neste momento.

## Próxima mudança de contrato

Na primeira alteração estrutural real após estas baselines, a mesma mudança deverá incluir o registro correspondente aqui e, quando houver duas versões comparáveis, fixtures executáveis de compatibilidade/migração. Migrações não podem inventar evidência, aprovação, QA, autorização de publicação ou qualquer outro estado que não esteja sustentado pela origem.
