# Método JPN — Canvas local v1

Status: **ferramenta candidata de apoio interno**. Não substitui revisão editorial, PDF final ou aprovação de release do Método JPN.

## Objetivo

Transformar o modelo compacto já definido em `METODO_JPN_QUICK_REFERENCE_v1.md` em uma superfície prática e local para preencher **Jornada, Precisão e Narrativa** e gerar um rascunho estruturado reutilizável.

## Arquivos

- `metodo-jpn-site/index.html` — formulário e saída;
- `metodo-jpn-site/styles.css` — layout responsivo e impressão;
- `metodo-jpn-site/app.js` — geração local do rascunho e indicação de lacunas básicas.

## Fonte metodológica

O canvas preserva os campos canônicos da referência rápida:

- Jornada: contexto, estado atual, recursos, restrições, incertezas/conflitos e confiança;
- Precisão: objetivo, escopo, entradas, saída, restrições, critérios, riscos e validação;
- Narrativa: estado final, sequência, formato, nível de detalhe, próxima ação e continuidade.

Os valores de confiança permanecem `confirmed`, `inferred`, `unknown` e `conflicting`.

## Operação

1. abrir `metodo-jpn-site/index.html` em navegador moderno;
2. preencher apenas o contexto material para a tarefa;
3. gerar o rascunho;
4. revisar campos críticos vazios;
5. copiar o texto somente quando ele estiver adequado ao uso pretendido;
6. validar a saída produzida pela IA contra os critérios definidos no canvas.

## Privacidade e limites

A ferramenta não usa API externa, login, analytics ou envio de formulário. O texto digitado permanece no navegador enquanto a página está aberta. O canvas não persiste dados automaticamente.

A ferramenta não transforma inferências em fatos, não garante precisão da resposta de uma IA e não equivale a autorização para publicar, comprar, contratar, alterar sistemas ou tomar decisão financeira, jurídica ou especializada.

## Estado de release

Esta entrega melhora a aplicação prática do Método JPN, mas não altera os gates `revisao-editorial-humana` e `pdf-final`, que permanecem pendentes em `PRODUCT_RELEASE_STATUS_v1.json`.
