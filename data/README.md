# Dados seed — CostaViva

Arquivo principal: `zonas-criticas.seed.geojson`

## Como usar
- O app lê este arquivo em `src/repository/seed-critical-zone-repository.ts` e valida cada feature em `src/lib/geojson/parse-critical-zones.ts`
- No mapa, aparece como a camada “Zonas críticas (literatura)”, com popup de `nome`, `taxa_resumo`, `fonte` e link
- A UI deixa claro: **não é sensor em tempo real**

## Campos principais
- `severidade`: alta | media | baixa
- `taxa_resumo`: texto legível para o pitch
- `fonte` / `fonte_url` / `ano_referencia`: rastreabilidade

## Ao editar
Rode `pnpm test`. O teste do repositório seed confere se todas as zonas são válidas, se os ids são únicos, se as coordenadas estão dentro de Sergipe e se as fontes usam https.

## Limite
Coordenadas são **aproximadas** para demo. Refinar com mapa/GPS antes de uma apresentação final.
