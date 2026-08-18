# Aba Teses e Dissertações — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a aba "Teses e Dissertações" (hoje estado vazio) num espaço de leitura das obras, com resumo colapsável ("Ver mais") e link para o trabalho na íntegra.

**Architecture:** Segue o padrão do site — dados em array no `app.js`, função `render*` que injeta HTML num container `[data-*]`, CSS por classe em `styles.css`. Nada de build, nada de bibliotecas. Interação "Ver mais" por delegação de evento, como `bindMemberCta`.

**Tech Stack:** HTML/CSS/JS puro (ES5, IIFE em `app.js`). Fontes Space Grotesk + Spectral já carregadas. Sem framework de teste — **verificação é manual no navegador** (abrir `d:\hinas\index.html`).

## Global Constraints

- Sem bibliotecas / sem build. Vanilla ES5 no estilo do `app.js` existente (strings concatenadas, `var`, `function`).
- Reusar tokens CSS existentes: `--paper #f7f3ec`, `--ink #16222e`, `--muted #5c6b78`, `--blue`, `--navy`, `--coral`, `--teal`, radius 16px.
- Responsivo fluido com `clamp()`; breakpoints do site: `900px` e `560px`. Sem overflow horizontal de ~320px a desktop.
- Rótulo do link é **"Acessar trabalho ↗"** (destino pode ser PDF ou portfólio), não "PDF".
- Respeitar `prefers-reduced-motion` (bloco já existe em `styles.css:299`).
- Repositório **não é git** — sem passos de commit. Após cada task, verificar no navegador.

---

### Task 1: Dados + container + render (conteúdo aparece na aba)

**Files:**
- Modify: `d:\hinas\app.js` (adicionar array `TESES`, função `renderTeses()`, chamada em `init()`)
- Modify: `d:\hinas\index.html:167-180` (substituir o bloco `.empty` da section `data-screen="teses"`)

**Interfaces:**
- Consumes: mapa de cores `C` (`app.js:7-11`), padrão de `renderMemberGrid` (`app.js:88`).
- Produces: `renderTeses()` que preenche `[data-teses]`; cada obra é `<article class="tese" style="--accent:…">` com `.tese__abstract` e `<button class="tese__more" aria-expanded="false">`. A Task 3 depende desses nomes de classe e do `aria-expanded`.

- [ ] **Step 1: Adicionar o array `TESES` em `app.js`**

Inserir logo após o bloco `MEMBERS` (depois de `app.js:37`, antes de `var SITE`):

