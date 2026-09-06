# JPN Prompt Pack v1

**Status:** draft editorial consolidado  
**Base metodológica:** JPN Framework `0.3.0-draft`  
**Finalidade:** fornecer templates reutilizáveis que tornam contexto, execução, validação e continuidade mais explícitos sem inventar fatos ausentes.

> O JPN Prompt Pack não garante respostas corretas, não elimina alucinações e não substitui revisão humana quando a tarefa envolver risco relevante. Os templates foram desenhados para reduzir ambiguidade operacional e deixar lacunas, restrições e critérios de aceitação mais visíveis.

## Como usar este pack

1. escolha o template pelo cenário, não pelo título mais parecido;
2. preencha apenas informações reais ou claramente marcadas como hipótese;
3. preserve lacunas relevantes em vez de inventar dados;
4. remova instruções que não se aplicam ao caso;
5. execute;
6. revise a saída usando a seção **Validação** do cartão;
7. registre decisões e próxima ação quando a tarefa fizer parte de um fluxo maior.

### Legenda de confiança

Quando necessário, classifique fatos relevantes como:

- `confirmed`: fornecido explicitamente ou verificado;
- `inferred`: inferência razoável ainda não confirmada;
- `unknown`: informação útil ou necessária ainda indisponível;
- `conflicting`: há versões incompatíveis.

A regra do pack é a mesma do Método JPN: **inferência não vira fato só porque parece provável**.

---

# 1. Transformar pedido vago em plano executável

**Nome:** Pedido vago → plano executável  
**Cenário:** o pedido inicial é curto, subjetivo ou incompleto.  
**Objetivo:** estruturar o trabalho sem fingir que informações ausentes são conhecidas.  
**Quando usar:** antes de iniciar tarefas com termos como “profissional”, “completo”, “melhor”, “bonito” ou “faça tudo”.  
**Não usar quando:** a instrução já estiver completa, verificável e de baixo risco.

**Entradas necessárias:**
- pedido original;
- contexto já conhecido;
- restrições confirmadas;
- formato desejado, se houver.

**Template:**

```text
Use o Método JPN para transformar a solicitação abaixo em um plano executável.

SOLICITAÇÃO ORIGINAL
{{pedido_original}}

J — JORNADA
Contexto confirmado:
{{contexto_confirmado}}

Estado atual:
{{estado_atual}}

Restrições conhecidas:
{{restricoes}}

P — PRECISÃO
1. identifique o objetivo operacional;
2. converta termos vagos em critérios observáveis;
3. declare o que está dentro e fora do escopo;
4. liste entradas disponíveis e saídas esperadas;
5. registre lacunas como unknown, inferred ou conflicting quando aplicável;
6. defina critérios de aceitação e validação.

N — NARRATIVA
Organize a resposta nesta ordem:
1. entendimento do pedido;
2. lacunas que realmente importam;
3. plano de execução;
4. critérios de aprovação;
5. próxima ação.

REGRAS
- não invente fatos ausentes;
- não interrompa por lacunas de baixo impacto se puder avançar com uma suposição claramente sinalizada;
- se uma lacuna impedir execução correta, explique exatamente por quê;
- preserve a intenção original.
```

**Como personalizar:** acrescente canal, público, prazo, formato ou ferramentas autorizadas quando esses elementos forem reais.  
**Validação:** o plano deve permitir que outra pessoa saiba o que fazer, o que não fazer e como verificar o resultado.  
**Riscos e limites:** excesso de estrutura pode ser desnecessário em tarefas simples; não transformar todas as lacunas em perguntas.  
**Componentes JPN usados:** Jornada completa; objetivo, escopo, restrições, critérios e validação em Precisão; sequência e próxima ação em Narrativa.

---

# 2. Pesquisa com fronteiras de evidência

**Nome:** Pesquisa verificável  
**Cenário:** pesquisa factual, técnica, comercial ou comparativa em que fonte e atualidade importam.  
**Objetivo:** separar fatos verificados, inferências e pontos ainda incertos.  
**Quando usar:** pesquisa na web, análise de mercado, legislação, software atual, preços, políticas ou tendências.  
**Não usar quando:** o usuário só quer uma explicação conceitual estável que não depende de atualização.

**Entradas necessárias:**
- pergunta de pesquisa;
- período relevante;
- fontes preferenciais ou proibidas;
- decisão que a pesquisa precisa apoiar.

**Template:**

