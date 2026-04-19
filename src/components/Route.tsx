import { useThree } from '@react-three/fiber'
import {useEffect, useState } from 'react'
import routesData from '../assets/devpost.json'

// route settings

type Point = {
    x: number
    y: number
    z: number
}
type RoutesFile = {
    points: Point[]
    closed?: boolean
}

// debuggind nodes
const NODE_RADIUS = 0.08
const LINE_COLOR = 'white'
const NODE_COLOR = '#dfff00'

const PATH_Y_OFFSET = 5

const CAMERA_HEIGHT = 1.2

const PATH_Y_OFFSET = 1

const CAMERA_HEIGHT = 3


export default function CameraRouteController() {
    const { camera } = useThree()
    const route = routesData as unknown as RoutesFile

    const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null)


    useEffect(() => {
        if (!route.points || route.points.length === 0) return

        const start = route.points[0]


        camera.position.set(start.x, start.y + CAMERA_HEIGHT, start.z)

        if (route.points.length > 1) {
            const next = route.points[1]

            camera.lookAt(next.x, next.y + CAMERA_HEIGHT, next.z)
        }
    }, [camera, route])


    return (
        <>
            {/* connecting path line*/}
            <line>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={route.points.length}
                        array={
                            new Float32Array(
                                route.points.flatMap((p) => [p.x, p.y + 40, p.z])
                            )
                        }
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color={LINE_COLOR} />
            </line>
            
            {/* neon yellow nodes */}
            {route.points.map((point, index) => (
                <mesh
                    key={index}
                    position={[point.x, point.y + PATH_Y_OFFSET, point.z]}
                    onClick={(e) => {
                        e.stopPropagation()

                        const clickedPoint = route.points[index]
                        if (!clickedPoint) return

                        setSelectedPointIndex(index)

                        camera.position.set(
                            clickedPoint.x,
                            clickedPoint.y + CAMERA_HEIGHT,
                            clickedPoint.z
                        )

                        camera.lookAt(
                            clickedPoint.x,
                            clickedPoint.y + CAMERA_HEIGHT,
                            clickedPoint.z - 1
                        )
                    }}
            >
                <sphereGeometry args={[NODE_RADIUS, 16, 16]} />
                <meshStandardMaterial
                    color={selectedPointIndex === index ? 'red' : NODE_COLOR}
                    emissive={selectedPointIndex === index ? 'red' : NODE_COLOR}
                    emissiveIntensity={2}
            />
            </mesh>
        ))}
    </>
    )
}