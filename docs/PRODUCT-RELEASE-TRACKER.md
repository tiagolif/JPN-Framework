# JPN — Product Release Tracker

> Documento de acompanhamento dos produtos digitais JPN. Ele complementa o roadmap técnico do framework e **não altera** os critérios de versão `1.0.0` do JPN Framework.

## Objetivo

Manter uma visão única e verificável do estado de cada produto, dos entregáveis existentes e dos gates que ainda impedem um release comercial final.

## Estados usados

- **CONCEITO** — escopo ainda em definição.
- **EM DESENVOLVIMENTO** — conteúdo/arte/código em construção.
- **CANDIDATO** — material utilizável para QA e revisão, mas ainda não deve ser tratado como release final.
- **QA PENDENTE** — candidato funcional com validações humanas ou multiplataforma ainda abertas.
- **PRONTO PARA FREEZE** — conteúdo e QA concluídos, aguardando empacotamento final.
- **RELEASE** — pacote congelado, validado, versionado e acompanhado por manifesto/checksums.

## Matriz de produtos

| Produto | Estado atual | Entregáveis candidatos | Gates pendentes |
|---|---|---|---|
| Método JPN | CANDIDATO | método, documentação, materiais editoriais/comerciais | revisão editorial e validação final de PDF/arte |
| JPN Prompt Builder | QA PENDENTE | builder, documentação e materiais comerciais candidatos | QA físico, responsivo e acessível; revisão final de UX |
| JPN Prompt Pack | CANDIDATO | 18 templates, quick reference e material visual candidato | revisão editorial humana e validação final dos PDFs |
| JPN Business | CANDIDATO | 12 playbooks e materiais de apoio/comerciais | revisão editorial e QA final dos arquivos entregáveis |
| JPN Gestão Fácil | QA PENDENTE | planilha integrada + versões Vendas/Estoque/OS candidatas | GF-QA-10 multiplataforma; proteção/edição segura; revisão visual final |
| JPN Pro Kit | EM DESENVOLVIMENTO | arquitetura/bundle e materiais comerciais candidatos | fechar composição, versões incluídas, QA cruzado e empacotamento |
| Landing pages JPN | CANDIDATO | páginas estáticas candidatas e sistema visual associado | QA visual em navegador real, responsividade e revisão editorial |
| Brand & Commercial Kit | CANDIDATO | sistema visual, paleta, regras de uso e artes-base | revisão visual/editorial humana e aplicação consistente nos assets finais |

## Gates obrigatórios antes de qualquer RELEASE

1. **Conteúdo**
   - copy revisada;
   - nomenclatura consistente;
   - ausência de claims não comprovados;
   - limitações e estados de QA visíveis quando aplicável.

2. **Funcionalidade**
   - testes principais executados;
   - ausência de erros conhecidos bloqueadores;
   - arquivos abrem no software-alvo;
   - fórmulas/links/controles essenciais verificados.

3. **Compatibilidade**
   - desktop/mobile quando aplicável;
   - Excel/LibreOffice/Google Sheets para planilhas quando aplicável;
   - navegadores principais para páginas web.

4. **Acessibilidade e usabilidade**
   - contraste e legibilidade;
   - navegação por teclado quando aplicável;
   - labels, foco e mensagens de erro no Builder/páginas;
   - instruções claras para áreas editáveis em planilhas.

5. **Privacidade e segurança**
   - sem senhas, tokens ou dados financeiros reais;
   - sem dados pessoais desnecessários;
   - exemplos fictícios/sanitizados;
   - nenhuma integração paga/externa ativada sem autorização.

6. **Empacotamento**
   - versão definida;
   - nomes finais dos arquivos;
   - README de entrega;
   - manifesto do pacote;
   - checksums SHA-256;
   - changelog resumido;
   - freeze do conteúdo.

## Regra de comercialização

Materiais em estado **CANDIDATO**, **QA PENDENTE** ou **EM DESENVOLVIMENTO** podem ser usados para revisão interna e demonstrações controladas, mas não devem ser apresentados como release final, produto completamente validado ou solução com resultado garantido.

## Próxima sequência recomendada

1. concluir QA físico/acessível do Prompt Builder;
2. executar GF-QA-10 da Gestão Fácil;
3. revisar PDFs e artes candidatas;
4. concluir composição do Pro Kit;
5. revisar landing pages em navegador real;
6. promover produtos aprovados para **PRONTO PARA FREEZE**;
7. gerar manifesto/checksums e congelar release.

## Registro de atualização

- 2026-09-11 — criado tracker separado do roadmap técnico para consolidar estado de produto, gates e sequência de release.