```text
Pesquise o tema abaixo usando evidência rastreável e atual quando necessário.

PERGUNTA
{{pergunta}}

DECISÃO QUE A PESQUISA DEVE APOIAR
{{decisao}}

RECORTE
Período: {{periodo}}
Mercado/localidade: {{mercado}}
Fontes prioritárias: {{fontes_prioritarias}}
Fontes a evitar: {{fontes_proibidas}}

JORNADA
Registre o que já sabemos e o que ainda precisa ser verificado. Não trate conhecimento prévio como atual se a informação puder ter mudado.

PRECISÃO
- diferencie fato verificado, inferência e ausência de evidência;
- priorize fontes primárias ou de alta autoridade;
- compare datas de publicação e data do evento quando isso importar;
- não extrapole um caso isolado para uma regra geral;
- destaque conflitos entre fontes;
- informe limitações da pesquisa.

NARRATIVA
Entregue:
1. resposta curta;
2. evidências principais;
3. pontos de divergência ou incerteza;
4. implicações para a decisão;
5. fontes utilizadas;
6. próxima verificação recomendada, se houver.
```

**Como personalizar:** defina jurisdição, setor, concorrentes, critérios ou recência.  
**Validação:** cada afirmação material que depende de informação externa deve ser suportada por fonte adequada; datas devem fazer sentido.  
**Riscos e limites:** fontes podem estar desatualizadas, incompletas ou enviesadas; ausência de evidência não prova ausência do fato.  
**Componentes JPN usados:** contexto e incertezas em Jornada; entradas, critérios, riscos e validação em Precisão; formato e sequência em Narrativa.

---

# 3. Comparar opções para uma decisão

**Nome:** Comparador de alternativas  
**Cenário:** escolher entre produtos, ferramentas, estratégias ou fornecedores.  
**Objetivo:** comparar opções pelos critérios do usuário, não por preferência genérica.  
**Quando usar:** seleção entre duas ou mais alternativas.  
**Não usar quando:** não existe decisão real ou critérios mínimos de comparação.

**Entradas necessárias:**
- opções;
- critérios;
- pesos, se existirem;
- restrições eliminatórias.

**Template:**

```text
Compare as opções abaixo para apoiar uma decisão prática.

OPÇÕES
{{opcoes}}

OBJETIVO DA DECISÃO
{{objetivo}}

CRITÉRIOS
{{criterios}}

RESTRIÇÕES ELIMINATÓRIAS
{{restricoes}}

REGRAS
- confirme dados atuais quando eles puderem ter mudado;
- não atribua peso a um critério sem sinalizar que é uma escolha;
- marque dados ausentes como unknown;
- não use número de recursos como sinônimo automático de qualidade;
- diferencie requisito obrigatório de preferência.

ENTREGA
1. tabela comparativa;
2. principais trade-offs;
3. opção mais adequada para cada perfil relevante;
4. recomendação condicionada aos critérios informados;
5. dados que ainda precisam ser confirmados.
```

**Como personalizar:** inclua custo apenas quando valores reais e atuais estiverem disponíveis e autorizados.  
**Validação:** a recomendação deve ser derivada dos critérios declarados e não contradizer restrições eliminatórias.  
**Riscos e limites:** dados desiguais entre opções podem produzir falsa precisão; rankings sem critérios explícitos são frágeis.  
**Componentes JPN usados:** objetivo de negócio em Jornada; critérios, restrições e validação em Precisão; estado final decisório em Narrativa.

---

# 4. Resumir documento preservando decisões

**Nome:** Resumo com continuidade  
**Cenário:** documento longo, reunião, especificação ou histórico de projeto.  
**Objetivo:** condensar sem perder decisões, pendências, responsáveis e riscos.  
**Quando usar:** passagem de contexto, retomada de projeto ou briefing.  
**Não usar quando:** o usuário quer tradução integral ou reprodução do conteúdo.

**Entradas necessárias:**
- conteúdo-fonte;
- finalidade do resumo;
- nível de detalhe.

**Template:**

```text
Resuma o conteúdo abaixo para continuidade operacional.

FINALIDADE
{{finalidade}}

CONTEÚDO-FONTE
{{conteudo}}

PRESERVE OBRIGATORIAMENTE
- fatos confirmados;
- decisões já tomadas;
- restrições;
- riscos;
- pendências;
- responsáveis citados;
- datas e prazos, quando existirem;
- pontos conflitantes.

NÃO FAÇA
- não invente decisões para preencher lacunas;
- não transforme hipótese em fato;
- não omita uma restrição só para deixar o resumo mais curto.

FORMATO
1. contexto em até 5 linhas;
2. decisões confirmadas;
3. estado atual;
4. pendências e bloqueios;
5. riscos;
6. próxima ação;
7. itens incertos ou conflitantes.
```

