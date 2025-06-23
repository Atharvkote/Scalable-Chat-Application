import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        toastOptions={{
          style: {
            background: 'bg-primary',
            color: 'black',
            fontWeight: 500,
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '16px',
            fontSize: '16px',
            border: '1px solid #ad46ff',
          },
          duration: 3000,
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
