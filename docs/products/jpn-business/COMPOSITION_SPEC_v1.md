# JPN Business — Especificação de Composição v1

## Objetivo

Congelar a direção editorial e visual do JPN Business antes da geração do PDF candidato. Este documento é uma especificação de composição, não uma aprovação de release.

## Formato-base

- Página: A4 retrato.
- Margens: 18–22 mm, com respiro maior no topo de aberturas de seção.
- Grid: coluna principal de leitura + faixas opcionais para notas, alertas e metadados de playbook.
- Ritmo: evitar páginas densas; privilegiar blocos curtos, listas operacionais e exemplos separados do texto conceitual.
- Numeração: rodapé discreto a partir da primeira página de conteúdo; capa não numerada visualmente.

## Hierarquia editorial

1. Capa: JPN Business, subtítulo funcional e marca JPN.
2. Página de abertura: escopo do produto, público e guardrails.
3. Sumário.
4. Como usar o material.
5. Fundamentos do Método JPN aplicados a negócios.
6. Playbooks JB-01 a JB-12 em sequência canônica.
7. Referência cruzada para prompts PP-* do JPN Prompt Pack.
8. Checklist final de aplicação e revisão humana.
9. Avisos de uso e limites.

## Componentes visuais

### Cabeçalhos de seção

Usar título curto, subtítulo explicativo e uma frase de orientação prática. Evitar slogans com promessa de resultado.

### Cartão de playbook

Cada playbook deve apresentar, nesta ordem:

- ID e nome canônico;
- objetivo;
- quando usar;
- entradas necessárias;
- passos JPN;
- prompt(s) PP-* relacionado(s);
- saída esperada;
- critérios de revisão;
- riscos/limites.

### Destaques

Usar caixas distintas para:

- **Atenção**: risco, limitação ou necessidade de validação;
- **Exemplo**: demonstração ilustrativa, nunca tratada como resultado garantido;
- **Checklist**: passos verificáveis;
- **Conexão JPN**: explicação de Jornada, Precisão e Narrativa.

## Regras de conteúdo

- Preservar os IDs JB-* e PP-* exatamente como nos índices versionados.
- Não afirmar garantia de vendas, ROI, precisão absoluta, eliminação de alucinações ou substituição de revisão humana.
- Toda recomendação operacional deve permitir adaptação ao contexto do usuário.
- Exemplos devem ser identificados como ilustrativos quando contiverem números, cenários ou resultados.
- Não introduzir preços, dados financeiros reais, credenciais ou dados pessoais no material-base.

## Identidade visual

A composição deve seguir a identidade visual JPN já versionada no repositório. A prioridade é legibilidade, consistência e aparência de produto profissional, evitando excesso de efeitos, ícones decorativos sem função ou páginas visualmente carregadas.

## Critérios para considerar a composição congelada

A dependência `diagramacao-final` só poderá avançar para `passed` quando houver:

1. arquivo candidato completo;
2. todas as seções previstas presentes;
3. todos os 12 playbooks diagramados;
4. referências PP-* conferidas;
5. inspeção visual página a página registrada;
6. ausência de overflow, cortes, páginas vazias acidentais e elementos ilegíveis;
7. evidência versionada do QA visual.

Até lá, a composição permanece `in-progress`.
