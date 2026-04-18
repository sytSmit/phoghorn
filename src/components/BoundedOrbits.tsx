import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

// camera map restrictions

const MIN_DISTANCE = 5
const MAX_DISTANCE = 20

const MIN_POLAR_ANGLE = 0.35
const MAX_POLAR_ANGLE = Math.PI / 2.05

const MIN_AZIMUTH_ANGLE = -Infinity
const MAX_AZIMUTH_ANGLE = Infinity

// bounds for where the camera target can move on your map
const MIN_TARGET_X = -100
const MAX_TARGET_X = 100
const MIN_TARGET_Y = 0
const MAX_TARGET_Y = 0
const MIN_TARGET_Z = -100
const MAX_TARGET_Z = 100

const ENABLE_PAN = true
const ENABLE_ROTATE = true
const ENABLE_ZOOM = true

const ENABLE_DAMPING = true
const DAMPING_FACTOR = 0.08

export default function BoundedOrbitControls(){
    const controlsRef = useRef<any>(null)
    const { camera } = useThree()

    useFrame(() => {
        const controls = controlsRef.current
        if (!controls) return

        const target = controls.target as THREE.Vector3

        // current camera offset from target
        const offset = new THREE.Vector3().subVectors(camera.position, target)

        // clamp the target to your allowed map area
        const clampedX = THREE.MathUtils.clamp(target.x, MIN_TARGET_X, MAX_TARGET_X)
        const clampedY = THREE.MathUtils.clamp(target.y, MIN_TARGET_Y, MAX_TARGET_Y)
        const clampedZ = THREE.MathUtils.clamp(target.z, MIN_TARGET_Z, MAX_TARGET_Z)
        

        if (clampedX !== target.x || clampedY !== target.y || clampedZ !== target.z) {
            target.set(clampedX, clampedY, clampedZ)
            camera.position.copy(target).add(offset)
        }

    controls.update()
    })

 

return (
    <OrbitControls
        ref={controlsRef}
        enablePan={ENABLE_PAN}
        enableRotate={ENABLE_ROTATE}
        enableZoom={ENABLE_ZOOM}
        enableDamping={ENABLE_DAMPING}
        dampingFactor={DAMPING_FACTOR}
        minDistance={MIN_DISTANCE}
        maxDistance={MAX_DISTANCE}
        minPolarAngle={MIN_POLAR_ANGLE}
        maxPolarAngle={MAX_POLAR_ANGLE}
        minAzimuthAngle={MIN_AZIMUTH_ANGLE}
        maxAzimuthAngle={MAX_AZIMUTH_ANGLE}
    />
)

}

