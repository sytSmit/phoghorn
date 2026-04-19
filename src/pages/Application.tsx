import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import BoundedOrbits from '../components/BoundedOrbits'
import CampusModel from '../components/CampusModel'
import Hand from '../components/Hand'
import Navbar from '../components/Navbar'

function Application() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      <Navbar />
      <Canvas
        camera={{ position: [0, 50, 100], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />

        <Suspense fallback={null}>
          <CampusModel />
          <Hand />
        </Suspense>

        <BoundedOrbits />
      </Canvas>
    </div>
  )
}

export default Application
