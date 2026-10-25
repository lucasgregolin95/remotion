#!/usr/bin/env bash
# Correção leve de luz, contraste, cor e nitidez + ampliação Lanczos proporcional.
# Não altera geometria nem proporção (sem esticar). Origem: public/fotos -> public/fotos-tratadas
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/fotos-tratadas
for f in public/fotos/*.jpg; do
  nome=$(basename "$f")
  ffmpeg -y -v error -i "$f" -vf \
    "scale='if(gt(iw,ih),1600,1280)':-2:flags=lanczos,eq=brightness=0.012:contrast=1.05:saturation=1.07:gamma=1.02,unsharp=5:5:0.55:5:5:0" \
    -q:v 2 "public/fotos-tratadas/$nome"
done
# A área coberta é 3:4 e precisa de mais altura para preencher 9:16 sem distorção.
ffmpeg -y -v error -i public/fotos/03-area-coberta.jpg -vf \
  "scale=-2:2100:flags=lanczos,eq=brightness=0.012:contrast=1.05:saturation=1.07:gamma=1.02,unsharp=5:5:0.55:5:5:0" \
  -q:v 2 public/fotos-tratadas/03-area-coberta.jpg