```javascript
var TESES = [
  {
    kind: 'Dissertação', year: '2024', accent: C.coral,
    title: 'O que dizem as narrativas de estudantes egressos do Ensino Médio Integral público? Uma análise sobre seus processos formativos',
    author: 'Flávia Shirakashi Seimandi',
    advisor: 'Renata H. P. Pucci',
    abstract: 'Esta dissertação, financiada pela Coordenação de Aperfeiçoamento de Pessoal de Nível Superior (Capes) e inserida na linha de pesquisa Formação de Professores, Trabalho Docente e Práticas Educativas do Programa de Pós-Graduação Stricto Sensu (PPGSS) em Educação da Universidade São Francisco (USF), teve como tema de investigação os processos formativos de estudantes egressos de uma mesma escola pública de Ensino Médio Integral do estado de São Paulo e como objetivo compreender, nas narrativas dos estudantes egressos, quais experiências vivenciadas, no contexto da escola de ensino integral pública, que os marcaram e, consequentemente, os impactaram em relação às diferentes escolhas durante suas trajetórias. Ouvir os jovens e o sentido que eles atribuem à escola, a partir de suas condições concretas de vida, pode ser um dos caminhos para a compreensão e o enfrentamento na superação dos desafios vivenciados por eles. Trata-se de uma pesquisa qualitativa, cuja abordagem metodológica realizada se deu a partir da análise das histórias descritas nas narrativas de oito estudantes dessa escola do interior de São Paulo, que concluíram os estudos entre 2015 e 2021, e que foram ouvidos em 2023, em um encontro coletivo e alguns encontros individuais, nos quais foram solicitadas narrativas sobre as experiências vivenciadas no Ensino Médio. A Teoria Histórico-Cultural, especialmente com base em Lev Vigotski, tendo como fundo o estudo do meio e os processos de significação no desenvolvimento do indivíduo, deram suporte para a compreensão do tema em estudo e para a análise das narrativas dos discentes. Entendendo o quanto essas narrativas são portadoras de significado, este estudo apoiou-se nos estudos de Carlo Ginzburg sobre o Paradigma Indiciário, na intenção de auxiliar o entendimento dos conceitos teóricos de forma mais humanizada. As perguntas da pesquisa foram: O que dizem as narrativas de estudantes do Ensino Médio Público Integral acerca de seus processos formativos? Como suas experiências contribuem e impactam para a elaboração de seus projetos e escolhas de vida? Algumas lições serão deixadas por esta pesquisa: ao analisarem-se as narrativas, percebeu-se a importância dos espaços de escuta dos estudantes nas escolas e confirmou-se que a Educação Integral é muito potente sim, e pode ser uma possibilidade de ampliar as aprendizagens, além de contribuir muito para os processos formativos dos estudantes, desde que o custo não seja uma forma de aumentar ainda mais a reprodução de desigualdades.',
    link: 'https://www.usf.edu.br/galeria/getImage/385/3213015878981224.pdf'
  },
  {
    kind: 'Dissertação', year: '2023', accent: C.teal,
    title: 'Narrativas (auto)biográficas da professora: contribuições do drama na formação docente',
    author: 'Elaine da Silveira Ribeiro Ferrarese',
    advisor: 'Luciana Haddad Ferreira',
    abstract: 'Esta pesquisa tem como tema a formação permanente da professora e o principal objetivo foi compreender, por meio das narrativas (auto)biográficas, os eventos dramáticos vivenciados pela professora no cotidiano escolar e como eles contribuem para o desenvolvimento de sua personalidade consciente. O material empírico utilizado nas investigações foram as narrativas tecidas no cotidiano escolar entre os meses de outubro de 2019 a março de 2020, a partir das experiências vividas como professora do Ensino Fundamental I em uma rede pública municipal de ensino. Assim, a pesquisa narrativa foi condutora de toda a investigação e é utilizada como fonte de dados, como registro do texto da pesquisa e como produção de conhecimento. A investigação parte da Teoria Histórico-Cultural que teve lugar central na produção e compreensão das narrativas, oferecendo noções fundamentais como drama, aprendizado, desenvolvimento, perejivanie, situação social de desenvolvimento e personalidade consciente tal como apresentado por Vigotski. A partir da teoria histórico-cultural foi possível observar como os eventos dramáticos vivenciados pela professora contribuem para o desenvolvimento de sua personalidade consciente. Além da teoria histórico-cultural, o paradigma indiciário desenvolvido por Carlo Ginzburg contribuiu na organização do material empírico a fim de buscar os sinais e indícios que se revelaram nas narrativas. A pesquisa aponta que, ao desempenhar o papel da docência, a professora vivencia situações contraditórias e (in)tensas no espaço escolar, situações que caracterizamos como eventos dramáticos em que ocorre o choque entre afetos contraditórios, desencadeando processos de conflitos cognitivos e afetivos, e todo esse processo dialético entre o individual e social, racional e emocional, biológico e cultural contribui para o desenvolvimento da personalidade consciente da professora, que é marcado por possibilidade e limitações (tanto de fatores externos como internos). Desenvolvimento que parte do social, das condições que lhe são dadas e (res)significadas por meio das interações dramáticas. Nesse sentido, a professora vai tensionando para além das condições sociais e culturais em busca de superação, adaptação e possibilidades outras em seu permanente processo de formação.',
    link: 'https://iepapp.unimep.br/biblioteca_digital/visualiza.php?cod=MjE2Nw=='
  }
];
```

- [ ] **Step 2: Adicionar a função `renderTeses()` em `app.js`**

Inserir após `renderMemberGrid` (depois de `app.js:108`), dentro do bloco de renders:

