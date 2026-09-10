# Product Feedback Loop JPN v1

**Estado:** candidate internal improvement loop / human review pending

## Objetivo

Transformar observações de uso em aprendizado rastreável para o ecossistema JPN sem tratar relato isolado como verdade universal, sem coletar dados desnecessários e sem transformar feedback em autorização automática de mudança, publicação, gasto ou release.

Este fluxo complementa onboarding, suporte e registro de evidências. Ele não substitui QA físico, QA multiplataforma, revisão editorial, revisão visual, CI ou decisão humana de release.

## Princípios

1. Registrar apenas o mínimo necessário para compreender o problema ou oportunidade.
2. Preferir exemplos fictícios, sanitizados ou anonimizados em documentação e testes.
3. Separar relato, evidência, interpretação e decisão.
4. Preservar os estados de confiança `confirmed`, `inferred`, `unknown` e `conflicting`.
5. Uma sugestão não vira requisito automaticamente.
6. Uma correção local não vira padrão para todos os produtos sem evidência suficiente.
7. Mudanças que afetem release continuam sujeitas aos gates específicos do produto.

## Fluxo FB-01..FB-07

### FB-01 — Capturar o sinal

Registrar o que foi observado com linguagem factual e curta. Evitar nome completo, telefone, e-mail, documento, credencial, dado financeiro real ou qualquer identificador desnecessário.

Saída mínima:
- produto afetado;
- tipo de sinal;
- descrição sanitizada;
- origem interna ou externa;
- estado inicial de confiança.

### FB-02 — Classificar o sinal

Categorias controladas:
- `USABILIDADE`;
- `CONTEUDO`;
- `PRECISAO`;
- `FLUXO`;
- `COMPATIBILIDADE`;
- `DOCUMENTACAO`;
- `COMERCIAL`;
- `ACESSIBILIDADE`;
- `OUTRO`.

A categoria ajuda triagem; não determina prioridade sozinha.

### FB-03 — Procurar evidência

Separar:
- relato original sanitizado;
- reprodução ou exemplo;
- evidência existente;
- ausência de evidência;
- conflito com fonte canônica.

Quando não houver evidência suficiente, manter `unknown` ou `inferred` em vez de promover para `confirmed`.

### FB-04 — Avaliar recorrência e impacto

Usar somente faixas qualitativas:
- recorrência: `UNICO`, `REPETIDO`, `RECORRENTE`, `DESCONHECIDO`;
- impacto: `BAIXO`, `MEDIO`, `ALTO`, `CRITICO`, `DESCONHECIDO`.

Essas faixas são apoio de triagem e não SLA, promessa de correção ou autorização automática.

### FB-05 — Definir resposta segura

Estados de decisão:
- `OBSERVAR` — ainda há pouca evidência;
- `DOCUMENTAR` — melhorar orientação sem alterar comportamento do produto;
- `TESTAR` — criar teste ou experimento reversível;
- `CORRIGIR_CANDIDATO` — preparar alteração para revisão;
- `NAO_APLICAR` — evidência insuficiente, fora de escopo ou risco desproporcional;
- `BLOQUEADO` — depende de autorização, dado, ambiente ou ação que não pode ser realizada autonomamente.

Nenhum estado acima equivale a release aprovado.

### FB-06 — Vincular ao produto e ao gate correto

#### Método JPN

Feedback sobre Jornada, Precisão, Narrativa ou política de lacunas deve ser comparado às fontes canônicas antes de qualquer alteração editorial.

#### JPN Prompt Pack

Identificar qual dos 18 templates está envolvido. Evitar mudar vários templates por causa de um único caso sem evidência de padrão.

#### JPN Business

Identificar qual dos 12 playbooks está envolvido e se o sinal ocorreu no conteúdo, implantação, scorecard, sprint ou revisão semanal.

#### JPN Prompt Builder

Separar conteúdo do prompt de comportamento da interface. Problemas de dispositivo continuam exigindo evidência no ambiente correspondente. O **QA físico contextual em celular continua pendente** enquanto não houver execução real documentada.

#### JPN Gestão Fácil

Registrar arquivo, aplicativo, aba e campo afetado quando aplicável. `GF-QA-10 continua pendente` até validação do mesmo XLSX em Microsoft Excel, LibreOffice Calc e Google Sheets. `REPOR` permanece somente alerta operacional.

#### JPN Pro Kit

Feedback de combinação entre produtos não promove o pacote. O JPN Pro Kit permanece **EM PREPARAÇÃO** até seus gates próprios serem satisfeitos.

### FB-07 — Fechar o ciclo

Um item só pode ser encerrado quando houver registro claro de uma destas saídas:
- decisão de observar;
- documentação ajustada e revisada;
- teste criado e resultado registrado;
- correção candidata vinculada a revisão;
- decisão explícita de não aplicar;
- bloqueio documentado.

Encerrar feedback não significa que a mudança entrou em release.

## Relação com suporte

Chamados do `CUSTOMER_SUPPORT_PLAYBOOK_v1.md` podem gerar feedback de produto quando revelarem padrão, lacuna de documentação, falha reproduzível ou oportunidade clara. O chamado de suporte e o item de feedback devem permanecer registros distintos: suporte resolve/encaminha a ocorrência; feedback acompanha aprendizado e possível melhoria do produto.

## Política de privacidade operacional

O registro deve evitar dados pessoais e sensíveis. Quando um exemplo real for indispensável para compreender o defeito, ele deve ser sanitizado antes de entrar em documentação, fixture, issue ou material compartilhado.

Não registrar:
- senhas, tokens ou chaves;
- números de cartão, conta ou outros dados financeiros reais;
- documentos pessoais;
- dados de saúde;
- conteúdo privado que não seja necessário para reproduzir o problema.

## Critérios de parada

Interromper a execução autônoma quando o próximo passo exigir:
- gasto ou contratação;
- publicação, anúncio ou envio externo;
- aceite de termos legais;
- credencial real;
- dado financeiro real;
- criação de conta com verificação de identidade;
- promoção de QA/release sem evidência correspondente.

## Checklist de qualidade do feedback

Antes de considerar um item pronto para decisão, verificar:
- [ ] produto identificado;
- [ ] descrição sanitizada;
- [ ] categoria definida;
- [ ] confiança registrada;
- [ ] evidência separada da interpretação;
- [ ] recorrência e impacto tratados como apoio qualitativo;
- [ ] nenhuma promessa de prazo ou resultado criada;
- [ ] gate correto do produto preservado;
- [ ] decisão humana continua possível;
- [ ] ausência de dados pessoais, credenciais e dados financeiros reais.

## Limite de uso

Este documento é um candidato interno. Ele organiza aprendizado e priorização, mas não comprova demanda de mercado, satisfação, eficácia, compatibilidade, segurança, qualidade final ou prontidão comercial de qualquer produto JPN.
