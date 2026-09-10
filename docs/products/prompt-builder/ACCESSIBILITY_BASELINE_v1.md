# JPN Prompt Builder — Accessibility Baseline v1

Estado: **candidato interno · QA assistiva física pendente**

Este documento registra requisitos de acessibilidade que podem ser verificados no código sem afirmar compatibilidade assistiva completa. Ele não substitui testes reais com teclado, leitor de tela, zoom, navegador móvel ou tecnologias assistivas.

## Escopo

A baseline cobre a superfície principal em `product-site/index.html` e `product-site/styles.css`.

## Requisitos implementados

### PB-A11Y-01 — idioma da página
O documento deve declarar `lang="pt-BR"`.

### PB-A11Y-02 — salto para conteúdo
Deve existir um link de “Pular para o conteúdo principal” visível quando recebe foco, apontando para o `<main>`.

### PB-A11Y-03 — landmarks e nomes
A navegação principal deve usar `<nav>` com nome acessível. Seções principais devem possuir associação com títulos por `aria-labelledby` quando isso aumentar a clareza estrutural.

### PB-A11Y-04 — labels de formulário
Controles editáveis visíveis devem possuir `<label for="...">` correspondente. Ajuda complementar deve usar `aria-describedby` quando estiver diretamente ligada ao campo.

### PB-A11Y-05 — atualizações dinâmicas
Status de prontidão, lacunas e recuperação local devem usar regiões apropriadas com `aria-live="polite"` e, quando necessário, `role="status"` e `aria-atomic="true"`.

### PB-A11Y-06 — resultado navegável
O prompt gerado deve possuir nome acessível e poder receber foco de teclado para leitura/navegação sem exigir clique do mouse.

### PB-A11Y-07 — foco visível
Links, botões, campos, selects, textareas, summaries e áreas focáveis devem manter indicação visual clara via `:focus-visible`.

### PB-A11Y-08 — alvo mínimo
Controles interativos principais usam altura mínima de 44 px como baseline de toque. Isso não prova ergonomia em todos os aparelhos.

### PB-A11Y-09 — movimento reduzido
A interface deve respeitar `prefers-reduced-motion: reduce`, removendo rolagem suave e animações/transições não essenciais quando a preferência estiver ativa.

### PB-A11Y-10 — botões sem submit implícito
Botões de ação da demo devem declarar `type="button"` para evitar comportamento de envio implícito caso a composição HTML mude futuramente.

## Gate automatizado

`scripts/check-prompt-builder-accessibility.mjs` verifica marcadores estruturais da baseline e é encadeado pelo gate já existente `check:product-site`.

Esse gate é estático. Ele detecta regressões óbvias, mas **não comprova WCAG, compatibilidade com leitor de tela ou experiência real de teclado**.

## QA físico ainda pendente

Os seguintes itens exigem teste humano/assistivo antes de qualquer claim de acessibilidade:

- navegação completa somente por teclado, inclusive ordem de foco;
- uso com leitor de tela em ao menos uma combinação real de navegador + tecnologia assistiva;
- zoom de 200% e reflow sem perda funcional;
- contraste percebido em estados dinâmicos e foco;
- anúncio de mudanças de prontidão/lacunas sem excesso de repetição;
- importação de arquivos usando teclado e tecnologia assistiva;
- comportamento em celular real, preservando o QA contextual móvel já pendente;
- validação de linguagem clara e entendimento por usuários reais.

## Critério de parada

Não marcar esta baseline como “aprovada”, “WCAG compliant”, “acessível” ou equivalente apenas porque o checker está verde. Qualquer afirmação desse tipo depende de evidência humana correspondente no registro de release.

## Guardrails preservados

Nenhum gasto, publicação, conta, credencial, dado financeiro real, aceite legal ou teste externo foi realizado para criar esta baseline. O JPN Pro Kit permanece em preparação; `GF-QA-10` e o QA físico contextual do Prompt Builder continuam pendentes.