```javascript
function renderTeses() {
  var el = document.querySelector('[data-teses]');
  if (!el) return;
  el.innerHTML = TESES.map(function (t) {
    return '<article class="tese" style="--accent:' + t.accent + '">' +
      '<div class="tese__bar"></div>' +
      '<div class="tese__body">' +
        '<div class="eyebrow eyebrow--blue tese__kind">' + t.kind + ' · ' + t.year + '</div>' +
        '<h3 class="display display--h3 tese__title">' + t.title + '</h3>' +
        '<div class="tese__meta">' + t.author +
          ' <span class="tese__advisor">· Orientação: ' + t.advisor + '</span></div>' +
        '<div class="tese__abstract prose">' + t.abstract + '</div>' +
        '<div class="tese__actions">' +
          '<button class="btn btn--ghost tese__more" type="button" aria-expanded="false">Ver mais</button>' +
          '<a class="btn btn--primary" href="' + t.link + '" target="_blank" rel="noopener">Acessar trabalho ↗</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('');
}
```

- [ ] **Step 3: Chamar `renderTeses()` no `init()`**

Em `app.js`, na função `init()` (`app.js:256`), adicionar a chamada junto aos outros renders, logo após `renderMemberGrid('[data-members]', MEMBERS);` (`app.js:260`):

```javascript
    renderMemberGrid('[data-members]', MEMBERS);
    renderTeses();
    bind();
```

- [ ] **Step 4: Substituir o markup da section `teses` em `index.html`**

Trocar o bloco inteiro `index.html:167-180` (a `<section data-screen="teses">` com `.empty`) por:

```html
    <!-- ==================== TESES E DISSERTAÇÕES ==================== -->
    <section class="screen" data-screen="teses" hidden>
      <div class="teses">
        <div class="eyebrow eyebrow--blue">Teses e Dissertações</div>
        <h2 class="display display--h2">Trabalhos do grupo</h2>
        <p class="teses__intro">Teses e dissertações produzidas no âmbito do HiNaS. Clique em “Ver mais” para ler o resumo completo ou acesse o trabalho na íntegra.</p>
        <div class="teses__list" data-teses></div>
      </div>
    </section>
```

- [ ] **Step 5: Verificar no navegador**

Abrir `d:\hinas\index.html`, clicar na aba **Teses e Dissertações** (ou ir para `/teses`).
Esperado: aparecem as **duas obras** com tipo·ano, título, autora · orientação, resumo (longo, ainda sem truncar) e os botões "Ver mais" e "Acessar trabalho ↗". Sem erro no console (F12).

---

### Task 2: Estilo + responsividade + truncagem com fade

**Files:**
- Modify: `d:\hinas\styles.css` (novo bloco `.teses*` / `.tese*`; regra dentro do `@media (max-width:560px)` existente em `styles.css:283`; regra no bloco `@media (prefers-reduced-motion:reduce)` em `styles.css:299`)

**Interfaces:**
- Consumes: classes geradas na Task 1 (`.tese`, `.tese__bar`, `.tese__abstract`, `.tese__actions`, var `--accent`).
- Produces: `.tese` colapsado por padrão (classe de expansão `is-expanded` será alternada pela Task 3). Regra chave: `.tese.is-expanded .tese__abstract { max-height: 200em }` e fade some.

- [ ] **Step 1: Adicionar o bloco base `.teses*` em `styles.css`**

Inserir antes do primeiro `@media` de layout (antes de `styles.css:263`, `@media (max-width:900px)`):

```css
/* ===== Teses e Dissertações ===== */
.teses{max-width:1000px;margin:0 auto;padding:clamp(24px,5vw,64px) clamp(20px,5vw,40px)}
.teses .eyebrow{margin-bottom:18px}
.teses__intro{font-size:clamp(16px,2.2vw,20px);line-height:1.6;color:var(--muted);max-width:680px;margin:14px 0 clamp(28px,5vw,48px)}
.teses__list{display:flex;flex-direction:column;gap:clamp(28px,5vw,56px)}

.tese{position:relative;display:flex;gap:clamp(16px,2.5vw,26px);background:#fff;border:1px solid rgba(21,50,78,.09);border-radius:16px;padding:clamp(20px,4vw,40px);overflow:hidden}
.tese__bar{flex:0 0 6px;align-self:stretch;border-radius:6px;background:var(--accent,var(--blue))}
.tese__body{flex:1 1 auto;min-width:0}
.tese__kind{margin-bottom:14px}
.tese__title{font-size:clamp(24px,3.2vw,38px);max-width:none;margin:0 0 14px}
.tese__meta{font-family:'Space Grotesk',sans-serif;font-size:clamp(14px,1.8vw,16px);color:var(--ink);margin-bottom:20px}
.tese__advisor{color:var(--muted)}

.tese__abstract{position:relative;font-size:clamp(16px,2.2vw,20px);line-height:1.75;color:var(--ink);margin:0;max-height:12.5em;overflow:hidden;transition:max-height .35s ease}
.tese__abstract::after{content:"";position:absolute;left:0;right:0;bottom:0;height:4.5em;background:linear-gradient(to bottom,rgba(255,255,255,0),#fff);pointer-events:none;transition:opacity .25s ease}
.tese.is-expanded .tese__abstract{max-height:200em}
.tese.is-expanded .tese__abstract::after{opacity:0}

.tese__actions{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:24px}
```

