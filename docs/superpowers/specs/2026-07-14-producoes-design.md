# Aba Produções — Design

**Data:** 2026-07-14
**Site:** HiNaS (`d:\hinas`), HTML/CSS/JS puro, single-page. Segue e reusa o componente criado para Teses e Dissertações.

## Objetivo

Preencher a aba "Produções" (hoje estado vazio "Em construção") com as publicações do grupo —
artigos, capítulos, trabalhos em eventos. Mesmo card de leitura das teses, com "Ver mais" para o
resumo e link para a publicação. Diferença central: a barra de destaque é um **gradiente com as
cores das autoras**.

## Escopo

**No escopo:**
- Lista de publicações reusando o card `.tese*` (sem eyebrow).
- Conteúdo por item: título, autoras (lista), resumo, link DOI.
- Barra em gradiente vertical com as cores das autoras.
- "Ver mais / Ver menos" (mesma interação das teses, generalizada).
- Botão "Ler no DOI ↗".

**Fora do escopo:** ano/veículo (não estão no txt), busca/filtro. Estende crescendo o array.

## Dados (`app.js`)

Novo array `PRODUCOES`, cada item: `title`, `authors` (array de nomes), `abstract`, `doi`.
Uma entrada semeada de `assets/producoes.txt` (artigo "Por uma ética do cuidado…", 3 autoras).

## Cor por autora

- `AUTHOR_COLORS`: mapa nome→cor **derivado de `LEADERS`+`MEMBERS`** (DRY, não redigita as cores).
- `FALLBACK_COLORS`: pool para autoras de fora do grupo (`C.navy`, `C.green`), rotacionado e
  cacheado por nome (mesma autora → sempre a mesma cor).
- `authorColor(nome)`: membro → cor do membro; senão → próximo do pool (cacheado).
- Match por nome exato; os nomes no array de dados são gravados sem espaços sobrando.

## Render (`app.js`)

- `renderProducoes()` injeta em `[data-producoes]`, reusando as classes `.tese*`.
- Barra: `cols = authors.map(authorColor)`; 1 cor → sólida; 2+ →
  `linear-gradient(to bottom, c1, c2, …)` inline no `.tese__bar` (o inline vence o
  `background:var(--accent,…)` padrão do `.tese__bar`).
- Sem eyebrow. `.tese__meta` recebe as autoras juntadas por " · ".
- Ações: `.tese__more` ("Ver mais") + `<a>` "Ler no DOI ↗" (`target="_blank"`, `rel="noopener"`).
- Chamada em `init()` após `renderTeses()`.

## Interação "Ver mais"

Generalizar o handler existente para cobrir teses **e** produções: delegação única por
`.tese__more` (nível documento), alternando `is-expanded` no `.tese` mais próximo, `aria-expanded`
e o texto do botão. Substitui o `bindTeses` atual (escopo `[data-teses]`).

## Markup (`index.html`)

Trocar o `.empty` da `section[data-screen="producoes"]` por `.teses > .teses__list[data-producoes]`,
com eyebrow "Produções", `h2` "Produções do grupo" e intro própria.

## CSS

Nenhum CSS novo: reusa `.teses`, `.teses__intro`, `.teses__list`, `.tese*`. A barra em gradiente é
inline, sobrepondo o `background` do `.tese__bar`.

## Critérios de sucesso

- A publicação aparece na aba com título, autoras, resumo e "Ler no DOI ↗".
- Barra mostra o gradiente das cores das autoras (Luciana=dourado, Renata=azul, Neuzita=fallback),
  com fade contínuo entre elas.
- "Ver mais/menos" funciona em teses e produções.
- Responsivo/reduced-motion herdados das classes `.tese*`.
- Sem dependências novas; `node --check app.js` passa.
