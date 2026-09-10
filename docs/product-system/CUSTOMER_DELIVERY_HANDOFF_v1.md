# JPN — Guia de entrega e handoff ao cliente v1

**Estado:** candidato interno · QA editorial e de release pendentes

Este documento organiza como os produtos digitais JPN devem ser preparados para entrega quando cada item estiver realmente aprovado. Ele não representa publicação, disponibilidade comercial, checkout, aceite jurídico, promessa de resultado ou decisão de release.

## 1. Objetivo

Evitar que uma futura entrega ao cliente seja apenas um conjunto solto de arquivos. O handoff deve deixar claro:

1. o que foi entregue;
2. qual arquivo abrir primeiro;
3. o que cada componente faz;
4. o que ainda depende de validação;
5. quais limites permanecem válidos;
6. como preservar a rastreabilidade da versão recebida.

A regra geral é: **entregar somente o que tiver estado compatível com entrega e nunca converter uma pendência em aprovação por conveniência.**

## 2. Estados permitidos

| Estado | Significado operacional | Pode entrar em pacote final? |
|---|---|---:|
| `RASCUNHO` | conteúdo ainda em construção | não |
| `CANDIDATO` | material completo o suficiente para QA | não |
| `QA_PENDENTE` | precisa de validação humana, física, visual ou multiplataforma | não |
| `APROVADO_PARA_FREEZE` | passou pelos gates definidos para o item | ainda não; exige freeze |
| `FROZEN` | conteúdo congelado, versão definida e hash registrável | sim, se o pacote também estiver aprovado |
| `ENTREGAVEL` | item frozen incluído em pacote de entrega validado | sim |
| `BLOQUEADO` | existe impedimento conhecido | não |

Um arquivo não herda automaticamente o estado de outro. Um PDF candidato não se torna final porque a fonte Markdown foi revisada; um XLSX não se torna multiplataforma porque abriu em um único editor; uma aplicação web não se torna validada em celular por passar em checker estático.

## 3. Regra do menor pacote suficiente

A entrega deve conter somente os componentes necessários para o produto adquirido ou autorizado. O Pro Kit não deve ser usado como pacote padrão por conveniência.

- problema de formulação e estrutura: Método JPN;
- necessidade de templates reutilizáveis: JPN Prompt Pack;
- necessidade de playbooks operacionais: JPN Business;
- necessidade de construir e revisar prompts em interface: JPN Prompt Builder;
- necessidade de controles simples para pequena empresa: JPN Gestão Fácil;
- combinação real de múltiplas necessidades: JPN Pro Kit, somente quando estiver liberado.

## 4. Estrutura padrão do pacote

Quando um produto chegar a `ENTREGAVEL`, o pacote deve preferir esta estrutura:

```text
JPN_<PRODUTO>_<VERSAO>/
├── 00_COMECE_AQUI/
│   ├── README_ENTREGA.md
│   └── CHANGELOG_RESUMIDO.md
├── 01_PRODUTO/
├── 02_GUIAS/
├── 03_EXEMPLOS/
├── 04_REFERENCIAS/
└── 99_INTEGRIDADE/
    ├── MANIFEST.txt
    └── SHA256SUMS.txt
```

Pastas sem conteúdo útil não devem ser criadas apenas para cumprir aparência de estrutura.

## 5. Arquivo `README_ENTREGA.md`

Cada pacote final deve conter um arquivo de entrada com, no mínimo:

- nome canônico do produto;
- versão da entrega;
- data do freeze;
- instrução clara de qual arquivo abrir primeiro;
- inventário dos componentes entregues;
- requisitos técnicos realmente confirmados;
- limites conhecidos;
- indicação de onde consultar documentação complementar;
- aviso de que exemplos não substituem revisão contextual;
- referência ao manifesto e aos checksums.

Não incluir preço, dados de pagamento, links de checkout, credenciais ou informação financeira real nesse arquivo.

## 6. Handoff por produto

### 6.1 Método JPN

**Entrada recomendada:** referência rápida ou guia inicial do Método.

