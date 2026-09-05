# JPN Compatibility Policy — draft v1

Este documento define uma política conservadora de compatibilidade para o JPN Framework enquanto o projeto permanece em `0.x` e com status experimental.

> Status: **draft**. Esta política descreve como versões do framework, schema, SDK e produtos derivados devem declarar compatibilidade. Ela não torna versões `0.x` automaticamente estáveis.

---

## 1. Objetivos

A política existe para evitar quatro classes de problema:

1. um produtor gerar um estado que um consumidor interpreta incorretamente;
2. um produto comercial criar um formato paralelo ao framework aberto;
3. mudanças no schema quebrarem silenciosamente Builder, SDK, exemplos ou agentes;
4. migrações ocorrerem por coerção implícita, promovendo campos ausentes ou alterando significado sem registro.

---

## 2. Identificadores de versão

O ecossistema JPN possui camadas diferentes e elas não devem compartilhar versão por conveniência quando evoluírem de forma independente.

| Camada | Exemplo atual | Função |
|---|---|---|
| Framework/spec | `0.3.0-draft` | semântica de Jornada, Precisão e Narrativa |
| JSON Schema | acompanha `0.3.0-draft` nesta fase | contrato estrutural do estado |
| SDK | `0.3.0-draft.0` | implementação de referência |
| Contratos complementares | `provenance-draft-v1`, `handoff-draft-v1` | envelopes/contratos fora do estado principal |
| Produtos comerciais | `v1`, `v2` etc. | versão do produto, não do framework |

Um produto `v2` pode continuar baseado no framework `0.3.0-draft`. Os dois números não são equivalentes.

---

## 3. Regra conservadora para `0.x`

Enquanto o JPN estiver em `0.x`:

- compatibilidade não deve ser presumida apenas pela semelhança do número de versão;
- consumidores devem conhecer explicitamente a versão que aceitam;
- mudanças de significado em campos existentes são incompatíveis;
- novos campos em objetos com `additionalProperties: false` são estruturalmente incompatíveis para leitores antigos;
- uma migração deve ser explícita e testável;
- ausência de versão conhecida deve resultar em erro legível, não em interpretação silenciosa.

---

## 4. Compatibilidade estrutural vs. semântica

### Estrutural

Dois estados são estruturalmente compatíveis quando ambos passam pelo contrato/schema esperado pelo consumidor.

### Semântica

Dois estados são semanticamente compatíveis quando os mesmos campos mantêm o mesmo significado operacional.

Uma mudança pode preservar JSON válido e ainda quebrar semântica. Exemplo: redefinir `confirmed` para significar “provável” seria incompatível mesmo sem alterar o tipo do campo.

A compatibilidade JPN exige ambas quando o consumidor depende do significado do estado.

---

## 5. Regras para produtores

Todo produtor de estado JPN deve:

1. preencher `version` com a versão real do contrato produzido;
2. não declarar uma versão antiga enquanto emite campos de uma versão nova;
3. não inventar campos fora do schema oficial;
4. preservar estados de confiança sem reclassificação silenciosa;
5. documentar qualquer envelope externo usado para provenance, handoff ou metadados;
6. manter fixtures/exemplos que possam ser validados automaticamente.

Exemplos de produtores:

- Prompt Builder;
- parser de entrada bruta;
- agente que materializa estado JPN;
- importador de documentos;
- adaptador de CRM/RAG.

---

## 6. Regras para consumidores

Todo consumidor deve:

1. inspecionar `version` antes de assumir compatibilidade;
2. validar o estado antes da execução quando houver validator disponível;
3. rejeitar versão desconhecida por padrão;
4. aceitar versão desconhecida apenas em modo explicitamente permissivo e observável;
5. nunca preencher silenciosamente um campo obrigatório ausente com conteúdo inventado;
6. registrar migração quando transformar um estado de uma versão para outra.

---

## 7. Política de leitura recomendada

### Modo estrito — padrão

```text
version conhecida?
  não → rejeitar com erro de compatibilidade
  sim → validar schema
           falhou → rejeitar
           passou → consumir
```

### Modo de migração

```text
version antiga conhecida
  ↓
validar no schema de origem
  ↓
migração explícita
  ↓
registrar alterações/lacunas
  ↓
validar no schema de destino
  ↓
consumir
```

Migração não é sinônimo de “consertar JSON”. Ela deve preservar ou declarar mudanças de significado.

---

## 8. Classes de mudança

### A. Editorial — compatível

Exemplos:

- correção de ortografia na documentação;
- exemplos adicionais;
- melhoria de explicação sem mudar regras.

