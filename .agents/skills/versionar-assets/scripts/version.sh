#!/usr/bin/env bash
# Cache-busting por hash de conteudo para o site HiNaS.
# Le os assets locais, calcula MD5 (8 chars) e reescreve as tags ?v= no index.html.
# Idempotente: se o conteudo nao mudou, o index.html fica identico.
#
# Uso: bash version.sh [raiz]   (padrao: diretorio atual)
set -euo pipefail

ROOT="${1:-$(pwd)}"
INDEX="$ROOT/index.html"
ASSETS=(styles.css app.js)   # assets locais a versionar

[ -f "$INDEX" ] || { echo "index.html nao encontrado em $ROOT" >&2; exit 1; }

for a in "${ASSETS[@]}"; do
  f="$ROOT/$a"
  if [ ! -f "$f" ]; then echo "pulando $a (nao encontrado)" >&2; continue; fi

  h=$(md5sum "$f" | cut -c1-8)
  esc=$(printf '%s' "$a" | sed 's/[.]/\\./g')
  # casa o nome do asset com ou sem ?v= existente e troca pelo hash novo
  sed -i -E "s#${esc}(\?v=[0-9a-fA-F]+)?#${a}?v=${h}#g" "$INDEX"
  echo "$a -> ?v=$h"
done
