# Arquitetura Editorial dos Produtos JPN v1

Base técnica: JPN Framework `0.3.0-draft`.

Este documento define como os produtos comerciais se relacionam com o framework. Ele não define preço, checkout, publicação ou termos comerciais.

## Princípio central

Os produtos JPN não são frameworks paralelos. Todos traduzem, ensinam ou operacionalizam o mesmo núcleo:

- **J — Jornada:** contexto, estado atual, histórico, recursos, restrições e incertezas;
- **P — Precisão:** objetivo operacional, escopo, entradas, saídas, critérios, riscos e validação;
- **N — Narrativa:** estado final desejado, sequência de entrega, formato, detalhe, próxima ação e continuidade.

Quando um produto representar um estado formal JPN, deve declarar a versão-base do framework e preservar os estados de confiança oficiais (`confirmed`, `inferred`, `unknown`, `conflicting`).

## Método JPN

### Papel
Produto educacional central. Ensina o raciocínio que transforma uma solicitação vaga em um contrato de contexto e execução revisável.

### Deve conter
1. problema que o método resolve;
2. Jornada, Precisão e Narrativa em linguagem acessível;
3. estados de confiança e tratamento de incerteza;
4. processo passo a passo;
5. exemplos antes/depois;
6. checklist de revisão;
7. limites do método;
8. relação com Prompt Builder, Prompt Pack e Business.

### Não deve prometer
- eliminação de alucinação;
- melhoria percentual sem avaliação reproduzível;
- resultado garantido;
- compatibilidade absoluta com qualquer modelo ou ferramenta.

## JPN Prompt Builder

### Papel
Ferramenta de aplicação. Converte entrada bruta em rascunho JPN revisável, mostra lacunas, avalia prontidão e compila um prompt.

### Fonte de verdade
O comportamento técnico deve vir do SDK oficial. A interface não deve reimplementar parser, validação, readiness ou compilação.

### Saídas
- rascunho JPN estruturado;
- campos pendentes de confirmação;
- indicador de prontidão;
- prompt compilado;
- JSON exportável.

## JPN Prompt Pack

### Papel
Biblioteca de aceleradores. Cada item deve ser um template de uso, não uma fórmula mágica.

### Estrutura mínima por prompt
- nome;
- cenário;
- resultado pretendido;
- dados que o usuário precisa fornecer;
- template;
- como adaptar;
- como validar;
- riscos de uso;
- relação com J, P e N.

### Regra
Prompts devem pedir contexto faltante ou marcar placeholders; não devem embutir fatos comerciais, financeiros ou jurídicos como se fossem universais.

## JPN Business

### Papel
Aplicação do método a rotinas de pequenas empresas.

### Domínios prioritários
- vendas e follow-up;
- atendimento;
- organização operacional;
- marketing e conteúdo;
- análise e tomada de decisão;
- rotinas administrativas não reguladas.

### Relação com Gestão Fácil
A planilha JPN Gestão Fácil é um utilitário operacional complementar. Ela não transforma o JPN Business em ERP, sistema contábil, fiscal ou financeiro.

## JPN Pro Kit

### Papel
Oferta agregadora. Organiza os produtos em uma jornada única de adoção.

### Ordem recomendada de consumo
1. Método JPN — entender;
2. Prompt Builder — estruturar;
3. Prompt Pack — acelerar;
4. JPN Business — aplicar no negócio;
5. Gestão Fácil — organizar rotinas e dados básicos;
6. materiais de referência — consultar e revisar.

### Regra de release
O Pro Kit só deve incluir artefatos com versão, base metodológica e status claros. Não misturar rascunhos internos com arquivos apresentados como finais.

## Linguagem comercial comum

Preferir:
- “ajuda a estruturar”;
- “torna lacunas explícitas”;
- “foi projetado para reduzir ambiguidade”;
- “permite revisar contexto e requisitos antes da execução”;
- “oferece templates e ferramentas de apoio”.

Evitar sem evidência:
- “garante”;
- “elimina erros”;
- “X vezes melhor”;
- “aumenta vendas em X%”;
- “funciona perfeitamente em qualquer IA”.

## Compatibilidade

Versões comerciais e técnicas são independentes. Um `Prompt Pack v1.1` pode continuar baseado no Framework `0.3.0-draft`. Se o framework mudar de forma incompatível, a compatibilidade dos produtos deve ser revisada explicitamente antes de atualizar a versão-base declarada.