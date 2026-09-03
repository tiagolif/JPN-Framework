# Avaliação do JPN Framework

Este documento define um protocolo inicial para avaliar o JPN de forma reproduzível.

O objetivo não é provar superioridade antecipadamente, mas criar uma metodologia que permita responder a perguntas como:

- O JPN aumenta o cumprimento de requisitos?
- Reduz retrabalho?
- Reduz afirmações factuais sem suporte?
- Melhora consistência entre execuções?
- Aumenta custo, latência ou tamanho de contexto de forma significativa?

## 1. Hipóteses

### H1 — Cumprimento de requisitos

Prompts estruturados com JPN apresentam maior taxa de cumprimento dos requisitos explícitos e implícitos previamente definidos no teste.

### H2 — Redução de retrabalho

Usuários precisam de menos rodadas de correção após uma primeira resposta estruturada com JPN.

### H3 — Grounding

Em tarefas com fontes fornecidas, o JPN reduz a taxa de afirmações factuais sem evidência identificável.

### H4 — Consistência

O JPN reduz variação indesejada entre múltiplas execuções da mesma tarefa.

Estas hipóteses devem ser aceitas ou rejeitadas com base nos resultados, e não tratadas como características já comprovadas do framework.

---

## 2. Desenho experimental

Comparar ao menos dois grupos:

- **Baseline:** instrução original sem transformação JPN.
- **JPN:** mesma tarefa normalizada em Jornada, Precisão e Narrativa.

Opcionalmente, adicionar um terceiro grupo com outro método de estruturação conhecido, desde que o experimento documente claramente sua implementação.

## 3. Conjunto de tarefas

O dataset inicial deve misturar diferentes classes de problema:

1. desenvolvimento de software;
2. atendimento/CRM;
3. resumo ou análise documental;
4. planejamento operacional;
5. RAG com informação insuficiente;
6. requisitos conflitantes;
7. solicitação curta e ambígua;
8. tarefa com formato rígido de saída.

Cada tarefa deve possuir um gabarito de avaliação independente do texto gerado pelo modelo.

## 4. Estrutura do caso de teste

```json
{
  "id": "task-001",
  "category": "software",
  "input": "...",
  "context": ["..."],
  "requirements": [
    {"id": "R1", "description": "...", "weight": 1}
  ],
  "forbidden_behaviors": ["..."],
  "expected_format": "..."
}
```

## 5. Métricas

### 5.1 Requirement Compliance Rate — RCR

Percentual ponderado de requisitos atendidos.

```text
RCR = soma(peso dos requisitos atendidos) / soma(peso total)
```

### 5.2 Unsupported Claim Rate — UCR

Em tarefas com evidência fornecida:

```text
UCR = afirmações factuais sem suporte / total de afirmações factuais
```

Quanto menor, melhor.

### 5.3 Rework Turns — RT

Quantidade de interações adicionais necessárias para que a resposta atenda ao critério de aprovação.

### 5.4 Format Compliance — FC

Métrica binária ou percentual para verificar aderência ao formato solicitado.

### 5.5 Consistency Score — CS

Executar a mesma tarefa múltiplas vezes e avaliar a estabilidade dos requisitos essenciais atendidos.

### 5.6 Latência

Registrar tempo total de geração quando a infraestrutura permitir.

### 5.7 Uso de tokens/contexto

Registrar tokens de entrada e saída para medir o custo adicional da estrutura JPN.

---

## 6. Avaliação humana

Quando houver avaliadores humanos, recomenda-se avaliação cega: o avaliador não deve saber se a resposta pertence ao grupo baseline ou JPN.

Escalas possíveis, de 1 a 5:

- correção;
- completude;
- clareza;
- utilidade;
- confiança;
- facilidade de executar a próxima ação.

## 7. Avaliação por regras

Sempre que possível, usar verificações determinísticas antes de recorrer a julgamento subjetivo.

Exemplos:

- JSON válido;
- presença de campos obrigatórios;
- compilação de código;
- testes automatizados;
- presença/ausência de termos proibidos;
- referências corretas;
- limites de comprimento;
- conformidade com schema.

## 8. Controle de variáveis

Para uma comparação justa, manter iguais entre grupos:

- modelo;
- versão do modelo;
- temperatura e demais parâmetros;
- ferramentas disponíveis;
- fontes fornecidas;
- limite de tokens;
- número máximo de tentativas.

A única variável intencional deve ser a estruturação pelo JPN, salvo quando o experimento estudar outro componente.

## 9. Repetições

Como modelos generativos apresentam variabilidade, recomenda-se executar cada condição múltiplas vezes.

Um teste inicial pode usar 5 repetições por caso; estudos mais robustos devem aumentar esse número conforme custo e necessidade estatística.

## 10. Relato dos resultados

Todo relatório deve incluir:

- modelo e versão;
- data do experimento;
- configuração;
- dataset/casos;
- número de execuções;
- prompts completos ou mecanismo de geração dos prompts;
- métricas agregadas;
- resultados por categoria;
- falhas observadas;
- limitações.

Resultados negativos também devem ser preservados.

## 11. Critério de maturidade

O JPN não deve adotar linguagem como “comprovadamente superior” até possuir experimentos reproduzíveis e resultados suficientes para sustentar uma afirmação específica.

Mesmo com resultados positivos, a conclusão deve permanecer limitada ao domínio, modelos e condições testadas.

## 12. Estrutura futura de evals

```text
evals/
├── dataset/
│   ├── software.jsonl
│   ├── support.jsonl
│   └── rag.jsonl
├── runners/
├── graders/
├── results/
└── README.md
```

Esta estrutura será adicionada quando houver casos de teste suficientes para automatização.