Não exige migração de estado.

### B. Implementação — potencialmente compatível

Exemplos:

- otimização interna do SDK;
- mensagens de erro melhores;
- novo helper que não muda saída existente.

Deve passar testes de regressão.

### C. Estrutura aditiva — não presumir compatibilidade

Exemplos:

- novo campo opcional em objeto com `additionalProperties: false`;
- novo valor em enum;
- novo bloco no estado.

Mesmo sendo “aditiva”, pode ser rejeitada por consumidores antigos. Exige versão declarada e teste de compatibilidade.

### D. Semântica/incompatível

Exemplos:

- renomear/remover campo;
- mudar campo opcional para obrigatório;
- alterar significado de um estado de confiança;
- mudar formato de escopo;
- transformar string em objeto.

Exige nova versão e migrador explícito se houver suporte à versão anterior.

---

## 9. Envelopes complementares

Contratos como provenance e handoff devem permanecer externos ao estado principal enquanto estiverem experimentais:

```json
{
  "jpn_state": {
    "version": "0.3.0-draft",
    "jornada": {},
    "precisao": {},
    "narrativa": {}
  },
  "provenance": {
    "contract_version": "provenance-draft-v1"
  }
}
```

Isso permite evolução independente sem forçar consumidores do estado JPN a aceitar campos desconhecidos.

Quando um contrato complementar amadurecer, sua incorporação ao schema principal deve passar por decisão de versão e migração.

---

## 10. Produtos comerciais

Produtos como JPN Prompt Builder, JPN Pro Kit e JPN Business podem ter versionamento comercial próprio, mas devem registrar sua base técnica.

Exemplo recomendado:

```text
JPN Prompt Builder v2
Framework base: 0.3.0-draft
Schema base: 0.3.0-draft
```

Regras:

- não chamar a versão do produto de versão do framework;
- não exportar JSON JPN incompatível com a versão declarada;
- incluir a versão-base em manifestos ou documentação técnica;
- atualizar Builder/Validator quando houver mudança incompatível no schema.

---

## 11. Matriz mínima de compatibilidade

Uma futura automação de release deve manter matriz semelhante a:

| Produtor | Produz | Consumidor | Aceita | Resultado |
|---|---|---|---|---|
| Builder v2 | `0.3.0-draft` | SDK `0.3.0-draft.0` | `0.3.0-draft` | esperado: compatível |
| Example fixture | `0.3.0-draft` | Validator atual | `0.3.0-draft` | esperado: compatível |
| Futuro Builder | `0.4.0-draft` | SDK `0.3.x` | somente `0.3.x` | rejeitar/migrar |

A tabela deve ser comprovada por teste, não apenas por documentação.

---

## 12. Contrato de erro

Quando a versão não for aceita, a implementação deve produzir erro legível com pelo menos:

- versão recebida;
- versões aceitas;
- componente que rejeitou;
- orientação de migração, se existir.

Exemplo:

```json
{
  "code": "JPN_UNSUPPORTED_VERSION",
  "received": "0.4.0-draft",
  "supported": ["0.3.0-draft"],
  "component": "@jpn-framework/sdk"
}
```

---

## 13. Migrações

Um migrador deve ser uma transformação explícita:

```text
migrate_0_3_to_0_4(input) -> output + report
```

O relatório deve registrar:

- campos adicionados com default legítimo;
- campos removidos;
- valores transformados;
- dados que não puderam ser migrados;
- itens que exigem revisão humana.

Defaults não podem conter fatos inventados. Se uma informação exigida pela versão nova não existe na antiga, a migração deve representar a lacuna de modo compatível ou falhar com instrução clara.

---

## 14. Critérios antes de uma versão estável

Antes de declarar uma versão `1.0`, recomenda-se ter:

1. schema e semântica congelados por uma janela definida;
2. suíte de fixtures válida e inválida;
3. testes de compatibilidade entre versões suportadas;
4. política de depreciação;
5. migradores para mudanças suportadas;
6. documentação de provenance/handoff estabilizada ou claramente externa;
7. evals reproduzíveis suficientes para caracterizar comportamento sem alegações exageradas.

---

## 15. Próximos passos

- adicionar `supportedVersions` ao SDK;
- definir erro estruturado de versão não suportada;
- criar fixtures de compatibilidade;
- criar primeiro migrador somente quando existir uma segunda versão estrutural real;
- adicionar matriz de compatibilidade ao CI quando houver duas versões suportadas.

Até lá, a política padrão é: **validar a versão declarada, rejeitar desconhecidos e nunca migrar silenciosamente**.
