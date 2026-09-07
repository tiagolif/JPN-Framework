# JPN — Product Page Copy Pack v1

Status: draft comercial interno, não publicado.
Base: `PRODUCT_PAGE_SYSTEM_v1.md`, `COMMERCIAL_MESSAGING_v1.md`, documentação vigente dos produtos e guardrails do ecossistema JPN.

## Objetivo

Entregar copy pronta para composição visual das páginas dos seis produtos JPN sem preço, checkout, escassez artificial, promessa de resultado ou CTA transacional. Cada bloco pode ser usado como página independente ou adaptado para uma página única de portfólio.

---

# Método JPN

## Hero

**Estruture melhor o que você pede à IA.**

O Método JPN organiza uma solicitação em três camadas — Jornada, Precisão e Narrativa — para tornar contexto, objetivo, restrições, critérios e estado final mais explícitos antes da execução.

CTA primário: **Conhecer o método**

Microcopy: O método melhora a estrutura da instrução; não garante que um modelo produza respostas corretas.

## O problema que ele organiza

Uma tarefa importante pode começar com uma frase curta, mas quase sempre depende de informações que ficaram implícitas: de onde a situação parte, o que precisa mudar, quais limites existem, quais fatos estão confirmados e como saber se a entrega está pronta.

Quando essas decisões aparecem só depois da primeira resposta, a revisão vira retrabalho. O JPN propõe organizar a especificação antes de delegar a execução.

## Como funciona

**Jornada** registra o estado atual, o histórico relevante, os recursos disponíveis, as dependências e as lacunas que ainda precisam ser tratadas.

**Precisão** transforma intenção em objetivo, escopo, restrições, fatos confirmados, critérios de aceitação e regras de validação.

**Narrativa** descreve a forma da entrega, a sequência esperada, o estado final desejado e a próxima ação.

## O que inclui

- estrutura canônica Jornada → Precisão → Narrativa;
- política para diferenciar fato, hipótese, preferência e lacuna;
- critérios de revisão de uma instrução antes da execução;
- exemplos de aplicação em tarefas de conhecimento;
- linguagem independente de um provedor específico de IA.

## Para quem é

Para pessoas que usam IA em tarefas que precisam ser revisáveis: vendas, atendimento, marketing, pesquisa, operação, criação, gestão e trabalho técnico.

## Para quem não é

Não é um substituto para checagem de fatos, análise jurídica, contábil, médica, financeira ou qualquer outra validação especializada que a tarefa exija.

## Exemplo de aplicação

Em vez de pedir apenas “crie uma campanha”, o usuário registra o contexto da campanha, público, ativos já disponíveis, objetivo, restrições da marca, entregáveis, critérios de revisão e próximos passos. A IA recebe uma tarefa mais delimitada e o usuário mantém explícito o que ainda precisa conferir.

## FAQ

### É um método só para ChatGPT?
Não. O núcleo do JPN descreve como estruturar a tarefa antes da execução e pode ser adaptado a diferentes modelos e ferramentas.

### O JPN impede alucinações?
Não. Ele pode tornar lacunas e critérios mais visíveis, mas a saída ainda precisa ser validada conforme o risco da tarefa.

### Preciso saber programar?
Não.

## Encerramento

**Antes de pedir uma resposta, organize o problema.**

CTA: **Conhecer o Método JPN**

---

# JPN Prompt Builder

## Hero

**Da ideia inicial a uma instrução estruturada e revisável.**

O JPN Prompt Builder conduz uma ideia pelos campos do Método JPN, mantém lacunas visíveis e compila uma instrução que pode ser revisada antes de ser usada em uma IA.

CTA primário: **Experimentar a demo**

Microcopy: A versão atual organiza o prompt localmente e não precisa de uma API externa para montar a instrução.

## O problema que ele organiza

Saber o que você quer fazer não significa já ter uma instrução completa. Contexto, restrições, formato, critérios e dados ausentes podem ficar espalhados entre mensagens, anotações ou memória.

O Builder transforma essa etapa em um fluxo guiado.

## Como funciona

1. descreva a ideia inicial;
2. complete Jornada, Precisão e Narrativa;
3. revise lacunas e restrições;
4. confira o estado final desejado;
5. compile a instrução para reutilização.

