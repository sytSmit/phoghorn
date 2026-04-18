import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import App from './pages/App'

//Basically only a router
function Root() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<App />} />
    </Routes>
  )
}

export default Root