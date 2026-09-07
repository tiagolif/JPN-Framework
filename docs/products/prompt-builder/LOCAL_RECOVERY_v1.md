# JPN Prompt Builder — recuperação local v1

## Objetivo

Reduzir perda acidental de trabalho entre salvamentos explícitos de projeto sem introduzir conta, servidor, nuvem, telemetria ou sincronização.

## Escopo

O Builder mantém um único rascunho de recuperação no `localStorage` do navegador. O snapshot pode incluir:

- projeto ativo;
- nome do projeto;
- ideia;
- tipo de resultado;
- restrições;
- prompt atualmente exibido;
- score de prontidão disponível.

A recuperação é complementar aos projetos locais. **Projeto salvo** é um snapshot deliberado e gerenciável; **rascunho de recuperação** é uma proteção best-effort contra fechamento ou recarga antes do próximo salvamento.

## Comportamento

1. alterações nos campos principais agendam um salvamento local com pequeno debounce;
2. geração e salvamento/atualização de projeto também atualizam a proteção;
3. ao reabrir a página, um snapshot compatível é restaurado para revisão;
4. o usuário pode limpar apenas a recuperação automática sem apagar projetos ou presets;
5. no fechamento da página, o Builder tenta persistir o estado atual uma última vez.

## Privacidade

- chave local: `jpn.prompt-builder.recovery.v1`;
- nenhum conteúdo é enviado automaticamente a servidor;
- não há login, telemetria ou sincronização;
- limpar dados do navegador pode remover o rascunho;
- exportar projetos continua sendo a opção adequada para backup manual durável.

## Guardrails

- formato versionado: `jpn-prompt-builder-recovery` v1;
- formatos desconhecidos são ignorados;
- texto é truncado defensivamente antes da persistência;
- score é normalizado para 0–100;
- restauração não executa IA nem trata o conteúdo recuperado como validado;
- a interface recomenda revisar e gerar novamente antes de usar o prompt restaurado.

## Validação automatizada

`npm run check:prompt-builder-recovery`

O gate cobre normalização, persistência simulada, leitura, limpeza, rejeição de formato incompatível e limites de tamanho.

## Fora de escopo

- sincronização entre dispositivos;
- histórico de múltiplos rascunhos automáticos;
- criptografia própria do armazenamento;
- recuperação após limpeza manual dos dados do navegador;
- publicação ou hospedagem do Builder.