- [ ] **Step 2: Adicionar a regra mobile no `@media (max-width:560px)` existente**

Dentro do bloco que começa em `styles.css:283` (`@media (max-width:560px){ … }`), acrescentar antes do `}` de fechamento:

```css
  .tese{flex-direction:column;gap:16px}
  .tese__bar{flex-basis:6px;width:100%;align-self:auto}
  .tese__actions{flex-direction:column;align-items:stretch}
  .tese__actions .btn{width:100%;min-height:44px;display:inline-flex;align-items:center;justify-content:center}
```

- [ ] **Step 3: Desligar a transição no `@media (prefers-reduced-motion:reduce)`**

Dentro do bloco em `styles.css:299`, acrescentar:

```css
  .tese__abstract,.tese__abstract::after{transition:none}
```

- [ ] **Step 4: Verificar no navegador**

Recarregar `/teses`. Esperado: cada obra num cartão branco, barra colorida (coral na 1ª, teal na 2ª), resumo **truncado (~7 linhas)** com **fade** para branco no rodapé; botões visíveis. Redimensionar a janela para ≤560px (ou DevTools responsivo, ~320px): barra vira faixa horizontal no topo, botões empilham e ocupam largura total, sem scroll horizontal. Tipografia encolhe suavemente.

---

### Task 3: Interação "Ver mais / Ver menos"

**Files:**
- Modify: `d:\hinas\app.js` (nova função `bindTeses()` + chamada dentro de `bind()`)

**Interfaces:**
- Consumes: `.tese__more` (botão com `aria-expanded`) e `.tese` da Task 1; classe `is-expanded` estilizada na Task 2.
- Produces: toggle de `is-expanded` no `.tese` mais próximo; atualiza `aria-expanded` e o texto do botão ("Ver mais" ↔ "Ver menos").

- [ ] **Step 1: Adicionar `bindTeses()` em `app.js`**

Inserir logo após `bindMemberCta` fechar (depois de `app.js:245`), antes de `readPath`:

```javascript
function bindTeses() {
  var list = document.querySelector('[data-teses]');
  if (!list) return;
  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.tese__more');
    if (!btn) return;
    var tese = btn.closest('.tese');
    if (!tese) return;
    var expanded = tese.classList.toggle('is-expanded');
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    btn.textContent = expanded ? 'Ver menos' : 'Ver mais';
  });
}
```

- [ ] **Step 2: Chamar `bindTeses()` dentro de `bind()`**

Em `bind()` (`app.js:174`), logo após `bindMemberCta();` (`app.js:185`):

```javascript
    bindMemberCta();
    bindTeses();
  }
```

- [ ] **Step 3: Verificar no navegador**

Recarregar `/teses`. Clicar em **"Ver mais"** numa obra: o resumo expande até o fim, o fade some e o botão vira **"Ver menos"**. Clicar de novo: recolhe e volta a "Ver mais". Testar com teclado (Tab até o botão, Enter/Espaço). Conferir `aria-expanded` alternando no DevTools. Ativar `prefers-reduced-motion` (DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce): expande sem animação de altura. As duas obras funcionam de forma independente.

---

## Notas de verificação final

- Abrir `d:\hinas\index.html`, navegar `/teses` — duas obras, dados corretos conforme `assets/teses_dissertações.txt`.
- Truncagem + "Ver mais/menos" funcionam nas duas, independentes.
- "Acessar trabalho ↗" abre o link certo em nova aba (obra 1 → PDF USF; obra 2 → portfólio UNIMEP).
- ~320px a desktop: sem overflow horizontal; botões com alvo de toque ≥44px no mobile.
- Console sem erros.
