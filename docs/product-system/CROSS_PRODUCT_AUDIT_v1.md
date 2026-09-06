# Auditoria Cruzada v1 — Método JPN + Prompt Pack + JPN Business

Base revisada: JPN Framework `0.3.0-draft`.

Status desta passada: **consistência estrutural revisada; release-candidate ainda bloqueado por revisão editorial final e diagramação**.

## Objetivo

Executar uma única revisão dos três produtos centrais para reduzir divergências de vocabulário, versão, escopo, claims e vínculos internos.

## Fontes canônicas desta etapa

- `docs/products/metodo-jpn/METODO_JPN_v1.md`;
- `docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md`;
- `docs/products/prompt-pack/PROMPT_INDEX.json`;
- `docs/products/jpn-business/JPN_BUSINESS_v1.md`;
- `docs/products/jpn-business/BUSINESS_INDEX.json`;
- `docs/product-system/CONTENT_CONTRACTS.md`;
- `docs/product-system/PRODUCT_ARCHITECTURE.md`.

## Resultado da revisão cruzada

### 1. Versão-base

Os três produtos declaram a mesma linha metodológica: `0.3.0-draft`.

A versão comercial continua separada da versão do framework. Um produto pode ser `v1` sem fingir que o framework é `1.0`.

### 2. Vocabulário central

O Método mantém as três dimensões canônicas:

- Jornada = contexto, estado atual, recursos, histórico material, restrições conhecidas e incertezas;
- Precisão = objetivo operacional, escopo, entradas, saídas, restrições, critérios de aceitação, riscos e validação;
- Narrativa = estado final, sequência de entrega, formato, nível de detalhe, próxima ação e continuidade.

Os estados de confiança preservados são:

- `confirmed`;
- `inferred`;
- `unknown`;
- `conflicting`.

Nenhum produto deve criar sinônimo técnico que altere o significado desses estados.

### 3. Separação de produto

A fronteira entre os três produtos está clara:

- **Método JPN** ensina o raciocínio e os contratos;
- **Prompt Pack** oferece templates para tarefas delimitadas;
- **JPN Business** oferece playbooks para processos recorrentes com responsáveis, decisões, validação e continuidade.

Essa separação evita transformar o Business em um segundo Prompt Pack ou o Método em catálogo de prompts.

### 4. Vínculos Prompt Pack → Business

`BUSINESS_INDEX.json` usa IDs do Prompt Pack como dependências editoriais. Esses links agora passam a ter verificação mecânica.

A checagem falha quando:

- há ID duplicado;
- um playbook aponta para prompt inexistente;
- um item existe no índice, mas não aparece no documento humano correspondente;
- a base do framework diverge entre os produtos;
- o Prompt Pack deixa de declarar Jornada, Precisão e Narrativa como componentes do cartão;
- um claim proibido pelo guardrail editorial reaparece nos produtos centrais.

### 5. Claims e limites

A revisão preserva a política já definida:

- não afirmar que o JPN elimina alucinações;
- não prometer venda, produtividade ou resultado garantido;
- não usar porcentagens de melhoria ou redução sem benchmark reproduzível;
- não apresentar QA editorial fictício como benchmark de IA;
- não tratar planejamento de campanha como autorização de gasto ou publicação.

### 6. Continuidade e lacunas

Os três produtos convergem na mesma regra:

- informação ausente não deve ser silenciosamente inventada;
- inferência deve permanecer inferência;
- conflito deve ser exposto;
- pergunta ao usuário é necessária apenas quando a lacuna bloqueia a execução correta ou quando o risco justifica confirmação;
- tarefas recorrentes devem preservar próxima ação e estado relevante.

## Verificação mecânica adicionada

Foi criado `scripts/check-product-consistency.mjs` e o comando:

```bash
npm run check:product-consistency
```

O comando também passa a integrar `npm run build`.

### O teste valida

1. mesma `framework_base` entre Prompt Pack e Business;
2. mesma base declarada no Método;
3. presença dos termos canônicos e quatro estados de confiança no Método;
4. unicidade e formato de IDs `PP-xx` e `JB-xx`;
5. correspondência entre índices estruturados e documentos humanos;
6. integridade de todos os `prompt_pack_links` do Business;
7. presença dos três componentes JPN em cada cartão do índice do Prompt Pack;
8. ausência de padrões simples de claims comerciais bloqueados.

O teste não substitui revisão humana de linguagem. Ele impede regressões objetivas que podem ser detectadas automaticamente.

## Achados desta passada

### Sem divergência estrutural encontrada

- nomenclatura J/P/N consistente;
- quatro estados de confiança consistentes;
- 18 IDs do Prompt Pack utilizados como catálogo estruturado;
- 12 IDs do JPN Business organizados como playbooks;
- vínculos do Business apontam apenas para a taxonomia atual do Prompt Pack;
- Business mantém processo como unidade principal, enquanto Prompt Pack mantém tarefa como unidade principal.

### Pendências editoriais reais

Ainda faltam, antes de `release-candidate`:

1. revisão ortográfica e uniformização de pontuação em uma única passada nos três documentos;
2. revisão de exemplos fictícios para eliminar redundância de estilo;
3. diagramação final dos materiais de entrega;
4. geração dos PDFs/DOCX finais somente depois da revisão textual;
5. atualização do Pro Kit para apontar apenas para versões aprovadas;
6. confirmação de CI verde desta nova checagem.

## Critério para promoção conjunta

Método JPN, Prompt Pack e JPN Business podem avançar para `release-candidate` quando:

- `npm run build` estiver verde com a checagem cruzada;
- não houver divergência terminológica conhecida;
- revisão ortográfica final estiver concluída;
- índices estruturados e documentos humanos corresponderem;
- nenhum placeholder, claim não comprovado, dado real sensível ou credencial estiver presente;
- arquivos diagramados declararem produto, versão comercial e base metodológica.

## Próxima ação recomendada

Executar a revisão editorial final e, em paralelo, preparar a montagem do **JPN Pro Kit release-candidate** com referências versionadas, sem preço, checkout, publicação ou anúncios.