**Como personalizar:** acrescente limite de palavras ou público-alvo.  
**Validação:** decisões e restrições do original continuam identificáveis no resumo.  
**Riscos e limites:** síntese excessiva pode apagar exceções importantes.  
**Componentes JPN usados:** histórico e estado atual em Jornada; escopo da síntese em Precisão; continuidade e próxima ação em Narrativa.

---

# 5. Reescrever mensagem profissional sem mudar o sentido

**Nome:** Reescrita controlada  
**Cenário:** e-mail, mensagem, aviso ou texto curto que precisa melhorar de clareza e tom.  
**Objetivo:** melhorar forma sem criar fatos, promessas ou compromissos novos.  
**Quando usar:** comunicação profissional, atendimento ou negociação.  
**Não usar quando:** a intenção original está ambígua e uma mudança de sentido teria consequência relevante.

**Entradas necessárias:**
- texto original;
- público;
- tom desejado;
- informações que não podem ser alteradas.

**Template:**

```text
Reescreva a mensagem preservando integralmente fatos, números, compromissos e intenção.

ORIGINAL
{{texto}}

PÚBLICO
{{publico}}

TOM
{{tom}}

NÃO ALTERAR
{{elementos_fixos}}

CRITÉRIOS
- clareza;
- naturalidade;
- concisão adequada;
- sem adicionar promessa, prazo, preço, garantia ou condição que não exista no original;
- se o original tiver ambiguidade factual relevante, sinalize em vez de decidir silenciosamente.

ENTREGUE
A versão final pronta para uso e, somente se necessário, uma observação curta sobre qualquer ambiguidade que impeça uma reescrita fiel.
```

**Como personalizar:** indique canal e limite de caracteres.  
**Validação:** comparar original e versão final para confirmar que fatos e compromissos não mudaram.  
**Riscos e limites:** uma reescrita pode alterar tom percebido; contexto cultural pode importar.  
**Componentes JPN usados:** contexto e fatos em Jornada; restrições e critérios em Precisão; formato final em Narrativa.

---

# 6. Follow-up comercial sem inventar urgência

**Nome:** Follow-up responsável  
**Cenário:** lead ou cliente parou de responder após contato anterior.  
**Objetivo:** retomar a conversa de forma útil sem inventar promoção, escassez ou condição comercial.  
**Quando usar:** vendas consultivas, orçamento pendente ou pós-contato.  
**Não usar quando:** o contato não autorizou comunicação ou existe regra interna que impeça o follow-up.

**Entradas necessárias:**
- contexto do contato;
- última interação;
- produto/serviço discutido;
- condições confirmadas;
- canal.

**Template:**

```text
Crie uma mensagem de follow-up baseada apenas nos fatos confirmados abaixo.

CONTEXTO CONFIRMADO
{{contexto}}

ÚLTIMA INTERAÇÃO
{{ultima_interacao}}

PRODUTO/SERVIÇO
{{produto}}

CONDIÇÕES CONFIRMADAS
{{condicoes}}

CANAL
{{canal}}

REGRAS
- não invente desconto, prazo, estoque, exclusividade ou urgência;
- não pressione o cliente;
- faça referência ao contato anterior de forma natural;
- ofereça uma próxima ação simples;
- mantenha a mensagem curta para o canal informado.

ENTREGUE
1. mensagem principal;
2. alternativa ainda mais curta;
3. informação que o vendedor deveria confirmar antes de usar, caso exista alguma lacuna relevante.
```

**Como personalizar:** adicione tom da marca e nome do produto se confirmados.  
**Validação:** toda condição mencionada deve existir nas entradas.  
**Riscos e limites:** frequência excessiva pode prejudicar relacionamento e pode haver obrigações legais de consentimento conforme o canal/jurisdição.  
**Componentes JPN usados:** histórico e fatos em Jornada; restrições em Precisão; próxima ação em Narrativa.

---

# 7. Triagem de atendimento ao cliente

