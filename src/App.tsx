import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Nav } from './components/Nav'
import { ReturnBar } from './components/ReturnBar'
import { Toast } from './components/Toast'
import Home from './routes/Home'
import NotFound from './routes/NotFound'
import ProjectDetail from './routes/ProjectDetail'
import { SceneLayer } from './scene/SceneLayer'
import { Footer } from './sections/Footer'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { useUI } from './store/ui'

export default function App() {
  const theme = useUI((s) => s.theme)
  const reduceMotion = useUI((s) => s.reduceMotion)
  useSmoothScroll()

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0B0C0E' : '#F4F2EE')
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion)
  }, [reduceMotion])

  return (
    <ErrorBoundary>
      <SceneLayer />
      <Nav />
      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ReturnBar />
      <Toast />
    </ErrorBoundary>
  )
}
