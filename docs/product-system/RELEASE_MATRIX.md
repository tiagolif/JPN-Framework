# Matriz de Release dos Produtos JPN v1

Base técnica atual: JPN Framework `0.3.0-draft`.

Esta matriz é um controle interno. Não define preço, não ativa checkout e não autoriza publicação.

| Produto | Estado | Dependência principal | Bloqueio atual | Próxima ação segura |
|---|---|---|---|---|
| Método JPN | draft editorial consolidado | terminologia do framework | revisão ortográfica/visual final | usar `docs/products/metodo-jpn/METODO_JPN_v1.md` como fonte canônica desta etapa |
| Prompt Builder | integração técnica em draft | SDK browser + parser + paridade | cadeia de PRs ainda não consolidada/CI final | manter integração no SDK oficial e validar build |
| Prompt Pack | draft editorial consolidado — 18 cartões | contrato de templates + Método consolidado | revisão ortográfica/visual final | usar `docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md` e `PROMPT_INDEX.json` como fontes canônicas desta etapa |
| JPN Business | draft editorial consolidado — 12 playbooks | contrato de playbooks + Método/Prompt Pack consolidados | revisão ortográfica/visual final | usar `docs/products/jpn-business/JPN_BUSINESS_v1.md` e `BUSINESS_INDEX.json` como fontes canônicas desta etapa |
| JPN Pro Kit | release-candidate interno de estrutura | componentes versionados + mapa de entrega | artefatos finais ainda não congelados; Gestão Fácil fora do repositório | seguir `docs/products/pro-kit/RELEASE_CHECKLIST.md` e não distribuir antes dos gates |
| JPN Gestão Fácil | v1 funcional criada fora deste repositório | XLSX + manual | artefatos não localizados/versionados nesta branch | localizar, revisar e incorporar de forma rastreável antes de declarar inclusão no Pro Kit |
| Materiais comerciais | rascunhos existentes | claims validados | benchmark ainda não executado | limitar copy a funcionalidades e benefícios não quantitativos |
| Identidade visual | direção já iniciada | consistência entre artefatos | guia mestre ainda pode ser consolidado | criar/atualizar brand kit mestre antes de novas artes finais |

## Estados permitidos

- `draft`: conteúdo em construção;
- `release-candidate`: completo, aguardando revisão final;
- `final`: aprovado para compor pacote interno;
- `published`: somente após autorização explícita para publicação.

O estado `release-candidate interno de estrutura` usado no Pro Kit significa que a arquitetura da entrega está definida, mas não que todos os artefatos finais já estejam congelados.

## Gates antes de `final`

### Método, Prompt Pack e Business
- terminologia alinhada ao Framework JPN;
- claims revisados;
- exemplos neutros;
- versão-base declarada;
- instruções de uso completas;
- revisão estrutural cruzada concluída;
- revisão ortográfica e visual final concluída.

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
- mapa de entrega atualizado;
- manifesto de arquivos congelado;
- checksums calculados somente depois dos artefatos finais;
- Gestão Fácil rastreada ou explicitamente removida da oferta;
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

## Sequência recomendada atualizada

1. consolidar a cadeia técnica do Prompt Builder e obter CI final verde;
2. concluir revisão ortográfica/visual de Método, Prompt Pack e Business;
3. localizar e congelar Gestão Fácil como release candidate;
4. consolidar brand kit mestre e diagramar os documentos finais;
5. construir o Pro Kit final apenas com artefatos aprovados e gerar hashes;
6. executar evals e revisar claims comerciais;
7. somente depois preparar publicação externa, mediante autorização explícita.
