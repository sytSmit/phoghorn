// src/pages/App.tsx
import { Canvas } from '@react-three/fiber'
import BoundedOrbits from '../components/BoundedOrbits'
import CampusModel from '../components/CampusModel'

function Application() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 50, 100], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <CampusModel />
        <BoundedOrbits />
      </Canvas>
    </div>
  )
}

export default Application
