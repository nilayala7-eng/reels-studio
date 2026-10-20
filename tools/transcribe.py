"""Transcribe a video/audio file to word-level timestamps (free, offline).

Usage: python3 -I transcribe.py <input> [model_dir]
Writes <input>.words.json ([{w, s, e}]) and <input>.txt (one line per phrase).
"""
import json, os, subprocess, sys

import numpy as np
import sherpa_onnx

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_MODEL = os.path.join(HERE, "..", "models", "sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8")
SR = 16000
CHUNK_S = 30  # parakeet works best on short windows; we cut at the quietest point near each boundary


def load_audio(path):
    pcm = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
        check=True, capture_output=True).stdout
    return np.frombuffer(pcm, np.int16).astype(np.float32) / 32768


def split_points(audio):
    cuts, pos = [0], 0
    while len(audio) - pos > CHUNK_S * SR:
        lo, hi = pos + (CHUNK_S - 6) * SR, pos + CHUNK_S * SR
        win = audio[lo:hi]
        frame = SR // 50
        energy = [np.abs(win[i:i + frame]).mean() for i in range(0, len(win) - frame, frame)]
        pos = lo + int(np.argmin(energy)) * frame
        cuts.append(pos)
    cuts.append(len(audio))
    return cuts


def main():
    src = sys.argv[1]
    model = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_MODEL
    rec = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=f"{model}/encoder.int8.onnx", decoder=f"{model}/decoder.int8.onnx",
        joiner=f"{model}/joiner.int8.onnx", tokens=f"{model}/tokens.txt",
        model_type="nemo_transducer", num_threads=os.cpu_count())
    audio = load_audio(src)
    cuts = split_points(audio)
    words = []
    for a, b in zip(cuts, cuts[1:]):
        st = rec.create_stream()
        st.accept_waveform(SR, audio[a:b])
        rec.decode_stream(st)
        r, off = st.result, a / SR
        for tok, t in zip(r.tokens, r.timestamps):
            if tok.startswith(" ") or not words or words[-1].get("_chunk") != a:
                words.append({"w": tok.strip(), "s": round(off + t, 2), "_chunk": a})
            else:
                words[-1]["w"] += tok
    for i, w in enumerate(words):
        w.pop("_chunk")
        nxt = words[i + 1]["s"] if i + 1 < len(words) else len(audio) / SR
        w["e"] = round(min(nxt, w["s"] + 0.8), 2)
    words = [w for w in words if w["w"]]

    lines, cur = [], []
    for w in words:
        cur.append(w)
        if w["w"][-1] in ".?!" or (len(cur) > 1 and w["s"] - cur[-2]["e"] > 0.6):
            lines.append(cur); cur = []
    if cur:
        lines.append(cur)
    text = "\n".join(f"[{l[0]['s']:6.2f}-{l[-1]['e']:6.2f}] " + " ".join(x["w"] for x in l) for l in lines)

    base = src.rsplit(".", 1)[0]
    json.dump(words, open(base + ".words.json", "w"), ensure_ascii=False)
    open(base + ".txt", "w").write(text)
    print(text)


if __name__ == "__main__":
    main()
