# JPN — Roteiro de demonstração de produtos v1

Status: material comercial interno, candidato e não publicado.

Objetivo: permitir uma demonstração curta, verificável e consistente dos produtos JPN sem transformar demonstração em promessa de resultado, oferta ativa ou autorização de venda.

Princípio: **demonstrar o menor recurso suficiente para a necessidade observada**. Não começar pelo produto mais abrangente e não usar preço, urgência, desconto, checkout ou claims não comprovados.

## 1. Preparação antes da demonstração

- usar somente dados fictícios ou sanitizados;
- confirmar o estado atual do produto na fonte canônica;
- escolher uma única necessidade de baixo risco;
- definir o que será mostrado e a condição de parada;
- manter lacunas como lacunas, sem inventar fatos para deixar a demonstração mais convincente;
- não inserir credenciais, dados financeiros reais, dados pessoais sensíveis ou informações de clientes;
- não apresentar QA pendente como concluído.

## 2. Abertura comum — 30 segundos

> “Vou mostrar somente a parte do JPN que corresponde ao problema que estamos avaliando. A ideia não é usar o pacote inteiro, e sim verificar se um recurso pequeno já organiza melhor o trabalho. O exemplo é fictício e a adequação final depende do contexto real.”

A abertura deve deixar claro que a demonstração é exploratória. Não declarar ganho de vendas, produtividade, precisão, economia ou compatibilidade universal.

## 3. Método JPN — demonstração de 3 minutos

### Cenário fictício

Entrada vaga: “Crie uma proposta comercial para um cliente.”

### Mostrar

1. **Jornada:** esclarecer objetivo, contexto, público e condição de conclusão.
2. **Precisão:** separar fatos confirmados, restrições, lacunas e conflitos.
3. **Narrativa:** definir formato, sequência, tom e nível de detalhe esperado.
4. comparar a entrada vaga com o briefing estruturado resultante.

### Frase de fechamento

“Se organizar a tarefa já resolve o problema, a demonstração termina aqui; não é necessário adicionar outro produto.”

### Limite obrigatório

O Método JPN estrutura a solicitação. Não garante que a resposta produzida por uma IA seja correta ou gere resultado comercial.

## 4. JPN Prompt Builder — demonstração de 4 minutos

### Cenário fictício

Uma pessoa precisa transformar uma intenção incompleta em uma instrução reutilizável.

### Mostrar

1. iniciar uma estrutura JPN;
2. preencher contexto e objetivo;
3. marcar informação como `confirmed`, `inferred`, `unknown` ou `conflicting` quando aplicável;
4. revisar lacunas antes de concluir;
5. mostrar a instrução estruturada sem executar uma tarefa externa em nome do usuário.

### Frase de fechamento

“O Builder ajuda a montar e revisar a estrutura; ele não valida automaticamente a verdade das informações nem executa a atividade final.”

### Limite obrigatório

O QA físico contextual em celular permanece pendente enquanto não houver evidência real registrada. Não usar “100% privado”, “funciona em qualquer dispositivo” ou claim equivalente sem evidência de release.

## 5. JPN Prompt Pack — demonstração de 3 minutos

### Cenário fictício

Uma tarefa recorrente já é conhecida e a pessoa quer evitar reconstruir a instrução toda vez.

### Mostrar

1. abrir o catálogo dos **18 templates canônicos**;
2. classificar a tarefa;
3. selecionar somente um template aderente;
4. apontar quais campos precisam de adaptação de contexto;
5. destacar que fatos e lacunas continuam exigindo revisão.

### Frase de fechamento

“Se um template cobre a necessidade, não há motivo para adicionar uma ferramenta ou processo maior.”

### Limite obrigatório

Template é ponto de partida. Compatibilidade e comportamento em ferramentas específicas precisam ser testados no ambiente real.

## 6. JPN Business — demonstração de 5 minutos

### Cenário fictício

Uma pequena empresa repete uma rotina de acompanhamento de solicitações pendentes.

### Mostrar

