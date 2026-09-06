# Contratos de Conteúdo JPN v1

Base: JPN Framework `0.3.0-draft`.

Objetivo: impedir que Método JPN, Prompt Pack, JPN Business e Pro Kit evoluam com terminologias ou promessas incompatíveis.

## 1. Contrato do Método JPN

Cada capítulo deve responder a quatro perguntas:

1. **O que é?** — conceito em linguagem simples.
2. **Por que existe?** — problema de contexto ou execução que procura reduzir.
3. **Como aplicar?** — sequência prática.
4. **Como verificar?** — sinais de que o uso ficou suficientemente explícito.

### Estrutura editorial recomendada

- abertura com problema real;
- conceito;
- exemplo ruim;
- reconstrução usando J, P e N;
- resultado revisado;
- checklist;
- erro comum;
- próxima etapa.

## 2. Contrato do Prompt Pack

Cada template deve seguir este cartão:

```text
Nome:
Cenário:
Objetivo:
Quando usar:
Não usar quando:
Entradas necessárias:
Template:
Como personalizar:
Validação:
Riscos e limites:
Componentes JPN usados:
```

### Critério de qualidade

Um prompt não entra no pack apenas por “soar bom”. Ele precisa tornar explícito ao menos:

- o que será feito;
- qual contexto é necessário;
- qual saída é esperada;
- como lidar com informação ausente;
- como revisar o resultado.

## 3. Contrato do JPN Business

Cada playbook deve conter:

```text
Processo de negócio:
Resultado pretendido:
Responsável típico:
Entradas:
Restrições:
Passos:
Pontos de decisão:
Saída:
Como validar:
O que registrar para continuidade:
Riscos:
```

### Limites

JPN Business pode organizar processos, mas não deve se apresentar como substituto automático de especialista jurídico, contador, sistema fiscal, sistema bancário ou profissional de saúde.

## 4. Contrato do Pro Kit

Cada item incluído no pacote deve ter:

- nome;
- versão comercial;
- base do Framework JPN;
- tipo de arquivo;
- finalidade;
- status (`draft`, `release-candidate`, `final`);
- data da versão;
- dependências, se houver.

O arquivo `LEIA PRIMEIRO` deve indicar uma ordem de consumo e distinguir claramente material final de material de apoio.

## 5. Contrato de exemplos

Exemplos precisam:

- usar dados fictícios ou neutros;
- identificar quando valores são apenas ilustrativos;
- não usar credenciais, dados financeiros reais ou dados pessoais;
- distinguir fatos fornecidos de inferências;
- evitar marcas ou políticas externas quando isso não for essencial.

## 6. Contrato de claims

### Permitido sem benchmark quantitativo

- descrever funcionalidades reais;
- explicar o desenho do método;
- afirmar que uma etapa “torna X explícito” quando isso é observável no produto;
- dizer que algo “foi projetado para reduzir ambiguidade”.

### Exige evidência

- percentuais;
- comparação com concorrentes ou baseline;
- ganho de produtividade;
- redução de custo;
- redução de erro;
- aumento de vendas;
- superioridade de qualidade.

## 7. Definition of Done editorial

Um artefato só pode ser marcado como `final` quando:

- terminologia JPN está alinhada;
- versão-base está declarada;
- placeholders foram removidos ou intencionalmente identificados;
- exemplos estão neutros;
- claims foram auditados;
- instruções de uso estão completas;
- arquivos editável e final estão diferenciados quando ambos existirem;
- passou por revisão visual/técnica adequada ao formato.