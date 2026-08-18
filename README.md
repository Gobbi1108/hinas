# Handoff: Site do HiNaS — Grupo de Pesquisa

## Overview
Site institucional (portfólio) do **HiNaS — Grupo de Pesquisa Histórias de Vida, Narrativas e Subjetividades**, vinculado ao Programa de Pós-Graduação em Educação da UNIMEP. É um site de página única (single-page) com navegação por 5 abas: **Home, Sobre, Integrantes, Projetos, Notícias**. Objetivo: apresentar o grupo, seu texto de identidade, seus integrantes e reservar espaço para projetos e notícias (ainda sem conteúdo).

## About the Design Files
Os arquivos deste pacote são **referências de design criadas em HTML** — um protótipo mostrando aparência e comportamento pretendidos, **não** código de produção para copiar diretamente. A tarefa é **recriar este design no ambiente/codebase de destino** (ex.: React + Next.js, Vue, Astro, etc.), usando os padrões e bibliotecas já estabelecidos ali. Se ainda não houver um ambiente, escolha o framework mais adequado (recomendo React/Next.js ou Astro por ser um site majoritariamente de conteúdo) e implemente o design nele.

O protótipo foi escrito como um "Design Component" (`.dc.html`) com um runtime próprio de template — **ignore esse runtime**. O que importa é a estrutura visual, a paleta, a tipografia, os textos e as interações descritas abaixo.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos e interações são finais. Recrie a UI fielmente usando as bibliotecas/design system do codebase de destino.

## Screens / Views

### Navegação global (todas as telas)
- **Barra de navegação fixa no topo**, altura ~73px, fundo `rgba(247,243,236,.82)` com `backdrop-filter: blur(14px)`, borda inferior `1px solid rgba(21,50,78,.1)`.
- Esquerda: logo (imagem `logo-light.jpeg`, 40×40, `border-radius:9px`, `object-fit:cover; object-position:top`) + wordmark "HiNaS" em Space Grotesk 700, 20px, cor navy, `letter-spacing:-.5px`. Clicar volta para Home.
- Direita: itens de aba em Space Grotesk 500, 12px, `letter-spacing:1.2px`, `text-transform:uppercase`, cor navy, opacity .9. Hover → opacity 1 + cor coral. Aba ativa: barra dourada de 2px sob o texto (aparece com fade-in .3s).
- **Rodapé**: borda superior `1px solid rgba(21,50,78,.12)`, padding 44px 40px, logo + nome à esquerda, "PPGE · UNIMEP / Diretório de Grupos de Pesquisa · CNPq" à direita (Space Grotesk 11px, muted).

### 1. Home
Herói com **3 composições alternativas** selecionáveis por um seletor segmentado ("Composição da capa") logo abaixo. O estado da composição escolhida (`a`/`b`/`c`) controla qual herói é exibido. Padrão: **Aurora (a)**.

- **Aurora (a)** — herói claro, `min-height:88vh`, grid 2 colunas (1.15fr / .85fr), gap 56px, max-width 1280px centralizado.
  - Fundo: 4 "blobs" radiais desfocados (gold, coral, teal, plum) com `filter:blur(20-22px)`, opacity .16–.28, animados em loop (`driftA/B/C`, 18–26s ease-in-out infinite).
  - Coluna esquerda (anima com `fadeUp .7s`): eyebrow "Grupo de Pesquisa · Diretório CNPq"; H1 em Spectral 300, `clamp(42px,5.2vw,78px)`, line-height 1.02, "Histórias de vida, / *narrativas* e subjetividades" (com "narrativas" em itálico coral e "subjetividades" em gold 500); parágrafo (19px, muted, max 520px); dois botões (ver Interações).
  - Coluna direita: espaço de foto do grupo em contêiner com **animação de morphing orgânico** de `border-radius` (`blobMorph 16s`), `overflow:hidden`, sombra `0 30px 80px -30px rgba(21,50,78,.5)`.
- **Noturno (b)** — herói escuro `#0a1220`, centralizado, `min-height:88vh`. Glow radial turquesa pulsante (`glowPulse 8s`); dois anéis de círculo (`border` gold/coral translúcido) girando em sentidos opostos (`spinSlow` 60s e 44s reverse). Ao centro: a logo escura (`logo-dark.jpeg`, `width:min(420px,64vw)`, `border-radius:24px`); tagline "Grupo de Pesquisa · UNIMEP"; botão gold "Conheça o grupo".
- **Editorial (c)** — grid 2 colunas iguais. Esquerda: foto do grupo em fundo navy (mín. 60vh). Direita: eyebrow "Est. no Diretório CNPq"; H1 Spectral 300 "Narrar a vida / como método / *de pesquisa.*" (última linha itálico coral); régua dourada 56×3px; parágrafo; botão navy.
- **Faixa "Eixos de trabalho"** (comum abaixo de todos os heróis): grid de 4 colunas, gap 22px, cada item com borda-topo, círculo colorido 34px (coral/gold/teal/plum), número "01–04" e título em Spectral 20px 500. Os 4 eixos: *Narrativas (auto)biográficas*, *Memória*, *Formação de professores*, *Práticas pedagógicas*.
- **Seletor de composição**: pílula com fundo `rgba(21,50,78,.06)`, 3 botões (Aurora / Noturno / Editorial); ativo = fundo navy + texto paper.

