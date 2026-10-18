"""
Gopher AI — Pothole Detection Backend
FastAPI server with YOLOv11n model for real-time pothole detection.
Streams annotated frames via WebSocket and provides REST endpoints.
"""

import asyncio
import base64
import json
import os
import time
import sys
from pathlib import Path

import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from ultralytics import YOLO
import torch

# ── Paths ──
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
MODEL_PATH = os.path.join(PROJECT_DIR, "models", "CNN", "gopher-ai_v1.pt")
VIDEO_PATH = os.path.join(PROJECT_DIR, "models", "CNN", "sample_road.mp4")
AI_DIR = Path(os.environ.get('GOPHER_AI_DIR', Path(PROJECT_DIR).parent / 'NN-DL/Gopher-AI')).resolve()
sys.path.insert(0, str(AI_DIR))
from vanilla_rnn.model import CNNEncoder, TemporalPredictor
RNN_PATH = Path(os.environ.get('GOPHER_RNN_CHECKPOINT', Path(PROJECT_DIR) / 'models/RNN/best.pt'))
torch.set_num_threads(4)

# ── App ──
app = FastAPI(title="Gopher AI Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load Model ──
print(f"Loading YOLO model from: {MODEL_PATH}")
encoder = CNNEncoder(MODEL_PATH)
model = encoder.yolo
temporal_predictor = None
print(f"Model loaded successfully. Classes: {model.names}")


def temporal_status():
    global temporal_predictor
    error = None
    if temporal_predictor is None:
        try:
            temporal_predictor = TemporalPredictor(RNN_PATH, cnn_hash=encoder.sha256)
        except (OSError, ValueError, RuntimeError, KeyError) as exc:
            error = str(exc)
    return {'available': temporal_predictor is not None, 'architecture': 'CNN + vanilla RNN',
            'experimental': True, 'label_source': 'YOLO-generated labels; not human-reviewed',
            'sequence_length': temporal_predictor.config['sequence_length'] if temporal_predictor else None,
            'sample_fps': temporal_predictor.config['sample_fps'] if temporal_predictor else None,
            'error': error}


def video_catalog():
    videos = {'sample': Path(VIDEO_PATH)} if Path(VIDEO_PATH).is_file() else {}
    videos.update({p.name: p for p in sorted((AI_DIR / 'dashcam_recordings').glob('*.mp4'))})
    return videos


@app.get('/api/videos')
async def videos():
    return {'videos': [{'id': key, 'name': 'Sample road video' if key == 'sample' else key}
                       for key in video_catalog()]}


def select_window(websocket):
    mode = websocket.query_params.get('mode', 'yolo')
    if mode not in ('yolo', 'rnn'):
        raise ValueError('Choose yolo or rnn mode.')
    if mode == 'rnn':
        if not temporal_status()['available']:
            raise ValueError('Temporal model unavailable. Check /api/model-info and the RNN checkpoint.')
        return temporal_predictor.new_window()
    return None


def infer(frame, window, timestamp):
    results, features = encoder.predict([frame])
    temporal = window.push(features[0], timestamp) if window is not None else None
    return results, temporal


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "model": "gopher-ai_v1", "classes": model.names, 'temporal': temporal_status()}


@app.get("/api/model-info")
async def model_info():
    """Return model metadata."""
    return {
        "model_name": "gopher-ai_v1",
        "architecture": "YOLOv11n",
        "classes": model.names,
        "num_classes": len(model.names),
        'temporal': temporal_status(),
    }


@app.get("/api/sample-video")
async def get_sample_video():
    """Serve the sample video file."""
    if os.path.exists(VIDEO_PATH):
        return FileResponse(VIDEO_PATH, media_type="video/mp4")
    return JSONResponse({"error": "Sample video not found"}, status_code=404)


