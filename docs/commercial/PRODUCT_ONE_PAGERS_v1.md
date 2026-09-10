# JPN — Product One-Pagers v1

Status: material comercial interno, candidato e não publicado.

Este documento reúne seis fichas comerciais de uma página para explicar os produtos JPN com linguagem curta, verificável e consistente. Não define preço, desconto, bônus, prazo, disponibilidade, checkout, garantia, promessa de resultado ou autorização de publicação.

Princípio: apresentar o menor recurso suficiente para o problema descrito. O produto mais abrangente não deve ser tratado automaticamente como a melhor opção.

---

## OP-01 — Método JPN

### Em uma frase

Estruture melhor a tarefa antes de pedir a resposta.

### Para quem pode fazer sentido

Para pessoas ou equipes que usam IA e percebem que pedidos vagos, contexto incompleto e critérios implícitos tornam o trabalho difícil de revisar ou repetir.

### Problema que organiza

Transformar uma intenção ainda pouco estruturada em uma instrução que explicite objetivo, contexto, fatos, restrições, lacunas, critérios e forma esperada de saída.

### O que entrega

Uma estrutura baseada em **Jornada · Precisão · Narrativa** para preparar e revisar tarefas antes da execução.

- **Jornada:** objetivo, contexto, público, etapa e condição de parada.
- **Precisão:** fatos, restrições, fontes, conflitos e lacunas.
- **Narrativa:** forma, sequência, tom, nível de detalhe e critérios de apresentação.

### Quando começar por ele

- quando o principal problema ainda é formular melhor a tarefa;
- quando a equipe precisa de linguagem comum para revisar instruções;
- quando ainda não há necessidade comprovada de uma biblioteca, ferramenta ou playbook maior.

### Exemplo de uso fictício

Uma pequena equipe precisa transformar “faça uma mensagem para o cliente” em uma solicitação que informe objetivo, situação do atendimento, fatos confirmados, restrições e formato desejado antes de gerar qualquer texto.

### Limite real

O Método JPN não garante resposta correta nem resultado comercial. A qualidade final também depende do modelo, dos dados, da tarefa e da revisão humana.

### Próximo passo informativo

Conhecer o Método JPN e testar a estrutura em uma tarefa pequena e reversível.

---

## OP-02 — JPN Prompt Pack

### Em uma frase

Comece de um ponto estruturado, não de uma tela em branco.

### Para quem pode fazer sentido

Para quem já reconhece tarefas recorrentes e quer pontos de partida reutilizáveis sem reconstruir toda a instrução a cada execução.

### Problema que organiza

Reduzir a repetição na montagem de prompts preservando contexto, restrições, lacunas e forma de saída.

### O que entrega

Uma biblioteca com **18 templates canônicos** alinhados ao Método JPN, voltados a comunicação, análise, operação, documentação e outros trabalhos recorrentes com IA.

### Quando começar por ele

- quando a tarefa já é razoavelmente conhecida e se repete;
- quando um template existente cobre a maior parte da necessidade;
- quando ainda não é necessário transformar a tarefa em processo empresarial completo.

### Exemplo de uso fictício

Uma pessoa produz semanalmente resumos de reuniões. Em vez de reescrever a estrutura toda vez, seleciona um template adequado, troca somente o contexto variável e mantém critérios de saída e tratamento de lacunas.

### Como escolher com segurança

1. classificar a tarefa;
2. escolher o menor template aderente;
3. adaptar Jornada, Precisão e Narrativa;
4. marcar fatos e lacunas;
5. testar em contexto controlado;
6. registrar o que precisou ser alterado.

### Limite real

Os templates podem ser adaptados a diferentes ferramentas, mas compatibilidade e comportamento específicos devem ser testados no ambiente real. O pack não comprova desempenho universal.

### Próximo passo informativo

Explorar os 18 templates e testar um único caso recorrente antes de combinar vários recursos.

---

## OP-03 — JPN Business

### Em uma frase

Transforme tarefas recorrentes em processos mais claros e revisáveis.

### Para quem pode fazer sentido

Para pequenas empresas ou equipes que já possuem rotinas repetidas e precisam explicitar entradas, responsabilidades, critérios, registros e próximos passos.