O pacote pode reunir, após aprovação:

- material canônico do Método JPN;
- referência rápida;
- workbook prático;
- exercícios e exemplos fictícios aprovados;
- versão PDF somente após revisão editorial e visual correspondente.

O handoff deve explicar que Jornada, Precisão e Narrativa são estrutura de trabalho, não garantia de eficácia universal.

### 6.2 JPN Prompt Pack

**Entrada recomendada:** índice dos prompts ou guia de seleção.

O pacote deve preservar os **18 templates canônicos**. Nenhuma entrega pode declarar quantidade diferente sem mudança explícita da fonte canônica.

Pode reunir, após aprovação:

- índice dos 18 templates;
- templates em formato editável;
- workbook de seleção e adaptação;
- exemplos fictícios aprovados;
- material de orientação para estados `confirmed`, `inferred`, `unknown` e `conflicting`.

A entrega deve deixar explícito que template é ponto de partida, não autorização para preencher lacunas com fatos inventados.

### 6.3 JPN Business

**Entrada recomendada:** índice dos playbooks ou guia de uso.

O pacote deve preservar os **12 playbooks canônicos**.

Pode reunir, após aprovação:

- os 12 playbooks;
- índice e mapa de navegação;
- candidato impresso/PDF somente depois do QA editorial e de renderização;
- exemplos fictícios e instruções de adaptação.

Playbooks não autorizam publicação, contratação, compra, envio externo ou decisão financeira sem a revisão adequada.

### 6.4 JPN Prompt Builder

**Entrada recomendada:** `PROMPT_BUILDER_QUICK_START_v1.md` ou equivalente aprovado.

Pode reunir, após aprovação:

- aplicação offline ou bundle aprovado;
- início rápido;
- documentação de presets;
- documentação de workspaces e recovery;
- notas de compatibilidade realmente verificadas;
- changelog da versão entregue.

**Estado atual que deve ser preservado:** QA físico contextual em dispositivo móvel real continua pendente. Checker estático, staging ou build não substituem esse teste físico.

Enquanto essa pendência existir, o pacote não deve alegar validação móvel final.

### 6.5 JPN Gestão Fácil

**Entrada recomendada:** guia de início rápido ou dicionário operacional.

Pode reunir, após aprovação:

- XLSX validado;
- guia de início rápido;
- dicionário operacional;
- Starter Data Kit com CSVs fictícios;
- instruções de preenchimento e limites.

**Estado atual que deve ser preservado:** `GF-QA-10` continua pendente. Não existe comprovação final de comportamento equivalente entre Microsoft Excel, LibreOffice Calc e Google Sheets.

`REPOR` continua sendo **alerta operacional**, nunca autorização automática de compra.

Dados financeiros reais não devem fazer parte de exemplos, pacotes de demonstração ou testes automatizados.

### 6.6 JPN Pro Kit

**Entrada recomendada:** mapa de entrega e guia de uso/composição.

O Pro Kit deve funcionar como orquestração dos produtos que realmente façam sentido para a necessidade do usuário, e não como duplicação integral do repositório.

**Estado atual que deve ser preservado:** `EM PREPARAÇÃO`.

Enquanto esse estado não mudar por processo explícito de release, não apresentar o Pro Kit como pacote final, disponível ou pronto para entrega.

## 7. Materiais comerciais e identidade visual

Materiais comerciais, one-pagers, FAQ, biblioteca de objeções, conteúdos sociais, artes e templates visuais são fontes auxiliares. Eles não devem ser colocados automaticamente no pacote do cliente.

Antes de qualquer uso externo, precisam do estado adequado de revisão comercial, editorial e visual. Os templates sociais permanecem fontes editáveis; publicação, impulsionamento e calendário de campanha exigem autorização específica fora deste fluxo.

## 8. Manifesto do pacote

`MANIFEST.txt` deve listar somente arquivos presentes no pacote, um por linha, com caminho relativo estável.

Exemplo fictício:

```text
00_COMECE_AQUI/README_ENTREGA.md
01_PRODUTO/arquivo-principal.ext
02_GUIAS/guia-inicial.pdf
99_INTEGRIDADE/SHA256SUMS.txt
```

