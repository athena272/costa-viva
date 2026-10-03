# CostaViva

Monitoramento participativo da erosão costeira no litoral de Sergipe.

Municípios como Estância (Praia do Saco), Aracaju (Coroa do Meio), Barra dos Coqueiros e Pirambu perdem faixa de areia, calçadões e casas para o avanço do mar e dos rios. Segundo estudo da UFS, 68 dos 147 km do litoral sergipano têm erosão intensa ou moderada. A evidência, porém, chega tarde e espalhada em notícias e pesquisas pontuais.

O CostaViva junta num mapa as zonas críticas apontadas pela literatura e, nas próximas etapas, relatos com foto e localização enviados por quem vive na orla, para que moradores e órgãos públicos enxerguem onde o problema se repete.

**Equipe:** InnovaPair

## Estado atual

- [x] Mapa das zonas críticas (seed da literatura UFS/G1) com lista, severidade e fontes
- [ ] Formulário de relato geolocalizado com foto
- [ ] Painel temporal de relatos (densidade e recência)
- [ ] Banco de dados e publicação

## Stack

| Camada | Escolha |
| --- | --- |
| App | Next.js 15 (App Router) + React 19 + TypeScript strict |
| Mapa | Leaflet + react-leaflet, tiles do OpenStreetMap |
| Validação | zod |
| Testes | Vitest |
| Pacotes | pnpm 10, Node 24 |
| CI | GitHub Actions (lint, typecheck, test, build) |

## Como rodar

```bash
pnpm install
pnpm dev
```

Abra http://localhost:3000.

| Script | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Checagem de tipos |
| `pnpm test` | Testes unitários e de integração |

## Estrutura

```
data/                      GeoJSON seed das zonas críticas (ver data/README.md)
docs/                      Proposta, canvas e oportunidades de inscrição
src/
  app/                     Rotas, layout, loading e tela de erro
  components/map/          Mapa Leaflet (carregado só no navegador) e estado de carregamento
  components/zones/        Lista de zonas, selo de severidade e aviso sobre os dados
  domain/                  Tipos e regras de domínio (zona crítica, severidade)
  lib/geojson/             Validação e conversão do GeoJSON para o domínio
  repository/              Acesso aos dados (hoje o seed; amanhã o banco)
```

A página pede as zonas ao `CriticalZoneRepository`. Hoje a implementação lê o seed em `data/`; quando houver banco, basta trocar a implementação em `getCriticalZoneRepository()`, sem mexer na tela.

## Sobre os dados

Os pontos do mapa vêm de estudos da UFS e de reportagens. **Não são sensores em tempo real** e as coordenadas são aproximadas. Detalhes e regras para editar o seed em [`data/README.md`](./data/README.md).

## Documentação

Veja [`docs/`](./docs/README.md): proposta completa, mapa de empatia, canvas de valor e a lista de eventos e prêmios onde o projeto pode ser inscrito.

## Licença

[MIT](./LICENSE)
