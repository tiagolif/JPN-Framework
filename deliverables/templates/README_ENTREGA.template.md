# {{PRODUCT_NAME}} — Leia-me da entrega

> Estado do pacote: `{{PACKAGE_STATE}}`
> Versão: `{{VERSION}}`
> Data de preparação: `{{PREPARED_DATE}}`

## O que este pacote contém

{{PACKAGE_SUMMARY}}

## Arquivos principais

{{PRIMARY_FILES}}

## Como começar

1. Leia este arquivo por completo.
2. Consulte o arquivo principal indicado acima.
3. Use somente os componentes necessários para a tarefa atual.
4. Preserve fatos e estados de confiança: `confirmed`, `inferred`, `unknown` e `conflicting` quando aplicável.
5. Pare antes de qualquer ação externa que dependa de nova autorização.

## Estado e limites

Este modelo de README não transforma um pacote em release final. O campo `{{PACKAGE_STATE}}` deve refletir o estado real definido pelo processo de handoff.

Não trate material candidato como aprovação de publicação, oferta ativa, checkout, compatibilidade universal, promessa de resultado ou autorização jurídica.

## Dependências ou QA ainda pendentes

{{PENDING_ITEMS}}

## Integridade

Quando o pacote estiver efetivamente `FROZEN`, consulte `SHA256SUMS.txt`. Hash comprova integridade do arquivo, não qualidade, revisão humana ou aprovação de release.

## Suporte documental

- `CHANGELOG_RESUMIDO.md`: mudanças relevantes desta versão;
- `MANIFEST.txt`: inventário do pacote;
- `SHA256SUMS.txt`: checksums apenas após freeze real.

## Guardrails

Não inclua credenciais, dados financeiros reais, dados sensíveis ou segredos neste arquivo. Não use este pacote para publicar, gastar, contratar, aceitar termos legais ou criar conta com verificação de identidade sem autorização específica.
