# Estudio de reels

Todo es gratis y funciona sin conexión: Whisper no se puede usar porque Hugging Face está bloqueado, así que se usa Parakeet v3 (sherpa-onnx) para transcribir, ffmpeg para cortar y Remotion para los motion graphics.

## Flujo para cada reel
1. El vídeo en bruto va a `raw/<nombre>.mp4`.
2. `tools/prep.sh raw/<nombre>.mp4 <nombre>`: transcribe, corta los silencios (>0,3 s) y deja `public/<nombre>.mp4`, `public/<nombre>.words.json` y la transcripción en `raw/<nombre>/transcript.txt`.
3. Leer la transcripción y escribir `public/edits/<nombre>.json` (formato en `src/types.ts`) siguiendo `estilo.md`.
4. Revisar con fotogramas sueltos: `npx remotion still src/index.ts Reel out/x.png --props=public/edits/<nombre>.json --frame=N --scale=0.25`.
5. Render final: `npx remotion render src/index.ts Reel out/<nombre>.mp4 --props=public/edits/<nombre>.json`.
6. Cuando el usuario apruebe un cambio, apuntarlo en `estilo.md`.

Si `models/` no está (el contenedor es efímero), se vuelve a descargar desde GitHub:
`curl -L https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2 | tar xj -C models` y `pip install sherpa-onnx`.

Para descargar reels de referencia: `pip install yt-dlp && python3 -m yt_dlp <url>`.
