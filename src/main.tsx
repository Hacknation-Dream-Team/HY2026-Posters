import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 1. Style CSS biblioteki mapy
import 'maplibre-gl/dist/maplibre-gl.css'

// 2. Twoje własne style (Tailwind / CSS)
import './index.css'

// 3. Główny komponent aplikacji
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)