**Nome:** Atendimento → diagnóstico e próximo passo  
**Cenário:** cliente relata problema, dúvida ou reclamação.  
**Objetivo:** separar o que já está confirmado do que precisa ser investigado.  
**Quando usar:** suporte N1/N2, SAC ou atendimento interno.  
**Não usar quando:** houver emergência ou risco que exija especialista ou protocolo obrigatório.

**Entradas necessárias:**
- relato do cliente;
- sistema/produto afetado;
- dados já verificados;
- política interna relevante.

**Template:**

```text
Analise o atendimento abaixo e proponha a próxima ação de suporte.

RELATO
{{relato}}

FATOS JÁ VERIFICADOS
{{fatos}}

POLÍTICAS/RESTRIÇÕES
{{politicas}}

CLASSIFIQUE
- confirmed: fatos explicitamente fornecidos ou verificados;
- inferred: hipóteses de diagnóstico;
- unknown: dados ainda necessários;
- conflicting: informações incompatíveis.

ENTREGUE
1. resumo do problema;
2. impacto percebido;
3. hipóteses ordenadas, claramente marcadas como hipóteses;
4. verificações de baixo risco;
5. critério para escalar;
6. mensagem curta ao cliente explicando o próximo passo sem culpar nem prometer solução antes da investigação.
```

**Como personalizar:** inclua SLA apenas se for política confirmada.  
**Validação:** nenhuma hipótese aparece como causa confirmada; etapas perigosas ou irreversíveis não devem ser sugeridas sem controle adequado.  
**Riscos e limites:** suporte técnico pode envolver segurança, privacidade ou perda de dados.  
**Componentes JPN usados:** confiança e estado atual em Jornada; riscos e validação em Precisão; sequência de resolução em Narrativa.

---

# 8. Post social a partir de fatos aprovados

**Nome:** Conteúdo social sem invenção comercial  
**Cenário:** transformar informações reais em postagem.  
**Objetivo:** criar texto publicável sem inventar benefício, preço, promoção ou prova social.  
**Quando usar:** redes sociais, anúncio orgânico, lançamento interno.  
**Não usar quando:** a publicação depende de alegação regulada ou aprovação jurídica não obtida.

**Entradas necessárias:**
- fatos aprovados;
- produto/oferta;
- público;
- canal;
- CTA permitido.

**Template:**

```text
Crie um post para {{canal}} usando somente as informações aprovadas abaixo.

FATOS APROVADOS
{{fatos}}

PÚBLICO
{{publico}}

OBJETIVO DO POST
{{objetivo}}

CTA PERMITIDO
{{cta}}

NÃO INVENTAR
- preço;
- desconto;
- prazo;
- disponibilidade;
- garantia;
- depoimento;
- estatística;
- condição de pagamento;
- característica não informada.

ESTRUTURA
1. gancho coerente com os fatos;
2. benefício derivado diretamente das características informadas;
3. contexto necessário;
4. CTA permitido.

Entregue a versão final e uma legenda curta alternativa. Se faltar um dado essencial para a promessa pretendida, aponte a lacuna em vez de preenchê-la.
```

**Como personalizar:** informe voz da marca, limite de caracteres e hashtags permitidas.  
**Validação:** cada claim deve poder ser rastreado para uma entrada fornecida.  
**Riscos e limites:** publicidade pode estar sujeita a regras específicas; template não substitui revisão regulatória.  
**Componentes JPN usados:** fatos e limites em Jornada; claims, escopo e critérios em Precisão; sequência e formato em Narrativa.

---

# 9. Descrição de oferta com condições controladas

**Nome:** Oferta sem condições inventadas  
**Cenário:** descrição de produto, serviço ou oportunidade comercial.  
**Objetivo:** apresentar valor sem extrapolar as condições fornecidas.  
**Quando usar:** catálogo, página, mensagem de venda ou proposta preliminar.  
**Não usar quando:** termos finais dependem de contrato ainda não aprovado.

**Entradas necessárias:**
- nome;
- características confirmadas;
- condições confirmadas;
- público;
- limitações.

**Template:**

```text
Escreva uma descrição comercial baseada apenas nos dados confirmados.

PRODUTO/SERVIÇO
{{nome}}

CARACTERÍSTICAS CONFIRMADAS
{{caracteristicas}}

CONDIÇÕES CONFIRMADAS
{{condicoes}}

LIMITAÇÕES/EXCLUSÕES
{{limitacoes}}

PÚBLICO
{{publico}}

REGRAS
- diferencie característica de benefício;
- benefício deve ser consequência razoável da característica, não garantia de resultado;
- não invente condição comercial;
- não use superlativos absolutos sem evidência;
- mantenha limitações materiais visíveis.

ENTREGUE
1. título;
2. descrição curta;
3. benefícios sustentados pelas entradas;
4. condições relevantes;
5. CTA neutro.
```