### Problema que organiza

Diminuir variação desnecessária em tarefas operacionais sem fingir que um playbook substitui sistemas, profissionais ou decisões humanas.

### O que entrega

Uma biblioteca com **12 playbooks empresariais** conectados a prompts, contexto, responsabilidades, critérios e próximos passos para rotinas de atendimento, vendas, marketing, gestão, operações e conhecimento.

### Quando começar por ele

- quando a tarefa já se repete como rotina de equipe;
- quando existe um responsável humano identificável;
- quando há entradas e saídas mínimas que podem ser documentadas;
- quando é possível testar primeiro em uma operação pequena e controlada.

### Exemplo de uso fictício

Uma empresa pequena quer padronizar o acompanhamento de solicitações pendentes. O playbook define o que entra, quem revisa, quais dados não podem ser inventados, como registrar bloqueios e quando interromper para decisão humana.

### Implantação recomendada

Escolher um processo, testar, observar, registrar, revisar e somente depois decidir se a rotina merece repetição interna. Scorecards ou semáforos servem como apoio diagnóstico, não como autorização automática.

### Limite real

O JPN Business não administra uma empresa sozinho e não substitui decisões humanas, aconselhamento profissional, sistemas fiscais, financeiros ou operacionais.

### Próximo passo informativo

Ver os 12 playbooks e selecionar apenas uma rotina de baixo risco para avaliação inicial.

---

## OP-04 — JPN Prompt Builder

### Em uma frase

Monte e revise estruturas JPN de forma guiada.

### Para quem pode fazer sentido

Para quem já utiliza a estrutura JPN e quer uma interface para organizar, revisar, salvar e reutilizar trabalhos sem depender de arquivos dispersos.

### Problema que organiza

Dar forma operacional à preparação de prompts e trabalhos JPN, mantendo contexto e pendências visíveis durante a reutilização.

### O que entrega

Uma ferramenta web candidata com fluxo guiado de Jornada → Precisão → Narrativa, presets, presets personalizados, workspaces locais e recuperação de contexto, conforme a implementação candidata atual.

### Estados de confiança preservados

- `confirmed` — informação confirmada;
- `inferred` — inferência explicitamente marcada;
- `unknown` — informação ainda desconhecida;
- `conflicting` — fontes ou entradas em conflito.

### Exemplo de uso fictício

Uma pessoa prepara um trabalho JPN, salva uma estrutura local e a reutiliza mais tarde. Antes da nova execução, revisa quais partes continuam confirmadas e quais precisam voltar para `unknown` ou `conflicting`.

### Limite real

A arquitetura candidata é local/offline, mas o **QA físico contextual em celular continua pendente**. Não deve ser apresentado como “100% privado”, universalmente compatível ou release final enquanto esses estados não forem comprovados.

### Próximo passo informativo

Conhecer o Prompt Builder e executar o fluxo de início rápido em ambiente de teste, sem promover o estado de QA.

---

## OP-05 — JPN Gestão Fácil

### Em uma frase

Organize controles básicos da pequena empresa em uma estrutura simples de planilha.

### Para quem pode fazer sentido

Para pequenos negócios que precisam centralizar cadastros, movimentações, tarefas e indicadores operacionais sem implantar um ERP completo.

### Problema que organiza

Reduzir dispersão de informações operacionais simples mantendo limites claros entre controle gerencial, contabilidade, finanças e decisões de compra.

### O que entrega

Uma planilha operacional candidata com as oito abas canônicas **Leia-me, Dashboard, Clientes, Vendas, Tarefas, Estoque, Financeiro e Listas**, acompanhada por guia, dicionário operacional e modelos de dados iniciais.

### Exemplos de acompanhamento

- cadastro e situação de clientes;
- registro operacional de vendas;
- tarefas e responsáveis;
- quantidade de itens em estoque;
- lançamentos informativos no controle financeiro;
- indicadores derivados das informações registradas.

### Exemplo de uso fictício

Uma pequena empresa registra clientes, tarefas e estoque em locais separados. A Gestão Fácil oferece uma estrutura única para organizar esses controles, mantendo campos calculados e estados padronizados.

