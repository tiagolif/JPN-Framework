# JPN Customer Support Playbook v1

> Estado: candidato interno · QA editorial e operacional pendentes.
>
> Este material organiza triagem e diagnóstico pós-entrega. Não representa SLA contratado, garantia de resultado, suporte 24/7, publicação, oferta comercial ou autorização para qualquer ação externa.

## Objetivo

Padronizar como registrar, classificar, diagnosticar e encaminhar dúvidas ou falhas relacionadas aos produtos JPN sem inventar causa, apagar evidência, promover QA inexistente ou executar ações irreversíveis em nome do usuário.

## Princípios

1. **Preservar evidência antes de corrigir.** Registrar sintoma, ambiente, arquivo/versão e passos observados antes de alterar o estado.
2. **Separar fato de hipótese.** Usar `confirmed`, `inferred`, `unknown` e `conflicting` para contexto e diagnóstico.
3. **Reproduzir no menor escopo possível.** Tentar uma reprodução simples e reversível antes de ampliar a investigação.
4. **Não tratar pendência de QA como bug confirmado.** QA físico contextual do Prompt Builder em celular real continua pendente.
5. **Não declarar compatibilidade sem evidência.** `GF-QA-10` continua pendente para Microsoft Excel, LibreOffice Calc e Google Sheets.
6. **Não transformar alerta em ação.** Na Gestão Fácil, `REPOR` continua somente um alerta operacional.
7. **Preservar o estado do Pro Kit.** JPN Pro Kit permanece `EM PREPARAÇÃO` enquanto seus gates não forem concluídos.
8. **Interromper diante de autorização externa.** Publicação, compra, contratação, aceite legal, criação de conta com verificação de identidade e uso de credenciais reais exigem ação humana apropriada.

## Fluxo de suporte

### SUP-01 — Registrar o relato

Capturar somente o necessário:

- produto e material afetado;
- versão ou nome do arquivo, quando conhecido;
- ambiente de uso;
- comportamento esperado descrito pelo usuário;
- comportamento observado;
- passos que antecederam o problema;
- evidência disponível, sem copiar credenciais ou dados sensíveis;
- impacto percebido.

Evitar pedir dado financeiro real, senha, token, chave de API ou documento pessoal como requisito padrão de diagnóstico.

### SUP-02 — Classificar a confiança

Para cada informação relevante:

- `confirmed`: observado diretamente ou sustentado por evidência adequada;
- `inferred`: hipótese plausível ainda não confirmada;
- `unknown`: informação necessária ainda ausente;
- `conflicting`: evidências ou relatos entram em conflito.

Uma causa não deve ser registrada como confirmada enquanto permanecer apenas `inferred`.

### SUP-03 — Classificar a ocorrência

Use uma das categorias:

| Categoria | Quando usar | Exemplo |
| --- | --- | --- |
| `DUVIDA_DE_USO` | comportamento parece coerente, mas falta orientação | usuário não sabe qual template escolher |
| `CONTEUDO` | texto, exemplo ou instrução pode estar incorreto/ambíguo | etapa editorial conflitante |
| `INTERFACE` | problema visual ou de interação | botão inacessível em determinado viewport |
| `DADOS` | preenchimento, estrutura ou fórmula exige diagnóstico | campo calculado foi sobrescrito |
| `COMPATIBILIDADE` | diferença entre ambientes ou ferramentas | comportamento distinto em planilhas |
| `RELEASE_QA` | ocorrência toca um gate ainda pendente | experiência móvel física do Builder |
| `BLOQUEIO_EXTERNO` | solução exigiria autorização ou serviço externo | publicação, conta, compra ou credencial |

### SUP-04 — Definir severidade operacional

A severidade descreve impacto, não culpa nem prioridade comercial:

- `S1_CRITICO`: risco de perda/corrupção relevante de trabalho ou bloqueio total sem contorno seguro;
- `S2_ALTO`: função principal indisponível, mas há contorno seguro limitado;
- `S3_MEDIO`: função secundária degradada ou instrução ambígua;
- `S4_BAIXO`: dúvida, melhoria ou inconsistência cosmética sem bloqueio.

Não usar severidade para prometer prazo de resposta ou SLA inexistente.

### SUP-05 — Reproduzir com segurança

Antes de alterar arquivo candidato ou código:

