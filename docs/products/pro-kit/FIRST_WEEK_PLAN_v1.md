# JPN Pro Kit v1 — Plano da Primeira Semana

Base: JPN Framework `0.3.0-draft`.

Status deste documento: **candidate companion / operational QA pending**.

Este roteiro transforma o Pro Kit em uma primeira experiência operacional curta, reversível e revisável. Ele não exige usar todos os componentes, não cria obrigação comercial e não substitui os gates de release.

> Regra da semana: use o **menor recurso suficiente**, com um caso pequeno, dados apropriados e revisão humana antes de ampliar.

## Objetivo

Ao final de uma primeira semana de uso, a pessoa deve conseguir:

1. estruturar uma necessidade real com o Método JPN;
2. produzir ou adaptar um único prompt;
3. testar esse prompt em pequena escala;
4. transformar o que se repetiu em uma rotina simples, se fizer sentido;
5. registrar somente fatos operacionais adequados;
6. decidir conscientemente o que manter, ajustar ou descartar.

Concluir este roteiro não significa que o Pro Kit está `release_ready`, aprovado para publicação ou validado em todos os ambientes.

## Dia 1 — Escolher um único problema

Comece com uma tarefa real, pequena e reversível.

Use o Método JPN para responder:

- **Jornada:** qual é o ponto de partida, a tarefa e a condição de parada?
- **Precisão:** quais fatos estão confirmados, inferidos, desconhecidos ou conflitantes?
- **Narrativa:** como a saída precisa ser apresentada para ser útil?

Saída mínima do dia: uma tarefa descrita em até um parágrafo, com objetivo, contexto confirmado, formato esperado e condição de parada.

Pare se a tarefa exigir credenciais, dado financeiro real desnecessário, aceite legal, gasto, publicação ou criação de conta com verificação de identidade.

## Dia 2 — Criar ou escolher um prompt

Escolha apenas um caminho:

- **Prompt Builder:** quando a tarefa é específica e precisa ser estruturada do zero;
- **Prompt Pack:** quando um dos **18 templates** já cobre o caso com pouca adaptação.

Não combine os dois por obrigação.

Antes do teste:

- remova dados pessoais desnecessários;
- use dados fictícios quando o objetivo for aprender o fluxo;
- diferencie `confirmed`, `inferred`, `unknown` e `conflicting`;
- defina o formato da resposta;
- mantenha revisão humana antes de qualquer uso externo.

O QA físico contextual do Prompt Builder em celular continua pendente. O Modo Temporário e o guard local de dados sensíveis são camadas candidatas e não equivalem a DLP, anonimização ou garantia de privacidade.

## Dia 3 — Testar um caso pequeno

Execute uma única tarefa controlada.

Registre:

- o que entrou;
- o que saiu;
- o que estava correto;
- o que precisou de correção;
- qual informação faltou;
- se a tarefa deve ou não ser repetida.

Não transforme um bom resultado isolado em promessa de desempenho, ROI, aumento de vendas, redução de custos ou garantia.

## Dia 4 — Decidir se existe repetição suficiente

Somente se a tarefa realmente se repetir, considere JPN Business.

Escolha no máximo um dos **12 playbooks** como referência e defina:

- responsável;
- gatilho da rotina;
- entrada mínima;
- passos;
- revisão humana;
- saída esperada;
- condição de parada.

Se ainda não existe padrão claro, continue usando o prompt pontualmente e não crie um processo artificial.

## Dia 5 — Registrar fatos operacionais, se necessário

Use a JPN Gestão Fácil somente quando houver fatos que realmente precisem de acompanhamento.

Exemplos adequados incluem tarefas, clientes, vendas operacionais, estoque e registros financeiros operacionais quando apropriados e autorizados pelo próprio usuário.

Regras atuais:

- `GF-QA-10` continua **PENDING** para o mesmo XLSX em Microsoft Excel, LibreOffice Calc e Google Sheets;
- `REPOR` é somente alerta operacional e nunca autorização automática de compra;
- a planilha não substitui sistema contábil, banco, decisão de crédito ou decisão financeira;
- dados fictícios são preferíveis para treinamento e demonstração.

Se não há informação que precise ser acompanhada, não use a planilha apenas para completar o roteiro.

## Dia 6 — Revisar o fluxo inteiro

Faça uma revisão simples:

| Pergunta | Resultado esperado |
|---|---|
| O problema inicial continua relevante? | sim / não / mudou |
| O prompt resolveu a tarefa? | suficiente / precisa ajuste / descartar |
| Houve informação inventada ou não confirmada? | registrar e corrigir |
| A rotina realmente se repete? | sim / não |
| A planilha adicionou clareza? | sim / não / não foi necessária |
| Alguma etapa criou complexidade sem valor? | remover ou simplificar |

A resposta correta pode ser reduzir o número de componentes usados.

## Dia 7 — Fechar a primeira semana

Classifique cada componente tocado em apenas um estado:

- `MANTER`: ajudou e pode continuar em pequena escala;
- `AJUSTAR`: mostrou valor, mas precisa correção ou novo teste;
- `PAUSAR`: faltam informações, QA ou contexto;
- `DESCARTAR_NESTE_CASO`: não adicionou valor ao problema atual.

Registre um próximo passo pequeno. Não transforme essa decisão em autorização para publicar, comprar, contratar, gastar, enviar mensagens externas ou aceitar termos.

## Critérios de sucesso

A primeira semana é considerada útil quando existe evidência de pelo menos um destes resultados:

- uma tarefa ficou mais clara;
- um prompt passou por teste e revisão;
- uma rotina real foi descrita com condição de parada;
- um registro operacional necessário foi organizado;
- um componente desnecessário foi conscientemente removido.

Não é necessário completar todos os itens.

## Critérios de parada imediata

Interrompa e mantenha o item como pendente quando aparecer:

- senha, token, chave de API, credencial ou segredo;
- dado financeiro real desnecessário;
- publicação, anúncio ou envio externo não autorizado;
- compra, contratação, mídia paga ou qualquer gasto;
- aceite de termos legais;
- criação de conta que exija verificação de identidade;
- decisão bancária, tributária, contábil, de crédito ou investimento;
- dependência de compatibilidade ou QA ainda não comprovados.

## Estado atual do Pro Kit

O JPN Pro Kit permanece **EM PREPARAÇÃO**. Este plano é um companion operacional candidato. Ele não substitui `USAGE_ROUTING_GUIDE_v1.md`, `READINESS_MATRIX_v1.md`, `RELEASE_CHECKLIST.md`, `RELEASE_GATES.json`, staging, freeze, hashes, manifesto final, QA físico/multiplataforma ou CI do head definitivo.
