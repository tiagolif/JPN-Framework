# JPN Framework — Especificação

**Versão:** 0.3.0-draft  
**Autor:** Tiago Cunha de Souza

## 1. Objetivo

Esta especificação descreve uma forma estruturada de transformar solicitações humanas em contexto operacional, requisitos verificáveis e entregas orientadas ao resultado.

O JPN é composto por três blocos:

- **Jornada:** contexto, histórico, estado atual e incertezas;
- **Precisão:** objetivo, escopo, restrições, riscos e validação;
- **Narrativa:** estado final, sequência de entrega e continuidade.

O framework pode ser usado em prompts isolados, system prompts, agentes, pipelines de automação e sistemas RAG.

## 2. Modelo conceitual

Representação mínima:

```text
JPN = J + P + N

J = contexto + histórico + estado + restrições conhecidas + incertezas
P = objetivo + escopo + requisitos + riscos + critérios de aceitação + validação
N = estado final + sequência + formato + continuidade
```

O JPN não exige que as três dimensões sejam exibidas ao usuário. Uma implementação pode mantê-las como estado interno.

## 3. Jornada

### 3.1 Campos mínimos

| Campo | Obrigatório | Descrição |
|---|---:|---|
| contexto | sim | Ambiente em que a tarefa existe |
| estado_atual | sim | Situação conhecida no momento |
| objetivo_de_negocio | não | Resultado de negócio relacionado |
| historico_relevante | não | Eventos anteriores que alteram a decisão atual |
| recursos_disponiveis | não | Ferramentas, dados, sistemas ou pessoas disponíveis |
| restricoes_conhecidas | não | Limites técnicos, jurídicos, financeiros ou operacionais |
| incertezas | não | Informações ainda não confirmadas |

### 3.2 Regras

- Fatos confirmados e hipóteses devem ser diferenciados.
- Contexto histórico só deve ser utilizado quando for material à tarefa atual.
- Informação sensível deve ser minimizada.
- Uma inferência não deve ser convertida em fato sem confirmação.

## 4. Precisão

### 4.1 Campos mínimos

| Campo | Obrigatório | Descrição |
|---|---:|---|
| objetivo | sim | Resultado operacional da tarefa |
| escopo | sim | O que está e não está incluído |
| entradas | não | Dados ou recursos consumidos |
| saídas | sim | Artefato, ação ou resposta esperada |
| restricoes | não | Limitações obrigatórias |
| criterios_de_aceitacao | recomendado | Condições que definem sucesso |
| riscos | recomendado | Falhas ou impactos que precisam ser considerados |
| validacao | recomendado | Como verificar a solução |

### 4.2 Transformação de requisitos

O JPN recomenda normalizar requisitos vagos.

```text
“rápido” -> tempo máximo ou expectativa operacional
“seguro” -> controles e ameaças relevantes
“bonito” -> referência visual, hierarquia ou critérios de design
“completo” -> escopo enumerado
“profissional” -> padrão de linguagem, estrutura e critérios observáveis
```

### 4.3 Critérios de aceitação

Critérios devem, quando possível:

- ser observáveis;
- possuir condição de aprovação;
- evitar termos subjetivos sem definição;
- cobrir casos de erro relevantes.

## 5. Narrativa

### 5.1 Campos mínimos

| Campo | Obrigatório | Descrição |
|---|---:|---|
| estado_final_desejado | sim | Situação esperada ao concluir |
| sequencia_de_entrega | recomendado | Ordem lógica ou operacional |
| formato_da_resposta | não | Documento, código, tabela, ação etc. |
| nivel_de_detalhe | não | Profundidade adequada ao usuário |
| proxima_acao | não | Continuação útil após a entrega |
| continuidade | não | Estado que precisa persistir |

### 5.2 Princípio

Narrativa é orientação ao **outcome**, não geração literária. Ela garante que a solução seja entregue de forma que o usuário consiga utilizá-la.

## 6. Pipeline de referência

```text
INPUT
  ↓
Context extraction
  ↓
Jornada normalization
  ↓
Requirement formalization
  ↓
Precisão / acceptance criteria
  ↓
Execution plan
  ↓
Tool use / generation
  ↓
Verification
  ↓
Narrativa / delivery
  ↓
OUTPUT + next state
```

## 7. Estados de confiança

Uma implementação pode classificar cada informação como:

- `confirmed`: explicitamente fornecida ou verificada;
- `inferred`: inferência razoável, ainda não confirmada;
- `unknown`: informação necessária não disponível;
- `conflicting`: existem informações incompatíveis.

Exemplo:

```json
{
  "value": "Supabase",
  "confidence_state": "confirmed",
  "source": "user_message"
}
```

## 8. Política de lacunas

Quando houver informação ausente, o agente deve escolher entre:

1. continuar com uma suposição de baixo risco claramente sinalizada;
2. buscar a informação em uma fonte autorizada;
3. solicitar esclarecimento quando a lacuna impedir execução correta;
4. entregar uma solução parcial quando isso for mais útil do que bloquear o trabalho.

## 9. Validação

Checklist mínimo:

- [ ] O objetivo foi atendido?
- [ ] O escopo foi respeitado?
- [ ] Fatos e inferências estão separados?
- [ ] Restrições foram aplicadas?
- [ ] Critérios de aceitação foram verificados?
- [ ] Riscos relevantes foram considerados?
- [ ] A saída está no formato solicitado?
- [ ] A próxima ação está clara quando necessária?

## 10. Métricas sugeridas para experimentos

Para avaliar o JPN de forma objetiva, estudos futuros podem comparar prompts com e sem a estrutura utilizando:

- taxa de cumprimento de requisitos;
- quantidade de retrabalho;
- taxa de alucinação factual;
- cobertura dos critérios de aceitação;
- número de esclarecimentos necessários;
- avaliação humana de utilidade;
- consistência entre execuções.

O repositório não declara melhoria estatística enquanto esses experimentos não forem executados e documentados.

## 11. Compatibilidade

O framework é agnóstico de fornecedor e pode ser adaptado a diferentes LLMs, agentes e ferramentas, desde que o sistema consiga representar contexto, instruções e estado.

## 12. Limitações

- Estrutura melhor não garante resposta correta.
- A qualidade depende dos dados, modelo, ferramentas e validação.
- Contexto excessivo pode reduzir eficiência.
- Critérios mal definidos continuam produzindo resultados ambíguos.
- Sistemas de alto risco exigem controles específicos além do JPN.
