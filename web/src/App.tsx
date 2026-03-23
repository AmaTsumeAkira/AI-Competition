import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

const Home = lazy(() => import('./pages/Home'))
const DebugTrack = lazy(() => import('./pages/DebugTrack'))
const CliTrack = lazy(() => import('./pages/CliTrack'))
const Rules = lazy(() => import('./pages/Rules'))
const Bonus = lazy(() => import('./pages/Bonus'))
const Guide = lazy(() => import('./pages/Guide'))
const Environment = lazy(() => import('./pages/Environment'))
const About = lazy(() => import('./pages/About'))

function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="text-gray-400 text-sm">加载中...</div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/debug" element={<DebugTrack />} />
          <Route path="/cli" element={<CliTrack />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/bonus" element={<Bonus />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/environment" element={<Environment />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  )
}
