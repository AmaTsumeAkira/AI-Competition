import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import DebugTrack from './pages/DebugTrack'
import CliTrack from './pages/CliTrack'
import Rules from './pages/Rules'
import About from './pages/About'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/debug" element={<DebugTrack />} />
          <Route path="/cli" element={<CliTrack />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