1. localizar um dos **12 playbooks canônicos**;
2. identificar entrada, responsável humano, critérios e saída;
3. mostrar onde prompts apoiam a rotina sem substituir decisão humana;
4. mostrar condição de parada e registro de bloqueios;
5. explicar como revisar o processo depois de uso controlado.

### Frase de fechamento

“O playbook organiza uma rotina. Ele não administra a empresa sozinho e não transforma score ou semáforo em decisão automática.”

### Limite obrigatório

Não apresentar JPN Business como substituto de ERP, contador, consultor, sistema fiscal, financeiro ou decisão profissional.

## 7. JPN Gestão Fácil — demonstração de 5 minutos

### Cenário fictício

Uma pequena empresa mantém clientes, tarefas e estoque em controles dispersos.

### Mostrar

1. **Leia-me:** orientação e limites;
2. **Dashboard:** visão derivada dos registros;
3. **Clientes:** cadastro operacional;
4. **Vendas:** registro de movimentações;
5. **Tarefas:** acompanhamento e responsáveis;
6. **Estoque:** quantidade e alerta operacional;
7. **Financeiro:** registro gerencial informativo;
8. **Listas:** padronização de valores usados no workbook.

Usar somente dados fictícios ou sanitizados durante a demonstração.

### Frase de fechamento

“A planilha serve para organização gerencial básica. Se esse controle já atende, não é necessário adicionar um ERP ou outra camada JPN.”

### Limites obrigatórios

- `GF-QA-10` multiplataforma continua pendente até teste real do mesmo XLSX em Microsoft Excel, LibreOffice Calc e Google Sheets;
- `REPOR` é somente alerta operacional, nunca autorização de compra;
- Financeiro não é contabilidade, banco, fiscal, auditoria ou recomendação financeira.

## 8. JPN Pro Kit — demonstração arquitetural de 4 minutos

Estado atual: **`EM PREPARAÇÃO`**.

### Mostrar

1. mapa do ecossistema;
2. jornada **Entender → Estruturar → Operar**;
3. papel individual de Método JPN, Prompt Builder, Prompt Pack, JPN Business e Gestão Fácil;
4. gates e estados independentes dos componentes;
5. regra de adicionar uma camada somente quando houver necessidade adicional comprovada.

### Frase de fechamento

“O Pro Kit mostra como os componentes podem se conectar, mas não deve ser indicado automaticamente quando um produto individual já resolve o problema.”

### Limite obrigatório

Não apresentar o Pro Kit como disponível para compra, release final ou opção superior enquanto o estado canônico permanecer `EM PREPARAÇÃO`.

## 9. Encerramento comum — 30 segundos

Encerrar com três perguntas internas:

1. qual problema concreto a demonstração mostrou;
2. qual foi o menor produto suficiente;
3. qual evidência ainda falta antes de qualquer afirmação adicional.

Se não houver aderência clara, registrar “nenhum produto indicado neste momento”. Não forçar encaminhamento.

## 10. Claims bloqueados durante demonstrações

Não afirmar, sem evidência específica e autorização adequada, que um produto:

- aumenta vendas;
- reduz custos em percentual ou valor;
- economiza quantidade determinada de horas;
- melhora respostas em percentual;
- funciona em qualquer IA sem adaptação;
- é “100% privado”;
- opera sem erros;
- substitui funcionário, consultor, contador ou ERP;
- garante resultado.

## 11. Checklist pós-demonstração

- [ ] necessidade demonstrada foi registrada sem dados sensíveis;
- [ ] produto mostrado correspondeu ao menor recurso suficiente;
- [ ] nenhum QA pendente foi apresentado como concluído;
- [ ] nenhum preço, desconto, checkout ou condição comercial foi inventado;
- [ ] nenhum claim de resultado foi criado a partir da demonstração;
- [ ] próximo passo, se houver, é informativo e reversível;
- [ ] publicação e venda continuam dependentes de autorização específica e estado de release.

## 12. Estado do material

`candidate internal product demo script / commercial and human QA pending`

Este roteiro é um ativo interno de demonstração. Não representa publicação, oferta comercial ativa, preço, autorização de venda, autorização de anúncio ou decisão de release.