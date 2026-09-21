# Evals JPN — Protocolo Fase 3

Esta pasta define uma primeira camada **reproduzível e agnóstica de fornecedor** para avaliar o JPN sem confundir protocolo com evidência de eficácia.

## Objetivo

Comparar, na mesma tarefa e com o mesmo modelo/configuração, duas condições:

- `baseline`: instrução curta, sem estrutura JPN explícita;
- `jpn`: instrução contendo Jornada, Precisão e Narrativa.

O protocolo mede propriedades observáveis da saída. Ele não presume que JPN vence o baseline.

## Métricas v1

1. **Cumprimento de requisitos** — fração de critérios obrigatórios atendidos.
2. **Cobertura de critérios de aceitação** — fração de critérios explicitamente verificáveis cobertos.
3. **Alucinação factual** — contagem de afirmações factuais incompatíveis com a evidência fornecida ou inventadas quando a tarefa exige não inferir.
4. **Retrabalho** — número de correções obrigatórias apontadas pelo avaliador para tornar a saída aceitável.
5. **Utilidade humana cega** — nota de 1 a 5 atribuída sem revelar qual condição gerou a resposta.

## Dataset inicial

`dataset.v1.json` contém tarefas sintéticas e auditáveis em domínios diferentes. Nenhuma tarefa usa dados pessoais, financeiros reais ou informação privada.

Cada caso contém `id`, `domain`, contexto/evidência, prompts baseline/JPN, requisitos, critérios de aceitação e claims proibidos.

## Registro e scoring

Use `results.example.json` como contrato de preenchimento. Cada par de respostas deve registrar o modelo, provider, parâmetros relevantes e as duas saídas brutas antes da avaliação. O arquivo de exemplo é deliberadamente incompleto e **não deve pontuar com sucesso**.

Depois de preencher uma rodada real, execute:

```bash
node scripts/score-evals.mjs caminho/para/results.json
```

O scorer não chama APIs nem modelos externos. Ele rejeita metadados placeholder, resposta vazia, `case_id` desconhecido, condição inválida, linha duplicada, arrays de pontuação com tamanho/tipo incompatível, contagens negativas, nota humana fora de 1..5 e pares baseline/JPN incompletos. Quando válido, grava um arquivo irmão `*.score.json` com agregados e resultados por caso.

## Regras experimentais

- manter modelo e parâmetros iguais entre baseline e JPN;
- alternar a ordem de execução para reduzir efeito de ordem;
- não editar respostas antes de registrar a saída bruta;
- avaliador humano não deve saber qual saída é baseline ou JPN ao atribuir utilidade;
- documentar falhas e resultados negativos;
- não transformar uma única rodada em claim comercial.

## Critério mínimo para uma rodada comparativa

Uma rodada só pode ser descrita como reproduzível quando houver dataset versionado, configuração do modelo registrada, respostas brutas preservadas, pontuação por critério, notas humanas identificadas apenas por avaliador sem revelar a condição durante a avaliação e resumo agregado acompanhado de limitações.

## Limite atual

Este diretório entrega o **protocolo, dataset e ferramenta de scoring**, não resultados comparativos. A Fase 3 só poderá ser marcada como concluída depois de uma execução real e documentada. O scorer endurecido melhora a integridade do registro, mas não substitui execução nem avaliação humana.
