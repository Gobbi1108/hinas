# Aba Teses e Dissertações — Design

**Data:** 2026-07-14
**Site:** HiNaS (`d:\hinas`), HTML/CSS/JS puro, single-page, render por dados em `app.js`.

## Objetivo

Transformar a aba "Teses e Dissertações" (hoje um estado vazio "Em construção") num espaço de
leitura das obras produzidas no âmbito do grupo. Cada obra exibe metadados e o resumo; se o
resumo for longo, o usuário clica em "Ver mais" para expandir o texto inteiro na própria página.

## Escopo

**No escopo:**
- Lista de leitura com as duas obras já disponíveis em `assets/teses_dissertações.txt`.
- Conteúdo por obra: tipo (Dissertação), ano, título, autora, orientadora, resumo, link do trabalho.
- Resumo colapsado com "Ver mais / Ver menos" (expande inline).
- Botão que leva ao trabalho completo (PDF ou portfólio) em nova aba.

**Fora do escopo (fácil de estender depois):**
- Texto integral da tese colado no site.
- Busca, filtro, ordenação, paginação.
- Mais de duas obras (basta crescer o array de dados).

## Dados (`app.js`)

Novo array `TESES`, mesmo padrão de `LINES` / `MEMBERS`. Cada item:

| campo     | descrição                                    |
|-----------|----------------------------------------------|
| `kind`    | tipo do trabalho, ex. `'Dissertação'`        |
| `year`    | ano, ex. `'2024'`                            |
| `title`   | título completo                              |
| `author`  | autora                                       |
| `advisor` | orientadora                                  |
| `abstract`| resumo (texto longo)                         |
| `link`    | URL do trabalho (PDF ou portfólio)           |
| `accent`  | cor de destaque (`C.coral`, `C.teal`)        |

Duas entradas semeadas a partir do txt:
1. *O que dizem as narrativas de estudantes egressos...* — Flávia Shirakashi Seimandi,
   orient. Renata H. P. Pucci, 2024 — accent coral.
2. *Narrativas (auto)biográficas da professora...* — Elaine da Silveira Ribeiro Ferrarese,
   orient. Luciana Haddad Ferreira, 2023 — accent teal.

## Render (`app.js`)

- Nova função `renderTeses()` que monta o HTML das obras dentro de `[data-teses]`.
- Chamada em `init()`, junto com os outros `render*`.
- Mesmo estilo de construção de string dos renders existentes.

## Markup (`index.html`)

Substituir o bloco `.empty` dentro de `section[data-screen="teses"]` por:

```
<div class="teses">
  <div class="eyebrow eyebrow--blue">Teses e Dissertações</div>
  <h2 class="display display--h2">Trabalhos do grupo</h2>
  <p class="teses__intro">Teses e dissertações produzidas no âmbito do HiNaS. Clique em "Ver mais"
     para ler o resumo completo ou acesse o trabalho na íntegra.</p>
  <div class="teses__list" data-teses></div>
</div>
```

Cada obra (gerada por `renderTeses`), classe `.tese`:
- barra de accent à esquerda (linguagem visual de `.member__bar`)
- eyebrow: `Dissertação · 2024`
- título grande
- metadados: `<autora>` · `Orientação: <orientadora>`
- resumo em `.tese__abstract` (base tipográfica de `.prose`), colapsado por padrão
- ações: botão **"Ver mais"** + link **"Acessar trabalho ↗"** (`target="_blank"`, `rel="noopener"`)

Rótulo do link é genérico ("Acessar trabalho") porque o destino pode ser PDF ou portfólio.

## "Ver mais" (comportamento)

- Estado colapsado: `.tese__abstract` com `max-height` (~7.5em) e gradiente de fade no rodapé.
- Botão faz toggle de `is-expanded` no `.tese`.
- Expandido: `max-height` liberado, fade some, rótulo do botão vira "Ver menos".
- `aria-expanded` no botão reflete o estado.
- Evento por delegação (padrão do app, como `bindMemberCta`).
- Respeita `prefers-reduced-motion`: sem transição de altura.

## CSS (`styles.css`)

- Novo bloco `.tese*` reusando tokens existentes (`--ink`, `--blue`, `--navy`, `--paper`, `--muted`, radius 16px).
- Fade do resumo: pseudo-elemento com gradiente de `transparent` até `var(--paper)`.
- Sem bibliotecas.

### Responsividade (alinhada ao padrão do site)

O site já usa `clamp()` fluido + breakpoints em `900px` e `560px` + bloco `prefers-reduced-motion`.
O `.tese*` segue o mesmo:

- **Fluido por padrão (mobile-first, sem media query):**
  - Padding do bloco: `clamp(20px,4vw,40px)`.
  - Título: reusa `.display--h3` (já é `clamp(30px,4vw,50px)`).
  - Resumo: `font-size:clamp(16px,2.2vw,20px)` (encolhe do padrão `.prose` 20px no celular).
  - Espaçamento entre obras: `gap:clamp(28px,5vw,56px)`.
  - Altura colapsada em unidade relativa (`em`/`lh`), não px — acompanha o tamanho de fonte fluido.
- **`@media (max-width:560px)`:**
  - Barra de accent vira faixa horizontal no topo (em vez de lateral), para não roubar largura do texto.
  - Ações (`Ver mais` + `Acessar trabalho`) empilham verticalmente, botões com `width:100%` e alvo de toque ≥44px.
  - Reduz padding lateral para aproveitar a tela estreita.
- **Toque:** `.tese__more` é `<button>` real (teclado + toque), sem depender de `:hover`.
- **`prefers-reduced-motion`:** entra no bloco existente — sem transição de `max-height` ao expandir.

Resultado: obras full-width empilhadas, texto legível de ~320px a desktop, sem overflow horizontal.

## Critérios de sucesso

- As duas obras aparecem na aba com metadados corretos.
- Resumo longo aparece truncado com fade; "Ver mais" revela o texto inteiro; "Ver menos" recolhe.
- "Acessar trabalho" abre o link correto em nova aba.
- Funciona sem JS quebrar em telas móveis e com `prefers-reduced-motion`.
- Nenhuma dependência nova; segue o padrão vanilla do site.
