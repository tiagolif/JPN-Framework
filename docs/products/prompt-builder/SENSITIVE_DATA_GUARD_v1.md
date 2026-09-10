# JPN Prompt Builder — Sensitive Data Guard v1

**Estado:** candidato interno · revisão funcional e QA físico pendentes

## Objetivo

Reduzir o risco de persistir ou exportar por engano dados potencialmente sensíveis inseridos no Prompt Builder. O guard funciona somente no navegador e não envia o conteúdo analisado para servidor.

## Comportamento

O módulo `product-site/sensitive-data-guard.js` observa os campos visíveis do Builder e procura padrões locais que podem indicar:

- credencial ou segredo digitado em formato chave/valor;
- chave privada;
- número semelhante a cartão;
- CPF formatado;
- endereço de e-mail;
- telefone.

A detecção é deliberadamente conservadora e pode gerar falso positivo. Ela não classifica identidade, propriedade ou legitimidade do dado e não substitui revisão humana.

## Ações protegidas

Quando houver achado, o Builder avisa antes de:

- salvar novo workspace;
- atualizar workspace;
- salvar preset;
- exportar workspaces;
- exportar presets;
- copiar o prompt gerado;
- baixar o prompt;
- exportar o rascunho JSON.

A ação não é executada silenciosamente. O usuário pode cancelar ou, reconhecendo que pode ser falso positivo, continuar manualmente.

## Privacidade operacional

O guard:

- roda localmente no navegador;
- não usa `fetch`, beacon, WebSocket ou outro transporte de rede;
- não cria armazenamento próprio com os achados;
- não registra o conteúdo analisado em console;
- exibe somente categorias de possíveis achados, nunca ecoa o valor detectado no aviso.

Ele complementa `SAFE_DATA_HANDLING_v1.md`; não transforma o Builder em ferramenta de DLP, cofre de segredos ou solução de compliance.

## Limitações conhecidas

Expressões regulares podem produzir falsos positivos e falsos negativos. Um dado não detectado não deve ser considerado seguro por inferência. Da mesma forma, um achado não confirma que o dado seja realmente sensível.

O guard não inspeciona semanticamente arquivos importados antes do parser próprio de presets/workspaces; essa frente continua sujeita às validações existentes e a revisão posterior.

## Relação com QA

Esta camada pode ser verificada estaticamente quanto à presença de detectores, ausência de transporte de rede e integração com as ações do Builder. Ela **não substitui**:

- QA físico contextual em celular real;
- QA de teclado/leitor de tela;
- revisão humana de falsos positivos;
- validação de importação/exportação em navegadores reais;
- decisão de release.

## Critério de parada

Não declarar que o Builder “impede vazamento”, “protege todos os dados”, “é 100% privado” ou possui conformidade regulatória apenas porque este guard existe.

Nenhum gasto, publicação, conta externa, credencial real, dado financeiro real, aceite legal ou envio externo foi necessário para implementar esta camada.
