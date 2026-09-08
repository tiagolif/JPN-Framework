# Auditoria Editorial — Método JPN v1

**Base:** JPN Framework `0.3.0-draft`  
**Status da auditoria:** consolidação estrutural e revisão cruzada concluídas; revisão final ainda pendente.

## Objetivo

Transformar o Método JPN em uma única versão editorial rastreável, evitando múltiplas interpretações comerciais do framework.

## Contrato aplicado

O draft consolidado foi revisado para cobrir:

- problema que o método procura reduzir;
- Jornada em linguagem acessível;
- Precisão em linguagem acessível;
- Narrativa como orientação ao estado final, não escrita literária;
- estados de confiança oficiais;
- política de lacunas;
- processo passo a passo;
- exemplos antes/depois;
- checklist de revisão;
- versão leve e versão completa;
- limites e não-garantias;
- relação com Prompt Builder, Prompt Pack, Business, Gestão Fácil e Pro Kit.

## Decisões editoriais

### 1. “Narrativa” foi desambiguada

O texto deixa explícito que Narrativa, no JPN, não significa storytelling por padrão. Ela organiza estado final, sequência, formato, detalhe, próxima ação e continuidade.

### 2. O método não promete superioridade

Foram evitadas afirmações de:

- ganho percentual;
- redução garantida de erro;
- eliminação de alucinação;
- aumento garantido de vendas ou produtividade;
- funcionamento perfeito em qualquer modelo.

### 3. Incerteza virou parte central do ensino

Os estados `confirmed`, `inferred`, `unknown` e `conflicting` aparecem como ferramenta prática para impedir que suposições sejam apresentadas como fatos.

### 4. Estrutura proporcional ao risco

O Método JPN não exige um formulário longo para toda tarefa. O draft inclui uso leve para tarefas simples e uso completo para tarefas complexas, recorrentes ou com maior custo de erro.

### 5. Exemplos são neutros

Os exemplos evitam dados pessoais, credenciais, preços reais e fatos comerciais específicos. Onde há uma restrição, ela é apresentada como parte fictícia do cenário.

## Inconsistência técnica encontrada e corrigida

A especificação em `docs/SPECIFICATION.md` ainda declarava `0.2.0-draft`, enquanto o SDK e a arquitetura de produto já estavam na linha `0.3.0-draft`. A branch desta auditoria atualiza o cabeçalho da especificação para `0.3.0-draft`.

Essa mudança é editorial de alinhamento de versão; não altera o schema nem a API.

## Revisão cruzada — Método ↔ Prompt Pack ↔ Business

A compatibilidade estrutural deixa de ser apenas uma pendência manual e passa a ter evidência versionada em `scripts/check-metodo-cross-product.mjs`.

O gate exige simultaneamente:

- a mesma base `0.3.0-draft` no Método, Prompt Pack e JPN Business;
- as três dimensões Jornada, Precisão e Narrativa no Método;
- os quatro estados de confiança canônicos;
- as quatro opções da política de lacunas;
- referência explícita aos cinco produtos complementares;
- exatamente 18 templates no Prompt Pack, todos classificados com `jornada`, `precisao` e `narrativa`;
- exatamente 12 playbooks no JPN Business;
- ao menos um vínculo `PP-*` em cada playbook e inexistência de referência a prompt ausente.

Esse teste comprova consistência estrutural entre os documentos canônicos atuais. Ele não substitui revisão ortográfica, prova visual, exportação final nem validação humana de qualidade editorial.

## Definition of Done — estado atual

| Critério | Estado |
|---|---|
| Terminologia JPN alinhada | concluído nesta revisão |
| Versão-base declarada | concluído |
| Estados de confiança corretos | concluído |
| Política de lacunas | concluído |
| Exemplos neutros | concluído |
| Claims auditados | concluído para este draft |
| Instruções de uso | concluído |
| Relação com outros produtos | concluído |
| Teste cruzado com Prompt Pack/Business | concluído |
| Revisão ortográfica final | pendente |
| Revisão visual/diagramação | pendente |
| PDF/DOCX final | pendente |

## Próximas ações seguras

1. executar revisão ortográfica fina sobre o conteúdo já consolidado;
2. manter o gate cruzado no build para impedir regressões entre Método, Prompt Pack e Business;
3. revisar o candidato visual/impresso antes de qualquer promoção de status;
4. somente depois congelar o conteúdo e gerar os formatos finais de entrega.

## Arquivo canônico desta etapa

`docs/products/metodo-jpn/METODO_JPN_v1.md`

Materiais antigos podem continuar existindo como histórico, mas não devem ser tratados como fonte editorial principal sem comparação explícita com este draft.
