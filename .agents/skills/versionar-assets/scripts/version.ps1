<#
  Cache-busting por hash de conteudo para o site HiNaS.
  Le os assets locais, calcula MD5 (8 chars) e reescreve as tags ?v= no index.html.
  Idempotente: se o conteudo nao mudou, o index.html fica identico.

  Uso:
    powershell -ExecutionPolicy Bypass -File version.ps1 [-Root <caminho>]
#>
param(
  [string]$Root = (Get-Location).Path
)
$ErrorActionPreference = 'Stop'

$index  = Join-Path $Root 'index.html'
$assets = @('styles.css', 'app.js')   # assets locais a versionar

if (-not (Test-Path $index)) { throw "index.html nao encontrado em $Root" }

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$html = [System.IO.File]::ReadAllText($index, $utf8NoBom)

foreach ($a in $assets) {
  $path = Join-Path $Root $a
  if (-not (Test-Path $path)) { Write-Warning "pulando $a (nao encontrado)"; continue }

  $hash    = (Get-FileHash -LiteralPath $path -Algorithm MD5).Hash.Substring(0, 8).ToLower()
  $escaped = [regex]::Escape($a)
  # casa o nome do asset com ou sem ?v= existente e troca pelo hash novo
  $pattern = "$escaped(\?v=[0-9a-fA-F]+)?"
  $html    = [regex]::Replace($html, $pattern, "${a}?v=$hash")
  Write-Host "$a -> ?v=$hash"
}

# grava UTF-8 sem BOM para nao inserir bytes no topo do HTML
[System.IO.File]::WriteAllText($index, $html, $utf8NoBom)
