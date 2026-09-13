# JPN Prompt Builder — Entrega offline v1

Status: **modo de entrega interno definido**. Este documento não publica o produto e não cria URL pública.

## Decisão reversível

Para destravar a composição do JPN Pro Kit sem depender de hospedagem, conta externa ou gasto, o Prompt Builder será preparado como **bundle offline servido por HTTP local**.

Essa decisão é reversível: uma publicação web futura pode ser adicionada separadamente, mas não é requisito para o staging interno do Pro Kit.

## Conteúdo do staging

O comando `npm run stage:prompt-builder` recria `dist/prompt-builder-offline/` com:

- `product-site/index.html`;
- `product-site/app.js`;
- `product-site/styles.css`;
- `product-site/README.md`;
- `dist/browser/index.js`, o bundle browser oficial do SDK;
- `INSTRUCOES_DE_ACESSO.txt`;
- `customer-docs-candidate/LEIA-ME.md`;
- `customer-docs-candidate/GUIA_RAPIDO.md`;
- `customer-docs-candidate/BACKUP_E_EXPORTACAO.md`;
- `customer-docs-candidate/PRIVACIDADE_E_LIMITES.md`;
- `STAGING_MANIFEST.json` com tamanho e SHA-256 dos arquivos copiados e dos documentos candidatos gerados.

Os quatro arquivos em `customer-docs-candidate/` projetam os slots de distribuição já definidos para o produto, porém permanecem explicitamente candidatos internos. Eles não são copiados para o diretório raiz com aparência de arquivos finais e não materializam `JPN_Prompt_Builder_Offline.zip`.

## Proveniência dos documentos candidatos

- `LEIA-ME.md`: deriva de `INSTRUCOES_DE_ACESSO.txt` e aponta para o guia rápido;
- `GUIA_RAPIDO.md`: deriva de `PROMPT_BUILDER_QUICK_START_v1.md`;
- `BACKUP_E_EXPORTACAO.md`: combina `LOCAL_RECOVERY_v1.md`, `LOCAL_WORKSPACES_v1.md` e `WORKSPACE_MANAGEMENT_v1.md`;
- `PRIVACIDADE_E_LIMITES.md`: combina `SENSITIVE_DATA_GUARD_v1.md`, `TEMPORARY_MODE_v1.md` e `SAFE_DATA_HANDLING_v1.md`.

A geração é determinística a partir dessas fontes. O manifesto registra hash e tamanho dos candidatos para facilitar comparação entre execuções sem tratá-los como hashes finais de release.

## Uso local

A pasta deve ser servida por HTTP local para preservar o carregamento de módulos ES. A instrução gerada sugere `python -m http.server 8000` apenas como exemplo quando Python já estiver instalado; nenhuma instalação paga ou criação de conta é necessária.

## Critérios para promover a artefato de entrega

Antes de congelar o Prompt Builder dentro do Pro Kit:

1. executar o build completo do SDK;
2. executar `npm run stage:prompt-builder`;
3. revisar os quatro documentos em `customer-docs-candidate/` e remover qualquer texto interno que não pertença ao pacote do cliente;
4. abrir o Builder pelo servidor HTTP local;
5. confirmar que criação de rascunho, validação, prontidão e geração do prompt funcionam com o bundle oficial;
6. executar o QA físico/contextual em celular real;
7. obter CI final associado ao commit candidato com conclusão `success`;
8. revisar as instruções de acesso e privacidade;
9. somente depois materializar os nomes finais, congelar o bundle, criar `JPN_Prompt_Builder_Offline.zip` e registrar os hashes finais.

## Separação entre staging e release

O staging pode existir enquanto os gates estão abertos porque serve apenas para inspeção. O pacote final continua bloqueado por:

- `qa-fisico-contextual-celular`;
- `ci-final`;
- `pacote-offline-final`.

Nenhum hash produzido pelo staging é automaticamente um hash final. Nenhum arquivo em `customer-docs-candidate/` é considerado aprovado apenas por ter sido gerado sem erro.

## Guardrails

- nenhuma URL pública é declarada;
- nenhum checkout ou anúncio é criado;
- nenhuma credencial é embutida;
- nenhuma API paga é necessária para o modo offline;
- nenhum dado financeiro real é usado;
- nenhum termo legal é aceito em nome do usuário;
- arquivos de desenvolvimento, logs, fixtures, segredos e evidências internas de QA não pertencem ao pacote final.

## Estado que esta decisão resolve

O gate `prompt-builder-release-decision` deixa de depender de uma escolha entre hospedagem e entrega local: **a entrega local é o modo interno escolhido para v1**. O staging agora também antecipa a estrutura documental do pacote futuro. Isso não equivale a dizer que o bundle final já foi congelado, revisado ou liberado; essa validação permanece parte do fechamento do Prompt Builder e do Pro Kit.
