# Galeria interna de artes JPN v1

## Objetivo

`commercial-site/artes.html` consolida em uma única superfície de revisão todos os ativos registrados em `COMMERCIAL_ASSET_MANIFEST_v1.json`.

A galeria não cria novos claims, não substitui o manifesto de ativos e não autoriza publicação. Seu objetivo é permitir inspeção visual conjunta de marca, capas, peças sociais e templates antes de qualquer uso externo.

## Fonte de verdade

A cobertura da galeria deriva de:

- `docs/commercial/COMMERCIAL_ASSET_MANIFEST_v1.json`;
- `docs/commercial/JPN_VISUAL_IDENTITY_v1.json`;
- `docs/commercial/COMMERCIAL_SURFACE_MANIFEST_v1.json`.

Cada ativo deve aparecer exatamente uma vez na galeria por meio de `data-asset="<id-canônico>"`. O caminho exibido deve corresponder ao caminho registrado no manifesto.

## Uso interno

A página pode ser usada para:

1. revisar consistência visual entre os produtos;
2. conferir se todos os ativos inventariados têm preview;
3. comparar capas, peças sociais e templates;
4. imprimir uma prova visual interna em A4 landscape;
5. identificar drift visual antes de criar novas peças.

## Limites

- `publication_authorized: false`;
- não publicar a galeria ou seus ativos por inferência;
- não tratar a existência de capa/arte como evidência de release;
- não incluir preço, checkout, captura de lead ou tracking;
- não introduzir URLs externas;
- JPN Pro Kit deve continuar identificado como `EM PREPARAÇÃO` enquanto seus gates estiverem abertos;
- nenhuma peça deve sugerir resultado garantido, ROI, precisão absoluta ou substituição de revisão humana.

## Validação

`scripts/check-commercial-art-gallery.mjs` compara a página ao manifesto de ativos e falha quando:

- um ativo registrado não aparece exatamente uma vez;
- a página referencia um `data-asset` inexistente;
- o caminho visual do SVG diverge do manifesto;
- falta `noindex,nofollow`, aviso de uso interno ou impressão landscape;
- surgem formulário, tracking, URL externa ou elemento transacional;
- o Pro Kit deixa de ser sinalizado como `EM PREPARAÇÃO`.

A validação mecânica não substitui revisão visual humana das artes.
