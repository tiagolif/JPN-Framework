# JPN Safe Data Handling v1

**Estado:** candidate internal policy / human review pending

## Objetivo

Definir uma política mínima e reutilizável para lidar com dados em prompts, exemplos, planilhas, suporte, feedback, páginas, documentação e arquivos entregáveis sem transformar material sensível em fixture, conteúdo comercial ou evidência de QA.

## Princípios SD-01..SD-08

- **SD-01 — Menor dado suficiente:** usar apenas o mínimo necessário para compreender ou testar a tarefa.
- **SD-02 — Fictício por padrão:** exemplos compartilháveis devem preferir nomes, organizações, contatos, IDs e cenários fictícios.
- **SD-03 — Sanitizar antes de reutilizar:** remover ou substituir dados pessoais, credenciais, tokens, URLs privadas, documentos, segredos e identificadores antes de levar conteúdo real para documentação, issue, prompt de exemplo, fixture ou material comercial.
- **SD-04 — Financeiro real não entra em artefato candidato:** valores, saldos, cartões, contas, boletos, dados bancários e transações reais ficam fora dos materiais candidatos do ecossistema.
- **SD-05 — Segredo nunca vira exemplo:** senha, API key, token, cookie, chave privada, recovery code e segredo equivalente não podem ser persistidos em documentação ou fixture.
- **SD-06 — Separar conteúdo de evidência:** dado usado para reproduzir um problema não comprova qualidade, compatibilidade, release nem desempenho.
- **SD-07 — Preservar confiança:** fatos, inferências, desconhecidos e conflitos permanecem separados como `confirmed`, `inferred`, `unknown` e `conflicting`.
- **SD-08 — Parar diante de autorização externa:** coleta, envio, publicação, aceite, compra ou ação em conta de terceiro exige autorização própria e não nasce desta política.

## Classificação operacional

| Classe | Exemplo | Tratamento |
|---|---|---|
| PUBLICO | texto institucional já público | pode ser reutilizado com revisão |
| FICTICIO | Cliente Exemplo, pedido TESTE-001 | preferencial para materiais candidatos |
| INTERNO_NAO_SENSIVEL | rótulo de fluxo, estado de QA | usar apenas quando necessário |
| PESSOAL | nome, telefone, e-mail, documento | sanitizar antes de compartilhar/reutilizar |
| CREDENCIAL | senha, token, API key, cookie | bloquear e remover |
| FINANCEIRO_REAL | conta, cartão, saldo, transação | bloquear em artefatos candidatos |
| PRIVADO_EXTERNO | URL privada, conteúdo de conta conectada | não persistir como fixture sem autorização específica |

## Fluxo SD-F01..SD-F06

1. **SD-F01 Identificar** qual dado está presente e por que ele é necessário.
2. **SD-F02 Classificar** usando a tabela acima.
3. **SD-F03 Reduzir** para o menor conjunto suficiente.
4. **SD-F04 Sanitizar** substituindo elementos reais por equivalentes fictícios quando o conteúdo precisar ser reutilizado.
5. **SD-F05 Verificar** se ainda restou credencial, dado financeiro real, identificador pessoal ou URL privada.
6. **SD-F06 Registrar limite**: conteúdo sanitizado continua candidato e não vira evidência de release por existir.

## Aplicação por produto

### Método JPN
Exercícios e exemplos devem usar cenários fictícios ou já públicos. Informações ausentes continuam explícitas e não são completadas com dados pessoais inferidos.

### JPN Prompt Pack
Os 18 templates canônicos devem ser demonstrados com placeholders ou dados fictícios. Um template nunca exige inserir credencial para demonstrar utilidade.

### JPN Business
Os 12 playbooks podem modelar rotinas, responsáveis e estados sem incluir dados pessoais ou financeiros reais. Logs candidatos devem usar exemplos sanitizados.

### JPN Prompt Builder
Campos de contexto e workspaces locais devem orientar o usuário a evitar segredos. O QA físico contextual em celular continua pendente e esta política não o substitui.

### JPN Gestão Fácil
Fixtures e Starter Data Kit devem continuar fictícios. `GF-QA-10` permanece pendente. `REPOR` é apenas alerta operacional; a planilha não autoriza compra. Valores financeiros reais não devem entrar em material de demonstração ou QA compartilhado.

### JPN Pro Kit
Permanece `EM PREPARAÇÃO`. Empacotamento e manifesto não devem incorporar arquivos que contenham credenciais, dados financeiros reais ou identificadores pessoais não sanitizados.

## Checklist antes de compartilhar um artefato

- o dado é realmente necessário?
- exemplos são fictícios por padrão?
- nomes, telefones, e-mails, documentos e IDs pessoais foram removidos/substituídos?
- não há senha, token, API key, cookie ou segredo?
- não há dado financeiro real?
- não há URL privada ou referência que exponha conta conectada?
- estados `confirmed`, `inferred`, `unknown` e `conflicting` continuam corretos?
- o arquivo continua identificado como candidato quando QA/release ainda estão pendentes?

## Regra de parada

Bloquear a reutilização e exigir tratamento específico se houver credencial, dado financeiro real, identidade verificável desnecessária, material privado de terceiro, ou se a sanitização impedir compreender com segurança o caso.

Esta política não autoriza coleta, publicação, compra, contratação, criação de conta, aceite legal ou ação externa em nome do usuário.