O manifesto não deve listar arquivos planejados, pendentes ou ausentes.

## 9. Checksums

`SHA256SUMS.txt` deve ser gerado somente sobre arquivos efetivamente congelados no pacote final.

Regras:

- não registrar hash como “final” antes do freeze;
- qualquer alteração de byte invalida o checksum anterior;
- arquivos regenerados exigem novos hashes;
- o hash comprova integridade do arquivo, não qualidade, aprovação editorial ou eficácia do conteúdo.

## 10. Changelog resumido

`CHANGELOG_RESUMIDO.md` deve ser legível por quem recebe o produto e conter apenas mudanças relevantes desde a versão anterior, quando houver.

Estrutura sugerida:

```markdown
# Alterações da versão

## Adicionado
- ...

## Ajustado
- ...

## Limites conhecidos
- ...
```

Não usar o changelog para esconder pendências ou transformar correções planejadas em funcionalidades concluídas.

## 11. Checklist de pré-handoff

Antes de promover um pacote para `ENTREGAVEL`, confirmar:

- [ ] nome e versão coerentes com fontes canônicas;
- [ ] nenhum item `RASCUNHO`, `CANDIDATO`, `QA_PENDENTE` ou `BLOQUEADO` incluído como final;
- [ ] README de entrega aponta corretamente o primeiro arquivo;
- [ ] inventário corresponde aos arquivos presentes;
- [ ] exemplos usam apenas dados fictícios;
- [ ] nenhuma credencial, token ou segredo está presente;
- [ ] nenhum dado financeiro real está presente;
- [ ] nenhuma condição comercial foi inventada;
- [ ] nenhum aceite legal está embutido ou presumido;
- [ ] nenhum link de checkout foi adicionado por conveniência;
- [ ] claims de compatibilidade refletem testes realmente concluídos;
- [ ] claims de dispositivo refletem QA físico realmente concluído;
- [ ] manifesto foi gerado após freeze;
- [ ] checksums foram gerados após freeze;
- [ ] revisão humana exigida para o tipo de artefato foi registrada;
- [ ] decisão de release foi explícita e rastreável.

## 12. Checklist pós-entrega

Sem executar qualquer ação externa automática, registrar internamente:

- versão efetivamente entregue;
- composição do pacote;
- hash do manifesto, quando aplicável;
- limitações informadas no handoff;
- referência do changelog;
- eventuais pendências que ficaram fora do pacote.

Esse registro não deve conter senha, token, número de cartão, informação bancária ou documento de identidade.

## 13. Critérios de parada

Interromper o fluxo automático e exigir autorização apropriada se o próximo passo envolver:

- publicar ou enviar material externamente;
- criar anúncio ou impulsionar conteúdo;
- gastar dinheiro;
- criar checkout ou definir condição comercial real;
- usar dados financeiros reais;
- inserir, mover ou expor credenciais;
- aceitar termos legais;
- criar conta que exija verificação de identidade;
- declarar release final sem evidência dos gates correspondentes.

## 14. Pendências conhecidas do ecossistema

Este guia não remove as pendências atuais. Em particular:

- QA físico contextual do JPN Prompt Builder em celular permanece pendente;
- `GF-QA-10` da Gestão Fácil permanece pendente;
- `REPOR` permanece somente alerta;
- JPN Pro Kit permanece `EM PREPARAÇÃO`;
- revisão visual/editorial humana ainda é necessária para artefatos que dependem dela;
- PDFs candidatos não devem ser tratados como finais sem validação correspondente;
- freeze e checksums finais devem ocorrer apenas depois das aprovações necessárias;
- CI deve ser verificado no head definitivo antes de qualquer declaração de release técnico.

## 15. Resultado esperado

Quando o processo de release estiver pronto, este guia deve permitir transformar um conjunto aprovado de fontes em uma entrega compreensível, mínima, rastreável e verificável, sem antecipar estados, inventar disponibilidade ou substituir validação humana por automação.