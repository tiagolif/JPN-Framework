# JPN Business — Revisão Operacional Semanal v1

Estado: `candidate companion / operational QA pending`

Este material transforma o playbook JB-12 em um ritual semanal curto, repetível e revisável para pequenas empresas. Não substitui julgamento humano, não autoriza envio automático, publicação, gasto, compra, aceite de termos legais ou uso de dados financeiros reais.

## 1. Regra central

A revisão semanal existe para comparar o que foi planejado com o que realmente aconteceu, identificar bloqueios e decidir o próximo pequeno ajuste. Não complete lacunas por suposição.

Use dados fictícios ou sanitizados durante testes. Quando a rotina depender de informação real, registre somente o mínimo necessário e preserve a origem.

## 2. Cadência de 30 minutos

1. **5 min — Entradas:** listar fatos, pendências e mudanças observadas desde a última revisão.
2. **5 min — Execuções:** identificar quais playbooks foram usados e quais ficaram parados.
3. **5 min — Qualidade:** revisar Contexto, Precisão, Narrativa e Segurança.
4. **5 min — Controle:** revisar Rastreabilidade, Revisão humana, Repetibilidade e Condição de parada.
5. **5 min — Bloqueios:** registrar o que impede continuar com segurança.
6. **5 min — Decisão:** escolher no máximo três próximos passos pequenos, com responsável de revisão.

## 3. Perguntas obrigatórias

- O que mudou desde a última revisão?
- Qual evidência sustenta cada conclusão?
- Houve alguma lacuna preenchida por suposição?
- Algum playbook produziu saída que exigiu correção humana?
- Alguma condição de parada deveria ter sido acionada antes?
- O processo está mais repetível ou apenas mais frequente?
- Existe um bloqueador crítico aberto?
- Qual é o menor próximo passo útil?

## 4. Mapa dos 12 playbooks

- JB-01 — Entrada e triagem de novo lead
- JB-02 — Follow-up comercial responsável
- JB-03 — Qualificação sem inventar necessidade
- JB-04 — Preparação de proposta sem definir condição não autorizada
- JB-05 — Atendimento e resolução de solicitação
- JB-06 — Escalonamento e handoff interno
- JB-07 — Planejamento de conteúdo comercial
- JB-08 — Planejamento de campanha sem publicação automática
- JB-09 — Criação e manutenção de SOP
- JB-10 — Reunião com decisão e plano de ação
- JB-11 — Base de conhecimento operacional
- JB-12 — Revisão semanal operacional

A revisão pode observar qualquer um dos 12 playbooks, mas JB-12 é o ritual que consolida a leitura da semana.

## 5. Ligação com Prompt Pack

JB-12 permanece ligado a PP-04, PP-10 e PP-17. Use esses prompts como apoio para resumir fatos, estruturar reunião e registrar decisão. Eles não substituem a origem dos dados nem a revisão humana.

## 6. Semáforo operacional

O semáforo é auxiliar e nunca funciona como autorização automática.

- **VERDE:** execução ocorreu, origem está clara, revisão humana concluída e nenhum bloqueador crítico está aberto.
- **AMARELO:** execução ocorreu parcialmente, há correção pendente ou evidência insuficiente.
- **VERMELHO:** existe bloqueador crítico, ausência de autorização necessária ou risco de ação externa indevida.

Um item em VERMELHO deve parar a progressão até revisão humana.

## 7. Relação com o scorecard

Use as oito dimensões já definidas no Operational Scorecard: Contexto, Precisão, Narrativa, Segurança, Rastreabilidade, Revisão humana, Repetibilidade e Condição de parada.

As faixas 0–7, 8–12 e 13–16 continuam sendo apoio diagnóstico. Pontuação não prova eficácia, não garante resultado e não autoriza publicação, envio, compra ou automação.

## 8. Relação com o sprint de 30 dias

Durante o sprint, faça uma revisão no fim de cada semana. Compare as execuções registradas no IMPLEMENTATION_TRACKER_v1.csv e anote:

- o que foi testado;
- o que mudou;
- qual correção foi necessária;
- qual bloqueador surgiu;
- qual decisão humana foi tomada;
- qual próximo passo pequeno será testado.

A decisão final do sprint continua humana: manter em teste, ajustar ou tornar candidato a rotina interna recorrente.

## 9. Template de saída

**Semana:** SEMANA-XX

**Playbooks observados:** JB-XX

**Fatos confirmados:**
- 

**Pendências:**
- 

**Correções necessárias:**
- 

**Bloqueadores críticos:**
- 

**Semáforo:** VERDE / AMARELO / VERMELHO

**Próximos passos (máximo 3):**
1. 
2. 
3. 

**Responsável pela revisão humana:**

**Decisão:** continuar em teste / ajustar / candidato a rotina interna recorrente

## 10. Guardrails

- não inventar preço, desconto, prazo, condição, estoque ou disponibilidade;
- não publicar, agendar ou declarar resultado esperado como fato;
- não autoriza publicação;
- não autoriza envio automático;
- não comprar mídia, publicar anúncio, aceitar termos de plataforma ou definir orçamento financeiro real;
- não incluir segredos, credenciais, dados financeiros reais ou informação sem origem confiável;
- `REPOR` é alerta, não autorização de compra;
- GF-QA-10 permanece pendente;
- QA físico contextual em celular permanece pendente;
- JPN Pro Kit permanece `EM PREPARAÇÃO`;
- nenhuma pontuação, cor ou frequência representa garantia de resultado;
- aceite de termos legais exige ação humana autorizada.

## 11. Estado e limite

Este ritual é material candidato para QA operacional. Ele documenta uma forma de revisar processos, mas não demonstra eficácia comercial, compatibilidade final, maturidade organizacional ou aprovação de release.