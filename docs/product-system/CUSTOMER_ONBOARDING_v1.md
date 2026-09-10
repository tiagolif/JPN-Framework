# JPN Customer Onboarding v1

> Estado: candidato interno · QA editorial e operacional pendentes.
>
> Este guia organiza o primeiro uso dos produtos JPN. Não representa release final, oferta ativa, publicação, garantia de resultado ou autorização para qualquer ação externa.

## Objetivo

Reduzir a fricção entre receber um produto JPN e conseguir usá-lo de forma consciente, começando pelo menor recurso suficiente e preservando os limites reais de cada produto.

## Princípios

1. **Começar pela necessidade, não pelo pacote.** Identifique o trabalho que precisa ser feito antes de escolher o produto.
2. **Menor recurso suficiente.** Evite recomendar o Pro Kit quando um único produto resolver a necessidade.
3. **Distinguir fato de hipótese.** Use `confirmed`, `inferred`, `unknown` e `conflicting` quando houver informação contextual.
4. **Não transformar alerta em autorização.** Na Gestão Fácil, `REPOR` é somente um alerta operacional.
5. **Não declarar compatibilidade sem evidência.** `GF-QA-10` continua pendente.
6. **Não declarar QA físico inexistente.** O Prompt Builder ainda depende de QA físico contextual em celular real.
7. **Preservar estado do Pro Kit.** JPN Pro Kit permanece `EM PREPARAÇÃO` enquanto seus gates não forem concluídos.

## Fluxo de onboarding

### ONB-01 — Identificar a necessidade

Complete uma frase simples:

> Preciso de ajuda para ________, com o resultado esperado de ________, sem ________.

Classifique a necessidade em uma das categorias:

- formular ou melhorar instruções para IA;
- reutilizar prompts prontos;
- estruturar rotinas de negócio;
- montar prompts em uma interface;
- organizar controles básicos de pequena empresa;
- combinar vários recursos JPN.

### ONB-02 — Escolher o primeiro produto

| Necessidade principal | Primeiro recurso sugerido | Por quê |
| --- | --- | --- |
| Aprender a estruturar instruções | Método JPN | Ensina Jornada, Precisão e Narrativa como estrutura de trabalho. |
| Reutilizar tarefas recorrentes | JPN Prompt Pack | Oferece 18 templates canônicos para adaptação. |
| Organizar rotinas operacionais | JPN Business | Oferece 12 playbooks canônicos e materiais de implementação. |
| Montar prompts por interface | JPN Prompt Builder | Organiza a construção do prompt; QA físico contextual em celular continua pendente. |
| Controlar operação simples | JPN Gestão Fácil | Centraliza controles básicos; `GF-QA-10` continua pendente. |
| Combinar necessidades reais | JPN Pro Kit | Usar somente quando múltiplos produtos forem necessários; permanece `EM PREPARAÇÃO`. |

### ONB-03 — Ler somente o essencial

Antes de abrir todos os arquivos, comece pelo material de entrada do produto:

- Método JPN → `METODO_JPN_QUICK_REFERENCE_v1.md`;
- Prompt Pack → `JPN_PROMPT_PACK_QUICK_REFERENCE_v1.md`;
- JPN Business → `JPN_BUSINESS_QUICK_REFERENCE_v1.md`;
- Prompt Builder → `PROMPT_BUILDER_QUICK_START_v1.md`;
- Gestão Fácil → `QUICK_START_v0.1.md`;
- Pro Kit → `LEIA_PRIMEIRO.md` e `USAGE_ROUTING_GUIDE_v1.md`.

### ONB-04 — Executar uma primeira tarefa pequena

A primeira execução deve ser reversível, fictícia quando necessário e curta o bastante para permitir revisão humana.

Exemplos:

- Método JPN: transformar um pedido vago em uma instrução estruturada;
- Prompt Pack: adaptar um único template a uma tarefa simples;
- JPN Business: escolher um único playbook e preencher somente o diagnóstico inicial;
- Prompt Builder: gerar um prompt sem conectar serviço externo;
- Gestão Fácil: preencher dados fictícios ou não sensíveis em uma cópia de trabalho;
- Pro Kit: usar o guia de roteamento para decidir quais componentes realmente são necessários.

### ONB-05 — Registrar confiança e pendências

Para qualquer informação usada como contexto:

- `confirmed`: confirmado por fonte ou pessoa responsável;
- `inferred`: dedução útil, mas ainda não confirmada;
- `unknown`: informação necessária ainda ausente;
- `conflicting`: duas fontes ou instruções relevantes entram em conflito.

Se um item estiver `unknown` ou `conflicting`, o próximo passo deve ser revisão ou coleta de evidência, não uma afirmação definitiva.

