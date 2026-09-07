# JPN Prompt Builder — Projetos locais v1

## Objetivo

Permitir que uma pessoa interrompa e retome trabalhos no Prompt Builder sem depender de conta, banco de dados, nuvem ou serviço externo.

## O que um projeto guarda

Cada projeto local é um snapshot editável com:

- nome;
- ideia atual;
- tipo de resultado;
- restrições;
- prompt compilado presente no momento do salvamento;
- rascunho JPN atual, quando existir;
- score de prontidão disponível;
- datas de criação e atualização.

Projetos são diferentes de presets. Presets são pontos de partida reutilizáveis. Projetos representam um trabalho específico em andamento.

## Persistência e privacidade

A persistência usa somente `localStorage`, na chave versionada `jpn.prompt-builder.workspaces.v1`.

O Builder não envia esses dados automaticamente para servidor, não sincroniza entre dispositivos e não cria conta. Se a pessoa limpar os dados do navegador, os projetos podem ser perdidos. Para portabilidade, deve usar exportação manual.

## Exportação e importação

A exportação gera `jpn-projetos-locais.json` com envelope versionado:

```json
{
  "format": "jpn-prompt-builder-workspaces",
  "version": 1,
  "exportedAt": "...",
  "workspaces": []
}
```

A importação aceita apenas o formato e a versão reconhecidos. O conteúdo importado é tratado como snapshot de dados; nenhum prompt, código ou instrução do arquivo é executado automaticamente.

## Limites defensivos

- máximo de 30 projetos locais;
- nome: até 120 caracteres;
- ideia: até 8.000 caracteres;
- restrições: até 4.000 caracteres;
- prompt armazenado: até 30.000 caracteres;
- score normalizado para 0–100;
- projetos sem nome ou ideia são descartados.

Esses limites evitam que o recurso vire um armazenamento arbitrário e reduzem risco de degradação do navegador.

## Fluxo recomendado

1. carregar um preset ou iniciar do zero;
2. preencher e gerar o rascunho JPN;
3. revisar lacunas e prontidão;
4. dar um nome ao trabalho;
5. salvar um snapshot local;
6. ao retomar, carregar o projeto e revisar seu conteúdo;
7. gerar novamente após alterações para recalcular o estado;
8. exportar backups quando o trabalho for importante ou precisar mudar de dispositivo.

## Guardrails

Salvar não significa validar a qualidade do conteúdo. Carregar um projeto antigo não garante que seu rascunho continua adequado ao contexto atual. O usuário deve revisar dados e gerar novamente após mudanças relevantes.

O recurso não altera o estado comercial do JPN Pro Kit e não implica publicação, sincronização ou hospedagem do produto.
