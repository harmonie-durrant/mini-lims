import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navigation from './components/Navigation.tsx'

createRoot(document.getElementById('root')!).render(
  <div>
      <Navigation />
      <App />
  </div>,
)