### 2. Sobre
- Max-width 900px. Eyebrow "Sobre o grupo"; H2 Spectral 300 `clamp(34px,4.6vw,58px)` "Um espaço comum para *pensar a formação* a partir das histórias de vida." (trecho em itálico coral).
- Parágrafo 1 (20px, line-height 1.75) — texto institucional (ver "Conteúdo/Copy").
- **Bloco de citação full-width** fundo navy, texto paper, Spectral itálico 300 `clamp(24px,3vw,36px)`: "Nossas produções têm o compromisso de sistematizar experiências de pesquisa e formação, docente e discente, nas suas dimensões epistemológicas e metodológicas."
- Parágrafo 2 (20px).
- Grid de 4 cards (fundo branco, borda `1px solid rgba(21,50,78,.09)`, `border-radius:16px`, padding 26px 22px, hover `translateY(-4px)`): os 4 eixos com círculo colorido, título Spectral 19px 600 e descrição (14px, muted). Descrições:
  - Narrativas (auto)biográficas: "A vida narrada como fonte e método para compreender a formação."
  - Memória: "Rememorar experiências como gesto de pesquisa e de formação."
  - Formação de professores: "Processos formativos docentes em suas dimensões epistemológicas."
  - Práticas pedagógicas: "O cotidiano da docência lido à luz das histórias dos sujeitos."
- Linha de metadados (borda-topo): Instituição "PPGE · UNIMEP" / Área "Educação" / Registro "Diretório de Grupos · CNPq".

### 3. Integrantes
- Max-width 1200px. Eyebrow "Integrantes"; H2 "Pesquisadoras e pesquisadores"; parágrafo introdutório.
- Grid de 3 colunas, gap 32px. Cada card: foto (aspect-ratio 4/5, `border-radius:18px`, sombra `0 20px 50px -28px rgba(21,50,78,.5)`) com um véu de cor de acento por cima (opacity .14) e uma barra de acento 52×6px no canto inferior esquerdo; nome em Spectral 22px 600; função em Space Grotesk 12px uppercase muted.
- **Integrantes (todos Doutorado):** Kátia Silene da Silva · Luciana Haddad Ferreira · Marcia Kiyomi Koike · Renata Cristina Oliveira Barrichelo Cunha · Renata Helena Pin Pucci — todas "Doutora em Educação"; Thiago Borges de Aguiar — "Doutor em Educação". Cores de acento por card, em ordem: coral, gold, teal, plum, blue, navy.

### 4. Projetos (vazio)
Estado "em construção": `min-height:78vh`, centralizado. Blob radial teal animado ao fundo; um spinner circular (anel navy girando, `spinSlow 6s`); eyebrow "Projetos"; H2 "Em construção"; parágrafo convidando a enviar títulos/descrições/responsáveis.

### 5. Notícias (vazio)
Igual ao Projetos, com blob gold; ícone de 4 barras verticais coloridas (coral/gold/teal/plum, alternadas em altura); eyebrow "Notícias"; H2 "Em construção"; parágrafo pedindo as informações.

## Interactions & Behavior
- **Navegação por abas**: estado `tab` ∈ {home, sobre, integrantes, projetos, noticias}. Trocar a aba renderiza a seção correspondente e rola suavemente para o topo (`window.scrollTo({top:0, behavior:'smooth'})`).
- **Troca de composição da Home**: estado `hero` ∈ {a, b, c}, controlado pelo seletor segmentado.
- **Transições de entrada de seção**: `animation: fadeIn .5s ease` ao montar cada seção; blocos internos usam `fadeUp .6–1.1s`.
- **Botões**:
  - "Conheça o grupo" → vai para Sobre. Primário: fundo navy, texto paper, `border-radius:40px`, padding 15px 30px, Space Grotesk 13px 600; hover → fundo coral.
  - "Ver integrantes" → vai para Integrantes. Secundário: transparente, borda `1.5px solid rgba(21,50,78,.28)`; hover → borda navy.
