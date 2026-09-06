# JPN — Visual Bounds Preflight v1

Status: `controle automatizado de pré-renderização`

## Objetivo

Adicionar uma camada mecânica entre a validação estrutural dos SVGs e a inspeção visual renderizada. O preflight procura coordenadas de texto e baselines que ultrapassem o `viewBox` ou fiquem em posições geometricamente suspeitas.

## Comando

```bash
npm run check:visual-bounds
```

O comando percorre `assets/covers` e `assets/social` e verifica todos os SVGs encontrados.

## O que é bloqueante

O check falha quando:

- um SVG não possui `viewBox` numérico utilizável;
- um elemento `<text>` com coordenadas explícitas possui `x` fora do quadro;
- a estimativa vertical baseada em `y` e `font-size` indica possível corte acima ou abaixo do quadro.

## O que vira aviso

O check apenas avisa quando:

- um `<text>` não possui `x`/`y` explícitos;
- um texto ancorado no início está muito próximo da borda direita;
- um texto ancorado no fim está muito próximo da borda esquerda.

Esses casos exigem inspeção visual, mas não são suficientes por si só para afirmar clipping.

## Limite intencional

Este preflight não mede largura real de glifos, kerning, fallback de fonte, quebra de linha, contraste, percepção de hierarquia ou aparência em dispositivos reais. Portanto, ele não promove o gate `visual-render-review` para `passed`.

A aprovação visual continua dependendo de renderização e inspeção dos assets em escala normal e reduzida conforme `VISUAL_REVIEW_EXECUTION_v1.md`.

## Relação com o build

`check:visual-bounds` faz parte do `npm run build`. Isso reduz a chance de um asset novo chegar ao staging com texto estruturalmente fora do quadro, sem confundir preflight geométrico com revisão visual concluída.

## Guardrails

Este controle não publica assets, não cria anúncios, não ativa checkout, não gera gasto, não usa dados financeiros reais e não aceita termos legais.
