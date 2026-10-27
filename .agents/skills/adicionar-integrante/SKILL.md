---
name: adicionar-integrante
description: >-
  Adiciona pessoas à aba Integrantes do site HiNaS (foto, nome completo, role/título,
  link do card e uma cor de destaque inédita, nunca repetida). Use SEMPRE que o usuário pedir para
  "adicionar integrante", "colocar mais um membro/pesquisador(a)", "incluir fulano na
  equipe", "adicionar líder do grupo", passar uma lista de pessoas novas com foto e
  titulação, ou pedir para trocar/corrigir foto, role ou cor de alguém que já está no
  site. Também use quando alguém perguntar qual cor está livre na paleta ou reclamar
  que duas pessoas ficaram com a mesma cor.
---

# Adicionar integrante — HiNaS

A aba Integrantes é montada em JS: `LEADERS` e `MEMBERS` no [app.js](../../../app.js)
alimentam `renderMemberGrid()`, que escreve nos containers `[data-leaders]` e
`[data-members]` do `index.html`. **Não existe HTML por pessoa** — mexer no `index.html`
para adicionar gente é erro; tudo acontece no array.

Cada pessoa tem 5 informações que o usuário passa, mais o `slotId` que o script calcula:

| Campo | O que é | Obrigatório |
|---|---|---|
| `name` | nome completo, com acentos | sim |
| `role` | título/vínculo em MAIÚSCULAS visuais (o CSS já faz `uppercase`) | sim |
| `photo` | caminho `assets/prof/<arquivo>` | sim (sem ela o card mostra "Foto") |
| `lattes` | URL que abre ao clicar no card — currículo Lattes, quase sempre | sim |
| `accent` | `C.<chave>` — cor de destaque, **única no site inteiro** | sim |
| `slotId` | `m<N>`, sequencial, identifica o slot da imagem | sim (o script diz qual é o próximo) |

A cor é o ponto delicado: ela pinta o véu sobre a foto, a barrinha do card, a sombra e
o balão "Clique para mais informações", e ainda serve de cor da pessoa nas **Produções**
(`AUTHOR_COLORS`). Duas pessoas com a mesma cor quebram essa leitura visual — por isso
a escolha da cor não é no olho, é pelo script.

## Passo a passo

### 1. Rodar o script de auditoria

Ele lê o `app.js` e devolve o próximo `slotId`, todas as cores já em uso, as fotos que
estão em `assets/prof` mas ainda não foram usadas, e sorteia cores novas garantidamente
distantes de todas as existentes.

```powershell
powershell -ExecutionPolicy Bypass -File .Codex\skills\adicionar-integrante\scripts\integrantes.ps1 -Sugerir 5
```

`-Sugerir N` = quantas cores sortear (uma por pessoa que for entrar; as sugestões também
não colidem entre si). `-Root D:\hinas` se rodar de fora da raiz. Sai com código 1 se achar
cor repetida, `slotId` repetido, foto faltando, `accent` inexistente ou link malformado.

**Sobre o `-Seed`:** por padrão o sorteio é diferente a cada execução — é isso que se quer,
duas pessoas adicionadas em dias diferentes não têm por que puxar as mesmas cores. Use
`-Seed <n>` só quando precisar repetir exatamente uma rodada: refazer um lote que deu
errado no meio, ou mostrar ao usuário as mesmas opções de novo. Rodar sem seed e depois
com seed não "melhora" nada, só confunde quem compara as duas saídas.

### 2. Resolver a foto

Ordem de preferência:

1. **Já está em `assets/prof`** — o script lista as fotos não usadas; casar pelo nome
   (`AngelicaSoaresdeAmaralRibeiro.png` → Angélica). Se a associação não for óbvia,
   pergunte ao usuário em vez de chutar: card com a foto errada é pior que card sem foto.
2. **Usuário deu um caminho de arquivo** — copie para `assets/prof` com o padrão
   `<NomeCompletoSemEspacos>.<ext>` (ex.: `MarcellaRiveraSanchesCesarino.png`): nome
   completo da pessoa, sem acentos, sem dimensões, partículas (`de`, `da`, `dos`) em
   minúsculo. Mantenha a extensão original. Copie, não mova: o original é do usuário.
3. **Não tem foto** — omita o campo `photo`. O card renderiza o placeholder "Foto" sem
   quebrar; melhor isso do que apontar para arquivo inexistente (o script acusa erro).

**Confirme o arquivo antes de editar o `app.js`.** Passe os nomes que o usuário citou em
`-Fotos` e o script devolve o caminho exato para colar, ou erra na hora:

```powershell
powershell -ExecutionPolicy Bypass -File .Codex\skills\adicionar-integrante\scripts\integrantes.ps1 -Sugerir 5 -Fotos Angelica,Cinthia,Hazel
```

```
Fotos pedidas:
  Angelica   -> assets/prof/AngelicaSoaresdeAmaralRibeiro.png
  Cinthia    -> assets/prof/CinthiaGrazielaPigossoMorenoGoncalves.png
```

Aceita nome com ou sem extensão e casa por trecho do nome. Se o arquivo não existir ou o
trecho casar com mais de um, vira erro (código 1) — assim um typo aparece **antes** de o
array ser editado, não depois. Ele também avisa `(JA USADA por ...)` quando a foto já
pertence a outra pessoa, o que costuma indicar nome trocado.

O card é `aspect-ratio: 4/5` e a imagem entra com `object-fit: cover`, ou seja, sobra
sempre corta pelas bordas. Retrato vertical rende melhor, mas não redimensione o arquivo
— o CSS resolve. Se um enquadramento específico ficar ruim, dá para ajustar só aquele
card por `slotId` no `styles.css` (existe precedente: `.img-slot[data-slot="m3"] img`).

