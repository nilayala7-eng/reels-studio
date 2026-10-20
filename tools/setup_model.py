"""Descarga el modelo de voz (Parakeet v3, ~490 MB) en models/. Funciona en Windows, Mac y Linux."""
import os, tarfile, urllib.request

URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8.tar.bz2"
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
os.makedirs(root, exist_ok=True)
if os.path.isdir(os.path.join(root, "sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8")):
    print("El modelo ya está descargado.")
else:
    tmp = os.path.join(root, "model.tar.bz2")
    print("Descargando modelo (~490 MB)...")
    urllib.request.urlretrieve(URL, tmp)
    with tarfile.open(tmp) as t:
        t.extractall(root)
    os.remove(tmp)
    print("Listo.")
