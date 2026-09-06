# Método JPN v1 — Jornada, Precisão e Narrativa

**Status:** draft editorial consolidado  
**Base metodológica:** JPN Framework `0.3.0-draft`  
**Finalidade:** ensinar uma forma prática de transformar pedidos vagos em contexto, requisitos e entregas revisáveis.

> O Método JPN não garante respostas corretas e não elimina alucinações. Ele foi projetado para tornar contexto, objetivo, escopo, incertezas, validação e estado final mais explícitos antes e durante a execução.

## 1. O problema que o Método JPN procura reduzir

Muitos pedidos para IA parecem claros para quem escreve, mas escondem decisões importantes.

Exemplo:

> “Crie uma campanha profissional para minha empresa.”

A frase não informa, por exemplo:

- qual empresa e qual oferta;
- quem é o público;
- em qual canal a campanha será usada;
- quais informações são confirmadas;
- o que não pode ser prometido;
- qual formato será entregue;
- como saber se a resposta ficou adequada.

Quando essas lacunas permanecem invisíveis, o modelo tende a preencher parte delas com padrões genéricos ou inferências. O Método JPN organiza o pedido em três dimensões complementares:

```text
JPN = Jornada + Precisão + Narrativa
```

- **Jornada** responde: “qual é a situação real?”
- **Precisão** responde: “o que exatamente precisa ser feito e como será verificado?”
- **Narrativa** responde: “como deve ficar o resultado final e o que acontece depois?”

## 2. J — Jornada

### O que é

Jornada é a camada de contexto. Ela registra a situação em que a tarefa existe, o estado atual, fatos relevantes, recursos disponíveis, limites conhecidos e incertezas.

### Por que existe

Sem contexto suficiente, duas pessoas podem interpretar a mesma instrução de formas diferentes. O mesmo acontece com modelos de IA.

Jornada não significa colocar todo o histórico possível no prompt. Significa selecionar apenas o contexto material para a tarefa atual.

### Componentes principais

- contexto;
- estado atual;
- objetivo de negócio, quando existir;
- histórico relevante;
- tentativas anteriores;
- recursos disponíveis;
- restrições conhecidas;
- incertezas;
- fatos e hipóteses classificados por confiança.

### Estados de confiança

Quando uma informação influencia a execução, o JPN pode classificá-la como:

- `confirmed`: fornecida explicitamente ou verificada;
- `inferred`: inferência razoável, ainda não confirmada;
- `unknown`: necessária ou útil, mas indisponível;
- `conflicting`: existem versões incompatíveis.

A regra principal é simples: **inferência não vira fato apenas porque parece provável**.

### Como aplicar

Antes de pedir a execução, responda:

1. Qual é o contexto mínimo necessário?
2. O que já aconteceu?
3. Em que estado a tarefa está agora?
4. Quais recursos existem?
5. Quais limites já são conhecidos?
6. O que ainda não sabemos?
7. Existe alguma informação em conflito?

### Como verificar

A Jornada está suficientemente boa quando uma terceira pessoa consegue entender a situação sem precisar inventar premissas importantes.

### Erro comum

Confundir “mais contexto” com “contexto melhor”. Informações irrelevantes aumentam ruído e podem esconder o que realmente importa.

## 3. P — Precisão

### O que é

Precisão transforma intenção em contrato operacional. Define objetivo, escopo, entradas, saídas, restrições, critérios de aceitação, riscos e validação.

### Por que existe

Expressões como “faça bonito”, “deixe completo”, “crie algo profissional” ou “faça rápido” são abertas demais. Precisão procura substituir adjetivos vagos por critérios observáveis.

Exemplos:

```text
“bonito” → hierarquia visual, referência, legibilidade, espaço em branco
“completo” → lista explícita do que deve estar incluído
“profissional” → linguagem, estrutura e padrão de qualidade definidos
“rápido” → prazo ou expectativa operacional concreta
```

### Componentes principais

- objetivo operacional;
- escopo — o que inclui e o que não inclui;
- entradas disponíveis;
- saídas esperadas;
- restrições;
- critérios de aceitação;
- riscos;
- método de validação.

### Como aplicar

Pergunte:

1. Qual é o resultado operacional?
2. O que está dentro do escopo?
3. O que está explicitamente fora?
4. Quais dados ou recursos podem ser usados?
5. Qual artefato ou ação deve ser entregue?
6. Quais limites precisam ser respeitados?
7. O que define uma resposta aprovada?
8. O que pode dar errado?
9. Como verificar antes de concluir?

### Critérios de aceitação

Um critério útil é observável. Em vez de:

> “O texto deve ficar ótimo.”

prefira:

> “O texto deve ter título, proposta principal, três benefícios, chamada para ação e não pode inventar preço, prazo ou garantia.”

### Como verificar

