# JPN — Registro de Evidências de QA Físico v1

> Documento interno. Não autoriza publicação, venda, anúncio, checkout, gasto, criação de conta ou aceite legal.

## Objetivo

Padronizar a evidência humana que falta antes do freeze dos produtos JPN. Um item só muda de `PENDING_PHYSICAL` para `PASS` quando houver execução real no dispositivo/software indicado e evidência registrada neste documento ou em registro equivalente.

## Regras de evidência

- Usar somente dados fictícios e não sensíveis.
- Registrar data, ambiente, versão/commit testado e resultado.
- Não marcar `PASS` por inferência de CI, screenshot antigo ou teste em ambiente diferente.
- Para falha, registrar passos de reprodução e impacto antes de corrigir.
- Reexecutar o caso após qualquer correção relevante.

## Prompt Builder — celular

| Caso | Ambiente obrigatório | Resultado | Evidência/observação |
|---|---|---|---|
| PB-PHY-01 | Android + Chrome atual | PENDING_PHYSICAL | Abrir via HTTP e concluir fluxo principal |
| PB-PHY-02 | Android + Chrome atual | PENDING_PHYSICAL | Preencher campos com teclado virtual; verificar scroll e foco |
| PB-PHY-03 | Android + Chrome atual | PENDING_PHYSICAL | Gerar, copiar e exportar prompt |
| PB-PHY-04 | Android + Chrome atual | PENDING_PHYSICAL | Ativar Modo Temporário e confirmar comportamento esperado |
| PB-PHY-05 | Android + Chrome atual | PENDING_PHYSICAL | Usar somente exemplo fictício para validar aviso de dado sensível |
| PB-PHY-06 | Android + Chrome atual | PENDING_PHYSICAL | Fechar/reabrir e verificar recuperação/persistência aplicável |
| PB-PHY-07 | Android + Chrome atual | PENDING_PHYSICAL | Verificar legibilidade, botões, áreas de toque e ausência de overflow crítico |

## Gestão Fácil — compatibilidade do mesmo XLSX

Usar exatamente o mesmo arquivo candidato em todos os ambientes. Não inserir dados financeiros reais.

| Caso | Ambiente obrigatório | Resultado | Evidência/observação |
|---|---|---|---|
| GF-PHY-01 | Microsoft Excel | PENDING_PHYSICAL | Abrir sem reparo/erro e validar abas, fórmulas e dashboard |
| GF-PHY-02 | LibreOffice Calc | PENDING_PHYSICAL | Abrir sem reparo/erro e validar abas, fórmulas e dashboard |
| GF-PHY-03 | Google Sheets | PENDING_PHYSICAL | Importar o mesmo XLSX e validar abas, fórmulas e dashboard |
| GF-QA-10 | Excel + Calc + Sheets | PENDING_PHYSICAL | Registrar comparação do mesmo candidato nos três ambientes |
| GF3-QA-11..18 | Ambientes definidos pelo plano v0.3 | PENDING_PHYSICAL | Executar individualmente e anexar observações por caso |

## PDFs e materiais finais

| Caso | Ambiente | Resultado | Evidência/observação |
|---|---|---|---|
| DOC-PHY-01 | Visualizador PDF desktop | PENDING_PHYSICAL | Método JPN: páginas, cortes, tipografia, links e caracteres |
| DOC-PHY-02 | Visualizador PDF desktop | PENDING_PHYSICAL | Prompt Pack: páginas, cortes, tipografia, links e caracteres |
| DOC-PHY-03 | Visualizador PDF desktop | PENDING_PHYSICAL | JPN Business: diagramação, tabelas, quebras e consistência visual |
| DOC-PHY-04 | Visualizador PDF desktop | PENDING_PHYSICAL | Pro Kit e materiais comerciais finais |

## Registro da execução

- Commit/head testado:
- Data:
- Responsável pelo teste:
- Dispositivo/modelo:
- Sistema operacional/versão:
- Navegador/software/versão:
- Arquivo candidato (quando aplicável):
- SHA-256 do candidato (quando aplicável):

### Falhas encontradas

Registrar para cada falha: ID do caso, passos de reprodução, resultado observado, resultado esperado, severidade e evidência disponível.

### Critério para freeze

O freeze só pode ocorrer depois que todos os casos obrigatórios aplicáveis estiverem `PASS`, as falhas bloqueantes estiverem corrigidas e revalidadas, a revisão editorial humana estiver concluída e os hashes finais forem calculados sobre os artefatos efetivamente aprovados.
