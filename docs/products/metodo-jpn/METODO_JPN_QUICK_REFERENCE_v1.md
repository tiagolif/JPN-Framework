# Método JPN — Referência Rápida v1

**Status:** candidate companion / editorial and visual QA pending  
**Base metodológica:** JPN Framework `0.3.0-draft`  
**Fonte canônica:** `METODO_JPN_v1.md`  
**Finalidade:** aplicar Jornada, Precisão e Narrativa em poucos minutos sem substituir o material completo.

> Esta referência rápida resume o fluxo operacional do Método JPN. Ela não garante respostas corretas, não elimina alucinações e não transforma inferências em fatos.

## JPN em 30 segundos

| Dimensão | Pergunta principal | Resultado esperado |
|---|---|---|
| **J — Jornada** | Qual é a situação real? | contexto material, estado atual, recursos, limites, incertezas e confiança |
| **P — Precisão** | O que exatamente precisa ser feito e como será verificado? | objetivo, escopo, entradas, saídas, restrições, critérios, riscos e validação |
| **N — Narrativa** | Como deve ficar o resultado final e o que acontece depois? | estado final, sequência, formato, detalhe, próxima ação e continuidade |

## Fluxo em 7 passos

1. **Capture a solicitação original.** Preserve o pedido como evidência de origem.
2. **Extraia a Jornada.** Registre apenas o contexto material para a tarefa.
3. **Classifique confiança quando necessário.** Separe `confirmed`, `inferred`, `unknown` e `conflicting`.
4. **Formalize a Precisão.** Defina objetivo, escopo, entradas, saídas, restrições, critérios, riscos e validação.
5. **Defina a Narrativa.** Determine estado final, sequência, formato e próxima ação.
6. **Execute e valide.** Compare a saída com os critérios antes de concluir.
7. **Preserve continuidade.** Registre o estado e a próxima ação quando houver outro ciclo.

## Checklist J — Jornada

Use somente o que influencia materialmente a tarefa.

- Qual é o contexto mínimo necessário?
- O que já aconteceu?
- Qual é o estado atual?
- Quais recursos estão disponíveis?
- Quais limites já são conhecidos?
- O que ainda não sabemos?
- Existe informação conflitante?

### Confiança da informação

- `confirmed`: fornecida explicitamente ou verificada;
- `inferred`: inferência razoável, ainda não confirmada;
- `unknown`: necessária ou útil, mas indisponível;
- `conflicting`: existem versões incompatíveis.

**Regra:** inferência não vira fato apenas porque parece provável.

## Checklist P — Precisão

Transforme intenção em critérios observáveis.

- Qual é o resultado operacional?
- O que está dentro do escopo?
- O que está fora do escopo?
- Quais entradas podem ser usadas?
- Qual artefato ou ação deve ser entregue?
- Quais restrições precisam ser respeitadas?
- O que define uma saída aprovada?
- O que pode dar errado?
- Como verificar antes de concluir?

### Troque adjetivos vagos por critérios

| Vago | Mais verificável |
|---|---|
| “bonito” | hierarquia visual, referência, legibilidade, espaço em branco |
| “completo” | lista explícita do que precisa estar incluído |
| “profissional” | linguagem, estrutura e padrão de qualidade definidos |
| “rápido” | prazo ou expectativa operacional concreta |

## Checklist N — Narrativa

Projete a entrega para uso, não apenas para correção técnica.

- Como a situação deve estar quando terminar?
- Em que ordem a resposta deve ser apresentada?
- Qual formato é realmente útil?
- Qual nível de detalhe é adequado?
- Existe uma próxima ação natural?
- O que precisa continuar disponível no próximo ciclo?

## Política de lacunas

Quando faltar informação, escolha a resposta proporcional ao risco e ao impacto:

1. **continuar com uma suposição de baixo risco claramente sinalizada**;
2. **buscar a informação em uma fonte autorizada** quando isso estiver disponível e permitido;
3. **solicitar esclarecimento se a ausência impedir execução correta**;
4. **entregar uma parte útil sem fingir que a tarefa foi concluída integralmente**.

### Regra de parada

Pare ou escale antes de concluir quando a lacuna envolver, por exemplo:

- condição comercial ou fato material não confirmado;
- dado sensível ou credencial;
- ação externa irreversível;
- decisão financeira, jurídica ou especializada sem base suficiente;
- fontes materialmente conflitantes sem critério para resolver a divergência.

## Modelo compacto para copiar

```text
# JPN — Jornada · Precisão · Narrativa

## J — Jornada
Contexto:
Estado atual:
Recursos disponíveis:
Restrições conhecidas:
Incertezas e conflitos:
Confiança relevante: confirmed / inferred / unknown / conflicting

## P — Precisão
Objetivo operacional:
Inclui:
Não inclui:
Entradas:
Saída esperada:
Restrições:
Critérios de aceitação:
Riscos:
Validação:

## N — Narrativa
Estado final desejado:
Sequência de entrega:
Formato:
Nível de detalhe:
Próxima ação:
Continuidade a preservar:
```

## Antes de concluir

- O contexto material está explícito sem excesso de ruído?
- Fatos e inferências estão separados quando isso importa?
- O objetivo e o escopo são verificáveis?
- As restrições estão preservadas?
- Existem critérios de aceitação observáveis?
- A saída foi validada contra esses critérios?
- O formato permite uso imediato?
- Lacunas relevantes continuam visíveis?
- A próxima ação está clara quando necessária?

## Limites desta referência

Este documento é um companion operacional. O conteúdo completo, exemplos, anti-padrões, relação entre produtos e fundamentação metodológica permanecem em `METODO_JPN_v1.md`. Revisão ortográfica final, revisão visual/diagramação, formatos finais, freeze, hashes e publicação continuam dependentes das respectivas evidências e autorizações.
