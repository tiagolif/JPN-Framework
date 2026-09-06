# Auditoria Editorial — JPN Business v1

Base: JPN Framework `0.3.0-draft`.

Status auditado: `draft editorial consolidado`.

## Objetivo da auditoria

Verificar se o JPN Business se comporta como produto de processos e não como uma duplicação do JPN Prompt Pack.

## O que foi consolidado

- 12 playbooks completos seguindo `CONTENT_CONTRACTS.md`;
- separação explícita entre processo e prompt isolado;
- vínculos estruturados com cartões do Prompt Pack via `BUSINESS_INDEX.json`;
- uso consistente de Jornada, Precisão e Narrativa;
- preservação dos estados de confiança quando o processo exige diferenciar fato, inferência, desconhecido ou conflito;
- limites contra promessas, urgência, preços, condições e políticas inventadas;
- bloqueio explícito de publicação/gasto no playbook de campanha;
- limites claros para temas jurídicos, fiscais, contábeis, bancários e outros processos regulados;
- relação definida com a planilha JPN Gestão Fácil sem apresentá-la como ERP.

## Revisão cruzada com o Prompt Pack

A diferença funcional ficou definida assim:

- Prompt Pack = execução delimitada de uma tarefa;
- JPN Business = processo recorrente que contém tarefas, decisões, responsáveis, validação e continuidade.

Exemplos:

- `PP-06 Follow-up responsável` pode produzir uma mensagem; `JB-02` define quando retomar, quais fatos usar e o que registrar depois.
- `PP-11 Notas → SOP` ajuda a redigir o documento; `JB-09` define como criar, testar, versionar e manter o procedimento.
- `PP-18 Handoff JPN` ajuda a produzir a transferência; `JB-06` define o processo e seus gates de autoridade.
- `PP-16 Conhecimento operacional reutilizável` ajuda a estruturar conhecimento; `JB-11` define inventário, provenance, conflitos e revisão.

## Duplicações deliberadamente evitadas

- não foi criado um “prompt mestre empresarial” genérico;
- não foi criado playbook de simples reescrita, resumo ou pesquisa, porque essas tarefas permanecem no Prompt Pack;
- campanha e conteúdo foram separados porque campanha envolve sequência, dependências e gates de publicação, enquanto conteúdo pode existir como produção editorial isolada;
- triagem e qualificação foram separadas porque triagem decide o fluxo inicial, enquanto qualificação avalia critérios de avanço.

## Claims

Nenhum playbook promete aumento de vendas, produtividade, redução de custo ou eliminação de erro. O produto se limita a explicar comportamento observável: estruturar processos, tornar entradas/restrições/decisões explícitas e registrar continuidade.

## QA fictício executado

Foi criada a bateria `QA_CASES_v1.md` cobrindo seis categorias:

- comercial;
- atendimento;
- marketing;
- operações;
- gestão;
- conhecimento.

Resultado editorial: 6/6 casos atendem aos critérios definidos sem exigir fatos inventados, ultrapassar autoridade ou remover incerteza relevante.

Este resultado é QA de coerência editorial, não benchmark de desempenho de IA e não sustenta claim quantitativo de superioridade.

## Pendências antes de release-candidate

- revisar ortografia e uniformidade de pontuação;
- validar mecanicamente todos os links do índice contra a versão final do Prompt Pack;
- revisar consistência entre Método, Prompt Pack e Business em uma única passada;
- preparar diagramação e arquivo de entrega final;
- decidir se alguns playbooks receberão modelos de registro anexos na versão comercial.

## Definition of Done da próxima etapa

O JPN Business pode avançar para `release-candidate` quando:

- nenhuma divergência terminológica for encontrada na revisão cruzada;
- o índice estruturado corresponder ao conteúdo humano e ao índice final do Prompt Pack;
- versão, base do framework e limites estiverem presentes no artefato diagramado;
- o pacote não contiver dados reais, credenciais ou claims não comprovados.
