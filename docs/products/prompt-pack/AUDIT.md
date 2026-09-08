# Auditoria Editorial — JPN Prompt Pack v1

**Base:** JPN Framework `0.3.0-draft`  
**Artefato auditado:** `JPN_PROMPT_PACK_v1.md`  
**Estado:** draft editorial consolidado com revisão cruzada estrutural e QA fictício de amostra

## Escopo desta rodada

A normalização foi feita contra o contrato de conteúdo de `docs/product-system/CONTENT_CONTRACTS.md`, o vocabulário do `Método JPN v1` e a arquitetura já consolidada do `JPN Business v1`.

Foram consolidados **18 cartões de prompt**, cobrindo:

- estruturação de pedidos vagos;
- pesquisa;
- comparação e decisão;
- resumo e continuidade;
- comunicação profissional;
- vendas;
- atendimento;
- conteúdo social;
- oferta comercial;
- reuniões;
- SOPs;
- análise de dados;
- debug;
- planejamento técnico;
- code review;
- base de conhecimento;
- memorando de decisão;
- handoff.

## Critérios verificados

### 1. Cartão editorial

Todos os prompts possuem:

- nome;
- cenário;
- objetivo;
- quando usar;
- quando não usar;
- entradas necessárias;
- template;
- personalização;
- validação;
- riscos e limites;
- componentes JPN usados.

**Resultado:** atendido no draft.

### 2. Terminologia JPN

O pack usa a mesma interpretação do Método:

- Jornada = contexto, estado, histórico, recursos, restrições conhecidas e incertezas;
- Precisão = objetivo operacional, escopo, entradas, saídas, restrições, critérios, riscos e validação;
- Narrativa = estado final, sequência, formato, próxima ação e continuidade.

Os estados `confirmed`, `inferred`, `unknown` e `conflicting` foram preservados quando a classificação de confiança é relevante.

**Resultado:** atendido no draft.

### 3. Política de lacunas

Nenhum template exige que toda lacuna interrompa a execução. A política adotada é:

1. avançar com suposição de baixo risco quando ela puder ser claramente sinalizada;
2. buscar fonte autorizada quando necessário;
3. pedir esclarecimento quando a lacuna impedir execução correta;
4. entregar parte útil sem fingir conclusão integral.

**Resultado:** alinhado ao Método JPN.

### 4. Claims

O pack não contém promessa de:

- ganho percentual;
- aumento de vendas;
- redução garantida de custo ou erro;
- eliminação de alucinação;
- superioridade sobre outros métodos.

**Resultado:** atendido.

### 5. Dados e exemplos

Os templates usam placeholders neutros. O QA de amostra usa apenas cenários sintéticos e não contém dados pessoais, credenciais, dados financeiros reais ou condições comerciais reais.

**Resultado:** atendido.

### 6. Duplicações semânticas

A consolidação separou prompts que poderiam parecer semelhantes pelo **resultado operacional**:

- `Pesquisa verificável` coleta e qualifica evidência;
- `Comparador de alternativas` transforma evidência em trade-offs;
- `Memorando de decisão` registra uma decisão já tomada;
- `Resumo com continuidade` preserva estado e decisões do conteúdo-fonte;
- `Handoff JPN` transfere responsabilidade e continuidade;
- `Notas → SOP` transforma conhecimento em execução repetível.

**Resultado:** nenhuma duplicação óbvia bloqueadora identificada nesta rodada.

## Revisão cruzada com o JPN Business

A separação funcional está consolidada assim:

- **Prompt Pack** = execução delimitada de uma tarefa;
- **JPN Business** = processo recorrente que contém tarefas, decisões, responsáveis, validação e continuidade.

O gate `npm run check:jpn-business-links` verifica mecanicamente:

- unicidade e formato dos IDs `JB-*` e `PP-*`;
- existência dos prompts referenciados pelo Business;
- presença dos IDs nos documentos humanos correspondentes;
- nomes e categorias obrigatórios;
- vínculo mínimo de cada playbook com o Prompt Pack;
- igualdade de `framework_base`;
- estrutura esperada da versão atual: 12 playbooks e 18 prompts.

Essa revisão encerra a antiga pendência de validação cruzada estrutural entre Prompt Pack e Business. Ela não substitui revisão ortográfica, visual ou CI do candidato.

## QA editorial fictício de amostra

Foi criado `QA_CASES_v1.md` com seis cenários sintéticos:

- `PP-01` — estruturação;
- `PP-02` — pesquisa;
- `PP-06` — vendas responsáveis;
- `PP-07` — suporte;
- `PP-12` — dados;
- `PP-18` — continuidade.

Resultado editorial registrado: **6/6 PASS** nos critérios definidos para preservação de fatos, restrições, lacunas, limites e continuidade.

O comando `npm run check:prompt-pack-qa` valida a existência da evidência, os vínculos com o índice canônico, os seis resultados registrados, disclaimers contra benchmark/claims e a permanência explícita dos bloqueios finais.

Esse QA é uma simulação editorial estática, não benchmark de desempenho de modelo e não sustenta claim quantitativo de superioridade.

## Pendências antes de release-candidate

- [ ] revisão ortográfica e de consistência fina;
- [x] revisão cruzada estrutural contra o JPN Business consolidado;
- [x] verificar separação de escopo Prompt Pack × Business na arquitetura atual;
- [x] testar uma amostra editorial com entradas fictícias e registrar evidência;
- [ ] revisar ordem visual/categorias no candidato diagramado;
- [ ] executar revisão visual/PDF;
- [ ] obter CI verde no head candidato;
- [ ] congelar versão e checksums somente após aprovação final do candidato.

## Definition of Done desta etapa

Este draft está **editorialmente consolidado** para a fase atual porque:

- cada prompt segue o cartão oficial;
- o vocabulário coincide com o Método JPN;
- não há claims indevidos;
- lacunas e incertezas não são tratadas como fatos;
- o escopo de cada template é distinguível;
- o documento declara sua versão-base;
- a ligação com o JPN Business é mecanicamente verificável;
- existe QA editorial fictício de amostra registrado.

A promoção para `release-candidate` continua bloqueada por revisão fina, revisão visual/PDF, CI do head e freeze final.
