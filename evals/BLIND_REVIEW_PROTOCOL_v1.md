# JPN — Protocolo de revisão cega v1

Este documento operacionaliza a etapa humana da Fase 3 sem revelar ao avaliador qual resposta veio do `baseline` e qual veio do `jpn`.

## Objetivo

Reduzir viés de confirmação na métrica `human_utility` preservando, ao mesmo tempo, rastreabilidade suficiente para recompor a condição depois que a avaliação terminar.

## Pré-condições

Antes de gerar o pacote cego:

1. use o mesmo modelo e os mesmos parâmetros para baseline e JPN;
2. preserve as respostas brutas sem edição;
3. tenha exatamente uma resposta `baseline` e uma resposta `jpn` para cada `case_id` avaliado;
4. registre modelo, provedor e parâmetros relevantes em `results`;
5. não preencha `human_utility` olhando a condição.

## Geração

Com respostas reais preenchidas em um arquivo compatível com `evals/results.example.json`:

```bash
JPN_EVAL_BLIND_SALT="uma-frase-local-com-8-ou-mais-caracteres" \
  npm run eval:blind -- caminho/para/results.json
```

O salt não é uma senha de segurança do produto. Ele serve apenas para tornar a atribuição A/B determinística dentro da rodada sem codificar a condição no pacote entregue ao avaliador. Não o entregue ao avaliador antes do fechamento das notas.

## Saídas

O comando gera em `dist/evals/<provider>-<model>/`:

- `BLIND_REVIEW_PACKET.json` — arquivo destinado ao avaliador;
- `BLIND_CONDITION_KEY.json` — chave separada que mapeia A/B para baseline/JPN.

O pacote contém contexto, evidências, requisitos, critérios de aceitação, claims proibidos, respostas A/B e campos vazios de revisão. Ele não contém os prompts nem a identificação da condição.

## Escala de utilidade humana

Use uma escala de 1 a 5:

- **1** — inútil ou inadequada para a tarefa;
- **2** — pouco útil; exige retrabalho substancial;
- **3** — parcialmente útil; exige correções relevantes;
- **4** — útil; exige apenas ajustes menores;
- **5** — útil e aceitável com pouco ou nenhum retrabalho.

O avaliador deve registrar uma nota e, idealmente, uma justificativa curta para A e B antes que a chave de condições seja aberta.

## Regras anti-viés

- não revelar nomes de condição, prompts ou estrutura JPN ao avaliador durante a pontuação;
- não reorganizar ou corrigir as respostas antes da avaliação;
- manter a mesma rubrica para A e B;
- não descartar resultados negativos;
- se houver mais de um avaliador, registrar cada avaliação separadamente antes de agregar;
- abrir `BLIND_CONDITION_KEY.json` somente depois do fechamento das notas.

## Fingerprint

Os dois arquivos recebem o mesmo `source_fingerprint_sha256`, calculado a partir do dataset e do arquivo de resultados usados na geração. Antes de recompor as condições, confirme que os fingerprints coincidem.

O fingerprint prova apenas que pacote e chave foram derivados da mesma entrada naquele processo. Ele não autentica identidade de avaliador e não substitui versionamento do repositório.

## Estado de release

Gerar um pacote cego significa apenas `blind-review-pending`.

Não significa:

- que a revisão humana foi executada;
- que JPN venceu baseline;
- que há significância estatística;
- que existe claim comercial autorizado;
- que a Fase 3 está concluída.

Uma conclusão comparativa continua exigindo execução real, notas fechadas, scoring agregado e relatório explícito de limitações.