### Limite real

**GF-QA-10 continua pendente** no mesmo XLSX candidato em Microsoft Excel, LibreOffice Calc e Google Sheets. `REPOR` é apenas alerta operacional, **não autorização automática de compra**. A planilha não se apresenta como ERP, sistema contábil, fiscal, bancário ou ferramenta de decisão financeira.

### Próximo passo informativo

Conhecer a estrutura e testar somente com dados fictícios ou sanitizados enquanto a validação multiplataforma permanecer pendente.

---

## OP-06 — JPN Pro Kit

### Em uma frase

Um conjunto integrado para quando vários componentes JPN realmente resolvem necessidades diferentes do mesmo fluxo.

### Para quem pode fazer sentido

Para usuários ou pequenas equipes que já identificaram necessidade concreta de combinar método, templates, playbooks, ferramenta guiada e materiais operacionais.

### Problema que organiza

Evitar que componentes complementares sejam usados como peças isoladas sem conexão, mas também evitar transformar abrangência em motivo automático de recomendação.

### O que reúne

O Pro Kit coordena materiais do ecossistema JPN preservando o papel, os limites e os gates de cada componente. O uso pode começar por um produto menor e crescer somente quando surgir necessidade adicional comprovada.

### Regra de decisão

Antes de adicionar uma nova camada, responder:

1. qual problema concreto ela resolve;
2. se esse problema realmente se repete;
3. quais entradas precisam estar disponíveis;
4. quem fará a revisão humana;
5. qual é a condição de parada;
6. se um produto menor já resolve a necessidade.

### Exemplo de uso fictício

Uma equipe primeiro estrutura tarefas com o Método JPN, depois identifica uma rotina recorrente coberta pelo Prompt Pack e somente mais tarde percebe necessidade real de um playbook do JPN Business. A combinação acontece por necessidade observada, não por obrigação de usar o pacote inteiro.

### Limite real

Estado atual: **`EM PREPARAÇÃO`**. O Pro Kit não deve ser apresentado como disponível para compra, release final ou opção automaticamente superior. Cada componente mantém seu próprio estado de QA.

### Próximo passo informativo

Entender o mapa de uso e verificar se um componente individual já resolve o problema antes de considerar uma combinação.

---

## Matriz rápida de encaminhamento

| Situação predominante | Menor recurso a avaliar primeiro |
| --- | --- |
| Pedido ainda vago ou difícil de revisar | Método JPN |
| Tarefa conhecida e repetida | JPN Prompt Pack |
| Rotina de equipe que precisa de processo | JPN Business |
| Necessidade de montar/reutilizar estruturas JPN em interface guiada | JPN Prompt Builder |
| Controles operacionais simples de pequena empresa | JPN Gestão Fácil |
| Necessidades reais em várias camadas ao mesmo tempo | JPN Pro Kit, ainda `EM PREPARAÇÃO` |

Esta matriz é orientação editorial, não diagnóstico automático, oferta comercial ou promessa de adequação.

## Checklist antes de usar uma ficha

- confirmar o estado atual do produto na fonte canônica;
- manter 18 templates para o Prompt Pack enquanto essa for a contagem canônica;
- manter 12 playbooks para o JPN Business enquanto essa for a contagem canônica;
- não promover o Prompt Builder além do QA disponível;
- manter GF-QA-10 como pendente enquanto não houver evidência multiplataforma concluída;
- manter `REPOR` apenas como alerta, sem autorização de compra;
- manter o Pro Kit em `EM PREPARAÇÃO` até decisão formal de release;
- não inserir preço, desconto, checkout, promessa de resultado ou urgência inventada;
- não usar dados pessoais, credenciais ou dados financeiros reais;
- exigir autorização específica antes de qualquer publicação, anúncio, gasto, aceite legal ou criação de conta com verificação de identidade.

## Estado do material

`candidate internal one-pagers / commercial and visual QA pending`

As fichas podem servir de fonte para apresentações, PDFs candidatos, páginas, treinamento e atendimento. Elas não são publicação, oferta ativa, tabela comercial, autorização de venda ou decisão de release.
