import { useState, useEffect, useRef, useCallback } from 'react'
import { Video, Wifi, WifiOff, RotateCcw, Zap, AlertTriangle, Activity, Scan } from 'lucide-react'

const BACKEND_WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/detect-video`

// Class colors matching the design system
const CLASS_COLORS = {
  pothole: { bg: '#EF4444', text: 'text-red-400', bgClass: 'bg-red-500/20' },
  alligator: { bg: '#F59E0B', text: 'text-amber-400', bgClass: 'bg-amber-500/20' },
  hairline: { bg: '#22C55E', text: 'text-green-400', bgClass: 'bg-green-500/20' },
}

function getClassColor(className) {
  const name = className.toLowerCase()
  if (name.includes('pothole')) return CLASS_COLORS.pothole
  if (name.includes('alligator') || name.includes('crack')) return CLASS_COLORS.alligator
  if (name.includes('hairline')) return CLASS_COLORS.hairline
  return CLASS_COLORS.pothole
}

export default function LiveDetection() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [mode, setMode] = useState('yolo')
  const [videoId, setVideoId] = useState('sample')
  const [videos, setVideos] = useState([])
  const [modelInfo, setModelInfo] = useState(null)
  const [temporal, setTemporal] = useState(null)
  const [error, setError] = useState('')
  const [detections, setDetections] = useState([])
  const [frameData, setFrameData] = useState(null)
  const [stats, setStats] = useState({ totalDetections: 0, fps: 0, currentFrame: 0, totalFrames: 0 })
  const [detectionLog, setDetectionLog] = useState([])
  const wsRef = useRef(null)
  const frameCountRef = useRef(0)
  const fpsIntervalRef = useRef(null)
  const [displayFps, setDisplayFps] = useState(0)
  const canvasRef = useRef(null)
  const imgRef = useRef(new Image())

  useEffect(() => {
    const controller = new AbortController()
    Promise.all(['/api/model-info', '/api/videos'].map(async (url) => {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) throw new Error('Could not load detection models and videos.')
      return response.json()
    })).then(([info, catalog]) => {
      setModelInfo(info)
      setVideos(catalog.videos)
      if (!catalog.videos.some((video) => video.id === 'sample')) setVideoId(catalog.videos[0]?.id || '')
    }).catch((err) => {
      if (err.name !== 'AbortError') setError('Backend unavailable. Start the detection server, then reload this page.')
    })
    return () => controller.abort()
  }, [])

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState < WebSocket.CLOSING) return

    setIsConnecting(true)
    setError('')
    setTemporal(null)
    setDetections([])
    setDetectionLog([])
    const params = new URLSearchParams({ mode, video: videoId })
    const ws = new WebSocket(`${BACKEND_WS_URL}?${params}`)

    ws.onopen = () => {
      setIsConnected(true)
      setIsConnecting(false)
      frameCountRef.current = 0

      // FPS counter
      fpsIntervalRef.current = setInterval(() => {
        setDisplayFps(frameCountRef.current)
        frameCountRef.current = 0
      }, 1000)
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)

      if (msg.type === 'annotated_frame') {
        frameCountRef.current++
        setTemporal(msg.temporal || null)

        // Draw frame on canvas
        const img = imgRef.current
        img.onload = () => {
          const canvas = canvasRef.current
          if (canvas) {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
          }
        }
        img.src = `data:image/jpeg;base64,${msg.frame}`

        setDetections(msg.detections || [])
        setStats({
          totalDetections: msg.count,
          fps: msg.fps,
          currentFrame: msg.current_frame,
          totalFrames: msg.total_frames,
        })

        // Log detections
        if (msg.detections?.length > 0) {
          setDetectionLog((prev) => {
            const newEntries = msg.detections.map((d) => ({
              ...d,
              timestamp: Date.now(),
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            }))
            return [...newEntries, ...prev].slice(0, 50) // Keep last 50
          })
        }
      } else if (msg.type === 'error') {
        setError(msg.message)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      setIsConnecting(false)
      setTemporal(null)
      clearInterval(fpsIntervalRef.current)
    }

    ws.onerror = () => {
      setIsConnected(false)
      setIsConnecting(false)
      setError('Connection failed. Check that the detection backend is running.')
    }

    wsRef.current = ws
  }, [mode, videoId])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
    setIsConnecting(false)
    setTemporal(null)
    setDetections([])
    clearInterval(fpsIntervalRef.current)
  }, [])

  const restart = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'restart' }))
      setTemporal(null)
      setDetections([])
      setDetectionLog([])
    }
  }, [])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  const progress = stats.totalFrames > 0 ? (stats.currentFrame / stats.totalFrames) * 100 : 0

  return (
    <div className="flex gap-4 h-[calc(100vh-112px)] animate-fade-in">
      {/* Left Panel — Stats & Log */}
      <div className="w-[300px] flex-shrink-0 bg-slate-950 border border-zinc-800 rounded-xl p-5 flex flex-col gap-5 overflow-y-auto">
        {/* Connection Status */}
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-3">
            Backend Connection
          </p>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 shadow-glow-green' : 'bg-zinc-600'}`} />
            <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-zinc-500'}`}>
              {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
            </span>
          </div>
          <div className="flex gap-2">
            {!isConnected ? (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-light transition-colors disabled:opacity-50"
              >
                <Wifi className="w-3.5 h-3.5" />
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            ) : (
              <>
                <button
                  onClick={disconnect}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-700 transition-colors"
                >
                  <WifiOff className="w-3.5 h-3.5" />
                  Stop
                </button>
                <button
                  onClick={restart}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart
                </button>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800" />

        <div className="space-y-3">
          <label className="block text-xs text-zinc-400">
            Detection model
            <select aria-label="Detection model" value={mode} onChange={(e) => { setMode(e.target.value); setTemporal(null) }}
              disabled={isConnected || isConnecting}
              className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-100 disabled:opacity-60">
              <option value="yolo">YOLO CNN</option>
              <option value="rnn" disabled={!modelInfo?.temporal?.available}>CNN + vanilla RNN (experimental)</option>
            </select>
          </label>
          <label className="block text-xs text-zinc-400">
            Recording
            <select aria-label="Recording" value={videoId} onChange={(e) => setVideoId(e.target.value)}
              disabled={isConnected || isConnecting}
              className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-xs text-zinc-100 disabled:opacity-60">
              {videos.length === 0 && <option value="sample">Sample road video</option>}
              {videos.map((video) => <option key={video.id} value={video.id}>{video.name}</option>)}
            </select>
          </label>
          {modelInfo && !modelInfo.temporal?.available && (
            <p className="text-xs text-amber-400">Temporal model unavailable. Check the backend model setup.</p>
          )}
          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
        </div>

        {mode === 'rnn' && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 space-y-2">
            <p className="text-xs font-semibold text-blue-300">Temporal damage scores</p>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Experimental: trained on YOLO-generated labels. Scores summarize recent frames; boxes come from YOLO.
            </p>
            {!temporal?.ready ? (
              <p className="text-xs text-zinc-400">{isConnected
                ? `Collecting context: ${temporal?.frames_collected || 0}/${temporal?.frames_required || modelInfo?.temporal?.sequence_length || 8} frames`
                : 'Start detection to collect video context.'}</p>
            ) : temporal.scores.map((item) => (
              <div key={item.class_id} className="flex items-center justify-between gap-2 text-xs">
                <span className="capitalize text-zinc-300">{item.class_name}</span>
                <span className={item.active ? 'font-semibold text-blue-300' : 'text-zinc-500'}>
                  {item.supported ? `${(item.score * 100).toFixed(1)}%` : 'Not trained'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Live Stats */}
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-3">
            Live Statistics
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-zinc-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Scan className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] text-zinc-500 uppercase">Detections</span>
              </div>
              <span className="text-xl font-bold text-zinc-100">{stats.totalDetections}</span>
            </div>
            <div className="bg-zinc-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] text-zinc-500 uppercase">FPS</span>
              </div>
              <span className="text-xl font-bold text-zinc-100">{displayFps}</span>
            </div>
          </div>
        </div>

        {/* Current Detections */}
        {detections.length > 0 && (
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-2">
              Current Frame
            </p>
            <div className="space-y-1.5">
              {detections.map((det, i) => {
                const color = getClassColor(det.class_name)
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between px-2 py-1.5 rounded-md bg-zinc-900/50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color.bg }}
                      />
                      <span className="text-xs text-zinc-300 capitalize">{det.class_name}</span>
                    </div>
                    <span className={`text-xs font-semibold tabular-nums ${color.text}`}>
                      {(det.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="border-t border-zinc-800" />

        {/* Detection Log */}
        <div className="flex-1 min-h-0">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-2">
            Detection Log
          </p>
          <div className="space-y-1 overflow-y-auto max-h-64">
            {detectionLog.length === 0 ? (
              <p className="text-xs text-zinc-600 italic">No detections yet</p>
            ) : (
              detectionLog.slice(0, 20).map((det) => {
                const color = getClassColor(det.class_name)
                const time = new Date(det.timestamp).toLocaleTimeString()
                return (
                  <div
                    key={det.id}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-zinc-800/50 transition-colors"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color.bg }}
                    />
                    <span className="text-xs text-zinc-400 capitalize flex-1 truncate">
                      {det.class_name}
                    </span>
                    <span className={`text-[10px] font-medium tabular-nums ${color.text}`}>
                      {(det.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-zinc-600 tabular-nums">
                      {time}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Main — Video Feed */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Video Container */}
        <div className="flex-1 relative bg-slate-950 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Canvas for annotated frames */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
            style={{ display: isConnected && frameData !== null ? 'block' : isConnected ? 'block' : 'none' }}
          />

          {/* Placeholder when not connected */}
          {!isConnected && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Video className="w-10 h-10 text-zinc-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                  <Scan className="w-3 h-3 text-accent" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-zinc-300 mb-2">
                Live Pothole Detection
              </h3>
              <p className="text-sm text-zinc-500 mb-1">
                {mode === 'rnn' ? 'CNN + vanilla RNN — Temporal Analysis' : 'YOLOv11n CNN Model — Real-time Inference'}
              </p>
              <p className="text-xs text-zinc-600 mb-6">
                Connect to the backend to start detecting road damage
              </p>
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-light transition-all duration-200 hover:shadow-glow-accent disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                {isConnecting ? 'Connecting...' : 'Start Detection'}
              </button>
            </div>
          )}

          {/* Live indicator */}
          {isConnected && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-sm border border-zinc-800 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-zinc-300 uppercase tracking-wider font-medium">Live</span>
            </div>
          )}

          {/* Detection count overlay */}
          {isConnected && detections.length > 0 && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-red-400 font-semibold">
                {detections.length} Detection{detections.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Model info overlay */}
          {isConnected && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-sm border border-zinc-800 rounded-lg">
              <Activity className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] text-zinc-400 font-mono">
                {mode === 'rnn' ? 'CNN + vanilla RNN' : 'YOLOv11n'} • {displayFps} FPS
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isConnected && stats.totalFrames > 0 && (
          <div className="bg-slate-950 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Video Progress</span>
              <span className="text-[10px] text-zinc-500 tabular-nums">
                Frame {stats.currentFrame} / {stats.totalFrames}
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
