# Composição editorial candidata JPN v1

Este fluxo transforma as fontes editoriais canônicas de **Método JPN**, **JPN Prompt Pack** e **JPN Business** em candidatos compostos de revisão, sem criar release final.

## Objetivo

Reduzir trabalho manual de montagem e garantir que a revisão humana aconteça sobre um documento composto determinístico, preservando proveniência e hashes das fontes.

## Comando

```bash
node scripts/build-editorial-candidates.mjs
```

A execução grava os resultados em `dist/editorial-candidates/`, diretório já excluído do versionamento.

## Saídas candidatas

- `Metodo_JPN_CANDIDATO.md`
- `JPN_Prompt_Pack_CANDIDATO.md`
- `JPN_Business_CANDIDATO.md`
- `EDITORIAL_CANDIDATES_MANIFEST.json`

O manifesto registra as fontes, SHA-256 de cada fonte, SHA-256 do candidato composto e `release_ready: false`.

## O que a montagem faz

1. lê `EDITORIAL_COMPOSITION_CANDIDATES_v1.json`;
2. usa exatamente as `primary_sources` já declaradas no preflight editorial;
3. calcula SHA-256 das fontes sem alterá-las;
4. concatena os materiais na ordem canônica;
5. insere marcadores `BEGIN SOURCE` / `END SOURCE` para facilitar auditoria;
6. adiciona avisos explícitos de candidato interno;
7. produz manifesto técnico da execução.

## O que a montagem não faz

- não revisa texto em nome de uma pessoa;
- não marca revisão editorial como aprovada;
- não executa QA visual;
- não gera `Metodo_JPN.pdf`, `JPN_Prompt_Pack.pdf` ou `JPN_Business.pdf`;
- não marca revisão página a página como concluída;
- não publica, vende ou distribui os candidatos.

## Fluxo recomendado

`fontes canônicas → candidato composto → revisão editorial humana → candidato diagramado → QA visual → PDF candidato → revisão página a página → decisão de release`

A composição automatizada termina no segundo estágio. Todos os demais gates continuam dependendo das evidências já definidas no contrato de release.

## Segurança e privacidade

As fontes não devem conter credenciais, dados financeiros reais, dados pessoais de clientes ou informações sensíveis. A composição não adiciona rede, tracking, envio externo ou persistência fora do diretório local de build.
