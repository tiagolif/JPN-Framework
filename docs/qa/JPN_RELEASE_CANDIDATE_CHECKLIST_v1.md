# JPN — Checklist de Candidato a Release v1

Status: **INTERNO / NÃO AUTORIZA PUBLICAÇÃO**

Este checklist consolida os gates finais do ecossistema JPN. Ele não substitui evidência física, revisão humana nem autorização explícita de publicação.

## Regra de promoção

Um artefato só pode avançar de `DRAFT` para `RELEASE_CANDIDATE` quando todos os gates aplicáveis abaixo estiverem `PASS`. Nenhum item `PENDING_PHYSICAL`, `PENDING_HUMAN` ou `FAIL` pode ser interpretado como aprovado.

`RELEASE_CANDIDATE` também não significa `PUBLISHED`, `FOR_SALE` ou autorização para anúncio, checkout, gasto ou criação de conta.

## RC-01 — Método JPN

- [ ] conteúdo final revisado editorialmente (`PENDING_HUMAN`)
- [ ] PDF inspecionado página a página (`PENDING_HUMAN`)
- [ ] links e referências internas válidos
- [ ] identidade visual consistente
- [ ] linguagem não promete superioridade universal ou validação científica inexistente
- [ ] arquivo final congelado e hash registrado

## RC-02 — JPN Prompt Pack

- [ ] templates e estruturas conferidos
- [ ] exemplos usam somente dados fictícios
- [ ] PDF/entregáveis inspecionados visualmente (`PENDING_HUMAN`)
- [ ] navegação entre Método → Prompt Pack → Prompt Builder coerente
- [ ] arquivo final congelado e hash registrado

## RC-03 — JPN Prompt Builder

- [ ] gates automatizados do Builder em `PASS`
- [ ] fluxo principal testado fisicamente em celular (`PENDING_PHYSICAL`)
- [ ] teclado/touch/viewport testados em aparelho real (`PENDING_PHYSICAL`)
- [ ] copiar/exportar testado em aparelho real (`PENDING_PHYSICAL`)
- [ ] Modo Temporário testado em aparelho real (`PENDING_PHYSICAL`)
- [ ] proteção/aviso de dados sensíveis testado apenas com dados fictícios (`PENDING_PHYSICAL`)
- [ ] recuperação após fechar/reabrir validada (`PENDING_PHYSICAL`)
- [ ] acessibilidade contextual revisada
- [ ] bundle final congelado e hash registrado

## RC-04 — JPN Business

- [ ] playbooks e exemplos conferidos
- [ ] diagramação final concluída (`PENDING_HUMAN`)
- [ ] PDF inspecionado página a página (`PENDING_HUMAN`)
- [ ] claims comerciais compatíveis com as evidências existentes
- [ ] arquivo final congelado e hash registrado

## RC-05 — JPN Gestão Fácil

- [ ] build reproduzível v0.3 em `PASS`
- [ ] mesmo XLSX testado no Microsoft Excel (`PENDING_PHYSICAL`)
- [ ] mesmo XLSX testado no LibreOffice Calc (`PENDING_PHYSICAL`)
- [ ] mesmo XLSX testado no Google Sheets (`PENDING_PHYSICAL`)
- [ ] GF-QA-10 concluído (`PENDING_PHYSICAL`)
- [ ] GF3-QA-11..18 concluídos (`PENDING_PHYSICAL`)
- [ ] fórmulas, validações, filtros e dashboards conferidos
- [ ] financeiro permanece gerencial e sem dados financeiros reais
- [ ] `REPOR` permanece apenas alerta operacional
- [ ] workbook final congelado e hash registrado

## RC-06 — JPN Pro Kit

- [ ] composição do pacote conferida
- [ ] onboarding e documentação revisados
- [ ] dependências entre produtos verificadas
- [ ] PDF/entregáveis inspecionados (`PENDING_HUMAN`)
- [ ] pacote final congelado e manifesto/hash registrados

## RC-07 — Comercial e identidade

- [ ] catálogo, apresentação, folha comercial, FAQ e diagnóstico coerentes
- [ ] copies sem garantia de resultado
- [ ] artes e identidade inspecionadas visualmente (`PENDING_HUMAN`)
- [ ] nenhum CTA implica checkout/publicação já ativa
- [ ] nenhuma peça contém dado real de cliente ou financeiro

## RC-08 — Entrega

- [ ] estrutura de arquivos final definida
- [ ] nomes e versões consistentes
- [ ] README/guia de início incluído
- [ ] manifesto de arquivos gerado
- [ ] hashes finais gerados após freeze
- [ ] pacote abre sem dependência de credenciais privadas

## RC-09 — Autorização externa

Os itens abaixo **não podem ser executados automaticamente por este checklist**:

- publicação pública;
- anúncio pago ou orgânico em nome do proprietário;
- habilitação de checkout/venda;
- gasto;
- criação de conta com verificação de identidade;
- aceite de termos legais;
- inserção de dados financeiros reais.

Eles exigem decisão/autorização separada do proprietário.

## Estado atual esperado

Enquanto os testes físicos e revisões humanas listados acima não forem concluídos, o ecossistema permanece em preparação e seus artefatos não devem ser promovidos silenciosamente para release final.
