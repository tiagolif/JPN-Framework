# Matriz de Release dos Produtos JPN v1

Base técnica atual: JPN Framework `0.3.0-draft`.

Esta matriz é um controle interno. Não define preço, não ativa checkout e não autoriza publicação.

| Produto | Estado | Dependência principal | Bloqueio atual | Próxima ação segura |
|---|---|---|---|---|
| Método JPN | draft editorial consolidado | terminologia do framework | revisão cruzada com Prompt Pack/Business + revisão final | usar `docs/products/metodo-jpn/METODO_JPN_v1.md` como fonte canônica desta etapa |
| Prompt Builder | integração técnica em draft | SDK browser + parser + paridade | cadeia de PRs ainda não consolidada | manter integração no SDK oficial e validar build |
| Prompt Pack | draft editorial consolidado — 18 cartões | contrato de templates + Método consolidado | revisão cruzada com JPN Business + QA editorial de amostra | usar `docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md` e `PROMPT_INDEX.json` como fontes canônicas desta etapa |
| JPN Business | draft editorial consolidado — 12 playbooks | contrato de playbooks + Método/Prompt Pack consolidados | QA fictício + revisão cruzada final | usar `docs/products/jpn-business/JPN_BUSINESS_v1.md` e `BUSINESS_INDEX.json` como fontes canônicas desta etapa |
| JPN Pro Kit | estrutura de entrega criada | versões finais dos componentes | componentes ainda em fechamento | substituir placeholders por releases aprovados |
| JPN Gestão Fácil | v1 funcional criada | manual e testes de uso | exemplos e release notes finais | executar revisão de experiência e empacotar versão candidata |
| Materiais comerciais | rascunhos existentes | claims validados | benchmark ainda não executado | limitar copy a funcionalidades e benefícios não quantitativos |
| Identidade visual | direção já iniciada | consistência entre artefatos | guia mestre ainda pode ser consolidado | criar/atualizar brand kit mestre antes de novas artes |

## Estados permitidos

- `draft`: conteúdo em construção;
- `release-candidate`: completo, aguardando revisão final;
- `final`: aprovado para compor pacote interno;
- `published`: somente após autorização explícita para publicação.

## Gates antes de `final`

### Método, Prompt Pack e Business
- terminologia alinhada ao Framework JPN;
- claims revisados;
- exemplos neutros;
- versão-base declarada;
- instruções de uso completas.

### Prompt Pack adicional
- cada cartão segue `CONTENT_CONTRACTS.md`;
- duplicações semânticas foram revisadas;
- prompts de processo longo que pertencem ao Business foram separados;
- amostra passou por QA editorial com entradas fictícias;
- índice estruturado corresponde ao conteúdo humano.

### JPN Business adicional
- cada playbook segue o contrato de processo em `CONTENT_CONTRACTS.md`;
- processo está separado de prompt isolado;
- pontos de decisão e continuidade estão explícitos;
- vínculos com Prompt Pack foram revisados;
- casos fictícios cobrem comercial, atendimento, marketing, operações, gestão e conhecimento;
- nenhum playbook automatiza decisão regulada ou ultrapassa autorização necessária.

### Prompt Builder
- CI verde;
- sem lógica JPN duplicada no front-end;
- paridade Node/browser protegida por teste;
- export JSON validado;
- nenhuma dependência de serviço pago para o fluxo-base.

### Pro Kit
- todos os itens com versão e status;
- `LEIA PRIMEIRO` atualizado;
- manifesto de arquivos;
- checksums quando o pacote for congelado;
- nenhum draft acidental dentro da pasta de entrega.

## Bloqueios externos deliberados

Permanecem fora da execução autônoma:

- definir ou cobrar preço real;
- criar checkout;
- aceitar termos de terceiros;
- publicar página, produto ou anúncio;
- usar dados financeiros;
- criar conta com verificação de identidade;
- contratar serviço pago.

## Sequência recomendada

1. consolidar cadeia técnica do Prompt Builder;
2. auditar Método JPN;
3. normalizar Prompt Pack;
4. normalizar JPN Business;
5. executar revisão cruzada Método + Prompt Pack + Business;
6. congelar Gestão Fácil como release candidate;
7. montar Pro Kit release candidate;
8. executar evals e revisar claims;
9. só então preparar publicação externa, mediante autorização.
