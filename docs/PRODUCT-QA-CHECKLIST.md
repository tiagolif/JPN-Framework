# JPN — Product QA Checklist

Checklist operacional para promover um produto de **CANDIDATO** para **PRONTO PARA FREEZE** e depois **RELEASE**.

## Identificação

- Produto:
- Versão candidata:
- Data do QA:
- Revisor:
- Commit/branch de referência:
- Artefatos avaliados:

## 1. Conteúdo e copy

- [ ] Nome do produto consistente em todos os arquivos.
- [ ] Versão e estado do produto aparecem corretamente.
- [ ] Texto revisado em português.
- [ ] Benefícios descritos sem promessas absolutas.
- [ ] Limitações e pendências não foram escondidas.
- [ ] Exemplos são fictícios ou sanitizados.
- [ ] Não há depoimentos inventados.
- [ ] Não há urgência artificial ou escassez falsa.
- [ ] CTAs correspondem ao estado real do produto.

## 2. Visual

- [ ] Capa/hero respeita o sistema visual JPN.
- [ ] Hierarquia tipográfica clara.
- [ ] Espaçamento consistente.
- [ ] Contraste suficiente para leitura.
- [ ] Não há texto cortado, sobreposto ou fora da área útil.
- [ ] Ícones/imagens não parecem quebrados ou esticados.
- [ ] Estados de alerta/sucesso não dependem apenas de cor.
- [ ] O material continua legível em zoom/tela menor.

## 3. PDFs e documentos

- [ ] Todas as páginas abrem sem erro.
- [ ] Sumário/índice corresponde ao conteúdo.
- [ ] Cabeçalhos e rodapés são consistentes.
- [ ] Não existem páginas em branco acidentais.
- [ ] Links internos/externos relevantes funcionam.
- [ ] O PDF foi inspecionado página por página.
- [ ] Texto permanece selecionável quando deveria ser.
- [ ] Metadados/título do arquivo estão adequados.

## 4. Planilhas — GF-QA-10

- [ ] Arquivo abre no Microsoft Excel.
- [ ] Arquivo abre no LibreOffice Calc.
- [ ] Arquivo importa no Google Sheets.
- [ ] Nenhum erro `#REF!`, `#VALUE!`, `#DIV/0!`, `#NAME?` ou `#N/A` inesperado.
- [ ] Fórmulas essenciais recalculam corretamente.
- [ ] Validações/listas suspensas funcionam.
- [ ] Formatação condicional permanece compreensível.
- [ ] Gráficos carregam corretamente.
- [ ] Áreas editáveis são fáceis de identificar.
- [ ] Células calculadas não parecem áreas de entrada.
- [ ] Dados de demonstração podem ser removidos sem quebrar a estrutura.
- [ ] `REPOR` permanece claramente descrito como alerta, não autorização de compra.
- [ ] Não existem dados financeiros reais no arquivo candidato.
- [ ] Não existem senhas, tokens ou dados pessoais desnecessários.

## 5. Prompt Builder / páginas web

- [ ] Página carrega sem erro de console bloqueador.
- [ ] Layout desktop validado.
- [ ] Layout mobile validado.
- [ ] Navegação por teclado verificada.
- [ ] Ordem de foco faz sentido.
- [ ] Campos possuem labels claros.
- [ ] Mensagens de erro são compreensíveis.
- [ ] Estados vazios são tratados.
- [ ] Botões possuem ação coerente e identificável.
- [ ] Nenhum botão crítico parece ativo quando ainda não está implementado.
- [ ] Links internos não estão quebrados.
- [ ] Nenhum checkout, analytics ou coleta de dados foi ativado sem autorização.

## 6. Prompt Pack / Método / Business

- [ ] Quantidade de templates/playbooks corresponde ao material oficial.
- [ ] IDs e títulos estão consistentes entre índice e conteúdo.
- [ ] Cada template/playbook explica quando usar.
- [ ] Entradas necessárias estão claras.
- [ ] Critérios de parada/limites aparecem quando necessários.
- [ ] Não há instruções que incentivem inventar fatos ausentes.
- [ ] Exemplos não revelam dados reais.

## 7. Pro Kit

- [ ] Lista definitiva dos produtos incluídos foi fechada.
- [ ] Cada item incluído possui versão definida.
- [ ] Não existem duplicatas ou arquivos obsoletos no pacote.
- [ ] README explica por onde começar.
- [ ] Relação entre Método, Builder, Pack, Business e Gestão Fácil está clara.
- [ ] Links/caminhos relativos do pacote funcionam após descompactar.

## 8. Segurança e privacidade

- [ ] Sem chaves de API.
- [ ] Sem senhas.
- [ ] Sem tokens/cookies.
- [ ] Sem dados bancários/cartões.
- [ ] Sem dados pessoais reais usados apenas para demonstração.
- [ ] Imagens/documentos de terceiros possuem uso autorizado ou foram substituídos.
- [ ] Nenhuma conta externa foi criada como parte do QA.

## 9. Freeze e empacotamento

- [ ] Nome final do produto definido.
- [ ] Sem arquivos `final-final`, `novo`, `teste` ou equivalentes no pacote.
- [ ] Versão aplicada aos arquivos principais.
- [ ] README de entrega presente.
- [ ] CHANGELOG resumido presente.
- [ ] Manifesto lista todos os arquivos entregáveis.
- [ ] SHA-256 calculado para cada arquivo final.
- [ ] ZIP final abre e extrai sem erro.
- [ ] Conteúdo do ZIP comparado com o manifesto.
- [ ] Commit/tag de origem registrado.

## 10. Decisão

Marque apenas uma opção:

- [ ] **REPROVADO** — possui bloqueadores; voltar para desenvolvimento.
- [ ] **CANDIDATO** — útil para revisão/demonstração, mas ainda existem gates abertos.
- [ ] **PRONTO PARA FREEZE** — todos os testes aplicáveis foram aprovados.
- [ ] **RELEASE** — freeze, manifesto, checksums e pacote final concluídos.

### Bloqueadores encontrados

1.
2.
3.

### Observações

-

---

Regra: um item não aplicável deve ser marcado como `N/A` acompanhado de uma justificativa curta; ele não deve ser silenciosamente ignorado.
