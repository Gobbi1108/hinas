# Path Routing + SEO por rota — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar roteamento por hash por path routing (URLs reais `/sobre`), com meta por rota e nav crawlável, mantendo a UX single-page.

**Architecture:** History API (`pushState`/`popstate`) troca a aba sem reload e atualiza a URL. Uma tabela `ROUTES` é fonte única de verdade (tab id ↔ slug ↔ title/description). Nav vira `<a href>` com clique interceptado. nginx faz fallback de qualquer rota pra `index.html`.

**Tech Stack:** HTML/CSS/JS puro (IIFE em [app.js](../../../app.js)), nginx.

## Global Constraints

- **Sem commits** — usuário pediu explicitamente não commitar. Nenhum passo roda `git`.
- **Sem framework de teste** — verificação é manual no browser. Servir com qualquer static server (`python -m http.server 8000` na raiz) e abrir `http://localhost:8000`.
- **Slug ≠ tab id só em `leituras`** — slug da URL é `indicacoes`, id interno do tab continua `leituras`. Todo o resto: slug == id.
- **Site na raiz do domínio** `https://hinas.com.br/` (confirmado pelo canonical existente).
- **Textos SEO por rota** — usar exatamente os aprovados pelo usuário (ver tabela na Task 1). Não inventar.

---

## File Structure

- [app.js](../../../app.js) — toda a lógica de rota (tabela `ROUTES`, maps, `goTab`, `readPath`, `applyRouteMeta`, `popstate`, interceptação de clique). Arquivo pequeno (~150 linhas), tudo num IIFE; mantém-se num arquivo só seguindo o padrão atual.
- [index.html](../../../index.html) — nav `<button>` → `<a href>`.
- [styles.css](../../../styles.css) — reset defensivo pros `<a>` do nav parecerem os botões atuais.
- `docs/deploy/nginx-snippet.conf` — **Create**: snippet de rewrite pro deploy manual.

---

### Task 1: Tabela de rotas + meta por rota

Fonte única de verdade das rotas e a função que atualiza `<title>`/meta. Sem navegação ainda — só os dados e o efeito de meta, testável chamando a função no console.

**Files:**
- Modify: [app.js](../../../app.js) — substitui a linha `var TABS = [...]` (linha 38) e adiciona helpers antes de `goTab`.

**Interfaces:**
- Consumes: nada.
- Produces:
  - `ROUTES` (array de `{ tab, slug, title, desc }`)
  - `SLUG_TO_TAB` (obj slug→tab), `TAB_TO_ROUTE` (obj tab→route)
  - `TABS` (array de tab ids, derivado — mantém compat com uso existente)
  - `slugPath(tab)` → string (`'/'` pra home, `'/'+slug` pros demais)
  - `applyRouteMeta(tab)` → void (atualiza title, description, og:title, og:url, canonical)

**Textos SEO (aprovados pelo usuário — preencher com os valores finais):**

| tab | slug | title | desc |
|---|---|---|---|
| home | `` | `HiNaS — Histórias de Vida, Narrativas e Subjetividades` | *(desc home aprovada)* |
| sobre | `sobre` | `Sobre — HiNaS` | *(desc sobre aprovada)* |
| integrantes | `integrantes` | `Integrantes — HiNaS` | *(desc integrantes aprovada)* |
| projetos | `projetos` | `Projetos — HiNaS` | *(desc projetos aprovada)* |
| leituras | `indicacoes` | `Indicações de leitura — HiNaS` | *(desc indicacoes aprovada)* |

- [ ] **Step 1: Substituir a linha `var TABS` pela tabela de rotas e maps**

Trocar a linha 38 (`var TABS = ['home', ...];`) por:

```js
  var SITE = 'https://hinas.com.br';

  var ROUTES = [
    { tab: 'home',        slug: '',            title: 'HiNaS — Histórias de Vida, Narrativas e Subjetividades', desc: 'Um convite para conhecer um grupo de estudos especial aonde há espaço de trabalho comum, dedicado aos estudos da constituição dos sujeitos nas relações sociais.' },
    { tab: 'sobre',       slug: 'sobre',       title: 'Sobre — HiNaS',                                          desc: 'Conheça o HiNaS: grupo de pesquisa que estuda a formação a partir de histórias de vida, narrativas (auto)biográficas, memória e práticas pedagógicas.' },
    { tab: 'integrantes', slug: 'integrantes', title: 'Integrantes — HiNaS',                                    desc: 'Pesquisadoras e pesquisadores do HiNaS — grupo de estudos sobre narrativas, memória e formação de professores, entre USF e PUC-Campinas.' },
    { tab: 'projetos',    slug: 'projetos',    title: 'Projetos — HiNaS',                                       desc: 'Projetos de pesquisa do HiNaS em torno de narrativas (auto)biográficas, memória, formação de professores e práticas pedagógicas.' },
    { tab: 'leituras',    slug: 'indicacoes',  title: 'Indicações de leitura — HiNaS',                          desc: 'Indicações de leitura do HiNaS sobre histórias de vida, narrativas (auto)biográficas, memória e formação docente.' },
  ];

  var TABS = ROUTES.map(function (r) { return r.tab; });
  var SLUG_TO_TAB = {}, TAB_TO_ROUTE = {};
  ROUTES.forEach(function (r) { SLUG_TO_TAB[r.slug] = r.tab; TAB_TO_ROUTE[r.tab] = r; });

  function slugPath(tab) {
    var r = TAB_TO_ROUTE[tab];
    return '/' + (r ? r.slug : '');
  }
```

