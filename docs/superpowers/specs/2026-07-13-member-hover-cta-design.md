# Bolha "Clique para mais informações" — hover nos integrantes

**Data:** 2026-07-13 · **Status:** aprovado

## Comportamento
- Cursor entra na foto de um integrante (aba Integrantes): cursor nativo some (`cursor: none`) e é substituído por bolha circular (~112px) que segue o mouse com leve atraso.
- Bolha: fundo na cor `accent` do integrante, texto branco "Clique para mais informações" centralizado.
- Cursor sai da foto: bolha encolhe (scale 0) e some (fade).
- Aplica-se a **todos** os integrantes, com ou sem link Lattes. Sem Lattes: clique não faz nada (placeholder para futura página de detalhes).

## Implementação
1. `app.js` — `renderMemberGrid`: adiciona `<div class="member__cta" style="background:accent">` dentro de `.member__photo`.
2. `app.js` — listener `mousemove` delegado nos `.members__grid`: posiciona bolha nas coordenadas do mouse relativas à foto.
3. `styles.css` — `.member__cta`: círculo absoluto, `translate(-50%,-50%) scale(0)` + `opacity:0`; visível em `:hover`. Transição em `left/top` dá o efeito de seguir com atraso. `cursor:none` só em `@media (hover:hover)`; bolha oculta em `@media (hover:none)` (touch).

## Acessibilidade
- Touch: sem bolha (sem hover).
- `prefers-reduced-motion`: regra global existente (styles.css) zera animações; bolha aparece sem movimento.
- Bolha é `pointer-events:none` — não bloqueia clique no link Lattes.
