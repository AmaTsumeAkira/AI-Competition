import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Debug from './pages/Debug'
import CLI from './pages/CLI'
import Rules from './pages/Rules'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/cli" element={<CLI />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
