# JPN Business — Operational Scorecard v1

Status: **candidate companion / operational QA pending**

Este scorecard complementa `IMPLEMENTATION_WORKBOOK_v1.md` e ajuda a avaliar se um playbook do JPN Business ainda está em teste, precisa de ajuste ou pode seguir para rotina interna com revisão humana. Ele não mede lucro, ROI, faturamento, conversão ou desempenho financeiro real e não transforma pontuação em autorização automática.

## 1. Regra central

Avalie **um playbook por vez** e apenas depois de pelo menos um teste revisado. A pontuação organiza evidências; ela não substitui julgamento humano.

**Regra de parada:** se faltar contexto, autorização, responsável, evidência de teste ou houver conflito entre fontes, interrompa a avaliação. Não complete lacunas por suposição.

## 2. Escala de avaliação

Use somente os valores abaixo:

- **0 — não evidenciado:** não há prova suficiente;
- **1 — parcial:** existe evidência, mas ainda há falhas ou dependências abertas;
- **2 — consistente no teste:** o item foi observado de forma satisfatória no cenário testado.

Pontuação máxima por playbook: **16 pontos**.

A soma é apenas um sinal auxiliar. Um único bloqueador crítico pode impedir avanço mesmo com pontuação alta.

## 3. Dimensões do scorecard

| Dimensão | Pergunta de verificação | 0 | 1 | 2 |
|---|---|---:|---:|---:|
| Contexto | As entradas mínimas estavam confirmadas? | ausentes | parciais | confirmadas |
| Precisão | A saída evitou inventar fatos, condições ou responsáveis? | falhou | parcial | consistente |
| Narrativa | O formato e o tom ficaram adequados ao uso interno? | inadequado | ajustável | adequado |
| Segurança | Dados sensíveis, credenciais e ações externas ficaram bloqueados? | falhou | parcial | preservado |
| Rastreabilidade | Foi possível identificar fonte, decisão e próximo passo? | ausente | parcial | claro |
| Revisão humana | Houve revisão por responsável definido quando necessária? | não | parcial | sim |
| Repetibilidade | O fluxo pode ser repetido sem depender de improviso relevante? | não | parcial | sim |
| Condição de parada | A rotina parou corretamente quando faltou contexto/autorização? | não | parcial | sim |

## 4. Classificação auxiliar

Depois de somar os oito itens:

- **0–7:** continuar em teste; não usar como rotina recorrente;
- **8–12:** ajustar e repetir com outro cenário fictício/sanitizado;
- **13–16:** pode ser candidato a uso interno recorrente **somente se nenhum bloqueador crítico estiver aberto** e houver revisão humana definida.

Essa classificação não declara eficácia comercial, compatibilidade final, automação aprovada nem autorização de publicação, compra ou gasto.

## 5. Bloqueadores críticos

Marque qualquer item aplicável. Se houver ao menos um `sim`, o playbook não deve avançar para rotina recorrente até correção e novo teste.

- [ ] houve invenção de preço, desconto, prazo, condição, estoque ou disponibilidade;
- [ ] houve ação externa não autorizada;
- [ ] houve publicação ou agendamento sem aprovação;
- [ ] houve compra de mídia, definição de orçamento financeiro real ou tentativa de pagamento;
- [ ] houve exposição de credencial, segredo ou dado financeiro real;
- [ ] houve promessa de resultado tratada como fato;
- [ ] faltou responsável pela revisão humana quando necessário;
- [ ] a saída contrariou fonte interna confirmada;
- [ ] a condição de parada não funcionou;
- [ ] a evidência usada não pertence ao mesmo cenário/versão avaliado.

## 6. Ficha de avaliação

Preencha uma ficha por execução relevante.

- **Playbook:** JB-__
- **Cenário:** fictício / sanitizado / interno controlado
- **Data:** ____ / ____ / ______
- **Responsável pela revisão:** ______________________________
- **Versão do material usada:** ______________________________

