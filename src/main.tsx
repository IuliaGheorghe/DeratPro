import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './css/global.css'
import App from './App.tsx'

AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: false,
  mirror: true,
  offset: 60,
  disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