A Precisão está boa quando é possível revisar a saída item por item sem depender apenas de gosto pessoal.

### Erro comum

Definir apenas o que fazer e esquecer como saber se terminou corretamente.

## 4. N — Narrativa

### O que é

Narrativa orienta a entrega para o estado final desejado. No JPN, narrativa não significa escrita literária. Significa organizar a solução para que seja utilizável.

### Por que existe

Uma resposta pode estar tecnicamente correta e ainda assim ser difícil de usar. A Narrativa define formato, sequência, nível de detalhe, próxima ação e continuidade.

### Componentes principais

- estado final desejado;
- sequência de entrega;
- formato da resposta;
- nível de detalhe;
- próxima ação;
- continuidade que deve ser preservada.

### Como aplicar

Pergunte:

1. Como a situação deve estar quando a tarefa terminar?
2. Em que ordem o resultado deve ser apresentado?
3. Qual formato é realmente útil?
4. Qual profundidade é adequada ao usuário?
5. Existe uma próxima ação natural?
6. Que informação precisa continuar disponível no próximo ciclo?

### Como verificar

A Narrativa está boa quando o usuário consegue pegar a resposta e utilizá-la sem reconstruir mentalmente o que fazer primeiro.

### Erro comum

Tratar “formato” como detalhe visual. Formato pode mudar completamente a utilidade da entrega: uma checklist, um JSON, uma planilha, um plano passo a passo e um texto publicável servem a necessidades diferentes.

## 5. O processo JPN em sete passos

### Passo 1 — Capture a solicitação original

Preserve o pedido exatamente como chegou. Ele funciona como evidência de origem e evita que uma reformulação apague a intenção inicial.

### Passo 2 — Extraia a Jornada

Registre contexto, estado atual, recursos, histórico material, restrições conhecidas e incertezas.

### Passo 3 — Classifique confiança quando necessário

Separe o que é confirmado, inferido, desconhecido ou conflitante.

### Passo 4 — Formalize a Precisão

Transforme o pedido em objetivo, escopo, entradas, saídas, critérios, riscos e validação.

### Passo 5 — Defina a Narrativa

Descreva estado final, sequência e formato adequado.

### Passo 6 — Execute e valide

A execução deve respeitar o contrato construído. Antes da entrega, compare o resultado com os critérios de aceitação.

### Passo 7 — Preserve continuidade

Quando a tarefa fizer parte de um processo maior, registre próxima ação e estado que precisa continuar disponível.

## 6. Política de lacunas

Nem toda informação ausente exige interromper o trabalho.

Quando houver uma lacuna, escolha conscientemente entre:

1. continuar com uma suposição de baixo risco claramente sinalizada;
2. buscar a informação em uma fonte autorizada;
3. solicitar esclarecimento se a ausência impedir execução correta;
4. entregar uma parte útil sem fingir que a tarefa foi concluída integralmente.

Essa decisão depende do impacto da lacuna. Um detalhe de estilo e uma informação jurídica crítica não têm o mesmo risco.

## 7. Exemplo completo — antes e depois

### Pedido original

> “Crie uma mensagem para recuperar clientes que sumiram.”

### Problemas escondidos

Não sabemos:

- qual negócio;
- qual relacionamento anterior;
- se houve orçamento;
- qual canal será usado;
- se existe promoção real;
- qual tom deve ser usado;
- o que não pode ser inventado.

### Reconstrução JPN

#### Jornada

- contexto: pequena empresa entrando em contato com leads que já demonstraram interesse;
- estado atual: o cliente parou de responder;
- informação confirmada: houve contato anterior;
- informação desconhecida: motivo do silêncio;
- restrição conhecida: não inventar desconto, urgência ou disponibilidade.

#### Precisão

- objetivo: criar uma mensagem curta de retomada;
- inclui: reconhecimento do contato anterior, abertura para ajudar, CTA simples;
- não inclui: pressão, desconto não confirmado, escassez falsa;
- saída: uma mensagem pronta para WhatsApp;
- critérios: natural, curta, sem informação inventada, com pergunta simples;
- validação: revisar se existe alguma promessa que não veio do contexto.

#### Narrativa

- estado final: mensagem pronta para copiar e enviar;
- formato: texto curto;
- nível de detalhe: baixo;
- próxima ação: adaptar nome/produto somente se essas informações estiverem confirmadas.

### Resultado possível

> “Oi! Passando para saber se você ainda quer ajuda com o que estávamos vendo. Se quiser, posso continuar de onde paramos e tirar qualquer dúvida por aqui.”

O ponto não é que exista uma única frase correta. O ganho estrutural é que as decisões importantes ficaram visíveis antes da geração.

## 8. Exemplo — criação de conteúdo

### Pedido fraco

> “Faça cinco posts para minha empresa.”

