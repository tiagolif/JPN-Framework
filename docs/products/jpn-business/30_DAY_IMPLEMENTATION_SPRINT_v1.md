# JPN Business — Sprint de Implementação em 30 Dias v1

**Estado:** candidate companion / operational QA pending

Este documento transforma o workbook e o scorecard do JPN Business em uma sequência temporal simples para pequenas empresas. Ele não substitui o `IMPLEMENTATION_WORKBOOK_v1.md` nem o `OPERATIONAL_SCORECARD_v1.md`.

## 1. Regra central

Implante **um único processo por vez**, com escopo pequeno, evidência observável e revisão humana antes de ampliar o uso.

Não complete lacunas por suposição. Se faltar contexto, autorização, responsável, fonte confiável ou critério de sucesso, pare e registre a pendência.

## 2. Objetivo dos 30 dias

Ao final do ciclo, a equipe deve ter:

- 1 processo prioritário escolhido;
- 1 playbook JB-* testado com dados fictícios ou sanitizados quando houver risco;
- entradas, saídas e responsável definidos;
- pelo menos 3 execuções registradas;
- falhas e exceções documentadas;
- avaliação pelo `OPERATIONAL_SCORECARD_v1.md`;
- decisão humana entre continuar em teste, ajustar ou tornar candidato a rotina interna recorrente.

Nenhuma pontuação ou quantidade de testes autoriza publicação, envio automático, compra, gasto, aceite legal ou integração externa.

## 3. Semana 1 — Escolher e delimitar

### Dia 1 — Escolha do processo

Escolha apenas um dos 12 playbooks:

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

Critério: prefira o processo que seja frequente, compreensível, reversível e pequeno o suficiente para ser observado sem depender de automação externa.

### Dia 2 — Definir entrada mínima

Registre:

- o que inicia o processo;
- quais dados são realmente necessários;
- quais dados são opcionais;
- quem pode fornecer ou confirmar cada informação.

### Dia 3 — Definir saída mínima

Registre:

- qual resultado interno esperado;
- formato da saída;
- quem revisa;
- o que caracteriza uma saída incompleta.

### Dia 4 — Mapear riscos e condição de parada

Pare quando houver qualquer condição material não confirmada, dado sensível sem necessidade, ação externa irreversível, autorização ausente ou conflito entre fontes.

### Dia 5 — Preparar primeiro teste

Use cenário fictício ou sanitizado quando houver risco. Não use credenciais, segredos ou dados financeiros reais.

## 4. Semana 2 — Testar e observar

### Dias 6–7 — Teste 1

Execute o playbook manualmente. Registre entrada, saída, pendências, correções e decisão humana.

### Dias 8–9 — Ajuste controlado

Ajuste somente o ponto que falhou. Não redesenhe todo o processo por causa de uma única exceção.

### Dias 10–11 — Teste 2

Repita com um cenário diferente, ainda controlado.

### Dias 12–14 — Revisão da semana

Compare os dois testes e responda:

1. A entrada estava clara?
2. O processo inventou algo?
3. A saída ficou utilizável?
4. A condição de parada funcionou?
5. A revisão humana detectou problemas?

## 5. Semana 3 — Repetir e documentar

### Dias 15–17 — Teste 3

Execute novamente. O objetivo não é provar eficácia comercial; é verificar repetibilidade operacional.

### Dias 18–19 — Registrar exceções

Liste as exceções observadas e classifique-as como:

- contexto ausente;
- conflito de informação;
- erro de interpretação;
- saída incompleta;
- risco/autorização;
- fora do escopo do playbook.

### Dias 20–21 — Atualizar SOP ou base interna

Se aplicável, use JB-09 ou JB-11 apenas para documentar o que já foi validado internamente. Não transforme hipótese em regra.

## 6. Semana 4 — Avaliar e decidir

### Dias 22–24 — Aplicar o scorecard

Avalie o processo nas 8 dimensões do `OPERATIONAL_SCORECARD_v1.md`:

- Contexto;
- Precisão;
- Narrativa;
- Segurança;
- Rastreabilidade;
- Revisão humana;
- Repetibilidade;
- Condição de parada.

A classificação 0–7 / 8–12 / 13–16 é auxiliar e nunca substitui julgamento humano.

### Dias 25–27 — Corrigir bloqueadores

Qualquer bloqueador crítico prevalece sobre pontuação. Não avance se o processo:

- inventa preço, desconto, prazo, condição, estoque ou disponibilidade;
- publica ou agenda conteúdo sem autorização;
- compra mídia, define orçamento financeiro real ou aceita termos de plataforma;
- expõe credenciais, segredos ou dados financeiros reais;
- transforma `REPOR` em autorização automática de compra;
- promete ganho, lucro, aumento de vendas, economia ou garantia de resultado.

### Dias 28–29 — Decisão humana

Escolha uma das três saídas:

- **continuar em teste**;
- **ajustar e repetir**;
- **candidato a rotina interna recorrente**.

“Candidato” não significa automação aprovada, publicação autorizada, release final ou eficácia comprovada.

### Dia 30 — Registro de encerramento

Registre:

- playbook escolhido;
- número de testes;
- principais falhas;
- correções adotadas;
- scorecard final;
- bloqueadores remanescentes;
- responsável pela próxima decisão;
- próxima data de revisão interna.

## 7. Rotas recomendadas por tipo de necessidade

| Necessidade | Playbook inicial sugerido | Apoio do Prompt Pack |
|---|---|---|
| Organizar novos contatos | JB-01 | PP-06, PP-07 |
| Fazer follow-up | JB-02 | PP-06 |
| Qualificar demanda | JB-03 | PP-07 |
| Preparar proposta | JB-04 | PP-03, PP-09 |
| Resolver solicitação | JB-05 | PP-07 |
| Fazer handoff | JB-06 | PP-18 |
| Planejar conteúdo | JB-07 | PP-08, PP-09 |
| Planejar campanha | JB-08 | PP-08, PP-09 |
| Criar SOP | JB-09 | PP-11 |
| Registrar reunião | JB-10 | PP-10, PP-17 |
| Criar base operacional | JB-11 | PP-16 |
| Fazer revisão semanal | JB-12 | PP-04, PP-10, PP-17 |

## 8. Integração com outros produtos JPN

- **Método JPN:** ajuda a estruturar Jornada, Precisão e Narrativa antes da execução.
- **JPN Prompt Builder:** pode ajudar a montar prompts, mas o QA físico contextual em celular permanece pendente.
- **JPN Prompt Pack:** fornece 18 templates reutilizáveis ligados aos playbooks.
- **Gestão Fácil:** pode apoiar acompanhamento operacional; GF-QA-10 permanece pendente e `REPOR` é alerta, não autorização de compra.
- **JPN Pro Kit:** permanece `EM PREPARAÇÃO` e não deve ser tratado como recomendação automática apenas por reunir mais componentes.

## 9. Limites e guardrails

Este sprint não autoriza:

- publicação de anúncios, posts ou campanhas;
- envio automático para clientes;
- compra de mídia ou qualquer gasto;
- criação de contas externas;
- aceite de termos legais;
- uso de credenciais ou segredos;
- uso de dados financeiros reais;
- garantia de resultado.

Ele é um artefato de implantação interna candidata e ainda depende de revisão operacional humana.