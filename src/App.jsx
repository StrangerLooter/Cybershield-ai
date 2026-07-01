import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Analyzer from './pages/Analyzer'
import QRScanner from './pages/QRScanner'
import Complaint from './pages/Complaint'
import Academy from './pages/Academy'
import Dashboard from './pages/Dashboard'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/analyzer"  element={<Analyzer />} />
          <Route path="/scanner"   element={<QRScanner />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/academy"   element={<Academy />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about"     element={<About />} />
        </Routes>
      </Layout>
    </>
  )
}