### 3. Registrar o link

`lattes` é o link que abre quando a pessoa clica no card. Com ele, `renderMemberGrid()`
troca a `<div class="member__photo">` por um `<a>` com `target="_blank"`,
`rel="noopener"` e `aria-label="Currículo Lattes de <nome>"`, e é isso que faz aparecer o
balão "Clique para mais informações" no hover. Sem `lattes` o card fica estático — visualmente
parece o mesmo card, mas não clica, e ninguém percebe até alguém reclamar.

Regras práticas:

- Cole a URL **como o usuário mandou**, inteira. Não normalize `http://` para `https://`
  nem tire/ponha barra final: `lattes.cnpq.br` responde nos dois esquemas e o array já
  tem uma mistura dos dois. Reescrever gera diff sujo sem ganho.
- Se o link não for do Lattes (ORCID, página institucional, currículo pessoal), pode usar
  do mesmo jeito — o campo é só "o link do card". Só vale saber que o `aria-label` diz
  "Currículo Lattes de ..."; se virar comum apontar para outra coisa, aí sim mude o texto
  do label no `renderMemberGrid()` em vez de mentir para leitor de tela.
- Se o usuário não mandou link para alguém, **pergunte** antes de omitir. Omitir é uma
  escolha válida (a pessoa pode não ter Lattes), mas é escolha dela, não sua.

### 4. Registrar a cor em `var C`

Adicione a chave sugerida no bloco `var C` do `app.js`, junto das outras pastel, uma
por linha ou agrupadas como as existentes:

```js
    pmint: '#8ccbb2', paqua: '#83bfcb', pchartreuse: '#c9cf8a',
    porchid: '#c69ac9', pblush: '#e0a5a0',
    poliva: '#b9d590', pmagenta: '#d590c0',   // <- novas
```

Use o nome que o script sugeriu (`p` + tom). Se quiser outro nome, tudo bem — o que não
pode é repetir chave nem hex.

### 5. Adicionar a entrada no array

Pessoa comum vai no **fim de `MEMBERS`**; líder do grupo vai em `LEADERS` (e lá o `role`
é sobrescrito por `'Líder do grupo · Doutora em Educação'` no `.map`, então não adianta
escrever role em `LEADERS`). Na dúvida sobre em qual entrar, é `MEMBERS`.

```js
    { name: 'Angélica Ferreira Lima', slotId: 'm16', accent: C.poliva, photo: 'assets/prof/AngelicaFerreiraLima.png', lattes: 'http://lattes.cnpq.br/0000000000000000', role: 'Mestra em Educação' },
```

Uma linha por pessoa, mesma ordem de campos das linhas vizinhas — o arquivo é lido em
diff, e coluna alinhada facilita conferir cor e slot de bate-pronto.

**Escreva sempre o `role` explícito.** O `.map` no fim de `MEMBERS` preenche
`'Doutora em Educação'` quando falta — isso existe só para as três entradas antigas que
realmente são doutoras. Para gente nova, deixar o default agir é atribuir titulação e
gênero que ninguém informou. Se o usuário não disse o título, pergunte.

Roles já em uso, para manter o vocabulário consistente: `Doutora em Educação`,
`Mestre/Mestra em Educação`, `Graduado/Graduada em Educação`, `Graduado em Direito`.
Titulação nova (ex.: `Doutorando em Educação`) é bem-vinda, só siga o mesmo formato
curto `<Titulação> em <Área>`.

### 6. Verificar

Rode o script de novo, agora sem sugestões:

```powershell
powershell -ExecutionPolicy Bypass -File .Codex\skills\adicionar-integrante\scripts\integrantes.ps1 -Sugerir 0
```

Precisa terminar em `OK:` e código 0. Se acusar erro, corrija antes de seguir — o site
não avisa nada em runtime, ele simplesmente renderiza errado.

### 7. Versionar os assets

`app.js` mudou, então o navegador precisa ser forçado a baixar a versão nova. Rode a
skill `versionar-assets` (ou o script dela direto) antes do deploy, senão o usuário vai
abrir o site e jurar que os integrantes novos não entraram.

## Várias pessoas de uma vez

É o caso comum (o usuário manda uma lista). Faça em lote, não uma por vez:

1. Um `-Sugerir <n>` só, com `n` = número de pessoas, já com `-Fotos` listando todos os
   arquivos citados. As sugestões vêm separadas entre si, então dá para distribuir uma por
   pessoa na ordem em que ele mandou, e as fotos saem todas resolvidas de uma vez.
2. Todas as cores novas em `var C` de uma vez.
3. Todas as linhas em `MEMBERS`, `slotId` sequencial a partir do que o script informou
   (`m16`, `m17`, `m18`…).
4. Uma verificação final no fim, cobrindo todo mundo.

## Quando a paleta apertar

O script trabalha em três faixas de tom: primeiro o registro pastel atual
(saturação 45%, luz 70% — igual às cores que já estão lá), e só quando a roda de matizes
lota é que ele desce para um tom um pouco mais fechado e depois para um mais claro. É por
isso que ele pode sugerir uma cor visivelmente mais escura lá pela vigésima pessoa: não é
capricho, é a única forma de continuar dando para diferenciar os cards.

Se ele avisar que sobraram menos cores do que o pedido, não invente hex na mão — fale com
o usuário. Nesse ponto vale repensar o design (agrupar por linha de pesquisa, por exemplo)
em vez de espremer mais uma cor quase igual a outra.
