# Path routing + SEO por rota — HiNaS

**Data:** 2026-07-10
**Status:** aprovado (aguardando review do spec)

## Objetivo

Trocar o roteamento por hash (`#sobre`) por **path routing** com URLs reais (`/sobre`),
melhorando SEO e organização. Manter a UX single-page (transição suave entre abas, sem reload).

## Contexto

Site estático puro: [index.html](../../../index.html), [app.js](../../../app.js),
[styles.css](../../../styles.css). Domínio `hinas.com.br` na raiz. Servidor **nginx** próprio.
Estado atual: hash routing já foi removido; nav via `<button data-tab>` chamando `goTab()` sem
atualizar URL.

## Mapa de rotas

Slug da URL nem sempre igual ao id interno do tab (`data-tab` / `data-screen` no DOM).
Precisa mapa nos dois sentidos.

| URL          | id do tab (DOM) | Label nav              |
|--------------|-----------------|------------------------|
| `/`          | `home`          | Home                   |
| `/sobre`     | `sobre`         | Sobre                  |
| `/integrantes` | `integrantes` | Integrantes            |
| `/projetos`  | `projetos`      | Projetos               |
| `/indicacoes`| `leituras`      | Indicações de leitura  |

Nota: só `leituras` diverge (slug `indicacoes`). Os demais slugs == id.

## Componentes

### 1. Roteamento JS — [app.js](../../../app.js)

- **Mapas de slug:** `TAB_TO_SLUG` e `SLUG_TO_TAB` derivados de uma tabela única
  `ROUTES` (fonte de verdade), pra não duplicar.
- **`goTab(tab)`:** substitui a lógica de hash por
  `history.pushState(null, '', slugPath(tab))`, onde `slugPath('home') === '/'` e
  demais `=== '/' + slug`. Só faz push se o path atual for diferente (evita entradas
  duplicadas no histórico). Depois chama `applyRouteMeta(tab)`.
- **`readPath()`** (substitui `readHash`): lê `location.pathname`, normaliza
  (remove barra final, `''`/`'/'` → `home`), consulta `SLUG_TO_TAB`. Slug
  desconhecido → `home`. Mantém a leitura de `?hero=` já existente.
- **`popstate` listener:** botão voltar/avançar → `readPath()` + `applyTab()` +
  `applyRouteMeta()`, **sem** novo pushState (senão duplica histórico).

### 2. Meta por rota — [app.js](../../../app.js)

Tabela `ROUTES` guarda por tab: `slug`, `title`, `description`.
`applyRouteMeta(tab)` atualiza:
- `document.title`
- `<meta name="description">`
- `<meta property="og:title">`
- `<meta property="og:url">` (URL absoluta `https://hinas.com.br` + path)
- `<link rel="canonical">` (mesma URL absoluta)

Helper garante o elemento (cria se faltar). É o que dá o ganho SEO real com URL limpa.

Títulos: formato `"<Seção> — HiNaS"` (home usa o título institucional completo já
existente). Descriptions curtas e específicas por seção.

### 3. Nav crawlável — [index.html](../../../index.html)

Ponto SEO forte: hoje nav é `<button>`, que o Googlebot não segue como link.
- `nav__tab` e `nav__brand` viram `<a href="/sobre">` (etc.), preservando classes/estilo.
- Handler global intercepta clique em `[data-tab]`: se for `<a>`, `preventDefault()` e
  chama `goTab()` (nav suave). Sem JS / ctrl+clique / novo-tab → navegação normal do
  browser funciona (o rewrite do nginx entrega a rota).
- CTAs dentro dos heróis podem seguir `<button data-tab>` — os `<a>` do nav já expõem
  todas as rotas ao crawler. (Opcional futuro: converter CTAs também.)

### 4. Rewrite nginx

Fallback pra reload / deep-link não dar 404 — toda rota que não é arquivo real serve
`index.html`:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Entregue como snippet pro usuário colar no `server {}` do site. Não há acesso ao
servidor a partir daqui; é passo manual de deploy.

## Fluxo de dados

```
load → readPath() lê pathname → SLUG_TO_TAB → state.tab
     → applyTab() mostra seção → applyRouteMeta() ajusta title/meta

clique nav <a> → preventDefault → goTab(tab)
     → pushState(path) → applyTab() → applyRouteMeta()

voltar/avançar → popstate → readPath() → applyTab() → applyRouteMeta()
```

## Tratamento de erro / edge cases

- Slug desconhecido (`/xyz`) → cai em `home` (nginx serve index.html, JS normaliza).
- `history.pushState` em `try/catch` (ambientes antigos) — degrada mostrando a aba sem
  atualizar URL.
- Path com subdiretório não previsto: assume site na raiz (`hinas.com.br/`), confirmado
  pelo canonical existente.

## Fora de escopo (YAGNI)

- Multi-página real (um HTML por rota) — descartado; mantém UX single-page.
- Prerender / SSR — Googlebot renderiza o JS; meta por rota basta pro porte do site.
- Converter CTAs dos heróis em `<a>` — nav já cobre crawl; deixar pra depois se quiser.

## Teste / verificação

- Navegar por cada aba clicando → URL muda pro slug certo, sem `#`, sem reload.
- Reload em `/sobre` e `/indicacoes` → volta na aba certa (depende do rewrite nginx;
  testar via server ou simular servindo index.html pra qualquer path).
- Voltar/avançar do navegador → troca aba corretamente.
- `document.title` e meta mudam por rota (inspecionar DOM / view-source após render).
- Ctrl+clique num tab → abre a rota em nova aba corretamente.
