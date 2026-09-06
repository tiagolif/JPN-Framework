# Auditoria Editorial — Método JPN v1

**Base:** JPN Framework `0.3.0-draft`  
**Status da auditoria:** primeira consolidação concluída; revisão final ainda pendente.

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
| Revisão ortográfica final | pendente |
| Revisão visual/diagramação | pendente |
| PDF/DOCX final | pendente |
| Teste cruzado com Prompt Pack/Business | pendente |

## Próximas ações seguras

1. usar este Método consolidado como fonte editorial para auditar o Prompt Pack;
2. normalizar cada prompt pelo contrato de conteúdo;
3. depois auditar JPN Business usando os mesmos conceitos;
4. somente após a revisão cruzada, promover o Método para `release-candidate`;
5. gerar formatos finais apenas quando o conteúdo estiver congelado.

## Arquivo canônico desta etapa

`docs/products/metodo-jpn/METODO_JPN_v1.md`

Materiais antigos podem continuar existindo como histórico, mas não devem ser tratados como fonte editorial principal sem comparação explícita com este draft.
