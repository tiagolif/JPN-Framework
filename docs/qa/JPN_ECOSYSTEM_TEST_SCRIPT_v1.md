# JPN — roteiro integrado de QA v1

Status: interno, não publicado. Este roteiro não promove estados de release e não substitui QA físico.

## Objetivo

Executar uma passagem única e rastreável pelo ecossistema JPN, evitando testar cada produto sem contexto. Todos os exemplos devem usar dados fictícios e nenhuma etapa autoriza publicação, anúncio, compra, checkout, criação de conta, aceite legal ou uso de dados financeiros reais.

## Matriz de execução

| ID | Produto | Cenário | Evidência esperada | Estado inicial |
|---|---|---|---|---|
| JPN-QA-01 | Método JPN | Converter “preciso melhorar o atendimento” em Jornada, Precisão e Narrativa | tarefa estruturada com objetivo, restrições e saída | PENDING |
| JPN-QA-02 | Prompt Pack | Selecionar o menor PP-* adequado ao cenário anterior | template identificado e adaptado apenas com fatos fictícios | PENDING |
| JPN-QA-03 | Prompt Builder | Montar o prompt, revisar, copiar/exportar e testar Modo Temporário | prompt final + comportamento de privacidade | PENDING_PHYSICAL |
| JPN-QA-04 | JPN Business | Transformar o cenário em processo com responsável, entrada, decisão, saída, validação e exceções | processo rastreável sem promessa de resultado | PENDING |
| JPN-QA-05 | Gestão Fácil | Registrar operação fictícia e verificar dashboard/cadastros/vendas/tarefas/estoque | workbook coerente; REPOR somente como alerta | PENDING_PHYSICAL |
| JPN-QA-06 | Pro Kit | Explicar a relação entre componentes sem recomendar por abrangência | jornada coerente e estado EM PREPARAÇÃO preservado | PENDING |
| JPN-QA-07 | Comercial | Percorrer escolher produto → demonstração → primeiros passos → FAQ | rotas consistentes, sem preço/checkout/lead | PENDING |
| JPN-QA-08 | Entrega | Conferir pacote, onboarding, suporte e limites | handoff coerente sem ação externa | PENDING |

## Passagem integrada

1. Começar no Método JPN e estruturar o problema fictício.
2. Ir ao Prompt Pack e escolher apenas um template suficiente.
3. Abrir o Prompt Builder e montar o prompt preservando contexto e restrições.
4. Levar a saída ao JPN Business somente se o cenário exigir processo operacional.
5. Usar Gestão Fácil somente para demonstrar registro e acompanhamento fictícios.
6. Mostrar o Pro Kit apenas como composição possível; manter EM PREPARAÇÃO.
7. Percorrer as superfícies comerciais internas e verificar que nenhuma delas cria preço, checkout, captação de lead ou promessa de resultado.
8. Conferir onboarding/handoff e encerrar antes de qualquer ação externa.

## Testes físicos que não podem ser simulados

### Prompt Builder
- Android/iOS em viewport real;
- teclado virtual sem cobrir controles essenciais;
- toque, foco, rolagem e legibilidade;
- copiar/exportar;
- Modo Temporário e recuperação conforme comportamento documentado;
- navegador real e retorno após fechar/reabrir.

### Gestão Fácil
- abrir o mesmo XLSX no Microsoft Excel;
- abrir o mesmo XLSX no LibreOffice Calc;
- importar o mesmo XLSX no Google Sheets;
- executar GF-QA-10 e GF3-QA-11..18 sem substituir evidência por inferência.

## Critério PASS

Marcar PASS somente com evidência observável. CI verde não transforma automaticamente teste físico ou revisão humana em PASS.

## Critério FAIL

Registrar: ID, ambiente, passos, resultado esperado, resultado observado e evidência. Corrigir somente quando a mudança não alterar guardrails ou exigir autorização externa.

## Regra de parada

Parar imediatamente se o teste exigir dado real sensível, gasto, compra, publicação, envio externo, criação de conta, aceite legal ou promoção de estado de release sem evidência.