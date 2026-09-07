# JPN Prompt Builder — gestão de projetos locais v1

## Objetivo

Completar o ciclo de vida dos projetos locais do JPN Prompt Builder sem introduzir conta, servidor, sincronização ou serviço pago.

## Operações suportadas

### Salvar novo snapshot
Cria um novo projeto independente com identificador próprio, preservando ideia, tipo de resultado, restrições, prompt atual, rascunho JPN e score de prontidão.

### Atualizar projeto carregado
Atualiza o projeto selecionado mantendo o mesmo `id` e `createdAt`, alterando `updatedAt`. Essa operação é apropriada quando o usuário deseja continuar o mesmo trabalho em vez de criar uma nova versão paralela.

### Duplicar
Cria outro projeto com novo `id`, nome terminado em `— cópia` por padrão e conteúdo equivalente ao snapshot de origem. O original permanece intacto.

### Excluir
Remove somente o snapshot local selecionado e exige confirmação explícita na interface. Arquivos JSON já exportados não são alterados.

### Exportar e importar
O contrato `jpn-prompt-builder-workspaces` versão 1 é preservado. A importação continua tratando todo conteúdo como dados editáveis e não executa automaticamente prompts, scripts ou instruções presentes no arquivo.

## Privacidade

Os projetos usam apenas `localStorage` do navegador. Não existe telemetria, login, nuvem, banco externo ou sincronização automática nesta versão.

## Limites

- máximo de 30 projetos locais;
- nome: 120 caracteres;
- ideia: 8.000 caracteres;
- restrições: 4.000 caracteres;
- prompt compilado: 30.000 caracteres;
- score normalizado entre 0 e 100.

## Segurança operacional

- atualizar exige um projeto previamente carregado;
- duplicar nunca reutiliza o identificador do original;
- excluir exige confirmação explícita;
- backups exportados são independentes do armazenamento local;
- arquivos importados precisam corresponder ao formato e versão esperados.

## Estado do produto

Esta camada melhora continuidade e versionamento manual do Prompt Builder offline. Não altera o estado comercial, não publica o produto e não constitui garantia de resultado produzido por modelos de IA.
