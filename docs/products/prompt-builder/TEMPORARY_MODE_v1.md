# JPN Prompt Builder — Modo Temporário v1

**Estado:** candidato interno · QA físico e assistivo pendente.

O Modo Temporário reduz a persistência local involuntária durante uma sessão do JPN Prompt Builder. Ele é complementar ao aviso de dados potencialmente sensíveis e não representa DLP, criptografia, anonimização, conformidade regulatória ou garantia de privacidade absoluta.

## Objetivo

Quando o usuário ativa o Modo Temporário:

- o rascunho de recuperação automática atual é removido por melhor esforço;
- novos snapshots de recuperação automática deixam de ser gravados enquanto o modo estiver ativo;
- os botões que criam ou atualizam projetos e presets locais ficam desabilitados;
- timers de recuperação pendentes são cancelados;
- o evento `pagehide` não grava uma nova recuperação;
- o estado do próprio modo não é persistido entre sessões.

Cópia e exportações permanecem ações explícitas do usuário. O modo não impede que o usuário copie texto para a área de transferência ou faça download/exportação quando escolher essas ações conscientemente.

## Regras PB-TMP-01..PB-TMP-08

- **PB-TMP-01 — opt-in explícito:** o modo começa desligado e só é ativado pelo usuário na sessão atual.
- **PB-TMP-02 — sem persistência do modo:** a preferência não é salva em `localStorage`, `sessionStorage`, cookie ou servidor.
- **PB-TMP-03 — limpeza ao ativar:** a recuperação automática existente é removida por melhor esforço quando o modo é ligado.
- **PB-TMP-04 — recuperação suspensa:** nenhuma nova chamada de salvamento automático deve ocorrer enquanto o modo estiver ativo.
- **PB-TMP-05 — pagehide seguro:** fechar/navegar para fora da página não deve criar snapshot de recuperação com o modo ativo.
- **PB-TMP-06 — ações locais bloqueadas:** salvar, atualizar, duplicar projeto e salvar preset ficam desabilitados durante o modo.
- **PB-TMP-07 — comunicação acessível:** o estado deve ser anunciado em região `role="status"`/`aria-live` e o checkbox deve ter descrição associada.
- **PB-TMP-08 — escopo honesto:** o modo não deve ser descrito como privacidade total, anonimização, criptografia ou garantia contra vazamento.

## Relação com dados sensíveis

O detector local de dados sensíveis continua responsável por avisar antes de ações de persistência, cópia e exportação. O Modo Temporário reduz persistência local automática/voluntária no navegador; ele não substitui revisão humana nem remove automaticamente dados do conteúdo.

## Limitações conhecidas

- Se um rascunho de recuperação já existia ao abrir a página, ele pode ser restaurado antes de o usuário ativar o modo; ao ativar, a recuperação armazenada é removida por melhor esforço.
- Projetos e presets salvos anteriormente não são apagados pelo Modo Temporário.
- Exportações e cópia continuam possíveis por decisão explícita do usuário.
- O navegador, sistema operacional, extensões, gerenciadores de clipboard, backups ou ferramentas externas podem manter dados fora do controle do Builder.
- A limpeza depende de o armazenamento local do navegador estar acessível.

## QA ainda necessário

Antes de qualquer claim de release, testar em navegadores reais e celular físico:

1. ativar o modo com recuperação existente e confirmar limpeza;
2. digitar/gerar conteúdo por alguns minutos e confirmar ausência de novo snapshot;
3. fechar a aba com o modo ativo e reabrir;
4. confirmar bloqueio de salvar/atualizar/duplicar projeto e salvar preset;
5. desligar o modo e confirmar retorno controlado da recuperação;
6. navegar apenas por teclado e validar anúncio com leitor de tela;
7. testar interação conjunta com o guard de dados sensíveis;
8. confirmar que projetos/presets antigos não são apagados.

Esses testes permanecem **PENDING** até evidência física correspondente.
