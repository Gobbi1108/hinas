/* ============================================================
   HiNaS — single-page tab + hero state
   ============================================================ */
(function () {
  'use strict';

  var C = {
    gold: '#e5a029', coral: '#d94f3a', teal: '#4c9cb8',
    plum: '#8a3b5e', navy: '#15324e', blue: '#245380',
    green: '#567d46',
    // Tons pastel (novos integrantes)
    pblue: '#8faccf', prose: '#d99fb5', psage: '#9cbf94',
    ppeach: '#e0b184', plilac: '#b0a3d1',
    pmint: '#8ccbb2', paqua: '#83bfcb', pchartreuse: '#c9cf8a',
    porchid: '#c69ac9', pblush: '#e0a5a0',
    pfolha: '#b2d590', pmagenta: '#d590c4', plavanda: '#b990d5',
    panil: '#9097d5', pjade: '#90d59a',
  };

  // ---- Data ------------------------------------------------
  var LINES = [
    { n: '01', t: 'Narrativas (auto)biográficas', color: C.coral, d: 'A vida narrada como fonte e método para compreender a formação.' },
    { n: '02', t: 'Memória', color: C.gold, d: 'Rememorar experiências como gesto de pesquisa e de formação.' },
    { n: '03', t: 'Formação de professores', color: C.teal, d: 'Processos formativos docentes em suas dimensões epistemológicas.' },
    { n: '04', t: 'Práticas pedagógicas', color: C.plum, d: 'O cotidiano da docência lido à luz das histórias dos sujeitos.' },
  ];

  var LEADERS = [
    { name: 'Renata Helena Pin Pucci', slotId: 'm5', accent: C.blue, photo: 'assets/prof/RenataHelenaPinPucci.webp', lattes: 'https://lattes.cnpq.br/4415867437970278' },
    { name: 'Luciana Haddad Ferreira', slotId: 'm2', accent: C.gold, photo: 'assets/prof/LucianaHaddadFerreira.webp', lattes: 'https://lattes.cnpq.br/0247458923893398' },
  ].map(function (m) {
    m.role = 'Líder do grupo · Doutora em Educação';
    return m;
  });

  var MEMBERS = [
    { name: 'Elaine da Silveira Ribeiro Ferrarese', slotId: 'm1', accent: C.coral, photo: 'assets/prof/ElainedaSilveiraRibeiroFerrarese.webp', lattes: 'http://lattes.cnpq.br/2252266198050608' },
    { name: 'Fernanda Ferreira de Oliveira', slotId: 'm3', accent: C.teal, photo: 'assets/prof/FernandaFerreiradeOliveira.webp', lattes: 'http://lattes.cnpq.br/6420005411369649' },
    { name: 'Marissol Prezotto', slotId: 'm4', accent: C.plum, photo: 'assets/prof/MarissolPrezotto.webp', lattes: 'http://lattes.cnpq.br/5764087747512788' },
    { name: 'Fernanda de Jesus Santos Brito', slotId: 'm6', accent: C.ppeach, photo: 'assets/prof/FernandadeJesusSantosBrito.webp', lattes: 'http://lattes.cnpq.br/6442107340102495', role: 'Doutora em Educação' },
    { name: 'Vinícius Gabryel Piovesan Evaristo', slotId: 'm7', accent: C.pblue, photo: 'assets/prof/ViniciusGabryelPiovesanEvaristo.webp', lattes: 'http://lattes.cnpq.br/2125394780485266', role: 'Mestre em Educação' },
    { name: 'Ana Caroline Franco', slotId: 'm8', accent: C.prose, photo: 'assets/prof/AnaCarolineFranco.webp', lattes: 'http://lattes.cnpq.br/0323054642068070', role: 'Mestra em Educação' },
    { name: 'Camila Rossi', slotId: 'm9', accent: C.psage, photo: 'assets/prof/CamilaRossi.webp', lattes: 'http://lattes.cnpq.br/0016242042069152', role: 'Graduada em Educação' },
    { name: 'Isabella Gualtieri Elias', slotId: 'm10', accent: C.plilac, photo: 'assets/prof/IsabellaGualtieriElias.webp', lattes: 'http://lattes.cnpq.br/2967989174099730', role: 'Graduada em Educação' },
    { name: 'Suelen Aparecida de Carvalho Rela', slotId: 'm11', accent: C.pmint, photo: 'assets/prof/SuelenAparecidadeCarvalhoRela.webp', lattes: 'http://lattes.cnpq.br/1388572052014967', role: 'Mestra em Educação' },
    { name: 'Poliana Helena Batista Thomaz', slotId: 'm12', accent: C.porchid, photo: 'assets/prof/PolianaHelenaBatistaThomaz.webp', lattes: 'http://lattes.cnpq.br/0907521175340448', role: 'Mestra em Educação' },
    { name: 'Matheus Victor Vieira Delvechio', slotId: 'm13', accent: C.paqua, photo: 'assets/prof/MatheusVictorVieiraDelvechio.webp', lattes: 'http://lattes.cnpq.br/0053167847895113', role: 'Graduado em Direito' },
    { name: 'Marcos Otávio Cassiano dos Santos Lima', slotId: 'm14', accent: C.pchartreuse, photo: 'assets/prof/MarcosOtavioCassianodosSantosLima.webp', lattes: 'http://lattes.cnpq.br/9858359000729254', role: 'Mestre em Educação' },
    { name: 'José Mário Regis Silva', slotId: 'm15', accent: C.pblush, photo: 'assets/prof/JoseMarioRegisSilva.webp', lattes: 'http://lattes.cnpq.br/6371708564440306', role: 'Mestre em Educação' },
    { name: 'Angélica Soares de Amaral Ribeiro', slotId: 'm16', accent: C.pfolha, photo: 'assets/prof/AngelicaSoaresdeAmaralRibeiro.webp', lattes: 'http://lattes.cnpq.br/3519597510662322', role: 'Doutora em Educação' },
    { name: 'Cinthia Graziela Pigosso Moreno Gonçalves', slotId: 'm17', accent: C.pmagenta, photo: 'assets/prof/CinthiaGrazielaPigossoMorenoGoncalves.webp', lattes: 'http://lattes.cnpq.br/7644384534619462', role: 'Graduada em Letras' },
    { name: 'Hazel Berger Primitivo Neta', slotId: 'm18', accent: C.plavanda, photo: 'assets/prof/HazelBergerPrimitivoNeta.webp', lattes: 'http://lattes.cnpq.br/0899945433820848', role: 'Graduada em Pedagogia e Psicologia' },
    { name: 'Eliane Aparecida da Silva', slotId: 'm19', accent: C.panil, photo: 'assets/prof/ElianeAparecidadaSilva.webp', lattes: 'https://lattes.cnpq.br/6907839377730915', role: 'Mestra em Educação' },
    { name: 'Marcella Rivera Sanches Cesarino', slotId: 'm20', accent: C.pjade, photo: 'assets/prof/MarcellaRiveraSanchesCesarino.webp', lattes: 'http://lattes.cnpq.br/6681424878799100', role: 'Mestra em Educação' },
  ].map(function (m) {
    if (!m.role) m.role = 'Doutora em Educação';
    return m;
  });

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

  // Pilha LIFO: última produção adicionada fica no TOPO deste array (aparece primeiro).
  var PRODUCOES = [
    {
      title: 'Docência Sob Plataformas Digitais: performatividade algorítmica, formação docente crítica e resistências no cotidiano escolar',
      authors: ['Vinícius Gabryel Piovesan Evaristo', 'Luciana Haddad Ferreira'],
      abstract: 'Este estudo investiga a docência na rede estadual paulista, atravessada por plataformas digitais e por dinâmicas de performatividade algorítmica. O objetivo é compreender as vivências docentes diante da plataformização, problematizando a ausência de formação crítica e os modos de resistência no cotidiano escolar. Trata-se de uma pesquisa narrativa, desenvolvida com um grupo colaborativo composto por 19 docentes, cujas narrativas foram interpretadas por meio de uma abordagem indiciária. O referencial teórico fundamenta-se na teoria histórico-cultural de Vigotski, articulada às contribuições de autores que discutem políticas educacionais e epistemologia narrativa. Os resultados apontam tensões, como a perda de autonomia, a intensificação das práticas de vigilância e a fragilização da formação crítica, ao mesmo tempo que evidenciam movimentos de resistência e apropriações críticas das tecnologias digitais.',
      doi: 'https://doi.org/10.22169/revint.v21.e26do113'
    },
    {
      title: 'Por uma ética do cuidado: a pesquisa narrativa por Maria Passeggi',
      authors: ['Luciana Haddad Ferreira', 'Renata Helena Pin Pucci', 'Neuzita de Paula Soares'],
      abstract: 'Este artigo destaca as contribuições da professora e pesquisadora brasileira Maria Passeggi para o campo da pesquisa narrativa em Educação, no seio do movimento biográfico internacional. Discute-se como seus estudos possibilitam (re)pensar a formação de modo ético e humanizado, ao centralizar a escuta, o acolhimento, a reflexividade narrativa e a capacidade de agir dos sujeitos da pesquisa, mesmo em contextos de vulnerabilidade. A partir de uma entrevista com a pesquisadora, são discutidas três dimensões centrais de sua trajetória e de seus estudos: a autoria docente como elemento formativo e emancipatório; o respeito à dignidade das participantes, especialmente nas pesquisas com crianças; e a ética do cuidado como princípio de valorização da vida. Os estudos indicam coerência entre vida, formação e produção acadêmico-científica de Maria Passeggi, em especial na compreensão da narrativa como prática ética, estética e política, suscetível de (trans)formar tanto quem narra quanto quem escuta.',
      doi: 'https://doi.org/10.5212/PraxEduc.v.21.26170.022'
    }
  ];

  // Cor por autora: membros usam a cor deles; autoras de fora recebem uma
  // cor de um pool rotacionado e cacheado (mesma autora = sempre a mesma cor).
  var AUTHOR_COLORS = {};
  LEADERS.concat(MEMBERS).forEach(function (m) { AUTHOR_COLORS[m.name] = m.accent; });
  var FALLBACK_COLORS = [C.navy, C.green];
  var fbIndex = 0, fbCache = {};
  function authorColor(name) {
    if (AUTHOR_COLORS[name]) return AUTHOR_COLORS[name];
    if (!fbCache[name]) { fbCache[name] = FALLBACK_COLORS[fbIndex % FALLBACK_COLORS.length]; fbIndex++; }
    return fbCache[name];
  }

  var SITE = 'https://hinas.com.br';

  var ROUTES = [
    { tab: 'home',        slug: '',            title: 'HiNaS',                                                  desc: 'Um convite para conhecer um grupo de estudos especial aonde há espaço de trabalho comum, dedicado aos estudos da constituição dos sujeitos nas relações sociais.' },
    { tab: 'sobre',       slug: 'sobre',       title: 'HiNaS · Sobre',                                          desc: 'Conheça o HiNaS: grupo de pesquisa que estuda a formação a partir de histórias de vida, narrativas (auto)biográficas, memória e práticas pedagógicas.' },
    { tab: 'integrantes', slug: 'integrantes', title: 'HiNaS · Integrantes',                                    desc: 'Pesquisadoras e pesquisadores do HiNaS — grupo de estudos sobre narrativas, memória e formação de professores, entre USF e PUC-Campinas.' },
    { tab: 'teses',       slug: 'teses',       title: 'HiNaS · Teses e Dissertações',                           desc: 'Teses e dissertações produzidas no âmbito do HiNaS sobre narrativas (auto)biográficas, memória e formação de professores.' },
    { tab: 'producoes',   slug: 'producoes',   title: 'HiNaS · Produções',                                      desc: 'Produções do HiNaS — artigos, capítulos e trabalhos em eventos sobre histórias de vida, narrativas, memória e formação docente.' },
    { tab: 'projetos',    slug: 'projetos',    title: 'HiNaS · Projetos',                                       desc: 'Projetos de pesquisa do HiNaS em torno de narrativas (auto)biográficas, memória, formação de professores e práticas pedagógicas.' },
    { tab: 'noticias',    slug: 'noticias',    title: 'HiNaS · Notícias',                                       desc: 'Notícias e novidades do HiNaS — grupo de pesquisa sobre histórias de vida, narrativas (auto)biográficas, memória e formação docente.' },
  ];

  var TABS = ROUTES.map(function (r) { return r.tab; });
  var SLUG_TO_TAB = {}, TAB_TO_ROUTE = {};
  ROUTES.forEach(function (r) { SLUG_TO_TAB[r.slug] = r.tab; TAB_TO_ROUTE[r.tab] = r; });

  function slugPath(tab) {
    var r = TAB_TO_ROUTE[tab];
    return '/' + (r ? r.slug : '');
  }

  // ---- State -----------------------------------------------
  var state = { tab: 'home', hero: 'a' };

  // ---- Render dynamic lists --------------------------------
  function renderLinesStrip() {
    var el = document.querySelector('[data-lines-strip]');
    if (!el) return;
    el.innerHTML = LINES.map(function (ln) {
      return '<div class="line">' +
        '<div class="line__dot" style="background:' + ln.color + '"></div>' +
        '<div class="line__n">' + ln.n + '</div>' +
        '<div class="line__t">' + ln.t + '</div>' +
        '</div>';
    }).join('');
  }

  function renderLinesCards() {
    var el = document.querySelector('[data-lines-cards]');
    if (!el) return;
    el.innerHTML = LINES.map(function (ln) {
      return '<div class="card">' +
        '<div class="card__dot" style="background:' + ln.color + '"></div>' +
        '<div class="card__t">' + ln.t + '</div>' +
        '<div class="card__d">' + ln.d + '</div>' +
        '</div>';
    }).join('');
  }

  function renderMemberGrid(selector, list) {
    var el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = list.map(function (m) {
      var photoInner =
        '<div class="member__veil" style="background:' + m.accent + '"></div>' +
        '<div class="img-slot" data-slot="' + m.slotId + '">' +
          (m.photo ? '<img src="' + m.photo + '" alt="' + m.name + '">' : '<span>Foto</span>') +
        '</div>' +
        '<div class="member__bar" style="background:' + m.accent + '"></div>' +
        '<div class="member__cta" style="background:' + m.accent + '"><span>Clique para mais informações</span></div>';
      var photo = m.lattes
        ? '<a class="member__photo" style="--acc:' + m.accent + '" href="' + m.lattes + '" target="_blank" rel="noopener" aria-label="Currículo Lattes de ' + m.name + '">' + photoInner + '</a>'
        : '<div class="member__photo" style="--acc:' + m.accent + '">' + photoInner + '</div>';
      return '<div class="member">' +
        photo +
        '<div class="member__name">' + m.name + '</div>' +
        '<div class="member__role">' + m.role + '</div>' +
        '</div>';
    }).join('');
  }

  function renderTeses() {
    var el = document.querySelector('[data-teses]');
    if (!el) return;
    el.innerHTML = TESES.map(function (t) {
      return '<article class="tese" style="--accent:' + t.accent + '">' +
        '<div class="tese__bar"></div>' +
        '<div class="tese__body">' +
          '<div class="eyebrow eyebrow--blue tese__kind">Publicado em ' + t.year + '</div>' +
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

  function renderProducoes() {
    var el = document.querySelector('[data-producoes]');
    if (!el) return;
    el.innerHTML = PRODUCOES.map(function (p) {
      var cols = p.authors.map(authorColor);
      var bar = cols.length === 1 ? cols[0] : 'linear-gradient(135deg,' + cols.join(',') + ')';
      return '<article class="tese">' +
        '<div class="tese__bar" style="background:' + bar + '"></div>' +
        '<div class="tese__body">' +
          '<h3 class="display display--h3 tese__title">' + p.title + '</h3>' +
          '<div class="tese__meta">' + p.authors.join(' · ') + '</div>' +
          '<div class="tese__abstract prose">' + p.abstract + '</div>' +
          '<div class="tese__actions">' +
            '<button class="btn btn--ghost tese__more" type="button" aria-expanded="false">Ver mais</button>' +
            '<a class="btn btn--primary" href="' + p.doi + '" target="_blank" rel="noopener">Ler no DOI ↗</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  // ---- View updates ----------------------------------------
  function applyTab() {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.hidden = s.getAttribute('data-screen') !== state.tab;
    });
    document.querySelectorAll('.nav__tab').forEach(function (t) {
      var active = t.getAttribute('data-tab') === state.tab;
      t.classList.toggle('is-active', active);
      if (active) { t.setAttribute('aria-current', 'page'); }
      else { t.removeAttribute('aria-current'); }
    });
  }

  function applyHero() {
    document.querySelectorAll('[data-hero]').forEach(function (h) {
      h.hidden = h.getAttribute('data-hero') !== state.hero;
    });
    document.querySelectorAll('[data-hero-set]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-hero-set') === state.hero);
    });
  }

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
    setMeta('meta[name="description"]',         'content', r.desc,  'meta', { name: 'description' });
    setMeta('meta[property="og:title"]',        'content', r.title, 'meta', { property: 'og:title' });
    setMeta('meta[property="og:description"]',  'content', r.desc,  'meta', { property: 'og:description' });
    setMeta('meta[property="og:url"]',          'content', url,     'meta', { property: 'og:url' });
    setMeta('meta[name="twitter:title"]',       'content', r.title, 'meta', { name: 'twitter:title' });
    setMeta('meta[name="twitter:description"]', 'content', r.desc,  'meta', { name: 'twitter:description' });
    setMeta('link[rel="canonical"]',            'href',    url,     'link', { rel: 'canonical' });
  }

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

  function setHero(hero) {
    state.hero = hero;
    applyHero();
  }

  // ---- Wire events -----------------------------------------
  function bind() {
    document.querySelectorAll('[data-tab]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button !== 0)) return;
        e.preventDefault();
        goTab(el.getAttribute('data-tab'));
      });
    });
    document.querySelectorAll('[data-hero-set]').forEach(function (el) {
      el.addEventListener('click', function () { setHero(el.getAttribute('data-hero-set')); });
    });
    bindMemberCta();
    bindReadMore();
  }

  // Bolha dos integrantes: segue o cursor com física de mola —
  // acelera com o mouse, passa do ponto e balança até estabilizar.
  function bindMemberCta() {
    // Touch/sem cursor: CTA é caixa estática (CSS). Não liga física de mola,
    // senão o mousemove sintético do toque reposiciona a bolha e "quebra" a caixa.
    if (!window.matchMedia('(hover:hover)').matches) return;

    var STIFFNESS = 0.85;  // força da mola (maior = reage mais rápido)
    var DAMPING = 0.05;     // atrito (menor = balança mais)
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var active = null;     // bolha sob o cursor: {cta, x, y, vx, vy, tx, ty, raf}

    function step() {
      if (!active) return;
      var a = active;
      if (reduceMotion) {
        a.x = a.tx; a.y = a.ty;
      } else {
        a.vx = (a.vx + (a.tx - a.x) * STIFFNESS) * DAMPING;
        a.vy = (a.vy + (a.ty - a.y) * STIFFNESS) * DAMPING;
        a.x += a.vx;
        a.y += a.vy;
      }
      a.cta.style.left = a.x + 'px';
      a.cta.style.top = a.y + 'px';
      a.raf = requestAnimationFrame(step);
    }

    document.querySelectorAll('.members__grid').forEach(function (grid) {
      grid.addEventListener('mousemove', function (e) {
        var photo = e.target.closest('.member__photo');
        if (!photo) return;
        var cta = photo.querySelector('.member__cta');
        if (!cta) return;
        var r = photo.getBoundingClientRect();
        var mx = e.clientX - r.left;
        var my = e.clientY - r.top;
        if (!active || active.cta !== cta) {
          if (active) cancelAnimationFrame(active.raf);
          active = { cta: cta, x: mx, y: my, vx: 0, vy: 0, tx: mx, ty: my, raf: 0 };
          cta.style.left = mx + 'px';
          cta.style.top = my + 'px';
          active.raf = requestAnimationFrame(step);
        } else {
          active.tx = mx;
          active.ty = my;
        }
      });
      grid.addEventListener('mouseout', function (e) {
        var photo = e.target.closest('.member__photo');
        if (!photo || photo.contains(e.relatedTarget)) return;
        if (active && photo.contains(active.cta)) {
          cancelAnimationFrame(active.raf);
          active = null;
        }
      });
    });
  }

  // "Ver mais/menos" dos cards de publicação (teses e produções).
  function bindReadMore() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.tese__more');
      if (!btn) return;
      var card = btn.closest('.tese');
      if (!card) return;
      var expanded = card.classList.toggle('is-expanded');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      btn.textContent = expanded ? 'Ver menos' : 'Ver mais';
    });
  }

  function readPath() {
    var p = window.location.pathname.replace(/\/+$/, '');  // tira barra final
    var slug = p.replace(/^\/+/, '');                      // tira barra inicial
    state.tab = SLUG_TO_TAB.hasOwnProperty(slug) ? SLUG_TO_TAB[slug] : 'home';
    var m = /[?&]hero=([abc])/.exec(window.location.search);
    if (m) state.hero = m[1];
  }

  // ---- Init ------------------------------------------------
  function init() {
    renderLinesStrip();
    renderLinesCards();
    renderMemberGrid('[data-leaders]', LEADERS);
    renderMemberGrid('[data-members]', MEMBERS);
    renderTeses();
    renderProducoes();
    bind();
    readPath();
    applyTab();
    applyRouteMeta(state.tab);
    applyHero();
    window.addEventListener('popstate', function () {
      readPath();
      applyTab();
      applyRouteMeta(state.tab);
      applyHero();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