## O que inclui

- interface guiada pelo Método JPN;
- presets para pontos de partida recorrentes;
- espaços de trabalho locais;
- revisão de campos antes da compilação;
- geração da instrução final sem exigir que fatos ausentes sejam inventados;
- funcionamento local/offline para a montagem do prompt.

## Para quem é

Para quem entende a tarefa, mas quer um processo mais consistente para transformar intenção em instrução antes de conversar com uma IA.

## Para quem não é

Não é um agente autônomo que valida fatos, executa a tarefa final ou toma decisões pelo usuário.

## Exemplo de aplicação

Uma pessoa precisa preparar uma análise comercial. Ela registra no Builder o objetivo, período, fontes disponíveis, perguntas que precisam ser respondidas, limites de interpretação e formato final. Antes de copiar o prompt, consegue enxergar o que ainda está faltando.

## FAQ

### O Builder envia meus dados para uma IA automaticamente?
A proposta da versão atual é montar a estrutura localmente. Integrações externas, quando existirem, devem ser tratadas como funções separadas e explícitas.

### Ele preenche informações que eu não tenho?
A abordagem atual é conservadora: lacunas devem continuar identificáveis para revisão.

### Posso reutilizar uma estrutura?
Sim. O fluxo foi pensado para permitir presets e espaços de trabalho reutilizáveis.

## Encerramento

**Transforme o rascunho mental em uma instrução que você consegue revisar.**

CTA: **Experimentar a demo**

---

# JPN Prompt Pack

## Hero

**Estruturas prontas para começar tarefas recorrentes com menos improviso.**

O JPN Prompt Pack reúne 18 estruturas reutilizáveis para comunicação, pesquisa, vendas, suporte, operações, dados e tecnologia, sempre com campos que precisam ser adaptados ao contexto real.

CTA primário: **Explorar o Prompt Pack**

## O problema que ele organiza

Reescrever do zero a estrutura de tarefas parecidas consome atenção e aumenta a chance de esquecer contexto, limites ou critérios importantes.

O Prompt Pack oferece pontos de partida estruturados sem transformar modelos de prompt em respostas universais.

## Como funciona

1. escolha a estrutura mais próxima da tarefa;
2. substitua os campos pelo contexto real;
3. remova o que não se aplica;
4. explicite lacunas e restrições;
5. revise antes de executar.

## O que inclui

- 18 templates PP-* na edição atual;
- categorias de uso delimitadas;
- campos de adaptação explícitos;
- estrutura alinhada a Jornada, Precisão e Narrativa;
- referências que podem ser combinadas com playbooks do JPN Business.

## Para quem é

Para profissionais que repetem tarefas de conhecimento e querem partir de uma estrutura verificável em vez de uma página em branco.

## Para quem não é

Não é uma coleção de comandos mágicos. Um template inadequado ou mal preenchido continua podendo gerar uma resposta inadequada.

## Exemplo de aplicação

Um vendedor precisa criar um follow-up. Em vez de usar uma mensagem genérica, seleciona uma estrutura do Pack e adapta histórico do contato, objetivo, tom, restrições e próxima ação permitida.

## FAQ

### Posso copiar e usar sem alterar nada?
Tecnicamente é possível, mas não é a proposta. Os templates foram feitos para adaptação ao contexto.

### O Pack funciona com diferentes IAs?
O núcleo é independente de provedor, embora o comportamento final varie entre modelos.

### O Pack substitui o Método JPN?
Não. O Pack oferece estruturas prontas; o Método explica a lógica para adaptar e revisar essas estruturas.

## Encerramento

**Comece por uma estrutura. Termine com o seu contexto.**

CTA: **Explorar o Prompt Pack**

---

# JPN Business

## Hero

**Playbooks para organizar tarefas recorrentes de pequenos negócios com IA.**

O JPN Business transforma o método em 12 fluxos operacionais para vendas, atendimento, marketing, reuniões, SOPs e gestão de conhecimento, com entradas, passos, validação humana e continuidade explícitas.

CTA primário: **Ver os playbooks**

## O problema que ele organiza