| Dimensão | Nota 0–2 | Evidência curta |
|---|---:|---|
| Contexto | __ | ______________________________ |
| Precisão | __ | ______________________________ |
| Narrativa | __ | ______________________________ |
| Segurança | __ | ______________________________ |
| Rastreabilidade | __ | ______________________________ |
| Revisão humana | __ | ______________________________ |
| Repetibilidade | __ | ______________________________ |
| Condição de parada | __ | ______________________________ |
| **Total** | **__/16** | |

### Decisão humana

- [ ] continuar em teste;
- [ ] ajustar e repetir;
- [ ] candidato a uso interno recorrente com revisão humana;
- [ ] interromper até resolver bloqueador crítico.

**Bloqueadores encontrados:** ______________________________

**Ajuste obrigatório antes do próximo uso:** ______________________________

**Próxima evidência necessária:** ______________________________

## 7. Mapa dos 12 playbooks

O scorecard pode ser usado com todos os playbooks canônicos:

- **JB-01 — Entrada e triagem de novo lead**;
- **JB-02 — Follow-up comercial responsável**;
- **JB-03 — Qualificação sem inventar necessidade**;
- **JB-04 — Preparação de proposta sem definir condição não autorizada**;
- **JB-05 — Atendimento e resolução de solicitação**;
- **JB-06 — Escalonamento e handoff interno**;
- **JB-07 — Planejamento de conteúdo comercial**;
- **JB-08 — Planejamento de campanha sem publicação automática**;
- **JB-09 — Criação e manutenção de SOP**;
- **JB-10 — Reunião com decisão e plano de ação**;
- **JB-11 — Base de conhecimento operacional**;
- **JB-12 — Revisão semanal operacional**.

## 8. Exemplos fictícios

### Exemplo A — JB-02

Cenário fictício: um lead pediu retorno na sexta-feira e não informou orçamento.

- Contexto: 2
- Precisão: 2
- Narrativa: 2
- Segurança: 2
- Rastreabilidade: 2
- Revisão humana: 2
- Repetibilidade: 1
- Condição de parada: 2
- Total: **15/16**

Decisão possível: candidato a novo teste controlado ou uso interno recorrente com revisão humana, desde que não exista bloqueador crítico. A nota não autoriza envio automático.

### Exemplo B — JB-04

Cenário fictício: a proposta contém produto e quantidade, mas preço e prazo não foram confirmados por fonte autorizada.

Mesmo que outras dimensões estejam satisfatórias, o fluxo deve destacar as lacunas e parar antes de inventar condição comercial. Se inventar preço ou prazo, há bloqueador crítico e a rotina deve voltar para teste.

## 9. Relação com outros produtos JPN

- **Método JPN:** ajuda a estruturar a instrução quando Contexto, Precisão ou Narrativa estiverem fracos.
- **JPN Prompt Builder:** pode apoiar montagem e reutilização de contexto; o QA físico contextual em celular permanece pendente.
- **JPN Prompt Pack:** oferece templates relacionados aos playbooks, mas não substitui contexto específico.
- **JPN Gestão Fácil:** pode acompanhar rotinas quando apropriado; **GF-QA-10 permanece pendente** e `REPOR` é alerta, não autorização de compra.
- **JPN Pro Kit:** permanece **`EM PREPARAÇÃO`** e não deve ser escolhido automaticamente por ser mais abrangente.

## 10. Estado e limites

Este scorecard é um **candidato de QA operacional interno**. Ele não representa:

- validação estatística;
- benchmark de mercado;
- garantia de resultado;
- autorização de venda;
- autorização de gasto;
- automação externa aprovada;
- publicação;
- aceite de termos legais;
- compatibilidade final entre plataformas;
- substituição da revisão humana.

Use somente dados fictícios, sanitizados ou informações internas não sensíveis durante testes. Não inclua credenciais, segredos ou dados financeiros reais.