- **Hovers**: itens de nav (opacity/cor), cards de eixo e de integrante (`translateY(-4px)`).
- **Animações decorativas em loop**: `driftA/B/C` (blobs), `blobMorph` (moldura da foto Aurora), `glowPulse` (glow Noturno), `spinSlow` (anéis Noturno e spinner Projetos).
- **Responsivo**: os grids de 2/3/4 colunas devem colapsar em telas estreitas (o protótipo usa larguras fixas de desktop; no codebase, aplicar breakpoints: heróis viram 1 coluna; integrantes 2→1 colunas; eixos 4→2→1).

## State Management
- `tab: 'home' | 'sobre' | 'integrantes' | 'projetos' | 'noticias'` — aba ativa (padrão `home`).
- `hero: 'a' | 'b' | 'c'` — composição da Home (padrão `a`). Recomendado escolher UMA composição definitiva na versão de produção (ou manter como toggle de admin); o seletor existe apenas para o cliente comparar.
- **Fotos**: no protótipo, as fotos (grupo + 6 integrantes) são placeholders de arrastar-e-soltar. Em produção, substituir por `<img>` reais servidos pelo app.
- Sem data fetching no protótipo; conteúdo é estático. Integrantes/eixos podem virar um array/CMS.

## Design Tokens
**Cores** (extraídas da logo — folhas em lâmpada):
- navy `#15324e` · gold `#e5a029` · coral `#d94f3a` · teal `#4c9cb8` · plum `#8a3b5e` · blue `#245380`
- paper (fundo) `#f7f3ec` · ink (texto) `#16222e` · muted `#5c6b78`
- painel escuro (Noturno) `#0a1220`
- Bordas comuns: `rgba(21,50,78,.09–.14)`; seleção de texto: fundo gold / texto navy.

**Tipografia** (Google Fonts):
- Display/corpo editorial: **Spectral** (300/400/500/600, itálico 400/500). Usada em H1/H2, citações, nomes, corpo de texto.
- UI/labels: **Space Grotesk** (400/500/600/700). Usada em nav, eyebrows, botões, números, metadados — geralmente uppercase com `letter-spacing`.
- Escala de títulos: H1 `clamp(42px,5.2vw,78px)`; H2 `clamp(34px,4.6vw,58px)`; citação `clamp(24px,3vw,36px)`. Corpo 18–20px, line-height 1.6–1.75. Labels 11–13px.

**Raios de borda:** botões/pílulas 40px; cards 16–18px; foto Aurora animada (`blobMorph`); moldura logo Noturno 24px.

**Sombras:** foto Aurora `0 30px 80px -30px rgba(21,50,78,.5)`; card de integrante `0 20px 50px -28px rgba(21,50,78,.5)`.

**Espaçamento:** container max-width 900–1280px; padding horizontal de seção 40px; gaps de grid 22–56px.

## Assets
- `assets/logo-light.jpeg` — logo em fundo claro (lâmpada de folhas coloridas + wordmark "HiNaS"). Usada na nav e no rodapé. **Peça ao cliente a versão vetorial (SVG/PNG transparente)** para produção — o JPEG tem fundo branco.
- `assets/logo-dark.jpeg` — a mesma logo em fundo preto; usada na composição Noturno. Também idealmente substituir por vetor/transparente.
- **Foto do grupo** e **fotos dos 6 integrantes**: ainda NÃO fornecidas — são placeholders no protótipo. Solicitar ao cliente.

## Conteúdo/Copy (texto institucional — usar na íntegra)
Parágrafo 1: "Este grupo foi idealizado por pesquisadores do Programa de Pós-Graduação em Educação da UNIMEP, pertencentes a distintos núcleos de estudos e pesquisa, e pesquisadores convidados. A partir de afinidades temáticas de suas pesquisas, voltadas para a constituição dos sujeitos nas relações sociais, instituímos um espaço de trabalho comum para fortalecer a participação de estudantes e pesquisadores da área de educação."

Parágrafo 2: "Privilegiamos as relações entre narrativa (auto)biográfica, memória, formação de professores e práticas pedagógicas. Os trabalhos do grupo podem ser encontrados em publicações em parceria de seus membros — artigos e trabalhos em eventos. Trabalhos individuais dos pesquisadores também refletem interfaces oriundas dos intercâmbios do grupo."

Fonte oficial dos dados dos integrantes: Diretório de Grupos de Pesquisa do CNPq (espelho do grupo `0976371314368679`).

## Files
- `HiNaS.dc.html` — protótipo completo (todas as 5 abas + 3 composições da Home). Referência visual e de comportamento.
- `assets/logo-light.jpeg`, `assets/logo-dark.jpeg` — logotipos.
