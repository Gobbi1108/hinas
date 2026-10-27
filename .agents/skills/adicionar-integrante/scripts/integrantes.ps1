# HiNaS - auditoria dos integrantes + sugestao de cor unica.
# Uso:
#   powershell -ExecutionPolicy Bypass -File .claude\skills\adicionar-integrante\scripts\integrantes.ps1
#   ... integrantes.ps1 -Sugerir 5
#   ... integrantes.ps1 -Sugerir 5 -Fotos Angelica,Cinthia
#   ... integrantes.ps1 -Root D:\hinas -Seed 42
# Sai com codigo 1 se achar erro (cor repetida, slotId repetido, foto faltando ou
# nao resolvida, accent inexistente, link invalido).

param(
  [string]$Root = "",
  [int]$Sugerir = 3,
  [int]$Seed = 0,
  [string[]]$Fotos = @()
)

$ErrorActionPreference = 'Stop'

if (-not $Root) { $Root = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')).Path }
$appPath = Join-Path $Root 'app.js'
if (-not (Test-Path $appPath)) { Write-Error "app.js nao encontrado em $Root"; exit 2 }

$app = [IO.File]::ReadAllText($appPath, [Text.Encoding]::UTF8)

# ---------- helpers de cor ----------
function ConvertTo-Hsl([string]$hex) {
  $r = [Convert]::ToInt32($hex.Substring(1,2),16) / 255
  $g = [Convert]::ToInt32($hex.Substring(3,2),16) / 255
  $b = [Convert]::ToInt32($hex.Substring(5,2),16) / 255
  $max = [math]::Max($r,[math]::Max($g,$b)); $min = [math]::Min($r,[math]::Min($g,$b))
  $l = ($max + $min) / 2; $d = $max - $min
  if ($d -eq 0) { return [pscustomobject]@{ H = 0.0; S = 0.0; L = $l } }
  if ($l -gt 0.5) { $s = $d / (2 - $max - $min) } else { $s = $d / ($max + $min) }
  if ($max -eq $r)     { $h = (($g - $b) / $d) % 6 }
  elseif ($max -eq $g) { $h = (($b - $r) / $d) + 2 }
  else                 { $h = (($r - $g) / $d) + 4 }
  $h = $h * 60; if ($h -lt 0) { $h += 360 }
  [pscustomobject]@{ H = $h; S = $s; L = $l }
}

function ConvertFrom-Hsl([double]$h, [double]$s, [double]$l) {
  $c = (1 - [math]::Abs(2 * $l - 1)) * $s
  $x = $c * (1 - [math]::Abs((($h / 60) % 2) - 1))
  $m = $l - $c / 2
  if     ($h -lt 60)  { $r=$c; $g=$x; $b=0 }
  elseif ($h -lt 120) { $r=$x; $g=$c; $b=0 }
  elseif ($h -lt 180) { $r=0; $g=$c; $b=$x }
  elseif ($h -lt 240) { $r=0; $g=$x; $b=$c }
  elseif ($h -lt 300) { $r=$x; $g=0; $b=$c }
  else                { $r=$c; $g=0; $b=$x }
  '#{0:x2}{1:x2}{2:x2}' -f [int][math]::Round(($r+$m)*255), [int][math]::Round(($g+$m)*255), [int][math]::Round(($b+$m)*255)
}

function Get-HueDist([double]$a, [double]$b) {
  $d = [math]::Abs($a - $b); if ($d -gt 180) { $d = 360 - $d }; $d
}

# Nome ASCII do tom, por faixa de matiz. Vira a chave em `var C` (prefixo p = pastel).
$HUE_NAMES = @(
  @(15,'rubi'), @(30,'salmao'), @(45,'damasco'), @(60,'ambar'), @(75,'limao'),
  @(90,'oliva'), @(105,'folha'), @(120,'relva'), @(135,'jade'), @(150,'esmeralda'),
  @(165,'hortela'), @(180,'turquesa'), @(195,'lagoa'), @(210,'ceu'), @(225,'ceruleo'),
  @(240,'anil'), @(255,'indigo'), @(270,'violeta'), @(285,'lavanda'), @(300,'malva'),
  @(315,'ametista'), @(330,'magenta'), @(345,'rosado'), @(360,'framboesa')
)
function Get-ToneName([double]$h) {
  foreach ($pair in $HUE_NAMES) { if ($h -lt $pair[0]) { return $pair[1] } }
  'framboesa'
}

# ---------- parse do app.js ----------
$paletteBlock = [regex]::Match($app, '(?s)var\s+C\s*=\s*\{(.*?)\};')
if (-not $paletteBlock.Success) { Write-Error 'Bloco `var C = {...};` nao encontrado no app.js'; exit 2 }

$palette = @{}
foreach ($m in [regex]::Matches($paletteBlock.Groups[1].Value, "(\w+)\s*:\s*'(#[0-9a-fA-F]{6})'")) {
  $palette[$m.Groups[1].Value] = $m.Groups[2].Value.ToLower()
}

$people = @(); $section = ''
foreach ($line in ($app -split "`n")) {
  if ($line -match 'var\s+LEADERS')      { $section = 'LEADERS' }
  elseif ($line -match 'var\s+MEMBERS')  { $section = 'MEMBERS' }
  elseif ($line -match 'var\s+TESES')    { $section = '' }
  if ($line -notmatch 'slotId:') { continue }
  $get = {
    param($pat)
    $mm = [regex]::Match($line, $pat)
    if ($mm.Success) { $mm.Groups[1].Value } else { '' }
  }
  $people += [pscustomobject]@{
    section = $section
    name    = (& $get "name:\s*'([^']*)'")
    slot    = (& $get "slotId:\s*'(m\d+)'")
    accent  = (& $get 'accent:\s*C\.(\w+)')
    photo   = (& $get "photo:\s*'([^']*)'")
    role    = (& $get "role:\s*'([^']*)'")
    lattes  = (& $get "lattes:\s*'([^']*)'")
  }
}

# ---------- erros ----------
$erros = @()
$avisos = @()

$hexGroups = $palette.GetEnumerator() | Group-Object { $_.Value } | Where-Object { $_.Count -gt 1 }
foreach ($g in $hexGroups) {
  $erros += "cor repetida em var C: $($g.Name) usada por " + (($g.Group | ForEach-Object { $_.Key }) -join ', ')
}

foreach ($g in ($people | Where-Object { $_.accent } | Group-Object accent | Where-Object { $_.Count -gt 1 })) {
  $erros += "accent C.$($g.Name) usado por mais de um integrante: " + (($g.Group | ForEach-Object { $_.name }) -join ' | ')
}

foreach ($g in ($people | Group-Object slot | Where-Object { $_.Count -gt 1 })) {
  $erros += "slotId $($g.Name) repetido: " + (($g.Group | ForEach-Object { $_.name }) -join ' | ')
}

foreach ($p in $people) {
  if (-not $p.accent)              { $erros += "$($p.name): sem accent" }
  elseif (-not $palette[$p.accent]) { $erros += "$($p.name): accent C.$($p.accent) nao existe em var C" }
  # role ausente nao e erro: entradas antigas caem no default 'Doutora em Educacao'
  # de proposito. Para entrada nova sempre escreva o role explicito (o default e
  # generificado no feminino e vale so pra quem ja estava assim).
  if ($p.section -eq 'MEMBERS' -and -not $p.role) { $avisos += "$($p.name): sem role explicito -> usa o default 'Doutora em Educacao'" }
  if ($p.photo -and -not (Test-Path (Join-Path $Root $p.photo))) { $erros += "$($p.name): foto nao existe -> $($p.photo)" }
  # lattes = link que abre ao clicar no card. Sem ele o card nao clica.
  if (-not $p.lattes) { $avisos += "$($p.name): sem link (lattes) -> card nao clicavel" }
  elseif ($p.lattes -notmatch '^https?://') { $erros += "$($p.name): link invalido -> $($p.lattes)" }
}

# ---------- relatorio ----------
$slots = $people | ForEach-Object { [int]($_.slot -replace '^m','') } | Sort-Object
$nextSlot = 'm' + ((($slots | Measure-Object -Maximum).Maximum) + 1)

Write-Host ""
Write-Host "Integrantes: $($people.Count)  (LEADERS $(($people | Where-Object {$_.section -eq 'LEADERS'}).Count) / MEMBERS $(($people | Where-Object {$_.section -eq 'MEMBERS'}).Count))"
Write-Host "Proximo slotId livre: $nextSlot"
Write-Host ""
Write-Host "Cores em uso:"
foreach ($p in $people) {
  $hex = $palette[$p.accent]
  if ($p.lattes) { $link = 'link ok' } else { $link = 'SEM LINK' }
  Write-Host ("  {0,-14} {1,-8} {2,-9} {3}" -f ("C." + $p.accent), $hex, $link, $p.name)
}

# fotos orfas em assets/prof
$profDir = Join-Path $Root 'assets\prof'
if (Test-Path $profDir) {
  $usadas = @($people | ForEach-Object { Split-Path $_.photo -Leaf })
  $orfas = Get-ChildItem $profDir -File | Where-Object { $usadas -notcontains $_.Name }
  if ($orfas) {
    Write-Host ""
    Write-Host "Fotos em assets/prof ainda nao usadas:"
    foreach ($f in $orfas) { Write-Host "  $($f.Name)" }
  }
}

# ---------- resolucao de fotos (-Fotos) ----------
# Confere ANTES de mexer no app.js se cada foto citada existe mesmo e devolve o
# caminho exato pra colar na entrada. Aceita nome com ou sem extensao. Sem isso o
# typo so apareceria na verificacao final, ja com o array editado errado.
if ($Fotos.Count -gt 0) {
  # Chamado com -File, o PowerShell entrega "a,b,c" como UMA string; separa aqui
  # pra aceitar tanto -Fotos a,b,c quanto -Fotos a -Fotos b.
  $Fotos = @($Fotos | ForEach-Object { $_ -split ',' } | Where-Object { $_.Trim() })
  Write-Host ""
  Write-Host "Fotos pedidas:"
  if (-not (Test-Path $profDir)) { $erros += "pasta assets/prof nao existe em $Root" }
  else {
    $todas = Get-ChildItem $profDir -File
    foreach ($pedido in $Fotos) {
      $alvo = $pedido.Trim() -replace '^assets[\\/]prof[\\/]', ''
      $hit = @($todas | Where-Object { $_.Name -eq $alvo -or $_.BaseName -eq $alvo })
      if ($hit.Count -eq 0) { $hit = @($todas | Where-Object { $_.BaseName -like "*$alvo*" }) }
      if ($hit.Count -eq 1) {
        $rel = 'assets/prof/' + $hit[0].Name
        $emUso = @($people | Where-Object { $_.photo -eq $rel })
        if ($emUso) { Write-Host ("  {0,-24} -> {1}  (JA USADA por {2})" -f $alvo, $rel, $emUso[0].name) }
        else        { Write-Host ("  {0,-24} -> {1}" -f $alvo, $rel) }
      }
      elseif ($hit.Count -gt 1) {
        $erros += "foto '$alvo' e ambigua: " + (($hit | ForEach-Object { $_.Name }) -join ', ')
      }
      else {
        $erros += "foto '$alvo' nao existe em assets/prof"
      }
    }
  }
}

# ---------- sugestoes de cor ----------
# Regra: pastel novo precisa ficar visualmente longe de TODA cor ja em uso.
# Longe = matiz >= 18 graus de distancia, ou >= 8 graus se a luminosidade
# tambem diferir bastante (ai o olho separa por claro/escuro, nao por matiz).
if ($Sugerir -gt 0) {
  $usadasHsl = @()
  foreach ($hex in ($palette.Values | Sort-Object -Unique)) { $usadasHsl += (ConvertTo-Hsl $hex) }

  # Faixas (S,L): a primeira e a dos pasteis atuais; as seguintes reabrem a roda
  # de matizes com tons mais escuros / mais claros quando a primeira esgotar.
  $tiers = @(@(0.45,0.70), @(0.36,0.62), @(0.30,0.79))
  $cands = @(); $tierIdx = 0
  foreach ($t in $tiers) {
    $tierIdx++
    for ($h = 0; $h -lt 360; $h += 3) {
      $hex = ConvertFrom-Hsl $h $t[0] $t[1]
      if ($palette.Values -contains $hex) { continue }
      $ok = $true
      foreach ($u in $usadasHsl) {
        $hd = Get-HueDist $h $u.H
        $ld = [math]::Abs($t[1] - $u.L)
        if ($hd -lt 18 -and -not ($hd -ge 8 -and $ld -ge 0.18)) { $ok = $false; break }
      }
      if ($ok) { $cands += [pscustomobject]@{ H = [double]$h; L = $t[1]; hex = $hex; tier = $tierIdx } }
    }
  }

  if ($Seed -ne 0) { Get-Random -SetSeed $Seed | Out-Null }
  $escolhidas = @()
  # Sorteia dentro da faixa 1 (mesmo tom dos pasteis atuais) antes de cair pras
  # faixas de reserva - assim a paleta so muda de registro quando precisa.
  foreach ($c in ($cands | Sort-Object tier, { Get-Random })) {
    if ($escolhidas.Count -ge $Sugerir) { break }
    $conflita = $false
    foreach ($e in $escolhidas) {
      if ((Get-HueDist $c.H $e.H) -lt 18 -and [math]::Abs($c.L - $e.L) -lt 0.18) { $conflita = $true; break }
    }
    if (-not $conflita) { $escolhidas += $c }
  }

  Write-Host ""
  if ($escolhidas.Count -lt $Sugerir) {
    Write-Host "AVISO: so sobraram $($escolhidas.Count) cores bem separadas (pedidas $Sugerir)."
  }
  Write-Host "Sugestoes de cor (aleatorias, sem repetir nenhuma em uso):"
  foreach ($c in $escolhidas) {
    $nome = 'p' + (Get-ToneName $c.H)
    $n = $nome; $i = 2
    while ($palette.ContainsKey($n)) { $n = "$nome$i"; $i++ }
    Write-Host ("  {0,-14} {1}   (matiz {2}, luz {3}%)" -f $n, $c.hex, [int]$c.H, [int]($c.L * 100))
  }
}

Write-Host ""
if ($avisos.Count -gt 0) {
  Write-Host "Avisos ($($avisos.Count)):"
  foreach ($a in $avisos) { Write-Host "  - $a" }
  Write-Host ""
}
if ($erros.Count -gt 0) {
  Write-Host "ERROS ($($erros.Count)):"
  foreach ($e in $erros) { Write-Host "  - $e" }
  exit 1
}
Write-Host "OK: nenhuma cor repetida, nenhum slotId repetido, fotos e links conferidos."
exit 0
