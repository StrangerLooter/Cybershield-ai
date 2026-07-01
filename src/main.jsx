import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#F0F4FF',
            border: '1px solid rgba(255, 90, 31, 0.3)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: { primary: '#00FF88', secondary: '#111827' },
          },
          error: {
            iconTheme: { primary: '#FF3333', secondary: '#111827' },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
