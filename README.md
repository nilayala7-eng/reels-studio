# Estudio de reels

Edición de reels con Claude Code + Remotion, 100 % gratis y sin conexión:
- Transcripción palabra a palabra (Parakeet v3 / sherpa-onnx).
- Corte automático de silencios con ffmpeg.
- Plantilla Remotion: subtítulos animados, etiquetas, stickers, zooms y escenas de motion graphics (pasos, checklist, logos, versiones, diagramas, terminal).

## Instalación
Requisitos: Node 18+, Python 3.10+ y ffmpeg.

```
npm install
pip install sherpa-onnx numpy yt-dlp
python tools/setup_model.py
```

## Uso
Abre Claude Code en esta carpeta y dile, por ejemplo:
> Edita los vídeos de C:\Users\yo\Videos\reels con mi estilo

Los pasos detallados están en `CLAUDE.md` y el estilo en `estilo.md`.
