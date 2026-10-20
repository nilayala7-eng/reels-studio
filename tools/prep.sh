#!/usr/bin/env bash
# Prepara un vídeo en bruto: transcribe → corta silencios → re-transcribe → copia a public/.
# Uso: tools/prep.sh raw/mi-video.mp4 [nombre]
set -euo pipefail
cd "$(dirname "$0")/.."
src="$1"
name="${2:-$(basename "${src%.*}")}"
work="raw/$name"
mkdir -p "$work"
cp "$src" "$work/original.mp4" 2>/dev/null || true
python3 -I tools/transcribe.py "$work/original.mp4" > /dev/null
python3 -I tools/cut_silences.py "$work/original.mp4" "$work/original.words.json" "public/$name.mp4"
python3 -I tools/transcribe.py "public/$name.mp4"
mv "public/$name.words.json" "public/$name.words.json" 2>/dev/null || true
mv "public/$name.txt" "$work/transcript.txt"
ffprobe -v error -show_entries format=duration -of csv=p=0 "public/$name.mp4"