@app.websocket("/ws/detect")
async def websocket_detect(websocket: WebSocket):
    """
    WebSocket endpoint for real-time pothole detection.
    
    Client sends base64-encoded JPEG frames.
    Server responds with JSON containing bounding box predictions.
    """
    await websocket.accept()
    print("WebSocket client connected")

    try:
        window = select_window(websocket)
        while True:
            # Receive base64 frame from client
            data = await websocket.receive_text()
            message = json.loads(data)

            if message.get("type") == "frame":
                frame_b64 = message["data"]

                # Decode base64 to image
                img_bytes = base64.b64decode(frame_b64)
                nparr = np.frombuffer(img_bytes, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                if frame is None:
                    await websocket.send_json({"type": "error", "message": "Invalid frame"})
                    continue

                # Run inference
                results, temporal = await asyncio.to_thread(infer, frame, window,
                    float(message.get('timestamp', time.monotonic())))
                
                detections = []
                for result in results:
                    if result.boxes is not None:
                        for box in result.boxes:
                            x1, y1, x2, y2 = box.xyxy[0].tolist()
                            confidence = float(box.conf[0])
                            class_id = int(box.cls[0])
                            class_name = model.names[class_id]

                            detections.append({
                                "bbox": [x1, y1, x2, y2],
                                "confidence": round(confidence, 3),
                                "class_id": class_id,
                                "class_name": class_name,
                            })

                await websocket.send_json({
                    "type": "detections",
                    "data": detections,
                    "count": len(detections),
                    "timestamp": time.time(),
                    "temporal": temporal,
                })

            elif message.get('type') == 'reset' and window:
                window.reset()
            elif message.get("type") == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
        try:
            await websocket.send_json({'type': 'error', 'message': str(e)})
            await websocket.close()
        except Exception:
            pass


@app.websocket("/ws/detect-video")
async def websocket_detect_video(websocket: WebSocket):
    """
    WebSocket endpoint for server-side video processing.
    
    Opens the sample video on the server, runs detection frame-by-frame,
    and streams annotated frames + detections back to the client.
    """
    await websocket.accept()
    print("Video detection WebSocket connected")

    try:
        window = select_window(websocket)
        path = video_catalog().get(websocket.query_params.get('video', 'sample'))
        if path is None:
            raise ValueError('Unknown video. Choose a video from the recordings list.')
    except ValueError as exc:
        await websocket.send_json({'type': 'error', 'message': str(exc)})
        await websocket.close()
        return
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        await websocket.send_json({"type": "error", "message": "Cannot open video"})
        await websocket.close()
        return

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    sample_fps = temporal_predictor.config['sample_fps'] if window else min(fps, 10)
    stride = max(1, round(fps / sample_fps))
    if window and abs(fps / sample_fps - stride) > 0.05:
        cap.release()
        await websocket.send_json({'type': 'error', 'message': 'Video FPS does not match temporal sampling requirements.'})
        await websocket.close()
        return
    frame_delay = 1.0 / sample_fps

    try:
        while True:
            started = time.monotonic()
            # Check for client messages (non-blocking)
            try:
                msg = await asyncio.wait_for(websocket.receive_text(), timeout=0.01)
                parsed = json.loads(msg)
                if parsed.get("type") == "stop":
                    break
                if parsed.get("type") == "restart":
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    if window:
                        window.reset()
                    continue
            except asyncio.TimeoutError:
                pass

            ret, frame = cap.read()
            if not ret:
                # Loop the video
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                if window:
                    window.reset()
                ret, frame = cap.read()
                if not ret:
                    break

            current_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))

            # Run inference
            results, temporal = await asyncio.to_thread(infer, frame, window, (current_frame - 1) / fps)

            detections = []
            for result in results:
                if result.boxes is not None:
                    for box in result.boxes:
                        x1, y1, x2, y2 = box.xyxy[0].tolist()
                        confidence = float(box.conf[0])
                        class_id = int(box.cls[0])
                        class_name = model.names[class_id]

                        detections.append({
                            "bbox": [x1, y1, x2, y2],
                            "confidence": round(confidence, 3),
                            "class_id": class_id,
                            "class_name": class_name,
                        })

                        # Draw bounding box on frame
                        color = _get_class_color(class_name)
                        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
                        label = f"{class_name} {confidence:.1%}"
                        label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                        cv2.rectangle(
                            frame,
                            (int(x1), int(y1) - label_size[1] - 8),
                            (int(x1) + label_size[0] + 4, int(y1)),
                            color,
                            -1,
                        )
                        cv2.putText(
                            frame,
                            label,
                            (int(x1) + 2, int(y1) - 4),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.5,
                            (255, 255, 255),
                            1,
                        )

            # Encode annotated frame to JPEG
            _, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            frame_b64 = base64.b64encode(buffer).decode("utf-8")

            await websocket.send_json({
                "type": "annotated_frame",
                "frame": frame_b64,
                "detections": detections,
                "count": len(detections),
                "current_frame": current_frame,
                "total_frames": total_frames,
                "fps": fps,
                "processing_fps": sample_fps,
                "temporal": temporal,
                "timestamp": time.time(),
            })

            for _ in range(stride - 1):
                if not cap.grab():
                    break
            await asyncio.sleep(max(0, frame_delay - (time.monotonic() - started)))

    except WebSocketDisconnect:
        print("Video detection client disconnected")
    except Exception as e:
        print(f"Video detection error: {e}")
        try:
            await websocket.send_json({'type': 'error', 'message': str(e)})
        except Exception:
            pass
    finally:
        cap.release()
        try:
            await websocket.close()
        except Exception:
            pass


def _get_class_color(class_name: str) -> tuple:
    """Return BGR color for a class name."""
    name = class_name.lower()
    if "pothole" in name:
        return (68, 68, 239)  # Red in BGR
    elif "alligator" in name or "crack" in name:
        return (11, 158, 245)  # Amber in BGR
    elif "hairline" in name:
        return (94, 197, 34)  # Green in BGR
    else:
        return (245, 158, 11)  # Default amber


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
