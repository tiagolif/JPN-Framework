# JPN Business — integridade do candidato renderizado v1

## Objetivo

Fechar a lacuna entre a validação da fonte editorial e o HTML realmente composto para impressão do JPN Business.

O gate desta etapa **não aprova o PDF** e **não substitui inspeção visual**. Ele apenas verifica que o candidato HTML gerado preserva a estrutura e os vínculos que já foram aprovados na fonte e no índice.

## Comandos

Gerar o candidato:

```bash
npm run build:jpn-business-print-candidate
```

Verificar o candidato já gerado:

```bash
npm run check:jpn-business-rendered-candidate
```

O `npm run build` executa os dois em sequência antes de seguir para o staging final do Prompt Builder.

## O que o gate comprova

O checker exige:

- `candidate-manifest.json` identificado como `JPN Business` e `v1-candidate`;
- status `print-candidate-visual-qa-pending`;
- `visual_qa: pending`;
- `pdf_export: pending`;
- `publication_authorized: false`;
- SHA-256 da fonte Markdown igual ao registrado no manifesto;
- SHA-256 do `BUSINESS_INDEX.json` igual ao registrado no manifesto;
- exatamente 12 playbooks renderizados, em ordem `JB-01` a `JB-12`;
- exatamente 12 blocos de conexão com o JPN Prompt Pack;
- exatamente 144 campos operacionais renderizados (12 campos × 12 playbooks);
- títulos e vínculos `PP-*` do manifesto iguais aos do índice;
- presença, no HTML, das referências `PP-*` exigidas pelo índice;
- aviso explícito de staging interno e de que o material ainda não é PDF final aprovado;
- ausência de CTAs transacionais como “comprar agora”, “finalizar compra” e “checkout”.

## O que o gate não comprova

Continuam fora do escopo mecânico:

- quebra de página correta em A4;
- ausência de viúvas/órfãs visualmente problemáticas;
- legibilidade de tabelas e blocos longos;
- consistência de margens após exportação;
- fidelidade da capa no PDF;
- links clicáveis no PDF final;
- revisão página a página;
- aprovação editorial final;
- hash do PDF congelado;
- autorização de publicação ou venda.

Esses itens continuam sujeitos ao `VISUAL_QA_CHECKLIST_v1.md`, ao pipeline de candidato PDF e ao freeze final.

## Regra de promoção

Passar em `check:jpn-business-rendered-candidate` significa apenas:

> a composição HTML preserva mecanicamente a estrutura canônica da fonte e do índice.

Não significa:

> PDF aprovado, produto finalizado, release autorizado ou publicação liberada.

Qualquer mudança em `JPN_BUSINESS_v1.md`, `BUSINESS_INDEX.json` ou no gerador deve provocar nova geração do candidato e nova execução deste gate antes de qualquer revisão visual subsequente.
