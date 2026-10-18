"""Run from gopher-ui: python -m unittest discover -s backend -p test_temporal_api.py -v"""
import base64
import unittest
import cv2
from fastapi.testclient import TestClient
from server import app, video_catalog, encoder, temporal_predictor


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_catalog_health_and_checkpoint(self):
        self.assertTrue(self.client.get('/api/health').json()['temporal']['available'])
        self.assertEqual(len(self.client.get('/api/videos').json()['videos']), len(video_catalog()))
        self.assertEqual(self.client.get('/api/model-info').json()['temporal']['sequence_length'], 8)

    def test_invalid_video_and_mode(self):
        for query in ('video=../../secret.mp4', 'mode=unknown'):
            with self.client.websocket_connect('/ws/detect-video?' + query) as ws:
                self.assertEqual(ws.receive_json()['type'], 'error')

    def test_frame_stream_context_reset_and_legacy_mode(self):
        path = next(iter(video_catalog().values()))
        cap = cv2.VideoCapture(str(path))
        ok, frame = cap.read()
        cap.release()
        self.assertTrue(ok)
        data = base64.b64encode(cv2.imencode('.jpg', frame)[1]).decode()
        with self.client.websocket_connect('/ws/detect?mode=rnn') as ws:
            for i in range(8):
                ws.send_json({'type': 'frame', 'data': data, 'timestamp': i/5})
                r = ws.receive_json()
                self.assertEqual(r['type'], 'detections')
                self.assertEqual(r['temporal']['ready'], i == 7)
            ws.send_json({'type': 'reset'})
            ws.send_json({'type': 'frame', 'data': data, 'timestamp': 0})
            self.assertFalse(ws.receive_json()['temporal']['ready'])
        with self.client.websocket_connect('/ws/detect') as ws:
            ws.send_json({'type': 'frame', 'data': data})
            self.assertIsNone(ws.receive_json()['temporal'])

    def test_video_stream_and_restart(self):
        key = next(k for k in video_catalog() if k.startswith('NO20221119'))
        with self.client.websocket_connect('/ws/detect-video?mode=rnn&video=' + key) as ws:
            for i in range(8):
                r = ws.receive_json()
                self.assertEqual(r['type'], 'annotated_frame')
                self.assertEqual(r['current_frame'], i*6 + 1)
                self.assertEqual(r['temporal']['ready'], i == 7)
            ws.send_json({'type': 'restart'})
            restarted = False
            for _ in range(4):
                r = ws.receive_json()
                if r['current_frame'] == 1:
                    self.assertFalse(r['temporal']['ready'])
                    restarted = True
                    break
            self.assertTrue(restarted)
            ws.send_json({'type': 'stop'})


if __name__ == '__main__':
    unittest.main()
