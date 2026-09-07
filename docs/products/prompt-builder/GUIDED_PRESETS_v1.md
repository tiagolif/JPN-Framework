# JPN Prompt Builder — Presets guiados v1

## Objetivo

Reduzir a fricção da tela vazia no JPN Prompt Builder sem usar IA externa para completar contexto e sem transformar exemplos genéricos em fatos do caso do usuário.

## Princípio

Cada preset é apenas um ponto de partida editável. Ao selecionar um preset, o Builder preenche:

- uma ideia-base;
- o tipo de resultado principal;
- restrições conservadoras do domínio.

O usuário continua responsável por revisar e adaptar o conteúdo. O preset não confirma contexto, dados, requisitos, prazos, preços, evidências ou condições não informadas.

## Catálogo inicial

A versão v1 cobre sete domínios alinhados à biblioteca aplicada do JPN:

1. desenvolvimento de software;
2. análise de documentos;
3. atendimento e vendas;
4. suporte técnico;
5. automação de backoffice;
6. multiagentes e handoff;
7. RAG com fontes conflitantes.

## Guardrails

- não executar chamadas de modelo;
- não preencher fatos específicos sobre empresa, cliente, sistema ou documento;
- manter restrições editáveis e visíveis;
- evitar claims absolutos e CTAs comerciais nos presets;
- preservar o fluxo oficial `createJpnDraftFromText` → validação → readiness → `buildJpnPrompt`;
- manter campos não resolvidos explícitos no resultado.

## Qualidade automatizada

`npm run check:prompt-builder-presets` valida:

- presença dos sete presets obrigatórios;
- IDs únicos;
- campos mínimos não vazios;
- conteúdo mínimo para ideia e restrições;
- ausência de padrões comerciais/claims proibidos definidos pelo gate.

O comando integra o pipeline principal de `npm run build`.

## Estado de produto

Os presets passam a fazer parte da experiência offline do Prompt Builder. Isso não altera o estado de publicação: a entrega continua definida como bundle local servido por HTTP, sem hospedagem pública obrigatória.

## Próximas extensões possíveis

Sem mudar o contrato v1, versões futuras podem adicionar favoritos, presets personalizados pelo usuário, importação/exportação de presets e ligação mais profunda com o Prompt Pack. Essas extensões não são requisito para considerar o catálogo guiado v1 funcional.
