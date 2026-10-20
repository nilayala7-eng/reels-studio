# Estudio de reels

Todo es gratis y funciona sin conexión: Parakeet v3 (sherpa-onnx) para transcribir, ffmpeg para cortar y Remotion para los motion graphics. El estilo está en `estilo.md`: síguelo siempre.

## Instalación (una sola vez)
`npm install`, `pip install sherpa-onnx numpy yt-dlp` y `python tools/setup_model.py`. Necesita Node 18+, Python 3.10+ y ffmpeg en el PATH.

## Flujo para un reel
1. `python tools/prep.py <ruta-del-video> <nombre>`: transcribe, corta los silencios (>0,3 s), lo pasa a 1080×1920 y deja `public/<nombre>.mp4`, `public/<nombre>.words.json` y `raw/<nombre>/transcript.txt`.
2. Leer la transcripción y escribir `public/edits/<nombre>.json` (formato en `src/types.ts`) siguiendo `estilo.md`. Los tiempos se sacan de `words.json`.
3. Revisar con fotogramas sueltos: `npx remotion still src/index.ts Reel out/x.png --props=public/edits/<nombre>.json --frame=N --scale=0.25`, y mirarlos antes de renderizar.
4. Render final: `npx remotion render src/index.ts Reel out/<nombre>.mp4 --props=public/edits/<nombre>.json`.
5. Cuando el usuario apruebe un cambio, apuntarlo en `estilo.md` (sección "Preferencias del usuario").

## Carpeta de vídeos del usuario
Cuando el usuario indique una carpeta de su PC, procesar cada vídeo de esa carpeta con el flujo anterior. No mover ni modificar nunca los originales: `prep.py` los copia a `raw/`.

## Vídeos largos (podcast, directo, clase…)
1. `python tools/transcribe.py <video>` para obtener la transcripción completa con tiempos.
2. Proponer al usuario de 3 a 5 fragmentos de 30-60 s con un gancho fuerte, una idea completa y un buen final (minuto de inicio y fin, y el gancho), y esperar a que elija.
3. Recortar cada fragmento: `ffmpeg -ss <inicio> -to <fin> -i <video> -c:v libx264 -crf 18 -c:a aac raw/<clip>.mp4`, y seguir el flujo normal con `prep.py`.
4. Si es horizontal, `prep.py` recorta al centro; si la persona no está centrada, ajustar el crop en `tools/cut_silences.py`.

## Reels de referencia
Las referencias ya analizadas están en `referencias/` (fotogramas y transcripción). Para añadir una nueva:
`python -m yt_dlp -o "refs/%(id)s.%(ext)s" <url>`, sacar fotogramas con `ffmpeg -i refs/x.mp4 -vf "fps=1,scale=270:-1,tile=6x2" refs/x_%02d.jpg`, transcribir y apuntar el estilo en `estilo.md`.