Em pequenos negócios, uma mesma atividade costuma ser repetida por pessoas diferentes, em momentos diferentes e com critérios que ficam na cabeça de quem executa. Inserir IA nesse processo sem definir entradas, decisões e revisão pode aumentar a inconsistência.

O JPN Business estrutura primeiro o processo; a IA entra como ferramenta dentro de um fluxo que continua revisável.

## Como funciona

Cada playbook organiza:

- processo e resultado esperado;
- responsável;
- entradas necessárias;
- restrições;
- passos de execução;
- decisões que não devem ficar implícitas;
- saída esperada;
- validação;
- continuidade;
- riscos;
- aplicação dos pilares JPN;
- prompts PP-* relacionados quando aplicável.

## O que inclui

- 12 playbooks JB-* na edição atual;
- vínculos com estruturas do JPN Prompt Pack;
- fluxos para vendas e relacionamento;
- apoio a conteúdo, campanhas e comunicação;
- organização de reuniões, SOPs e conhecimento;
- pontos explícitos de validação humana.

## Para quem é

Para pequenos negócios, gestores e profissionais que querem aplicar IA em rotinas repetíveis sem reduzir o processo a “copiar um prompt”.

## Para quem não é

Não substitui decisões comerciais críticas nem orientação contábil, fiscal, jurídica ou financeira. Também não garante aumento de vendas ou produtividade.

## Exemplo de aplicação

Um time precisa preparar uma sequência de follow-up. O playbook define quais informações do cliente entram, o objetivo do contato, restrições de abordagem, estrutura de mensagem, validação antes do envio e registro da próxima ação. A IA ajuda na preparação; a decisão de contato continua controlada pelo processo.

## FAQ

### É um software de automação?
Não. O produto é uma biblioteca de playbooks operacionais. Automação técnica pode ser construída separadamente quando fizer sentido.

### Os playbooks usam o Prompt Pack?
Sim. A edição atual registra relações explícitas com prompts PP-* quando uma estrutura do Pack pode apoiar a etapa.

### É só para empresas grandes?
Não. A proposta é justamente tornar processos úteis para pequenos negócios e equipes enxutas.

## Encerramento

**Não automatize a desorganização. Estruture o processo primeiro.**

CTA: **Ver os playbooks do JPN Business**

---

# JPN Gestão Fácil

## Hero

**Uma planilha simples para centralizar a rotina do pequeno negócio.**

A JPN Gestão Fácil organiza clientes, vendas, tarefas, estoque e registros financeiros operacionais em um arquivo XLSX único, com áreas separadas e manual de uso.

CTA primário: **Ver como a planilha funciona**

Microcopy: Não é sistema bancário, fiscal, contábil ou ERP completo.

## O problema que ela organiza

Pequenas operações frequentemente distribuem informações entre cadernos, mensagens, arquivos separados e planilhas improvisadas. Isso dificulta enxergar o estado atual e manter registros consistentes.

A Gestão Fácil propõe uma estrutura central para rotinas básicas sem exigir implantação de um sistema complexo.

## Como funciona

1. registre cadastros básicos;
2. mantenha vendas e tarefas em áreas próprias;
3. acompanhe itens e movimentações operacionais;
4. use os resumos previstos na planilha;
5. confira os registros antes de tomar decisões.

## O que inclui

- arquivo XLSX versionado;
- área de clientes;
- área de vendas;
- área de tarefas;
- área de estoque;
- registros financeiros operacionais;
- manual de uso;
- dados demonstrativos para entendimento da estrutura.

## Para quem é

Para autônomos e pequenos negócios que ainda não precisam de um ERP completo, mas querem sair de registros dispersos e adotar uma rotina básica mais organizada.

## Para quem não é

Não substitui software contábil, emissão fiscal, conciliação bancária, controles regulatórios ou validação profissional de informações financeiras.

## Exemplo de aplicação

Uma pequena loja registra cliente, venda, tarefa de acompanhamento e movimentação operacional em áreas separadas do mesmo arquivo. O responsável consegue consultar a rotina sem depender de anotações espalhadas.

## FAQ

### Preciso usar dados reais para aprender?
Não. A estrutura inclui dados demonstrativos e pode ser entendida antes de qualquer preenchimento real.

