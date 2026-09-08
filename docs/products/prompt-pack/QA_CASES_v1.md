# QA editorial — JPN Prompt Pack v1

**Base:** JPN Framework `0.3.0-draft`  
**Artefato:** `JPN_PROMPT_PACK_v1.md`  
**Escopo:** simulação editorial estática com dados totalmente fictícios  
**Resultado:** 6/6 casos atendem aos critérios editoriais definidos  

> Este documento não é benchmark de modelo, não mede qualidade percentual e não sustenta claim de superioridade. O objetivo é verificar se os cartões selecionados fornecem instruções suficientes para preservar fatos, sinalizar lacunas, respeitar limites e produzir continuidade operacional.

## Critérios comuns

Um caso recebe `PASS` quando o template, aplicado às entradas fictícias, exige de forma explícita:

1. separação entre fatos e lacunas relevantes;
2. preservação de restrições informadas;
3. ausência de fatos, preços, prazos, garantias ou autoridade inventados;
4. saída com forma verificável;
5. próxima ação ou continuidade quando o cenário exigir.

---

## PP-QA-01 — pedido vago → plano executável

**Prompt:** `PP-01` — Pedido vago → plano executável  
**Cenário fictício:** uma microempresa pede “organize nosso atendimento e deixe profissional”, sem definir canal, volume ou indicador de sucesso.  
**Entradas fictícias conhecidas:** equipe de 3 pessoas; atendimento por e-mail e chat; nenhuma automação autorizada; objetivo inicial é reduzir perda de contexto.  
**Lacunas:** volume diário, tempo-alvo e política de escalonamento.

**Verificação editorial:**

- o cartão manda converter termos vagos em critérios observáveis;
- exige separar escopo, entradas, saídas e lacunas;
- permite avançar com lacuna de baixo risco apenas quando sinalizada;
- não autoriza inventar metas ou políticas;
- termina com plano, critérios de aprovação e próxima ação.

**Resultado:** `PASS`.

---

## PP-QA-02 — pesquisa verificável

**Prompt:** `PP-02` — Pesquisa verificável  
**Cenário fictício:** comparar duas ferramentas de suporte para decidir qual merece um teste interno.  
**Entradas fictícias:** decisão depende de documentação pública atual, recursos de exportação e suporte a permissões; preços não fazem parte desta simulação.  
**Lacunas:** disponibilidade regional de alguns recursos.

**Verificação editorial:**

- o cartão exige evidência rastreável e atual quando necessário;
- diferencia fato verificado, inferência e ausência de evidência;
- exige comparação de datas quando atualidade importa;
- impede extrapolar caso isolado;
- inclui conflitos, limitações e próxima verificação.

**Resultado:** `PASS`.

---

## PP-QA-03 — follow-up responsável

**Prompt:** `PP-06` — Follow-up responsável  
**Cenário fictício:** um potencial cliente pediu material sobre um serviço e não respondeu após o envio.  
**Entradas fictícias confirmadas:** material foi enviado; não há promoção, prazo especial, reserva, informação de estoque ou condição comercial autorizada.  
**Lacuna:** não se sabe se o material foi lido.

**Verificação editorial:**

- o cartão restringe a mensagem aos fatos confirmados;
- proíbe desconto, urgência, estoque, exclusividade e prazo inventados;
- proíbe pressão indevida;
- pede uma próxima ação simples;
- manda sinalizar informação que precisa ser confirmada antes do uso.

**Resultado:** `PASS`.

---

## PP-QA-04 — atendimento → diagnóstico e próximo passo

**Prompt:** `PP-07` — Atendimento → diagnóstico e próximo passo  
**Cenário fictício:** usuário relata que não consegue exportar um relatório em um sistema de testes.  
**Entradas fictícias confirmadas:** login funciona; erro ocorre apenas ao exportar; navegador e mensagem exata do erro ainda não foram informados.  
**Restrição:** não alterar conta, permissões ou dados do usuário durante a triagem.

**Verificação editorial:**

- o cartão separa relato, fatos verificados e pontos a investigar;
- não transforma hipótese técnica em diagnóstico confirmado;
- orienta próxima ação proporcional ao nível de evidência;
- preserva a necessidade de escalonamento quando houver protocolo obrigatório;
- mantém continuidade do atendimento em vez de encerrar com suposição.

**Resultado:** `PASS`.

---

## PP-QA-05 — análise de dados com escopo explícito

**Prompt:** `PP-12` — Análise de dados com escopo explícito  
**Cenário fictício:** analisar uma tabela sintética de chamados para entender distribuição por categoria.  
**Entradas fictícias:** 100 linhas geradas para teste, sem dados pessoais ou financeiros; categorias A, B e C; objetivo é apenas descrever distribuição e possíveis anomalias.  
**Lacunas:** nenhuma explicação causal foi fornecida.

**Verificação editorial:**

- o cartão exige delimitar pergunta, campos, período e critérios;
- separa observação descritiva de interpretação;
- impede causalidade não sustentada pelos dados;
- exige declarar limitações e qualidade das entradas;
- conduz a saída para achados verificáveis, não para precisão fictícia.

**Resultado:** `PASS`.

---

## PP-QA-06 — handoff JPN

**Prompt:** `PP-18` — Handoff JPN  
**Cenário fictício:** transferir um projeto interno de documentação de uma pessoa para outra.  
**Entradas fictícias confirmadas:** estrutura inicial criada; revisão visual pendente; nenhuma publicação autorizada; duas decisões ainda abertas.  
**Restrição:** a nova pessoa não pode aprovar publicação nem assumir decisões que pertencem ao responsável original.

**Verificação editorial:**

- o cartão preserva estado atual, decisões, pendências, riscos e próxima ação;
- distingue o que está confirmado do que permanece aberto;
- não amplia autoridade durante a transferência;
- evita que pendência seja narrada como conclusão;
- cria continuidade suficiente para retomada sem reconstruir todo o histórico.

**Resultado:** `PASS`.

---

## Cobertura da amostra

A amostra cobre seis tipos distintos de uso:

- estruturação: `PP-01`;
- pesquisa: `PP-02`;
- vendas responsáveis: `PP-06`;
- suporte: `PP-07`;
- dados: `PP-12`;
- continuidade: `PP-18`.

Ela não substitui teste de todos os 18 cartões nem execução comparativa entre modelos. O resultado comprova apenas coerência editorial dos seis casos fictícios escolhidos com as regras declaradas no próprio pack.

## Estado após esta rodada

- QA editorial fictício de amostra: `PASS` — 6/6;
- revisão cruzada estrutural Prompt Pack ↔ JPN Business: coberta pelo gate `check:jpn-business-links`;
- revisão ortográfica fina: pendente;
- revisão visual/PDF: pendente;
- CI do head candidato: pendente;
- freeze e checksum final: pendentes.
