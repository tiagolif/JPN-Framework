# JPN Pro Kit v1 — Checklist de Release

## Núcleo técnico

- [ ] cadeia browser/parser/paridade consolidada;
- [ ] Prompt Builder sem implementação JPN paralela;
- [ ] CI verde no commit que será congelado;
- [ ] versão suportada explícita;
- [ ] export JSON validado;
- [ ] fluxo-base sem dependência de serviço pago.

## Conteúdo

- [ ] Método JPN revisado ortograficamente;
- [ ] Prompt Pack revisado ortograficamente;
- [ ] JPN Business revisado ortograficamente;
- [x] revisão estrutural cruzada Método + Prompt Pack + Business criada;
- [x] índices Prompt Pack e Business estruturados;
- [x] vínculos Business → Prompt Pack protegidos por checagem;
- [ ] exemplos finais revisados e claramente fictícios quando aplicável;
- [ ] nenhuma funcionalidade futura descrita como disponível hoje.

## JPN Gestão Fácil

- [x] XLSX reconstruído v0.1 versionado em `deliverables/gestao-facil/`;
- [x] fonte editorial do manual versionada;
- [x] fórmulas principais e referências verificadas em GF-QA-01 a GF-QA-09;
- [x] exemplos de QA usam somente dados fictícios/neutros;
- [x] evidência de QA funcional registrada em `QA_EXECUTION_v0.1.md`;
- [ ] GF-QA-10 executado no mesmo binário em Microsoft Excel, LibreOffice Calc e Google Sheets;
- [ ] inspeção visual final em suíte de planilha desktop;
- [ ] PDF final do manual gerado e inspecionado;
- [ ] release notes específicas congeladas junto ao binário final.

## Identidade e diagramação

- [x] brand kit mestre consolidado;
- [x] capas e fontes sociais vetoriais criadas para a família JPN;
- [x] gate estrutural de QA visual integrado ao build;
- [ ] hierarquia visual comum aplicada aos documentos finais;
- [ ] SVGs renderizados e inspecionados para clipping, contraste e leitura reduzida;
- [ ] PDFs finais inspecionados página a página;
- [ ] nenhuma arte de anúncio publicada durante o fechamento interno.

## Pacote

- [x] `LEIA_PRIMEIRO` criado;
- [x] mapa de entrega criado;
- [x] template de manifesto definido;
- [x] release notes internas criadas;
- [x] manifesto aponta para o XLSX real da Gestão Fácil, sem hash final prematuro;
- [ ] pasta final construída somente com artefatos aprovados;
- [ ] hashes SHA-256 calculados depois do congelamento;
- [ ] ZIP final testado;
- [ ] inventário do ZIP corresponde ao manifesto;
- [ ] ausência de drafts/placeholders acidentais confirmada.

## Copy e prova

- [ ] claims revisados contra resultados de evals;
- [x] garantias absolutas e claims quantitativos sem evidência permanecem bloqueados;
- [ ] FAQ final alinhado às funcionalidades realmente entregues;
- [ ] descrição final da oferta aprovada antes de uso externo.

## Bloqueios que exigem autorização explícita

- [ ] definir preço real;
- [ ] configurar/cobrar checkout;
- [ ] publicar página ou produto;
- [ ] publicar anúncio ou campanha;
- [ ] aceitar termos de plataforma em nome do proprietário;
- [ ] contratar serviço pago;
- [ ] usar dados financeiros;
- [ ] criar conta com verificação de identidade.

Nenhum item desta última seção deve ser executado automaticamente para completar o checklist.