**Como personalizar:** informe canal e extensão.  
**Validação:** nenhum detalhe comercial aparece sem fonte nas entradas.  
**Riscos e limites:** claims regulados ou financeiros exigem revisão específica.  
**Componentes JPN usados:** contexto e fatos em Jornada; saídas, restrições e critérios em Precisão; formato em Narrativa.

---

# 10. Reunião → plano de ação

**Nome:** Ata operacional JPN  
**Cenário:** transformar anotações de reunião em decisões e tarefas.  
**Objetivo:** preservar decisões sem atribuir responsável ou prazo que não tenha sido definido.  
**Quando usar:** reuniões de projeto, operação ou cliente.  
**Não usar quando:** as notas estão incompletas a ponto de não distinguir discussão de decisão.

**Entradas necessárias:**
- notas/transcrição;
- participantes, se relevantes;
- objetivo da reunião.

**Template:**

```text
Converta as notas abaixo em uma ata operacional.

OBJETIVO DA REUNIÃO
{{objetivo}}

NOTAS
{{notas}}

REGRAS
- decisão só é decisão se estiver explicitamente apoiada pelas notas;
- ideia discutida não deve virar compromisso;
- não atribua responsável ou prazo por inferência;
- marque conflitos e pontos sem conclusão.

FORMATO
1. contexto;
2. decisões confirmadas;
3. ações acordadas | responsável | prazo | status da informação;
4. pendências;
5. riscos/bloqueios;
6. pontos conflitantes;
7. próxima reunião ou ação, apenas se informada.
```

**Como personalizar:** acrescente IDs de projeto ou áreas.  
**Validação:** cada decisão e tarefa deve ser rastreável ao conteúdo-fonte.  
**Riscos e limites:** transcrição pode conter erros; confirmação humana pode ser necessária.  
**Componentes JPN usados:** histórico e decisões em Jornada; saídas e critérios em Precisão; continuidade em Narrativa.

---

# 11. Criar procedimento operacional a partir de notas

**Nome:** Notas → SOP  
**Cenário:** existe conhecimento informal que precisa virar procedimento.  
**Objetivo:** estruturar execução repetível, incluindo exceções e validação.  
**Quando usar:** rotinas administrativas, atendimento, cadastro ou operação.  
**Não usar quando:** processo envolve segurança crítica e ainda não foi validado por responsável competente.

**Entradas necessárias:**
- notas do processo;
- objetivo;
- responsável típico;
- ferramentas;
- exceções conhecidas.

**Template:**

```text
Transforme as notas abaixo em um procedimento operacional claro.

OBJETIVO
{{objetivo}}

NOTAS DO PROCESSO
{{notas}}

RESPONSÁVEL TÍPICO
{{responsavel}}

FERRAMENTAS AUTORIZADAS
{{ferramentas}}

EXCEÇÕES CONHECIDAS
{{excecoes}}

ESTRUTURE
1. finalidade;
2. pré-requisitos;
3. entradas;
4. passos numerados;
5. pontos de decisão;
6. erros comuns;
7. como validar a conclusão;
8. quando parar e escalar;
9. o que registrar para continuidade.

Não invente etapas ausentes. Quando a sequência depender de informação que não está nas notas, marque a lacuna explicitamente.
```

**Como personalizar:** inclua sistemas e papéis internos.  
**Validação:** uma pessoa que conhece a área deve conseguir executar o procedimento e identificar onde ele ainda está incompleto.  
**Riscos e limites:** documentação não torna um processo correto por si só.  
**Componentes JPN usados:** recursos e restrições em Jornada; escopo, riscos e validação em Precisão; sequência em Narrativa.

---

# 12. Analisar dados ou planilha

**Nome:** Análise de dados com escopo explícito  
**Cenário:** tabela, CSV, planilha ou conjunto de indicadores.  
**Objetivo:** responder uma pergunta de negócio sem confundir correlação, ausência de dados e causalidade.  
**Quando usar:** resumo de desempenho, segmentação, tendências ou QA de dados.  
**Não usar quando:** a decisão exige inferência estatística avançada que não pode ser sustentada pelos dados disponíveis.