Os `<<DESC_*>>` são substituídos pelos textos aprovados antes de rodar.

- [ ] **Step 2: Adicionar `applyRouteMeta` e helper `setMeta` (antes de `goTab`)**

```js
  function setMeta(selector, attr, value, tag, tagAttrs) {
    var el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement(tag);
      Object.keys(tagAttrs).forEach(function (k) { el.setAttribute(k, tagAttrs[k]); });
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  }

  function applyRouteMeta(tab) {
    var r = TAB_TO_ROUTE[tab];
    if (!r) return;
    var url = SITE + slugPath(tab);
    document.title = r.title;
    setMeta('meta[name="description"]',    'content', r.desc,  'meta', { name: 'description' });
    setMeta('meta[property="og:title"]',   'content', r.title, 'meta', { property: 'og:title' });
    setMeta('meta[property="og:url"]',      'content', url,     'meta', { property: 'og:url' });
    setMeta('link[rel="canonical"]',        'href',    url,     'link', { rel: 'canonical' });
  }
```

- [ ] **Step 3: Verificar no browser**

Servir a raiz (`python -m http.server 8000`), abrir `http://localhost:8000`, console:
```js
applyRouteMeta('sobre');
document.title;                                   // "Sobre — HiNaS"
document.querySelector('link[rel=canonical]').href; // "https://hinas.com.br/sobre"
document.querySelector('meta[name=description]').content; // desc de sobre
```
Esperado: os três batem com a tabela. (Funções expostas via console dentro do IIFE — se não acessíveis, validar após Task 2 pela navegação real.)

---

### Task 2: Navegação por History API

Liga `goTab` ao `pushState`, lê a rota inicial do `pathname` e trata voltar/avançar.

**Files:**
- Modify: [app.js](../../../app.js) — `goTab` (linhas 103-108), `readHash` (renomeia p/ `readPath`, 125-128), `init` (131-140).

**Interfaces:**
- Consumes: `TAB_TO_ROUTE`, `slugPath`, `applyRouteMeta`, `SLUG_TO_TAB` (Task 1); `applyTab`, `state` (existentes).
- Produces: `readPath()` → void; `goTab(tab)` agora atualiza URL + meta.

- [ ] **Step 1: Reescrever `goTab` pra usar `pushState` + meta**

Substituir a função `goTab` inteira (linhas 103-108) por:

```js
  function goTab(tab) {
    if (!TAB_TO_ROUTE[tab]) return;
    state.tab = tab;
    applyTab();
    applyRouteMeta(tab);
    var path = slugPath(tab);
    if (window.location.pathname !== path) {
      try { history.pushState(null, '', path); } catch (e) {}
    }
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
  }
```

- [ ] **Step 2: Trocar `readHash` por `readPath`**

Substituir a função `readHash` (linhas 125-128) por:

```js
  function readPath() {
    var p = window.location.pathname.replace(/\/+$/, '');  // tira barra final
    var slug = p.replace(/^\/+/, '');                      // tira barra inicial
    state.tab = SLUG_TO_TAB.hasOwnProperty(slug) ? SLUG_TO_TAB[slug] : 'home';
    var m = /[?&]hero=([abc])/.exec(window.location.search);
    if (m) state.hero = m[1];
  }
```

- [ ] **Step 3: Atualizar `init` — chamar `readPath`, meta inicial e `popstate`**

Na função `init`, trocar a linha `readHash();` por `readPath();`, e logo após `applyTab();` adicionar meta inicial + listener. Bloco final de `init`:

```js
    bind();
    readPath();
    applyTab();
    applyRouteMeta(state.tab);
    applyHero();
    window.addEventListener('popstate', function () {
      readPath();
      applyTab();
      applyRouteMeta(state.tab);
    });
```

- [ ] **Step 4: Verificar navegação no browser**

Servir a raiz, abrir `http://localhost:8000`:
- Clicar em cada aba → URL vira `/sobre`, `/integrantes`, `/projetos`, `/indicacoes`, `/` (Home). Sem `#`, sem reload, `document.title` muda.
- Botão **voltar** do navegador → volta pra aba anterior corretamente (a seção e o title acompanham).
- Botão **avançar** → refaz.

Nota: recarregar `/sobre` direto ainda dá 404 num static server comum — isso é resolvido pelo rewrite do nginx (Task 4).

---

### Task 3: Nav crawlável (`<button>` → `<a href>`)