### É um ERP?
Não. É uma planilha operacional de organização básica.

### Posso abrir em qualquer aplicativo de planilha?
A compatibilidade final deve ser validada no QA previsto para Excel, LibreOffice Calc e Google Sheets antes do release definitivo.

## Encerramento

**Centralize o básico antes de aumentar a complexidade.**

CTA: **Ver a estrutura da Gestão Fácil**

---

# JPN Pro Kit

## Hero

**O ecossistema JPN reunido em uma jornada única de implementação.**

O JPN Pro Kit organiza método, ferramenta, biblioteca, playbooks e materiais de aplicação em uma sequência para quem quer adotar o conjunto completo sem descobrir sozinho por onde começar.

Status comercial: **EM PREPARAÇÃO**

CTA permitido nesta fase: **Acompanhar o desenvolvimento**

## O problema que ele organiza

Ter vários materiais úteis não significa ter uma implementação coerente. O Pro Kit existe para conectar aprendizagem, estruturação, reutilização e operação em uma única jornada.

## Jornada prevista

1. entenda a lógica com o Método JPN;
2. pratique a estruturação no Prompt Builder;
3. acelere tarefas delimitadas com o Prompt Pack;
4. leve a lógica para processos com o JPN Business;
5. organize rotinas básicas com a Gestão Fácil quando aplicável;
6. use os materiais de implementação para consolidar a adoção.

## Componentes previstos

- Método JPN;
- JPN Prompt Builder;
- JPN Prompt Pack;
- JPN Business;
- JPN Gestão Fácil;
- materiais de implementação;
- leitura inicial e orientação de uso.

## Para quem é

Para quem prefere uma jornada integrada em vez de adotar cada produto isoladamente.

## Para quem não é

Não é uma promessa de transformação automática do negócio. O conjunto organiza ferramentas e processos; aplicação, dados, julgamento e validação continuam sob responsabilidade do usuário.

## Estado atual

O Pro Kit permanece em preparação enquanto artefatos, hashes, PDFs, compatibilidade e evidências de release ainda não estiverem congelados e revisados. Nenhum preço, checkout, desconto, reserva ou escassez deve aparecer antes de autorização específica.

## FAQ

### O Pro Kit já está à venda?
Não. O produto está em consolidação interna.

### Ele reúne todos os produtos JPN?
A composição prevista reúne os principais produtos do ecossistema e materiais de implementação, respeitando o estado de release de cada componente.

### Posso comprar antecipadamente?
Não há oferta antecipada definida nesta fase.

## Encerramento

**Aprenda a lógica. Estruture a tarefa. Reutilize o que funciona. Organize o processo.**

CTA: **Acompanhar o desenvolvimento do JPN Pro Kit**

---

# Blocos reutilizáveis para composição visual

## Selos de categoria

- Método: **Framework de estruturação**
- Prompt Builder: **Ferramenta guiada**
- Prompt Pack: **Biblioteca de estruturas**
- JPN Business: **Playbooks operacionais**
- Gestão Fácil: **Planilha operacional**
- Pro Kit: **Ecossistema integrado — em preparação**

## Microcopies de confiança permitidas

- “Lacunas permanecem visíveis para revisão.”
- “Estrutura antes da execução.”
- “Sem promessa de resposta perfeita.”
- “Use exemplos como ponto de partida, não como fato.”
- “Decisões críticas continuam exigindo validação humana.”

## CTAs permitidos antes de lançamento autorizado

- Conhecer o método
- Experimentar a demo
- Explorar o Prompt Pack
- Ver os playbooks
- Ver como a planilha funciona
- Acompanhar o desenvolvimento

## CTAs que permanecem bloqueados nesta fase

- Comprar agora
- Garantir minha vaga
- Reservar com desconto
- Últimas unidades
- Oferta por tempo limitado
- Entrar no checkout

## Regra de publicação

Este arquivo é fonte de copy interna. Sua existência não autoriza publicação, anúncio, checkout, preço, coleta de dados, abertura de conta ou aceite de termos. Qualquer página pública futura deve passar pelo checklist de `PRODUCT_PAGE_SYSTEM_v1.md` e pelo estado de release vigente de cada produto.
