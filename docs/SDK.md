# JPN TypeScript SDK

> Status: `0.3.0-draft.0` — referência experimental.

O SDK é a implementação de referência do JPN Framework em TypeScript. Ele existe para transformar a especificação JPN em um contrato executável que possa ser usado em agentes, pipelines de IA, automações e aplicações com RAG.

## Objetivos

O SDK resolve quatro problemas:

1. **validar** se um estado JPN respeita o contrato definido pelo JSON Schema;
2. **compilar** o estado JPN em um prompt operacional consistente;
3. **avaliar prontidão** antes da execução, destacando lacunas de contexto e validação;
4. **fornecer tipos TypeScript** para integrações seguras.

## Instalação local

Enquanto o pacote ainda não é publicado no npm:

```bash
git clone https://github.com/tiagolif/JPN-Framework.git
cd JPN-Framework
npm install
npm test
npm run build
```

Requisito: Node.js 20 ou superior.

## API pública

### `validateJpnState(input)`

Valida um valor desconhecido contra `schemas/jpn.schema.json`.

```ts
import { validateJpnState } from "./src/index.js";

const result = validateJpnState(input);

if (!result.valid) {
  console.error(result.errors);
}
```

Uma validação inválida retorna erros estruturados:

```ts
{
  valid: false,
  errors: [
    {
      path: "/precisao/saidas",
      keyword: "required",
      message: "must have required property 'saidas'"
    }
  ]
}
```

### `assertJpnState(input)`

Funciona como type guard e lança `JpnValidationError` quando o estado é inválido.

```ts
import { assertJpnState } from "./src/index.js";

assertJpnState(input);

// A partir daqui o TypeScript trata `input` como JpnState.
console.log(input.precisao.objetivo);
```

### `buildJpnPrompt(state, options?)`

Transforma um estado JPN válido em uma instrução operacional pronta para ser enviada a um modelo de linguagem ou agente.

```ts
import { buildJpnPrompt } from "./src/index.js";

const prompt = buildJpnPrompt(state, {
  includeConfidence: true,
  preamble: "Você é um agente de operações comerciais."
});
```

O compilador preserva:

- contexto confirmado;
- estados de confiança;
- objetivo operacional;
- escopo positivo e negativo;
- critérios de aceitação;
- riscos;
- estratégia de validação;
- estado final desejado;
- próxima ação.

### `assessJpnReadiness(state)`

Produz uma avaliação heurística de completude antes da execução.

```ts
import { assessJpnReadiness } from "./src/index.js";

const assessment = assessJpnReadiness(state);

console.log(assessment);
```

Exemplo de saída:

```ts
{
  score: 90,
  ready: true,
  strengths: [
    "Contexto e estado atual definidos",
    "Critérios de aceitação definidos"
  ],
  gaps: [
    "Objetivo de negócio não informado"
  ]
}
```

A pontuação não representa verdade científica nem qualidade garantida. Ela é um checklist operacional para detectar estados incompletos.

## Exemplo mínimo

```ts
import {
  assessJpnReadiness,
  buildJpnPrompt,
  type JpnState,
} from "./src/index.js";

const state: JpnState = {
  version: "0.3.0-draft",
  jornada: {
    contexto: "Equipe recebe leads por WhatsApp.",
    estado_atual: "Follow-up manual.",
    incertezas: ["SLA ainda não definido."]
  },
  precisao: {
    objetivo: "Organizar qualificação e handoff.",
    escopo: {
      inclui: ["qualificação", "registro no CRM"],
      nao_inclui: ["decisão de crédito"]
    },
    saidas: ["lead qualificado"],
    criterios_de_aceitacao: [
      "Inferências devem ser identificadas."
    ],
    riscos: ["alucinação de dados"],
    validacao: ["executar casos de teste"]
  },
  narrativa: {
    estado_final_desejado: "Lead entregue com contexto preservado.",
    proxima_acao: "Executar piloto controlado."
  }
};

const readiness = assessJpnReadiness(state);

if (!readiness.ready) {
  console.warn(readiness.gaps);
}

const prompt = buildJpnPrompt(state);
console.log(prompt);
```

## Exemplo completo em JSON

Veja [`examples/crm-state.json`](../examples/crm-state.json).

## Arquitetura

```text
schemas/jpn.schema.json
        │
        ▼
src/validator.ts ─────► valida estrutura e tipos
        │
        ├──────────────► src/readiness.ts
        │                  avalia completude operacional
        │
        └──────────────► src/prompt.ts
                           compila estado em instrução
                                │
                                ▼
                         LLM / agente / workflow
```

## Decisões de design

### Schema como contrato

A implementação usa o JSON Schema como fonte do contrato em runtime. Os tipos TypeScript refletem esse contrato para desenvolvimento.

### Falhar cedo

Entradas inválidas são rejeitadas antes da compilação do prompt. Isso impede que um agente receba uma estrutura parcialmente corrompida sem aviso.

### Sem dependência de provedor de IA

O SDK não chama OpenAI, Anthropic, Google ou qualquer outro modelo. Ele prepara e valida contexto. A integração com o provedor fica a cargo da aplicação.

### Sem inferência automática escondida

O SDK não inventa campos ausentes e não converte hipóteses em fatos. Estados de confiança precisam vir do processo que constrói o contexto.

## Testes

A suíte usa Vitest e cobre:

- estado JPN válido;
- propriedades proibidas pelo schema;
- erro estruturado;
- compilação de Jornada, Precisão e Narrativa;
- preservação de estados de confiança;
- avaliação de prontidão.

```bash
npm test
```

## Build e tipagem

```bash
npm run typecheck
npm run build
```

O build gera JavaScript ESM e declarações TypeScript em `dist/`.

## Próximos passos técnicos

- gerar tipos automaticamente a partir do JSON Schema para eliminar duplicação;
- publicar pacote npm quando a API estiver estável;
- adicionar adapters para OpenAI, Anthropic e Google sem acoplar o núcleo;
- criar parser de intake para converter entradas brutas em rascunho JPN;
- adicionar benchmark automatizado baseado no protocolo de `docs/EVALUATION.md`;
- criar suporte a versionamento e migração de estados JPN.

## Limitações

Esta versão é experimental. A API pode mudar antes da versão `1.0.0`.

O JPN SDK não garante que a saída de um LLM seja correta. Ele melhora estrutura, rastreabilidade e verificabilidade da entrada, mas a qualidade final também depende do modelo, das ferramentas, das fontes de dados e dos testes usados pela aplicação.
