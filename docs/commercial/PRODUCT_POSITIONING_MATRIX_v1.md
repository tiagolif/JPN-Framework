# JPN — Matriz de posicionamento e indicação de produtos v1

Status: material comercial interno, candidato e não publicado.

Objetivo: manter o portfólio JPN coerente durante diagnóstico, demonstração e preparação de materiais comerciais, evitando sobreposição artificial entre produtos e indicação de uma solução maior que a necessidade observada.

Princípio central: **indicar o menor recurso suficiente**. A matriz não autoriza venda, publicação, preço, desconto, anúncio ou promessa de resultado.

## Matriz principal

| Produto | Problema que organiza | Entrada típica | Saída esperada | Indicar quando | Não indicar quando | Próxima camada possível |
| --- | --- | --- | --- | --- | --- | --- |
| Método JPN | pedido ou tarefa mal definida | intenção, contexto parcial e objetivo | briefing estruturado em Jornada, Precisão e Narrativa | o problema principal é clareza e estrutura | já existe processo claro e a necessidade é apenas reutilizar uma instrução pronta | Prompt Builder ou Prompt Pack, somente se houver necessidade adicional |
| JPN Prompt Builder | montagem e revisão de instruções reutilizáveis | contexto, objetivo, fatos, lacunas, limites e formato | instrução JPN estruturada e revisável | a pessoa precisa construir prompts com consistência | um template existente já cobre a tarefa ou a necessidade é executar uma rotina empresarial | Prompt Pack para recorrência; Business para processo |
| JPN Prompt Pack | reconstrução repetida de instruções conhecidas | tarefa recorrente compatível com um dos 18 templates | template adaptado ao contexto | a tarefa se repete e há template aderente | a tarefa exige diagnóstico/processo novo ou fatos ainda não foram esclarecidos | Método/Builder para estruturar lacunas; Business para rotina |
| JPN Business | rotina empresarial repetitiva sem processo explícito | situação operacional e critérios humanos | playbook selecionado entre 12 opções canônicas | há rotina, responsáveis, entradas, saídas e condição de parada a organizar | a necessidade é apenas escrever um prompt ou controlar registros em planilha | Gestão Fácil quando houver necessidade de registro operacional básico |
| JPN Gestão Fácil | registros básicos dispersos de pequena empresa | dados operacionais fictícios/sanitizados ou, após autorização apropriada, dados reais adequados | workbook com 8 áreas de organização gerencial | a empresa precisa centralizar controles básicos em planilha | exige ERP, contabilidade, fiscal, banco, automação decisória ou compatibilidade ainda não testada | outro sistema especializado; não presumir Pro Kit |
| JPN Pro Kit | conexão arquitetural entre componentes JPN | necessidades já diagnosticadas em mais de uma camada | composição documentada do ecossistema | somente quando múltiplos componentes forem realmente necessários e seus estados permitirem | um produto individual resolve a necessidade ou enquanto o kit estiver EM PREPARAÇÃO para finalidade comercial | nenhuma camada automática; revisar necessidade |

## Regras de diferenciação

### Método JPN × Prompt Builder

O Método é a lógica de estruturação. O Builder é uma ferramenta para aplicar e revisar essa estrutura. Não apresentar o Builder como requisito para usar o Método.

### Prompt Builder × Prompt Pack

Builder serve para construir/revisar uma instrução. Prompt Pack oferece pontos de partida para tarefas recorrentes. Se um dos 18 templates resolver a necessidade após adaptação, não exigir que a pessoa reconstrua tudo no Builder.

### Prompt Pack × JPN Business

Prompt Pack organiza instruções; Business organiza rotinas. Um prompt pode apoiar um playbook, mas não substitui responsáveis, critérios, registros, bloqueios ou condição de parada.

### JPN Business × Gestão Fácil

Business define como uma rotina pode ser executada; Gestão Fácil registra informações operacionais básicas. Não vender a planilha como automação do playbook e não vender o playbook como sistema de gestão.

### Produtos individuais × Pro Kit

Pro Kit não é uma versão “melhor” de todos os produtos. É uma camada de composição. Enquanto estiver `EM PREPARAÇÃO`, sua demonstração deve permanecer arquitetural e não comercial.

## Árvore curta de indicação

1. A dificuldade é entender/definir a tarefa? → começar pelo **Método JPN**.
2. A tarefa está clara, mas é preciso montar/revisar uma instrução? → **Prompt Builder**.
3. A tarefa é conhecida e recorrente? → verificar primeiro os **18 templates do Prompt Pack**.
4. O problema é uma rotina empresarial com responsáveis e etapas? → verificar os **12 playbooks do JPN Business**.
5. O problema é centralizar registros gerenciais básicos? → avaliar **Gestão Fácil**, respeitando os QAs pendentes.
6. Há necessidade real de várias camadas JPN? → documentar a composição; não tratar **Pro Kit** como oferta enquanto estiver `EM PREPARAÇÃO`.
7. Nenhuma opção corresponde claramente? → registrar **nenhum produto indicado neste momento**.

## Guardrails comerciais

- não inventar preço, desconto, escassez, prazo promocional ou checkout;
- não transformar demonstração em prova de resultado;
- não declarar QA físico ou humano pendente como concluído;
- não afirmar compatibilidade universal com IA, navegador, dispositivo ou planilha;
- não apresentar Gestão Fácil como ERP, contabilidade, banco, fiscal ou recomendação financeira;
- não apresentar `REPOR` como autorização de compra;
- não apresentar score, semáforo ou sugestão como decisão automática;
- usar dados fictícios ou sanitizados em demonstrações;
- não inserir credenciais, dados financeiros reais ou dados pessoais sensíveis;
- manter `release_ready=false` e `publication_authorized=false` quando esses forem os estados canônicos.

## Uso em materiais futuros

Esta matriz deve servir como referência para:

- páginas e one-pagers, evitando claims conflitantes;
- roteiro de demonstração, escolhendo o menor produto suficiente;
- FAQ e tratamento de objeções;
- diagnóstico de pequenas empresas;
- comparação entre produtos;
- composição futura do Pro Kit após gates reais.

Qualquer material derivado deve consultar também a fonte canônica de estado/release do produto. Esta matriz não substitui manifestos, gates ou evidências.

## Estado do material

`candidate internal positioning matrix / commercial and human QA pending`

Este documento não representa publicação, oferta ativa, autorização de venda, anúncio ou decisão de release.