**Entradas necessárias:**
- arquivo/dados;
- pergunta;
- período;
- definições de métricas;
- filtros relevantes.

**Template:**

```text
Analise os dados fornecidos para responder à pergunta abaixo.

PERGUNTA
{{pergunta}}

PERÍODO
{{periodo}}

DEFINIÇÕES IMPORTANTES
{{definicoes}}

FILTROS
{{filtros}}

PROCESSO
1. valide estrutura, tipos, valores ausentes e duplicidades relevantes;
2. registre limitações do conjunto;
3. calcule apenas métricas necessárias para a pergunta;
4. diferencie descrição observada de hipótese explicativa;
5. não atribua causalidade sem desenho adequado;
6. trate outliers de forma explícita, sem removê-los silenciosamente.

ENTREGA
1. resposta principal;
2. métricas que sustentam a resposta;
3. padrões relevantes;
4. limitações;
5. hipóteses a investigar;
6. próxima análise recomendada.
```

**Como personalizar:** indique unidade, moeda ou meta apenas quando definidas.  
**Validação:** cálculos devem ser reproduzíveis e definições de métricas consistentes.  
**Riscos e limites:** qualidade dos dados limita a qualidade da conclusão.  
**Componentes JPN usados:** estado dos dados em Jornada; entradas, validação e riscos em Precisão; formato decisório em Narrativa.

---

# 13. Diagnosticar bug de software

**Nome:** Debug estruturado  
**Cenário:** erro de aplicação, integração, build ou comportamento inesperado.  
**Objetivo:** separar evidência de hipótese e testar causas com menor risco primeiro.  
**Quando usar:** investigação técnica.  
**Não usar quando:** a ação proposta poderia causar perda de dados ou impacto de produção sem backup/controle adequado.

**Entradas necessárias:**
- comportamento esperado;
- comportamento observado;
- erro/log;
- ambiente;
- mudanças recentes;
- tentativas já feitas.

**Template:**

```text
Diagnostique o problema abaixo usando evidências e testes incrementais.

ESPERADO
{{esperado}}

OBSERVADO
{{observado}}

ERRO/LOG
{{erro}}

AMBIENTE
{{ambiente}}

MUDANÇAS RECENTES
{{mudancas}}

TENTATIVAS ANTERIORES
{{tentativas}}

REGRAS
- não trate hipótese como causa confirmada;
- priorize testes reversíveis e de baixo risco;
- não recomende apagar dados, redefinir produção ou expor segredos sem necessidade e controle;
- diga o que cada teste confirma ou descarta.

ENTREGUE
1. síntese do incidente;
2. hipóteses ordenadas com justificativa;
3. testes diagnósticos;
4. correção provável somente quando sustentada;
5. como validar a correção;
6. rollback ou cautela relevante;
7. evidência adicional necessária se ainda inconclusivo.
```

**Como personalizar:** inclua stack, versões e comandos seguros.  
**Validação:** cada hipótese deve ter teste correspondente; correção deve ter critério de confirmação.  
**Riscos e limites:** logs podem conter dados sensíveis; sanitizar antes de compartilhar.  
**Componentes JPN usados:** estado atual e tentativas em Jornada; riscos, validação e critérios em Precisão; sequência em Narrativa.

---

# 14. Planejar implementação de funcionalidade

**Nome:** Feature → plano de implementação  
**Cenário:** transformar requisito de produto em trabalho técnico.  
**Objetivo:** definir escopo, dependências, critérios e riscos antes de codificar.  
**Quando usar:** nova feature, integração ou refatoração significativa.  
**Não usar quando:** mudança trivial já está completamente especificada.

**Entradas necessárias:**
- objetivo do produto;
- comportamento esperado;
- arquitetura atual;
- restrições;
- definição de pronto.

**Template:**

```text
Crie um plano técnico para a funcionalidade abaixo.

OBJETIVO DO PRODUTO
{{objetivo}}

COMPORTAMENTO ESPERADO
{{comportamento}}

ARQUITETURA/ESTADO ATUAL
{{estado_atual}}

RESTRIÇÕES
{{restricoes}}

DEFINIÇÃO DE PRONTO
{{definition_of_done}}

ENTREGUE
1. entendimento do requisito;
2. pressupostos e lacunas;
3. componentes afetados;
4. mudanças propostas;
5. contratos/API/dados envolvidos;
6. migração ou compatibilidade, se aplicável;
7. testes necessários;
8. riscos e rollback;
9. sequência de implementação;
10. critérios de aceite.

Não invente estrutura do repositório que não foi observada. Quando faltar informação de arquitetura, marque-a como unknown.
```

