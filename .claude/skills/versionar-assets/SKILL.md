---
name: versionar-assets
description: >-
  Versiona automaticamente os assets (styles.css, app.js) do site HiNaS com
  cache-busting por hash de conteúdo, evitando que o navegador sirva versões
  antigas em cache depois de um deploy. Use SEMPRE que o usuário for atualizar,
  subir, publicar ou fazer deploy do site, ou disser coisas como "atualizei o
  site", "vou subir pro servidor", "deploy", "versionar", "cache", "o site não
  atualiza / está cacheado", "gerar nova versão dos assets". Rode antes de
  enviar os arquivos pro servidor.
---

# Versionar assets (cache-busting) — HiNaS

Site estático puro (HTML/CSS/JS), SPA com roteamento por path no `app.js`,
servido por Apache (Locaweb) em `hinas.com.br`. Problema que isso resolve: navegador
guarda `styles.css` / `app.js` em cache e não pega atualização após deploy —
funciona só em aba anônima.

Solução: cada arquivo referenciado com `?v=<hash>`. O hash vem do **conteúdo**
do arquivo (MD5, 8 chars), então:

- Conteúdo mudou → hash muda → URL muda → navegador rebaixa.
- Conteúdo igual → hash igual → nada muda (idempotente, sem "bump" manual).

## Quando rodar

Antes de qualquer deploy / upload pro servidor. É seguro rodar sempre — se nada
mudou, o `index.html` fica idêntico.

## Como rodar

Do diretório raiz do projeto (`d:\hinas`), rode o script. Ele lê `styles.css` e
`app.js`, calcula o hash de cada um e reescreve as tags `?v=` no `index.html`.

**PowerShell (Windows — padrão neste ambiente):**
```powershell
powershell -ExecutionPolicy Bypass -File .claude\skills\versionar-assets\scripts\version.ps1
```

**Bash (git-bash / servidor Linux):**
```bash
bash .claude/skills/versionar-assets/scripts/version.sh
```

Ambos aceitam a raiz como argumento se rodar de outro lugar
(`... version.ps1 -Root D:\hinas` / `version.sh /caminho/hinas`).

Saída esperada:
```
styles.css -> ?v=3ec979fe
app.js -> ?v=d41b8a4d
```

Depois confira o diff do `index.html` e suba os arquivos.

## Adicionar novo asset ao versionamento

Se surgir outro `.css`/`.js` local no `index.html`, adicione o nome dele à
lista `$assets` (PowerShell) e `for a in ...` (bash) dentro dos scripts. Fontes
do Google e imagens em `assets/` não entram aqui — elas têm cache próprio via
`.htaccess`.

## Configuração do servidor (Apache / .htaccess) — complementar

Servidor é Apache (Locaweb, hospedagem compartilhada). Os headers de cache já
estão no [.htaccess](../../../.htaccess) na raiz: `index.html` com `no-cache`
(sempre revalida) e `.css`/`.js`/imagens com cache longo (podem cachear forte
porque o `?v=` já invalida quando muda). O `.htaccess` sobe junto com os
arquivos do site — nada a rodar no servidor.

Precisa dos módulos `mod_headers` e `mod_rewrite` habilitados (padrão na
Locaweb). Se os headers de cache não aplicarem, é `mod_headers` desligado.

## Por que hash de conteúdo e não timestamp/contador

Timestamp muda o hash a cada deploy mesmo sem mudança real → invalida cache à
toa. Contador manual (`?v=2`, `?v=3`) exige lembrar de incrementar e erra. Hash
de conteúdo é automático e só invalida o que realmente mudou.
