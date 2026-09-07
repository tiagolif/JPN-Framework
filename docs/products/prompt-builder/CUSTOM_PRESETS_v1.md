# JPN Prompt Builder — Presets personalizados locais v1

## Objetivo

Permitir que uma configuração útil do Builder seja reutilizada sem conta, servidor, banco de dados ou sincronização externa.

## Escopo da versão v1

O usuário pode:

- nomear a configuração atual;
- salvar ideia, tipo de resultado e restrições como preset pessoal;
- reutilizar presets salvos no mesmo navegador;
- exportar todos os presets pessoais para um arquivo JSON;
- importar esse arquivo em outro navegador ou dispositivo.

## Modelo de privacidade

Os presets pessoais usam `localStorage` do navegador. Não existe envio automático para servidor, telemetria, login ou sincronização em nuvem.

Consequências importantes:

- limpar os dados do navegador pode remover os presets locais;
- outro navegador ou dispositivo não recebe esses presets automaticamente;
- o backup/exportação JSON é o mecanismo explícito de portabilidade;
- conteúdo importado deve ser revisado pelo usuário antes do uso.

## Formato de exportação

O arquivo usa um envelope versionado:

```json
{
  "format": "jpn-builder-custom-presets",
  "version": 1,
  "exportedAt": "<ISO-8601>",
  "presets": []
}
```

Cada preset preserva apenas:

- `id`;
- `label`;
- `type`;
- `idea`;
- `restrictions`;
- `source: custom-local`.

O Builder não executa automaticamente conteúdo importado.

## Limites e validações

A versão v1 aplica:

- até 50 presets locais;
- nome obrigatório;
- ideia obrigatória;
- campos de texto truncados defensivamente;
- rejeição de envelopes de importação com formato ou versão incompatíveis;
- normalização dos objetos antes de persistir ou importar.

O limite evita crescimento descontrolado do armazenamento local e mantém a função como recurso leve do bundle offline.

## Relação com presets guiados

Os sete presets guiados oficiais continuam separados e imutáveis no catálogo distribuído. Presets pessoais aparecem em um grupo próprio (`Meus presets locais`) e podem ser editados indiretamente ao carregar, alterar os campos e salvar uma nova configuração.

## Guardrails

- não usar API externa;
- não sincronizar dados silenciosamente;
- não executar prompts durante importação;
- não tratar presets importados como fatos confirmados;
- não armazenar credenciais por design;
- deixar claro que o armazenamento pertence ao navegador do usuário.

## Qualidade automatizada

`npm run check:prompt-builder-custom-presets` verifica:

- contrato da chave de armazenamento;
- limite de presets;
- criação e normalização;
- round-trip de armazenamento em memória;
- round-trip de exportação/importação;
- rejeição de formato incompatível.

O gate integra o `npm run build`.

## Estado de produto

Com esta camada, o Prompt Builder offline cobre três níveis de reutilização:

1. presets guiados distribuídos pelo JPN;
2. presets pessoais salvos localmente;
3. exportação/importação manual para portabilidade.

Isso não altera o estado de publicação do produto e não cria dependência de hospedagem, conta ou serviço pago.
