# JPN Prompt Builder — QA Mobile v1

Estado: candidato de teste interno. Não é bundle final de release, não autoriza publicação e não substitui o SDK/browser bundle canônico.

## Objetivo

Permitir inspeção prática em celular usando `product-site/mobile-test.html`, uma fixture autocontida sem API, conta, servidor, tracking, checkout ou dependência de rede durante a execução do arquivo.

## Escopo

A fixture cobre os sete presets guiados atuais do Prompt Builder e testa a experiência móvel de preenchimento, geração de estrutura JPN, prontidão indicativa, cópia, armazenamento local, recuperação e limpeza do rascunho.

## Casos de teste

| ID | Teste | Evidência esperada | Estado inicial |
|---|---|---|---|
| PB-MOB-01 | Abrir em tela de celular | Página legível, sem rolagem horizontal | PENDENTE-HUMANO |
| PB-MOB-02 | Carregar `Atendimento e vendas` | Ideia, tipo e restrições preenchidos | PENDENTE-HUMANO |
| PB-MOB-03 | Gerar rascunho | Saída contém J, P e N e prontidão > 0 | PENDENTE-HUMANO |
| PB-MOB-04 | Copiar prompt | Conteúdo chega à área de transferência | PENDENTE-HUMANO |
| PB-MOB-05 | Salvar rascunho | Estado confirma armazenamento local | PENDENTE-HUMANO |
| PB-MOB-06 | Fechar e reabrir | Rascunho salvo é restaurado | PENDENTE-HUMANO |
| PB-MOB-07 | Limpar teste | Campos e armazenamento local são limpos após confirmação | PENDENTE-HUMANO |
| PB-MOB-08 | Testar os sete presets | Todos carregam sem erro visual ou funcional | PENDENTE-HUMANO |
| PB-MOB-09 | Testar orientação retrato/paisagem | Controles permanecem utilizáveis | PENDENTE-HUMANO |
| PB-MOB-10 | Testar zoom e teclado virtual | Inputs continuam acessíveis, sem sobreposição crítica | PENDENTE-HUMANO |

## Critério de aprovação

O gate estrutural `scripts/check-prompt-builder-mobile-test.mjs` pode comprovar somente sincronização básica dos sete presets, presença de viewport/noindex, armazenamento local, breakpoint móvel e ausência de padrões explícitos de rede/API. Ele não comprova ergonomia, clipboard real, teclado virtual, comportamento do navegador, orientação de tela nem qualidade visual percebida.

PB-MOB-01..10 só podem mudar para PASS com teste real no dispositivo/navegador correspondente. Isso também significa que esta fixture não promove automaticamente o gate formal de QA em navegador/dispositivo do Prompt Builder.

## Guardrails

- nenhum preço, checkout ou CTA de compra;
- nenhuma chamada de rede ou API de IA;
- nenhum envio de dados do usuário;
- `noindex,nofollow` explícito;
- dados de teste armazenados apenas no navegador local;
- nenhuma garantia de resultado;
- nenhuma autorização de venda ou publicação.