Expõe as rotas como links reais pro Googlebot e pra ctrl+clique.

**Files:**
- Modify: [index.html](../../../index.html) — nav (linhas 37-49).
- Modify: [app.js](../../../app.js) — handler de clique em `bind` (linhas 117-119).
- Modify: [styles.css](../../../styles.css) — reset dos `<a>` do nav.

**Interfaces:**
- Consumes: `goTab` (Task 2).
- Produces: nenhuma nova função.

- [ ] **Step 1: Converter `nav__brand` e `nav__tab` em âncoras**

Substituir o bloco `<nav>` (linhas 37-49) por:

```html
  <nav class="nav">
    <a class="nav__brand" href="/" data-tab="home" aria-label="Ir para Home">
      <img src="assets/logo-light.jpeg" alt="HiNaS" class="nav__logo">
      <span class="nav__wordmark">HiNaS</span>
    </a>
    <div class="nav__tabs" role="tablist">
      <a class="nav__tab" href="/" data-tab="home" role="tab"><span>Home</span></a>
      <a class="nav__tab" href="/sobre" data-tab="sobre" role="tab"><span>Sobre</span></a>
      <a class="nav__tab" href="/integrantes" data-tab="integrantes" role="tab"><span>Integrantes</span></a>
      <a class="nav__tab" href="/projetos" data-tab="projetos" role="tab"><span>Projetos</span></a>
      <a class="nav__tab" href="/indicacoes" data-tab="leituras" role="tab"><span>Indicações de leitura</span></a>
    </div>
  </nav>
```

- [ ] **Step 2: Interceptar clique, respeitando ctrl/cmd/middle-click**

Substituir o forEach de `[data-tab]` em `bind` (linhas 117-119) por:

```js
    document.querySelectorAll('[data-tab]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button !== 0)) return;
        e.preventDefault();
        goTab(el.getAttribute('data-tab'));
      });
    });
```

(`preventDefault` só afeta os `<a>`; inofensivo pros `<button>` de CTA que continuam.)

- [ ] **Step 3: Reset defensivo dos `<a>` do nav**

Adicionar ao final de [styles.css](../../../styles.css):

```css
.nav__brand,
.nav__tab { text-decoration: none; color: inherit; cursor: pointer; }
```

- [ ] **Step 4: Verificar no browser**

Servir a raiz:
- Nav aparece idêntico ao anterior (sem sublinhado, cores certas, aba ativa destacada).
- Clicar navega suave (sem reload), URL muda.
- **Ctrl+clique** (ou botão do meio) numa aba → abre a rota em nova aba do navegador.
- `document.querySelectorAll('.nav__tab').length` → 5, todos `<a>` com `href` correto.

---

### Task 4: Rewrite nginx (fallback de rota)

Faz qualquer rota que não seja arquivo real servir `index.html`, pra reload/deep-link não dar 404.

**Files:**
- Create: `docs/deploy/nginx-snippet.conf`

**Interfaces:** nenhuma (config de deploy).

- [ ] **Step 1: Criar o snippet**

Criar `docs/deploy/nginx-snippet.conf`:

```nginx
# HiNaS — SPA fallback. Colar dentro do bloco `server { ... }` do site.
# Qualquer path que não seja arquivo/dir real cai em index.html;
# o app.js lê o pathname e mostra a aba certa.
location / {
    try_files $uri $uri/ /index.html;
}
```

- [ ] **Step 2: Verificar o fallback (no servidor / simulando)**

Após aplicar no nginx e recarregar config (`nginx -t && systemctl reload nginx`):
- Acessar direto `https://hinas.com.br/sobre` e dar **F5** → carrega na aba Sobre (não 404).
- Idem `/indicacoes`.

Local (opcional): qualquer server com fallback pra index.html reproduz. Ex.:
`npx serve -s .` (o `-s` serve index.html pra rotas desconhecidas) e abrir `/sobre`.

---

## Self-Review

**Spec coverage:**
- Mapa de rotas (incl. `indicacoes`) → Task 1 ✓
- Roteamento JS (pushState/readPath/popstate) → Task 2 ✓
- Meta por rota (title/description/og/canonical) → Task 1 (`applyRouteMeta`) + chamado em Task 2 ✓
- Nav crawlável → Task 3 ✓
- Rewrite nginx → Task 4 ✓
- Edge: slug desconhecido → `home` (Task 2 Step 2) ✓; pushState em try/catch (Task 2 Step 1) ✓

**Placeholder scan:** `<<DESC_*>>` são intencionais — substituídos pelos textos SEO aprovados antes de rodar a Task 1. Nenhum outro placeholder.

**Type consistency:** `goTab`, `applyRouteMeta`, `readPath`, `slugPath`, `SLUG_TO_TAB`, `TAB_TO_ROUTE` usados com os mesmos nomes/assinaturas entre Task 1→2→3. ✓

**Nota TDD/commits:** template padrão pede teste automatizado + commit por task; adaptado por não haver framework de teste (verificação manual no browser) e por instrução explícita de não commitar.
