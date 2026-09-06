# JPN Pro Kit v1 — LEIA PRIMEIRO

Base metodológica: JPN Framework `0.3.0-draft`.

Status deste pacote: **release-candidate interno**. Não é uma publicação comercial e não define preço, checkout, licença adicional, anúncio ou condição de venda.

## O que é o JPN Pro Kit

O JPN Pro Kit organiza, em uma única experiência de entrega, os produtos e ferramentas que aplicam o JPN em diferentes níveis:

1. **Método JPN** — explica Jornada, Precisão e Narrativa e como estruturar contexto, objetivo, restrições, validação e continuidade.
2. **JPN Prompt Pack** — fornece cartões reutilizáveis para tarefas delimitadas.
3. **JPN Business** — fornece playbooks para processos recorrentes de negócio.
4. **JPN Prompt Builder** — ferramenta web para transformar uma solicitação em rascunho JPN revisável, validar o estado e compilar o prompt.
5. **JPN Gestão Fácil** — planilha operacional para pequenas empresas. A edição reconstruída v0.1 está versionada no repositório e passou pelo QA funcional local GF-QA-01 a GF-QA-09. Compatibilidade cruzada e artefato final do manual ainda estão pendentes.

## Ordem recomendada de uso

### Para aprender

Comece pelo Método JPN. Ele estabelece o vocabulário comum e evita tratar templates como fórmulas mágicas.

### Para executar uma tarefa pontual

Use o Prompt Pack. Escolha o cartão pelo cenário, complete as entradas reais, preserve lacunas e revise os critérios de validação.

### Para organizar um processo recorrente

Use o JPN Business. Cada playbook inclui responsáveis, decisões, restrições, saída, validação e continuidade.

### Para estruturar uma solicitação própria

Use o Prompt Builder. O fluxo-base é local e deve depender do SDK browser oficial; campos não confirmados continuam visíveis como lacunas.

### Para organizar a rotina operacional

Use a Gestão Fácil para clientes, vendas, tarefas, estoque e registros financeiros operacionais simples. Ela não substitui ERP, contabilidade, sistema fiscal, jurídico ou bancário.

## Regra de confiança

Quando um conteúdo representar formalmente um estado JPN, use somente os estados:

- `confirmed` — informação explicitamente confirmada;
- `inferred` — inferência identificada como tal;
- `unknown` — informação ainda desconhecida;
- `conflicting` — fontes ou informações em conflito.

Nunca transforme `inferred`, `unknown` ou `conflicting` em fato confirmado apenas para completar um template.

## O que este kit não promete

O JPN não garante respostas corretas, não elimina alucinações, não garante vendas, produtividade ou redução de custos e não substitui revisão humana em decisões relevantes. Claims quantitativos só podem ser usados depois de avaliação reproduzível.

## Fontes canônicas desta etapa

- Método: `docs/products/metodo-jpn/METODO_JPN_v1.md`
- Prompt Pack: `docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md`
- Índice do Prompt Pack: `docs/products/prompt-pack/PROMPT_INDEX.json`
- Business: `docs/products/jpn-business/JPN_BUSINESS_v1.md`
- Índice Business: `docs/products/jpn-business/BUSINESS_INDEX.json`
- Prompt Builder: `product-site/`
- Gestão Fácil XLSX: `deliverables/gestao-facil/JPN_Gestao_Facil_v0.1_reconstruida.xlsx`
- Gestão Fácil manual: `docs/products/gestao-facil/MANUAL_v0.1.md`
- Gestão Fácil QA: `docs/products/gestao-facil/QA_EXECUTION_v0.1.md`
- Contratos editoriais: `docs/product-system/CONTENT_CONTRACTS.md`
- Auditoria cruzada: `docs/product-system/CROSS_PRODUCT_AUDIT_v1.md`

## Antes de um release final

O pacote ainda precisa passar pelos gates registrados em `RELEASE_CHECKLIST.md`. Em especial: CI verde da cadeia técnica, revisão ortográfica/visual final, GF-QA-10 da Gestão Fácil, geração e inspeção dos PDFs finais, congelamento do manifesto com hashes reais dos artefatos finais e autorização explícita antes de qualquer publicação externa.
