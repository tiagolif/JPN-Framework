# JPN Product Site

Camada comercial experimental do JPN Framework.

## Objetivo

Transformar o núcleo JPN em uma experiência demonstrável para público não técnico sem alterar o SDK principal.

## Arquivos

- `index.html`: landing page e shell da demonstração.
- `styles.css`: identidade visual responsiva.
- `app.js`: gerador determinístico local para demonstrar Jornada, Precisão e Narrativa.

## Como testar

Abra `index.html` em um navegador. A demonstração não exige servidor, API ou chave de IA.

## O que a demo faz

1. Recebe uma ideia curta.
2. Estrutura Jornada, Precisão e Narrativa com heurísticas locais.
3. Produz um prompt operacional.
4. Calcula uma prontidão heurística de 0 a 95%.
5. Permite copiar ou baixar o prompt.

## O que a demo não faz

- Não é um modelo de IA.
- Não interpreta semântica com a profundidade de um LLM.
- Não garante que o prompt resultante produza a melhor resposta possível.
- Não processa pagamento.
- Não envia dados para serviços externos.

## Caminho para versão comercial

- Conectar um intake inteligente opcional usando provedor de IA.
- Adicionar autenticação e limites de uso somente quando houver estratégia de venda definida.
- Conectar checkout externo após conta comercial e dados de recebimento serem aprovados pelo proprietário.
- Medir conversão antes de decidir preço definitivo.

## Segurança do projeto

Esta camada deve permanecer separada do núcleo do framework até revisão. Não modificar `src/`, `schemas/` ou testes do SDK a partir da landing comercial sem uma decisão técnica explícita.
