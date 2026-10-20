"""Prepara un vídeo en bruto: transcribe → corta silencios → re-transcribe → lo deja en public/.

Uso: python tools/prep.py <ruta-del-video> [nombre]
Funciona en Windows, Mac y Linux (necesita ffmpeg en el PATH).
"""
import os, shutil, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
src = os.path.abspath(sys.argv[1])
name = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(os.path.basename(src))[0]
work = os.path.join(root, "raw", name)
os.makedirs(work, exist_ok=True)

original = os.path.join(work, "original" + os.path.splitext(src)[1])
if os.path.abspath(src) != original:
    shutil.copy(src, original)
py = sys.executable
subprocess.run([py, "-I", os.path.join(here, "transcribe.py"), original], check=True, stdout=subprocess.DEVNULL)
base = os.path.splitext(original)[0]
out = os.path.join(root, "public", name + ".mp4")
subprocess.run([py, "-I", os.path.join(here, "cut_silences.py"), original, base + ".words.json", out], check=True)
subprocess.run([py, "-I", os.path.join(here, "transcribe.py"), out], check=True)
shutil.move(os.path.join(root, "public", name + ".txt"), os.path.join(work, "transcript.txt"))
print(f"\nListo: public/{name}.mp4, public/{name}.words.json, raw/{name}/transcript.txt")