### Reconstrução

**Jornada:** empresa, público, canal, oferta, materiais disponíveis, restrições da marca.  
**Precisão:** cinco posts, objetivo de cada um, temas incluídos, tamanho, CTA, fatos permitidos, critérios de revisão.  
**Narrativa:** tabela com post, objetivo, copy, CTA e sugestão visual; ordem de publicação se houver lógica editorial.

## 9. Exemplo — análise

### Pedido fraco

> “Analise esta planilha e me diga o que fazer.”

### Reconstrução

**Jornada:** finalidade da planilha, período, origem dos dados, limitações conhecidas.  
**Precisão:** métricas a observar, perguntas a responder, o que não pode ser inferido, critérios para priorizar achados.  
**Narrativa:** resumo executivo, achados, evidências, riscos, recomendações e próximos passos.

## 10. O JPN não precisa aparecer inteiro no prompt

O método pode ser usado de três formas:

1. **explícita:** J, P e N aparecem no texto;
2. **estruturada:** um sistema mantém o estado em JSON ou outro formato;
3. **internalizada:** o usuário usa o checklist mentalmente e produz uma instrução final compacta.

O objetivo é preservar a qualidade da estrutura, não obrigar uma aparência específica.

## 11. Checklist rápido JPN

### Jornada

- [ ] contexto suficiente;
- [ ] estado atual explícito;
- [ ] histórico apenas quando relevante;
- [ ] recursos conhecidos;
- [ ] restrições conhecidas;
- [ ] incertezas visíveis;
- [ ] fatos e inferências não foram misturados.

### Precisão

- [ ] objetivo operacional claro;
- [ ] escopo inclui / não inclui;
- [ ] entradas identificadas;
- [ ] saídas especificadas;
- [ ] critérios de aceitação observáveis;
- [ ] riscos relevantes considerados;
- [ ] forma de validação definida.

### Narrativa

- [ ] estado final desejado;
- [ ] sequência útil;
- [ ] formato adequado;
- [ ] nível de detalhe adequado;
- [ ] próxima ação quando necessária;
- [ ] continuidade preservada quando houver processo recorrente.

## 12. Quando usar uma versão leve

Tarefas simples não precisam de um documento extenso.

Exemplo:

```text
J: preciso responder um cliente que pediu prazo; o prazo ainda não foi confirmado.
P: criar resposta curta sem inventar data; pedir apenas o dado necessário.
N: entregar uma mensagem pronta para WhatsApp.
```

A estrutura deve ser proporcional ao risco, à complexidade e ao custo do retrabalho.

## 13. Quando usar uma versão completa

Prefira um estado JPN detalhado quando houver:

- vários requisitos;
- múltiplas ferramentas;
- automação;
- dependência de dados externos;
- continuidade entre execuções;
- risco de interpretar errado uma restrição;
- necessidade de auditoria ou validação.

## 14. Limites do método

O JPN organiza contexto e execução, mas não substitui:

- fontes confiáveis;
- validação factual;
- conhecimento especializado;
- controles específicos para sistemas de alto risco;
- revisão humana quando necessária.

Uma estrutura bem feita ainda pode produzir uma resposta errada se os dados, o modelo, as ferramentas ou os critérios forem inadequados.

## 15. Relação com os produtos JPN

### JPN Prompt Builder

Aplica o método por interface: recebe uma solicitação, produz rascunho estruturado, mostra lacunas, avalia prontidão e compila um prompt.

### JPN Prompt Pack

Oferece templates para cenários recorrentes. Os templates aceleram a aplicação, mas precisam ser adaptados ao contexto real.

### JPN Business

Aplica o método a rotinas de pequenas empresas, como vendas, atendimento, marketing, organização e análise operacional.

### JPN Gestão Fácil

É uma ferramenta complementar para organizar dados básicos e rotinas. Não é ERP, sistema contábil, fiscal ou bancário.

### JPN Pro Kit

Organiza os produtos em uma jornada de adoção: aprender, estruturar, acelerar, aplicar e organizar.

## 16. Exercício final

Escolha uma solicitação real que você faria hoje para uma IA.

1. escreva a versão original;
2. marque o que está confirmado, inferido ou desconhecido;
3. monte a Jornada;
4. formalize a Precisão;
5. defina a Narrativa;
6. execute;
7. revise a resposta usando os critérios de aceitação;
8. compare o que mudou entre a versão original e a estruturada.

O objetivo do exercício não é provar que toda resposta ficará melhor. É aprender a enxergar decisões que antes estavam implícitas.

---

## Nota de versão

Este draft editorial foi consolidado contra o JPN Framework `0.3.0-draft`. Antes de ser marcado como `final`, ainda deve passar por revisão editorial, visual, compatibilidade com os demais produtos e geração dos formatos de entrega.
