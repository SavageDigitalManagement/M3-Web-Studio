from __future__ import annotations

import math
from typing import Optional, Tuple

import os
import tempfile

from flask import Flask, jsonify, request
from flask_cors import CORS

try:
    import numpy as np
    import librosa
except Exception:
    np = None
    librosa = None

try:
    import yt_dlp
except Exception:
    yt_dlp = None

app = Flask(__name__)
CORS(app)

KEY_TO_CAM = {
    "C": "8B",
    "G": "9B",
    "D": "10B",
    "A": "11B",
    "E": "12B",
    "B": "1B",
    "F#": "2B",
    "Gb": "2B",
    "Db": "3B",
    "C#": "3B",
    "Ab": "4B",
    "G#": "4B",
    "Eb": "5B",
    "D#": "5B",
    "Bb": "6B",
    "A#": "6B",
    "F": "7B",
    "Am": "8A",
    "Em": "9A",
    "Bm": "10A",
    "F#m": "11A",
    "Gbm": "11A",
    "C#m": "12A",
    "Dbm": "12A",
    "G#m": "1A",
    "Abm": "1A",
    "D#m": "2A",
    "Ebm": "2A",
    "A#m": "3A",
    "Bbm": "3A",
    "Fm": "4A",
    "Cm": "5A",
    "Gm": "6A",
    "Dm": "7A",
}


def analyze_audio(path: str, seconds: int = 60, target_sr: int = 22050) -> Tuple[Optional[int], Optional[str]]:
    if librosa is None or np is None:
        return None, None
    try:
        y, sr = librosa.load(path, mono=True, duration=seconds, sr=target_sr)
        if y.size == 0:
            return None, None
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = int(round(float(tempo))) if tempo else None

        chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
        prof = chroma.mean(axis=1)

        major_profile = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
        minor_profile = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])

        def score(profile):
            scores = []
            for i in range(12):
                rot = np.roll(profile, i)
                s = np.dot(prof, rot) / (np.linalg.norm(prof) * np.linalg.norm(rot))
                scores.append(s)
            return scores

        major_scores = score(major_profile)
        minor_scores = score(minor_profile)
        max_major = max(major_scores)
        max_minor = max(minor_scores)
        note_idx = major_scores.index(max_major) if max_major >= max_minor else minor_scores.index(max_minor)
        is_minor = max_minor > max_major

        notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        key = notes[note_idx] + ("m" if is_minor else "")
        return bpm, key
    except Exception:
        return None, None


@app.post("/analyze")
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "missing file"}), 400
    f = request.files["file"]
    if not f.filename:
        return jsonify({"error": "missing filename"}), 400
    suffix = os.path.splitext(f.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        f.save(tmp.name)
        tmp_path = tmp.name
    try:
        seconds = int(request.args.get("seconds", "60"))
    except Exception:
        seconds = 60
    bpm, key = analyze_audio(tmp_path, seconds=seconds)
    camelot = KEY_TO_CAM.get(key) if key else None
    try:
        os.remove(tmp_path)
    except Exception:
        pass
    return jsonify({"bpm": bpm, "key": key, "camelot": camelot})


@app.post("/rip")
def rip():
    if yt_dlp is None:
        return jsonify({"error": "yt-dlp not installed"}), 500
    data = request.get_json(silent=True) or {}
    url = data.get("url")
    if not url:
        return jsonify({"error": "missing url"}), 400

    out_dir = tempfile.mkdtemp(prefix="lucid_rip_")
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": os.path.join(out_dir, "%(title).200s.%(ext)s"),
        "quiet": True,
        "noplaylist": True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        if "requested_downloads" in info and info["requested_downloads"]:
            filepath = info["requested_downloads"][0]["filepath"]
        else:
            filepath = ydl.prepare_filename(info)

    filename = os.path.basename(filepath)
    response = app.send_static_file(filepath) if False else None
    from flask import send_file  # inline to avoid circular
    resp = send_file(filepath, as_attachment=True)
    resp.headers["X-Filename"] = filename
    return resp


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
