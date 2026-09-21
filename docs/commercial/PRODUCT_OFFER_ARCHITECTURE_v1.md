# Arquitetura de Oferta — Ecossistema JPN v1

> Documento interno de preparação comercial. Não autoriza publicação, anúncio, checkout, preço, promessa de resultado ou lançamento.

## Objetivo

Organizar os produtos JPN como uma linha coerente de soluções, evitando sobreposição de ofertas e permitindo recomendar o menor recurso suficiente para o problema apresentado.

## Princípio de composição

A progressão do ecossistema é **entender → estruturar → aplicar → operar → integrar**. O cliente não precisa percorrer todas as etapas nem adquirir todos os produtos. Cada produto deve permanecer útil isoladamente dentro do escopo declarado.

| Produto | Papel na arquitetura | Resultado operacional esperado | Próxima camada possível |
| --- | --- | --- | --- |
| Método JPN | Fundamento | compreender Jornada, Precisão e Narrativa e aplicar o raciocínio a instruções | Prompt Builder ou Prompt Pack |
| JPN Prompt Builder | Estruturação assistida | transformar uma intenção em instrução estruturada e revisável | Prompt Pack |
| JPN Prompt Pack | Aplicação pronta | partir de templates reutilizáveis para tarefas recorrentes | JPN Business |
| JPN Business | Operação por playbooks | organizar rotinas empresariais em playbooks orientados | Gestão Fácil |
| JPN Gestão Fácil | Registro e acompanhamento | centralizar clientes, vendas, tarefas, estoque e registros gerenciais em uma planilha | Pro Kit quando houver necessidade real de integração |
| JPN Pro Kit | Integração | reunir componentes aprovados em uma jornada única | — |

## Rotas de entrada

### Rota A — “Não sei como pedir para a IA”

1. Começar pelo **Método JPN** quando a necessidade é aprender o raciocínio.
2. Indicar **Prompt Builder** quando a dificuldade principal é estruturar uma instrução concreta.
3. Usar **Prompt Pack** quando o usuário prefere partir de modelos reutilizáveis.

### Rota B — “Quero aplicar IA na rotina da empresa”

1. Começar pelo **JPN Business** quando o problema é transformar uma rotina em playbook.
2. Acrescentar **Prompt Pack** apenas se templates de instrução reduzirem trabalho recorrente.
3. Avaliar **Gestão Fácil** somente quando houver necessidade de registro e acompanhamento em planilha.

### Rota C — “Preciso organizar a pequena empresa”

1. Demonstrar **Gestão Fácil** pelo mapa das oito abas.
2. Não apresentar a planilha como ERP, sistema contábil ou automação autônoma.
3. Se também houver necessidade de IA, selecionar separadamente Prompt Builder, Prompt Pack ou Business conforme o problema.

### Rota D — “Quero tudo integrado”

O **Pro Kit** só deve ser apresentado depois de confirmar que a integração de múltiplas camadas realmente é necessária. Enquanto seus artefatos não passarem pelos gates aplicáveis, seu estado permanece **EM PREPARAÇÃO**.

## Regras para bundles futuros

Qualquer bundle comercial futuro deve:

- possuir composição explícita e versionada;
- indicar quais componentes são independentes;
- evitar duplicar o mesmo arquivo sob nomes diferentes;
- registrar dependências e gates de cada artefato;
- manter documentação de entrega e integridade;
- não declarar compatibilidade, aprovação ou readiness sem evidência correspondente;
- não usar desconto, preço de referência ou economia calculada antes de decisão comercial autorizada;
- não usar urgência, escassez ou garantia de resultado como substituto de valor demonstrável.

## Matriz de expansão segura

| Situação observada | Recurso mínimo | Expandir somente se… |
| --- | --- | --- |
| instrução vaga | Prompt Builder | houver repetição suficiente para justificar templates |
| necessidade de aprender o método | Método JPN | o usuário quiser aplicação assistida |
| tarefa recorrente já conhecida | Prompt Pack | houver processo empresarial mais amplo |
| processo empresarial recorrente | JPN Business | também for necessário registrar/acompanhá-lo |
| controles dispersos em planilhas/notas | Gestão Fácil | várias camadas JPN forem realmente necessárias |
| uso combinado de vários componentes | Pro Kit | todos os componentes incluídos estiverem elegíveis para a composição pretendida |

## Guardrails de linguagem comercial

### Permitido

- “estrutura”, “organiza”, “ajuda a revisar”, “modelo reutilizável”, “playbook”, “registro gerencial”;
- demonstrar entradas e saídas fictícias;
- explicar limites e pré-requisitos;
- comparar produtos JPN pelo problema que resolvem.

### Não permitido sem evidência específica

- “garante resultado”;
- “aumenta vendas” ou percentuais de ganho;
- “elimina erros”;
- “100% privado/seguro”;
- “compatível com qualquer IA/software”;
- “substitui especialista, contador, ERP ou decisão humana”.

## Sequência de demonstração do portfólio

Quando for necessário mostrar o ecossistema completo, usar esta ordem:

**Método JPN → Prompt Builder → Prompt Pack → JPN Business → Gestão Fácil → Pro Kit**.

A demonstração deve parar assim que o problema apresentado já estiver coberto. O objetivo é adequação, não maximização do número de produtos.

## Estado de preparação

Este documento organiza a arquitetura de oferta, mas não promove nenhum produto para release. Permanecem válidos os gates e estados registrados nas fontes de release do repositório, incluindo QA físico/contextual, QA multiplataforma, revisão humana e freeze quando aplicáveis.