**Como personalizar:** inclua limites de compatibilidade, segurança e performance.  
**Validação:** cada critério de pronto deve ser coberto por implementação ou teste verificável.  
**Riscos e limites:** plano pode mudar após inspeção do código real.  
**Componentes JPN usados:** arquitetura e recursos em Jornada; escopo e critérios em Precisão; sequência de implementação em Narrativa.

---

# 15. Revisar alteração de código

**Nome:** Code review orientado a risco  
**Cenário:** revisar PR, patch ou conjunto de alterações.  
**Objetivo:** identificar defeitos concretos e riscos regressivos sem produzir observações genéricas.  
**Quando usar:** revisão técnica antes de merge.  
**Não usar quando:** não há acesso suficiente ao diff/contexto para fazer afirmações confiáveis.

**Entradas necessárias:**
- diff/PR;
- objetivo da mudança;
- testes;
- contratos relevantes.

**Template:**

```text
Revise a alteração abaixo com foco em defeitos concretos, regressões e inconsistências com o objetivo informado.

OBJETIVO
{{objetivo}}

ALTERAÇÃO
{{diff_ou_codigo}}

TESTES/EVIDÊNCIAS
{{testes}}

CONTRATOS/RESTRIÇÕES
{{contratos}}

PRIORIZE
- quebra funcional;
- dados incorretos;
- incompatibilidade de contrato;
- falhas de validação;
- risco de segurança ou privacidade;
- comportamento em edge cases relevantes;
- teste ausente para comportamento novo.

PARA CADA ACHADO
- gravidade;
- evidência concreta;
- cenário de falha;
- correção sugerida quando possível.

Não preencha a revisão com preferência estética se não houver impacto real. Se não houver achado material, diga isso explicitamente.
```

**Como personalizar:** defina convenções e requisitos do repositório.  
**Validação:** cada achado deve apontar para comportamento observável no código ou contrato.  
**Riscos e limites:** sem execução/testes reais, parte da revisão permanece inferencial.  
**Componentes JPN usados:** objetivo e histórico em Jornada; critérios, riscos e validação em Precisão; entrega priorizada em Narrativa.

---

# 16. Criar artigo de base de conhecimento

**Nome:** Conhecimento operacional reutilizável  
**Cenário:** registrar solução, processo ou instrução recorrente.  
**Objetivo:** criar documentação que outra pessoa consiga aplicar e verificar.  
**Quando usar:** FAQ, troubleshooting, onboarding, operação.  
**Não usar quando:** a informação ainda não foi validada ou muda com frequência sem processo de atualização.

**Entradas necessárias:**
- problema/pergunta;
- solução confirmada;
- pré-requisitos;
- exceções;
- fonte de verdade.

**Template:**

```text
Transforme as informações abaixo em um artigo de base de conhecimento.

PROBLEMA/PERGUNTA
{{problema}}

SOLUÇÃO CONFIRMADA
{{solucao}}

PRÉ-REQUISITOS
{{prerequisitos}}

EXCEÇÕES
{{excecoes}}

FONTE DE VERDADE
{{fonte}}

ESTRUTURA
1. quando usar este artigo;
2. resumo da solução;
3. pré-requisitos;
4. procedimento;
5. como validar;
6. erros comuns;
7. quando escalar;
8. limitações;
9. fonte e data de revisão, se fornecidas.

Não crie etapas que não estejam sustentadas pelas entradas. Separe claramente solução confirmada de hipótese de troubleshooting.
```

**Como personalizar:** indique nível técnico do leitor.  
**Validação:** procedimento precisa ter condição observável de sucesso.  
**Riscos e limites:** artigos desatualizados podem propagar erro; definir revisão quando necessário.  
**Componentes JPN usados:** contexto e fonte em Jornada; critérios e limites em Precisão; sequência e continuidade em Narrativa.

---

# 17. Memorando de decisão

**Nome:** Decisão com trade-offs explícitos  
**Cenário:** documentar escolha entre alternativas.  
**Objetivo:** registrar por que uma opção foi escolhida e em quais condições a decisão deve ser revista.  
**Quando usar:** decisões técnicas, operacionais ou de produto.  
**Não usar quando:** a decisão ainda não ocorreu; nesse caso use o comparador de alternativas.

