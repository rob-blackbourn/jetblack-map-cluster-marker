import React from 'react'
import { HashRouter as Router, Link, Routes, Route } from 'react-router-dom'

import SimpleExample from './pages/SimpleExample'
import GeoJsonExample from './pages/GeoJsonExample'

export default function App() {
  return (
    <div style={{ marginTop: 50 }}>
      <Router>
        <div>
          <h1>@jetblack/map-cluster-marker demos</h1>

          <nav>
            <Link to="/">Simple</Link>
            &nbsp;|&nbsp;
            <Link to="/geojson">GeoJSON</Link>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={<SimpleExample />}></Route>
          <Route path="/geojson" element={<GeoJsonExample />} />
        </Routes>
      </Router>
    </div>
  )
}
