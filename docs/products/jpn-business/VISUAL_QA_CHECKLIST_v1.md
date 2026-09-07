# JPN Business — Checklist de QA Visual v1

Use este checklist somente sobre um arquivo candidato completo. Marcar um item como aprovado exige inspeção real; este documento sozinho não constitui evidência de aprovação.

## Estrutura

- [ ] Capa correta e sem elementos provisórios.
- [ ] Sumário corresponde às seções e páginas.
- [ ] Aberturas de seção seguem hierarquia consistente.
- [ ] JB-01 a JB-12 aparecem uma única vez na sequência planejada.
- [ ] Referências PP-* conferidas contra o Prompt Pack.
- [ ] Página final contém limites de uso e revisão humana.

## Legibilidade

- [ ] Corpo de texto legível em 100% de zoom.
- [ ] Contraste suficiente entre texto e fundo.
- [ ] Não há linhas órfãs/viúvas visualmente problemáticas.
- [ ] Não há texto cortado, sobreposto ou fora da área útil.
- [ ] Tabelas, caixas e listas não ultrapassam margens.
- [ ] URLs, IDs e códigos permanecem íntegros.

## Consistência visual

- [ ] Tipografia e tamanhos seguem uma hierarquia estável.
- [ ] Cabeçalhos, rodapés e numeração são consistentes.
- [ ] Caixas de Atenção, Exemplo, Checklist e Conexão JPN mantêm o mesmo padrão.
- [ ] Espaçamentos entre blocos equivalentes são consistentes.
- [ ] Cores e elementos gráficos seguem a identidade JPN versionada.
- [ ] Não há elementos decorativos sem função que prejudiquem leitura.

## Conteúdo e guardrails

- [ ] Nenhum exemplo é apresentado como resultado garantido.
- [ ] Não há promessa de ROI, vendas, precisão absoluta ou eliminação de alucinações.
- [ ] Revisão humana é preservada onde necessária.
- [ ] Números ilustrativos estão identificados como exemplos quando aplicável.
- [ ] Não há dados financeiros reais, dados pessoais, credenciais ou segredos.

## Exportação

- [ ] PDF abre sem erro.
- [ ] Fontes aparecem corretamente incorporadas/substituídas.
- [ ] Links clicáveis relevantes funcionam quando presentes.
- [ ] Páginas não apresentam rasterização ilegível.
- [ ] Tamanho final é adequado para entrega digital.
- [ ] O mesmo PDF candidato foi usado na inspeção registrada.

## Registro de evidência

Ao concluir uma revisão real, registrar:

- hash ou identificador do arquivo candidato;
- data da inspeção;
- páginas revisadas;
- problemas encontrados;
- correções realizadas;
- responsável pela revisão;
- resultado final: aprovado, reprovado ou requer nova rodada.

A dependência `pdf-final` não deve ser marcada como `passed` apenas porque o arquivo foi exportado. Ela exige inspeção efetiva do PDF candidato.