### ONB-06 — Revisar antes de ampliar

Faça três verificações antes de adicionar mais produtos ou automações:

1. O recurso atual resolveu a necessidade inicial?
2. Existe uma nova necessidade concreta que exige outro produto?
3. Alguma pendência de QA, dado ou autorização impede o próximo passo?

Se a resposta à segunda pergunta for “não”, permaneça no recurso atual.

## Trilhas de primeiro uso

### Método JPN

1. Ler a referência rápida.
2. Escolher uma tarefa real de baixo risco.
3. Escrever Jornada, Precisão e Narrativa separadamente.
4. Comparar com o workbook prático.
5. Revisar o resultado e registrar o que precisou ser ajustado.

**Critério de conclusão do onboarding:** a pessoa consegue explicar J, P e N e aplicar os três a uma tarefa sem depender de um template fechado.

### JPN Prompt Pack

1. Consultar o índice dos 18 templates.
2. Escolher um template pelo tipo de tarefa, não pelo título mais atraente.
3. Usar o workbook de seleção para adaptar contexto e limites.
4. Executar um teste pequeno.
5. Registrar aderência, falhas e ajustes.

**Critério de conclusão do onboarding:** a pessoa consegue escolher e adaptar um template sem tratar sua saída como garantida.

### JPN Business

1. Ler a referência rápida.
2. Identificar uma rotina operacional concreta.
3. Selecionar um dos 12 playbooks.
4. Preencher diagnóstico e responsável.
5. Usar scorecard/tracker somente na extensão necessária.

**Critério de conclusão do onboarding:** existe uma rotina definida, um responsável e um próximo passo observável, sem automação externa não autorizada.

### JPN Prompt Builder

1. Ler o Quick Start.
2. Criar um prompt simples com contexto não sensível.
3. Conferir a saída gerada.
4. Reabrir/editar o trabalho para verificar recuperação básica.
5. Não considerar experiência móvel final validada até existir evidência de QA físico contextual em celular real.

**Critério de conclusão do onboarding:** a pessoa consegue montar, revisar e reutilizar um prompt no ambiente validado, reconhecendo a pendência móvel.

### JPN Gestão Fácil

1. Ler o Quick Start e o dicionário operacional.
2. Trabalhar em uma cópia do arquivo candidato.
3. Usar exemplos fictícios ou dados não sensíveis.
4. Verificar que campos calculados não sejam substituídos manualmente.
5. Tratar `REPOR` somente como alerta.
6. Não declarar equivalência entre Excel, LibreOffice Calc e Google Sheets até `GF-QA-10` ser concluído.

**Critério de conclusão do onboarding:** a pessoa entende onde registrar dados, quais campos são calculados e quais decisões permanecem humanas.

### JPN Pro Kit

1. Confirmar que há mais de uma necessidade real.
2. Ler `LEIA_PRIMEIRO.md`.
3. Usar `USAGE_ROUTING_GUIDE_v1.md` para escolher componentes.
4. Não assumir que todos os produtos precisam ser usados.
5. Preservar o estado `EM PREPARAÇÃO` até os gates de release serem concluídos.

**Critério de conclusão do onboarding:** existe uma justificativa explícita para cada componente selecionado e nenhum artefato pendente é tratado como final.

## Checklist de segurança operacional

Antes de concluir o primeiro uso, confirmar:

- [ ] nenhum dado financeiro real foi introduzido em exemplo ou demonstração;
- [ ] nenhuma credencial, token ou chave foi adicionada a arquivo do produto;
- [ ] nenhuma conta externa foi criada em nome do usuário;
- [ ] nenhum termo legal foi aceito;
- [ ] nenhum anúncio, post ou campanha foi publicado;
- [ ] nenhuma compra, contratação ou gasto foi autorizado;
- [ ] saídas de IA relevantes receberam revisão humana;
- [ ] pendências de QA continuam descritas como pendências.

## Critérios de escalonamento

O onboarding deve parar e pedir ação humana quando houver necessidade de:

- inserir dados pessoais, financeiros ou credenciais reais;
- publicar conteúdo ou anúncio;
- realizar compra, contratação ou assinatura;
- aceitar termos ou política em nome de alguém;
- criar conta que exija verificação de identidade;
- afirmar compatibilidade ou QA ainda não evidenciado;
- tomar decisão irreversível com base apenas em saída de IA.

## Relação com release

Concluir este onboarding **não torna um produto release-ready**. A prontidão continua dependente do `RELEASE_EVIDENCE_REGISTER_v1`, do catálogo de entregáveis e dos gates específicos de cada produto.
