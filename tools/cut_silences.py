"""Corta silencios y pausas largas usando los tiempos de palabra.

Uso: python3 -I cut_silences.py <video> <words.json> <salida.mp4> [max_gap=0.3] [pad=0.08]
"""
import json, subprocess, sys

src, words_path, out = sys.argv[1:4]
max_gap = float(sys.argv[4]) if len(sys.argv) > 4 else 0.3
pad = float(sys.argv[5]) if len(sys.argv) > 5 else 0.08

words = json.load(open(words_path))
segs = []
for w in words:
    s, e = max(0, w["s"] - pad), w["e"] + pad
    if segs and s - segs[-1][1] < max_gap:
        segs[-1][1] = e
    else:
        segs.append([s, e])

parts = "".join(
    f"[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS[a{i}];"
    for i, (s, e) in enumerate(segs))
concat = "".join(f"[v{i}][a{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=1[vc][a];" \
    "[vc]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30[v]"
subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-filter_complex", parts + concat,
     "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-c:a", "aac", "-b:a", "192k", out],
    check=True)
kept = sum(e - s for s, e in segs)
print(f"{len(segs)} tramos, {kept:.1f}s conservados")
