import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f4f4f5',
            border: '1px solid #27272a',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#0f172a' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#0f172a' },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
