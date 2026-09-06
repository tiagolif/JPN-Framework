# Auditoria Editorial — JPN Prompt Pack v1

**Base:** JPN Framework `0.3.0-draft`  
**Artefato auditado:** `JPN_PROMPT_PACK_v1.md`  
**Estado:** draft editorial consolidado

## Escopo desta rodada

A normalização foi feita contra o contrato de conteúdo de `docs/product-system/CONTENT_CONTRACTS.md` e o vocabulário do `Método JPN v1`.

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

Os templates usam placeholders neutros. Não foram incluídos dados pessoais, credenciais, dados financeiros reais ou condições comerciais reais.

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

## Pendências antes de release-candidate

- [ ] revisão ortográfica e de consistência fina;
- [ ] revisão cruzada contra o JPN Business consolidado;
- [ ] verificar se algum cartão deve migrar do Prompt Pack para Business por representar processo longo demais;
- [ ] testar uma amostra de prompts com entradas fictícias e registrar resultado como QA editorial, sem claim de superioridade;
- [ ] definir ordem visual/categorias da versão diagramada;
- [ ] gerar PDF/DOCX final somente depois da revisão cruzada;
- [ ] congelar versão e checksums quando o artefato for promovido a release-candidate.

## Definition of Done desta etapa

Este draft pode ser considerado **editorialmente consolidado** quando:

- cada prompt segue o cartão oficial;
- o vocabulário coincide com o Método JPN;
- não há claims indevidos;
- lacunas e incertezas não são tratadas como fatos;
- o escopo de cada template é distinguível;
- o documento declara sua versão-base.

Esses critérios estão atendidos para a fase de draft. A promoção de status continua bloqueada pela revisão cruzada com JPN Business e pela QA editorial de amostra.