#!/usr/bin/env bash
# Gera uma faixa de narração por cena com Piper (voz pt-BR "edresson", CC BY 4.0)
# e trata o áudio (reamostragem, EQ de presença, compressão e normalização).
# Uso: PIPER=/caminho/para/piper VOZ=/caminho/pt-br-edresson-low.onnx ./producao/gerar-narracao.sh
set -euo pipefail
cd "$(dirname "$0")/.."
PIPER="${PIPER:-piper}"
VOZ="${VOZ:?defina VOZ com o caminho do modelo .onnx}"
mkdir -p public/narracao /tmp/narracao-bruta
python3 - "$PIPER" "$VOZ" <<'PY'
import json, subprocess, sys
piper, voz = sys.argv[1], sys.argv[2]
for linha in json.load(open("producao/roteiro.json")):
    bruto = f"/tmp/narracao-bruta/{linha['id']}.wav"
    subprocess.run([piper, "-m", voz, "--length-scale", "1.0", "--sentence-silence", "0.2", "-f", bruto],
                   input=linha["texto"].encode(), check=True, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", bruto, "-af",
        "aresample=44100:resampler=soxr,highpass=f=90,equalizer=f=220:t=q:w=1:g=2,"
        "equalizer=f=3200:t=q:w=1.2:g=3,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,"
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
        "atempo=1.07,loudnorm=I=-16:TP=-1.5:LRA=7,aresample=44100",
        "-ac", "1", f"public/narracao/{linha['id']}.wav"], check=True)
PY
for f in public/narracao/*.wav; do
  printf '%s %s\n' "$(basename "$f" .wav)" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"
done
