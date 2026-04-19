import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import BoundedOrbits from '../components/BoundedOrbits'
import CampusModel from '../components/CampusModel'
import CameraRouteController from '../components/Route'
import Hand from '../components/Hand'
import Navbar from '../components/Navbar'
import Navbar2 from '../components/Navbar2'
import { Environment, ContactShadows } from '@react-three/drei' // Add these

function Application() {
  //const [isPlaying, setIsPlaying] = useState(true)
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#e1ebf0' }}>
      <Navbar />
      <Navbar2 />
      <Canvas
        camera={{ position: [0, 50, 100], fov: 45 }}
        shadows
        gl={{ 
          antialias: true,
          stencil: false,
          depth: true
        }}
      >
        {/* 1. Replace manual lights with an Environment map for realistic interior reflections */}
        <Environment preset="city" /> 

        <Suspense fallback={null}>
          <CampusModel />
          <Hand />
          
          {/* 2. Soft floor shadows to ground the building */}
          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.4} 
            scale={200} 
            blur={2} 
            far={50} 
          />
        </Suspense>

        <BoundedOrbits />
         <CameraRouteController
          //onRouteComplete={() => setIsPlaying(false)}
        />
      </Canvas>
    </div>
  )
}

export default Application