**Entradas necessárias:**
- decisão;
- opções consideradas;
- critérios;
- evidências;
- riscos;
- responsáveis, se informados.

**Template:**

```text
Crie um memorando de decisão baseado apenas nas informações abaixo.

DECISÃO
{{decisao}}

CONTEXTO
{{contexto}}

OPÇÕES CONSIDERADAS
{{opcoes}}

CRITÉRIOS
{{criterios}}

EVIDÊNCIAS
{{evidencias}}

RISCOS
{{riscos}}

ENTREGUE
1. decisão em uma frase;
2. contexto;
3. opções analisadas;
4. razões da escolha;
5. trade-offs aceitos;
6. riscos e mitigação;
7. fatos ainda incertos;
8. sinais que justificariam revisar a decisão;
9. próxima ação.

Não invente unanimidade, responsável ou justificativa que não esteja nas entradas.
```

**Como personalizar:** inclua data e identificador do projeto.  
**Validação:** a decisão deve ser explicável pelos critérios e evidências fornecidos.  
**Riscos e limites:** decisão registrada pode envelhecer; manter condições de revisão.  
**Componentes JPN usados:** contexto e evidência em Jornada; critérios e riscos em Precisão; estado final e continuidade em Narrativa.

---

# 18. Handoff entre agentes ou pessoas

**Nome:** Handoff JPN  
**Cenário:** transferir trabalho para outra pessoa, agente ou sessão.  
**Objetivo:** preservar estado, decisões, restrições e próxima ação sem transportar raciocínio privado desnecessário.  
**Quando usar:** troca de responsável, mudança de sessão, multiagente ou retomada posterior.  
**Não usar quando:** o trabalho é simples e não possui continuidade relevante.

**Entradas necessárias:**
- objetivo;
- estado atual;
- decisões;
- artefatos;
- pendências;
- restrições;
- próxima ação.

**Template:**

```text
Crie um handoff operacional do trabalho abaixo.

OBJETIVO
{{objetivo}}

ESTADO ATUAL
{{estado_atual}}

DECISÕES CONFIRMADAS
{{decisoes}}

ARTEFATOS/REFERÊNCIAS
{{artefatos}}

RESTRIÇÕES
{{restricoes}}

PENDÊNCIAS
{{pendencias}}

FORMATO
1. objetivo do trabalho;
2. estado atual;
3. decisões confirmadas;
4. fatos inferred/unknown/conflicting relevantes;
5. artefatos e fontes de verdade;
6. o que já foi tentado;
7. o que não deve ser refeito;
8. riscos/bloqueios;
9. próxima ação recomendada;
10. critério para considerar a próxima etapa concluída.

Não inclua cadeia de pensamento privada. Preserve somente informações operacionais necessárias para continuidade.
```

**Como personalizar:** inclua IDs, links ou versões de artefatos.  
**Validação:** quem recebe o handoff consegue continuar sem repetir investigação já concluída nem perder restrições.  
**Riscos e limites:** handoff desatualizado pode divergir da fonte de verdade; versão/data ajudam a controlar isso.  
**Componentes JPN usados:** Jornada para estado e histórico; Precisão para restrições e conclusão; Narrativa para continuidade.

---

# Checklist do Prompt Pack

Antes de usar qualquer template, confirme:

- [ ] o cenário realmente corresponde ao problema;
- [ ] fatos importantes estão identificados como confirmados, inferidos, desconhecidos ou conflitantes quando necessário;
- [ ] nenhuma condição comercial, jurídica, financeira ou operacional foi inventada;
- [ ] objetivo e saída estão explícitos;
- [ ] existem critérios de validação;
- [ ] riscos materiais não foram escondidos;
- [ ] o formato final é útil para quem vai executar;
- [ ] a próxima ação está clara quando houver continuidade.

## Relação com os demais produtos JPN

- **Método JPN:** explica os princípios por trás dos cartões.
- **JPN Prompt Builder:** ajuda a transformar texto bruto em estado JPN e prompt estruturado.
- **JPN Business:** aplica os mesmos princípios a processos empresariais completos, não apenas prompts isolados.
- **JPN Pro Kit:** agrega os produtos versionados em uma experiência de entrega única.

## Limites editoriais deste draft

Esta versão está pronta para revisão cruzada com o Método JPN e com o futuro draft consolidado do JPN Business. Antes de `release-candidate`, ainda devem ocorrer revisão ortográfica final, inspeção de duplicações semânticas, diagramação e geração dos arquivos finais de entrega.