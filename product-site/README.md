# JPN Product Site

Camada comercial experimental do JPN Framework.

## Objetivo

Transformar o núcleo JPN em uma experiência demonstrável para público não técnico sem alterar o SDK principal.

## Base técnica

- Framework base: `0.3.0-draft`.
- A demo comercial acompanha o contrato proposto por `createJpnDraftFromText()` no PR de parser de entrada bruta.
- Enquanto o site permanecer um arquivo estático sem etapa de build, o comportamento browser-side é mantido explicitamente alinhado ao helper do SDK, mas não importa o módulo TypeScript diretamente.
- Quando houver bundle/browser build oficial do SDK, esta cópia de compatibilidade deve ser removida e substituída pelo import do SDK para existir uma única implementação.

## Arquivos

- `index.html`: landing page e shell da demonstração.
- `styles.css`: identidade visual responsiva.
- `app.js`: intake conservador, prontidão e compilação local para demonstração.

## Como testar

Abra `index.html` em um navegador. A demonstração não exige servidor, API ou chave de IA.

## O que a demo faz

1. Recebe uma ideia curta.
2. Preserva a entrada como contexto `confirmed` com origem `raw_input`.
3. Cria um rascunho JPN `0.3.0-draft` sem inventar contexto ausente.
4. Expõe `unresolvedFields` e `inferredFields` para revisão.
5. Calcula prontidão seguindo os pesos atuais do SDK.
6. Produz um prompt operacional.
7. Permite copiar, baixar o prompt e exportar o rascunho em JSON.

## O que a demo não faz

- Não é um modelo de IA.
- Não interpreta semanticamente com a profundidade de um LLM.
- Não transforma automaticamente lacunas em fatos.
- Não garante que o prompt resultante produza a melhor resposta possível.
- Não processa pagamento.
- Não envia dados para serviços externos.

## Regra de compatibilidade

A demo não deve criar um formato JPN paralelo. Mudanças incompatíveis em `JpnState`, `createJpnDraftFromText()` ou `assessJpnReadiness()` exigem atualização e teste desta camada antes de release comercial.

## Caminho para versão comercial

- criar build browser-safe do SDK e remover a implementação espelhada de `app.js`;
- adicionar editor completo do estado JPN após o intake rápido;
- incluir validação oficial do schema no navegador;
- conectar um intake inteligente opcional somente se houver decisão explícita sobre provedor/custo;
- adicionar autenticação e limites de uso somente quando houver estratégia de venda definida;
- conectar checkout externo após conta comercial e dados de recebimento serem aprovados pelo proprietário;
- medir conversão antes de decidir preço definitivo.

## Segurança do projeto

Esta camada permanece separada do núcleo do framework até revisão. Não alterar `src/`, `schemas/` ou contratos públicos a partir de necessidades comerciais sem uma decisão técnica explícita.