1. anotar os passos mínimos do relato;
2. usar dados fictícios ou não sensíveis;
3. trabalhar em cópia quando houver risco de alterar arquivo do usuário;
4. tentar reproduzir uma única vez no menor ambiente suficiente;
5. registrar `REPRODUZIDO`, `NAO_REPRODUZIDO`, `PARCIAL` ou `NAO_TESTADO`;
6. não converter `NAO_TESTADO` em conclusão.

### SUP-06 — Encaminhar por produto

#### Método JPN

Verificar primeiro se a dúvida está em Jornada, Precisão, Narrativa ou na política de lacunas. Comparar com a referência rápida e o workbook prático antes de propor novo material.

#### JPN Prompt Pack

Confirmar o ID do template, a tarefa pretendida e a adaptação feita. Preservar os 18 templates canônicos e evitar declarar que um template garante desempenho.

#### JPN Business

Confirmar qual dos 12 playbooks está sendo usado, qual rotina foi definida e em que etapa do workbook/tracker ocorreu a dúvida. Não confundir material de implementação com automação externa já autorizada.

#### JPN Prompt Builder

Registrar navegador/ambiente, viewport quando relevante, fluxo executado e se o comportamento ocorreu em ambiente físico ou apenas determinístico. O **QA físico contextual em celular real continua pendente** e não pode ser substituído por fixture, inspeção de código ou emulação.

#### JPN Gestão Fácil

Registrar o mesmo arquivo/cópia, aplicativo utilizado e aba/campo afetado. Não sobrescrever campos calculados como tentativa de correção. `GF-QA-10` continua pendente; `REPOR` continua somente alerta operacional, nunca autorização automática de compra.

#### JPN Pro Kit

Identificar primeiro qual componente realmente está envolvido. O Pro Kit permanece `EM PREPARAÇÃO`; um problema em um componente não deve ser generalizado para todo o pacote sem evidência.

## Registro de diagnóstico

Para cada ocorrência, usar o mínimo necessário:

- ID do chamado;
- produto;
- categoria;
- severidade;
- status de reprodução;
- descrição curta;
- confiança da causa;
- causa candidata ou confirmada;
- contorno reversível, quando existir;
- próximo passo;
- bloqueio externo, se houver;
- evidência de encerramento.

O arquivo `SUPPORT_INTAKE_TEMPLATE_v1.csv` fornece um modelo vazio/fictício para esse registro.

## Estados do chamado

- `NOVO`: relato registrado, triagem ainda não concluída;
- `TRIAGEM`: informações mínimas em organização;
- `DIAGNOSTICO`: reprodução ou análise em andamento;
- `BLOQUEADO`: depende de evidência, ambiente ou autorização humana externa;
- `CORRECAO_CANDIDATA`: existe ajuste proposto ainda sem validação final;
- `VALIDACAO`: correção candidata está sendo verificada;
- `ENCERRADO`: causa/contorno e evidência de fechamento foram registrados;
- `NAO_REPRODUZIDO`: investigação atual não reproduziu o relato; não significa que o problema nunca ocorreu.

## Critério de encerramento

Um chamado só deve ser tratado como encerrado quando houver, no mínimo:

1. descrição do que foi observado;
2. classificação final da causa como `confirmed`, `inferred`, `unknown` ou `conflicting`;
3. registro da correção/contorno ou explicação de por que nenhum ajuste foi aplicado;
4. evidência de validação compatível com o tipo de problema;
5. pendências remanescentes explicitadas.

Encerrar chamado não transforma produto em `release_ready` e não substitui gates de release.

## Casos que devem permanecer bloqueados

Interromper o fluxo autônomo quando a resolução exigir:

- senha, token, chave de API ou credencial real;
- dado financeiro real ou decisão financeira;
- publicação, anúncio, campanha ou postagem externa;
- compra, pagamento, contratação ou assinatura;
- aceite de termos legais;
- criação de conta com verificação de identidade;
- remoção ou sobrescrita irreversível de material do usuário sem autorização;
- declaração de compatibilidade, QA físico ou release sem evidência correspondente.

## Relação com onboarding e release

O onboarding explica o primeiro uso; este playbook organiza suporte após ou durante esse uso. Nenhum deles substitui `RELEASE_EVIDENCE_REGISTER_v1`, catálogo de entregáveis, gates específicos dos produtos ou revisão humana quando ela for necessária.
