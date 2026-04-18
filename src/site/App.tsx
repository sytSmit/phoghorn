import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Application from './pages/Application'



//Basically only a router
export default function Root() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<Application />} />
    </Routes>
  )
}
