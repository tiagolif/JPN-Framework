# JPN Gestão Fácil — plano de recuperação e QA

Status: artefato funcional anterior mencionado no histórico do projeto, porém XLSX e manual não localizados na árvore atual do repositório nem na busca disponível desta execução.

## Regra

Não reconstruir silenciosamente um arquivo antigo como se fosse o mesmo artefato. Se o original for localizado, ele deve ser importado, versionado e testado. Se não for localizado, uma nova edição deve ser criada explicitamente como reconstrução controlada.

## Escopo mínimo esperado

A planilha de gestão para pequenas empresas deve priorizar operação simples e não exigir dados financeiros reais durante desenvolvimento ou QA.

Módulos previstos para validação:

1. visão geral;
2. clientes/contatos;
3. tarefas e pendências;
4. vendas/oportunidades em formato operacional;
5. agenda/rotinas;
6. indicadores calculados apenas a partir de dados fictícios de teste;
7. instruções de uso.

## QA obrigatório

- abrir sem erro em software compatível com XLSX;
- fórmulas sem referências quebradas;
- campos de entrada claramente separados de campos calculados;
- filtros e cabeçalhos consistentes;
- nenhuma credencial ou dado pessoal real;
- exemplos inteiramente fictícios;
- ausência de macros inesperadas;
- manual coerente com nomes de abas e campos;
- versão e base do produto registradas.

## Integração ao Pro Kit

O Pro Kit deve manter `pending-import-and-versioning` até existir um XLSX efetivamente versionado e validado. O status só pode mudar depois do QA e da geração do manifesto final.

## Próxima ação segura

1. continuar procurando o XLSX/manual original em fontes disponíveis;
2. se localizado, importar sem alterar o original e executar QA;
3. se continuar ausente após busca suficiente, reconstruir como `JPN_Gestao_Facil_v1_rebuild.xlsx`, deixando explícito que é uma nova edição controlada.
