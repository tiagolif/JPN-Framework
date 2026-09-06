# JPN Business — QA com Casos Fictícios v1

Base: JPN Framework `0.3.0-draft`.

Objetivo: verificar se os playbooks produzem estados operacionais úteis sem inventar fatos, condições comerciais, autoridade ou decisões.

Todos os casos abaixo são fictícios e neutros.

## Critérios comuns

Um caso passa quando:

- fatos fornecidos permanecem fatos;
- lacunas permanecem explícitas;
- inferências não viram confirmação;
- nenhuma restrição do playbook é ultrapassada;
- a saída contém próxima ação ou motivo explícito para não agir;
- continuidade pode ser registrada sem recuperar toda a conversa original.

---

## QA-01 — Comercial / JB-01 Entrada e triagem

**Entrada fictícia**

> “Olá, vi o serviço de organização de documentos. Preciso entender como funciona para uma equipe pequena.”

**Fatos confirmados**
- existe interesse em entender o funcionamento;
- o tema é organização de documentos;
- a pessoa menciona uma equipe pequena.

**Não confirmado**
- orçamento;
- prazo;
- número de pessoas;
- intenção de compra;
- autoridade de decisão.

**Aplicação esperada**
- preservar a mensagem original;
- registrar necessidade inicial como “entender funcionamento”;
- não marcar compra como provável;
- formular apenas perguntas que permitam apresentar o serviço de modo relevante;
- definir próxima ação como resposta informativa/qualificação leve.

**Resultado de QA:** PASSA.

**Motivo:** o playbook permite avançar sem exigir orçamento ou urgência e proíbe transformar interesse inicial em intenção de compra confirmada.

---

## QA-02 — Atendimento / JB-05 Resolução de solicitação

**Entrada fictícia**

> “Enviei um arquivo ontem e ainda aparece como pendente. Vocês conseguem verificar?”

Procedimento disponível: o atendente pode confirmar recebimento e status do sistema, mas não pode prometer prazo de análise de outra equipe.

**Aplicação esperada**
- confirmar entendimento;
- consultar o status permitido;
- informar o que está confirmado;
- se ainda depender de outra equipe, encaminhar sem inventar prazo;
- registrar o responsável atual e a próxima etapa.

**Resultado de QA:** PASSA.

**Motivo:** o playbook contém gate explícito de autoridade e proíbe promessa de prazo dependente de outra área.

---

## QA-03 — Marketing / JB-08 Planejamento de campanha

**Entrada fictícia**

Objetivo: preparar campanha de lançamento de um guia digital. Existem capa, descrição e três imagens. Ainda não foram definidos preço, plataforma de checkout, orçamento de mídia nem data de publicação.

**Aplicação esperada**
- estruturar público, mensagem, ativos, peças e sequência;
- marcar preço, checkout, mídia e publicação como não definidos;
- não escolher orçamento;
- não publicar;
- produzir plano em estado “pronto para revisão”.

**Resultado de QA:** PASSA.

**Motivo:** o playbook permite produzir valor antes da ativação externa e contém bloqueios explícitos contra gasto, aceite de termos e publicação.

---

## QA-04 — Operações / JB-09 Criação e manutenção de SOP

**Entrada fictícia**

Notas:
1. receber formulário;
2. conferir se nome do projeto e arquivo estão presentes;
3. se faltar um deles, devolver para correção;
4. se estiver completo, registrar como recebido;
5. uma segunda pessoa revisa o conteúdo.

**Aplicação esperada**
- definir pré-condição: formulário recebido;
- converter os cinco itens em sequência operacional;
- transformar “falta nome ou arquivo” em ponto de decisão;
- preservar a revisão por segunda pessoa;
- incluir critério de conclusão e versão do SOP.

**Resultado de QA:** PASSA.

**Motivo:** o playbook organiza as notas sem acrescentar sistemas, prazos ou aprovações inexistentes.

---

## QA-05 — Gestão / JB-10 Reunião com decisão

**Entrada fictícia**

Durante uma reunião foram discutidas duas opções de nome para um projeto. O grupo preferiu a opção A, mas a pessoa responsável pela marca não estava presente e a decisão final ficou para a próxima reunião.

**Aplicação esperada**
- registrar que A foi a preferência da reunião;
- NÃO registrar A como nome aprovado;
- registrar decisão final como pendente;
- registrar dependência: revisão da pessoa responsável pela marca;
- incluir a próxima reunião/checkpoint.

**Resultado de QA:** PASSA.

**Motivo:** o playbook separa explicitamente discussão, preferência e decisão tomada.

---

## QA-06 — Conhecimento / JB-11 Base operacional

**Entrada fictícia**

Fonte A, versão 2: “Solicitações completas seguem para revisão.”

Fonte B, sem data: “Toda solicitação segue automaticamente para revisão.”

**Aplicação esperada**
- preservar as duas fontes;
- registrar versão/data disponível;
- detectar conflito;
- não escolher silenciosamente uma das duas como regra vigente;
- solicitar definição de fonte autoritativa ou validação humana antes de automação.

**Resultado de QA:** PASSA.

**Motivo:** o playbook exige rastreabilidade e impede conflito silencioso.

---

# Resultado consolidado

Casos executados: 6.

Categorias cobertas:
- comercial;
- atendimento;
- marketing;
- operações;
- gestão;
- conhecimento.

Resultado: **6/6 casos passam pelos critérios editoriais definidos**.

Este QA verifica coerência do playbook contra entradas fictícias; não é benchmark de desempenho de IA e não sustenta claim quantitativo de superioridade do JPN.

## Pendências após QA

- revisão ortográfica final do produto completo;
- revisão cruzada integral Método + Prompt Pack + Business;
- validação mecânica dos IDs do índice na etapa de consolidação técnica;
- diagramação do artefato comercial;
- revisão final antes de promover para `release-candidate`.
