import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ToastProvider } from './context/ToastContext'
import { ConfirmDialogProvider } from './context/ConfirmDialogContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <ConfirmDialogProvider>
        <App />
      </ConfirmDialogProvider>
    </ToastProvider>
  </StrictMode>,
)
