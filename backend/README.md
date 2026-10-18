# Gopher AI detection server

From the `gopher-ui` project root:

```powershell
python -m uvicorn server:app --app-dir backend --host 127.0.0.1 --port 8000
```

In a second terminal:

```powershell
npm run dev
```

Choose the **User** role, then **CNN + vanilla RNN (experimental)** in Detection model.
Choose a recording and Connect. After eight sampled frames, temporal class scores appear
alongside the YOLO video boxes. Stop before switching models or recordings.
Restart and video looping reset temporal context; every connection has its own history.

YOLO remains the default. The RNN was trained on sparse, unreviewed YOLO-generated labels
and performed poorly in evaluation. Its score is an experimental signal, not a verified
damage probability. It does not filter detections or drive repair priorities.

## Files and paths

- CNN checkpoint: `models/CNN/gopher-ai_v1.pt`.
- RNN checkpoint: `models/RNN/best.pt` (trained binary, ignored by Git).
- Training metrics: `models/RNN/metrics.json`.
- Shared inference implementation: `Gopher-AI/vanilla_rnn/model.py`.
- Video catalog: existing sample video plus `Gopher-AI/dashcam_recordings/*.mp4`.

The default sibling layout is `SEM-7/gopher-ui` and `SEM-7/NN-DL/Gopher-AI`.
Set `GOPHER_AI_DIR` if the AI project lives elsewhere. Set `GOPHER_RNN_CHECKPOINT`
to override the RNN weights. The backend checks the CNN's hash and class order against
the RNN checkpoint. It will report RNN unavailable for missing or incompatible weights.
Keep the shared AI project available when starting this backend.

The Vite development proxy forwards `/api` and `/ws` to port 8000. The UI uses its
current origin (including secure WebSockets under HTTPS). Production hosting must
provide the same proxy routes. Built assets alone do not run the Python backend.

## API and tests

- `GET /api/model-info`: CNN and RNN availability/metadata.
- `GET /api/videos`: allowed recording IDs; arbitrary file paths are rejected.
- `/ws/detect-video?mode=yolo|rnn&video=<catalog-id>`: annotated frames and optional
  temporal results; client messages `restart` and `stop` are supported.
- `/ws/detect?mode=yolo|rnn`: send `{type: "frame", data: "<base64 JPEG>", timestamp: 0.0}`.
  Timestamps are seconds of source video time. Send `reset` between sources/seeks.
  Temporal sampling is 5 FPS; time gaps over 0.5 seconds reset the window.

```powershell
python -m unittest discover -s backend -p test_temporal_api.py -v
npm run build
```

Tests require the supplied recordings, both checkpoints, FastAPI, and HTTPX.
They cover both detection modes, warmup, stream restart/reset, invalid video/mode,
and model availability. The AI project has additional chronological-window,
normalization, checkpoint compatibility, and online/offline score parity tests.
