import { useFrame, useThree } from '@react-three/fiber'
import {useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import routesData from '../assets/routes.json'

// route settings
const MOVE_SPEED = 4
const WAYPOINT_THRESHOLD = 0.1
const LOOK_AHEAD_DISTANCE = 1

type Point = {
    x: number
    y: number
    z: number
}
type RoutesFile = {
    points: Point[]
    closed?: boolean
}

type CameraRouteControllerProps = {
    isPlaying: boolean
    onRouteComplete?: () => void
}


export default function CameraRouteController({
    isPlaying,
    onRouteComplete,
}: CameraRouteControllerProps) {
    const { camera } = useThree()
    const route = routesData as unknown as RoutesFile

    const currentIndexRef = useRef(0)
    const finishedRef = useRef(false)

    const targetVec = useRef(new Vector3())
    const moveDir = useRef(new Vector3())
    const lookTarget = useRef(new Vector3())

    useEffect(() => {
        currentIndexRef.current = 0
        finishedRef.current = false

        if (!route.points || route.points.length === 0) return

        const start = route.points[0]
        camera.position.set(start.x, start.y, start.z)

        if (route.points.length > 1) {
            const next = route.points[1]
            camera.lookAt(next.x, next.y, next.z)
        }
    }, [camera, route])

    useFrame((_, delta) => {
        if (!isPlaying || finishedRef.current) return
        if (!route.points || route.points.length < 2) return

        const currentIndex = currentIndexRef.current
        const nextIndex = currentIndex + 1

        if (nextIndex >= route.points.length) {
            finishedRef.current = true
            onRouteComplete?.()
            return
        }

    const nextPoint = route.points[nextIndex]
    targetVec.current.set(nextPoint.x, nextPoint.y, nextPoint.z)

    moveDir.current.subVectors(targetVec.current, camera.position)
    const distanceToTarget = moveDir.current.length()

    if (distanceToTarget <= WAYPOINT_THRESHOLD) {
        currentIndexRef.current += 1

        if (currentIndexRef.current >= route.points.length -1) {
            finishedRef.current = true
            onRouteComplete?.()
        }

        return
    }


    moveDir.current.normalize()

    const step = Math.min(MOVE_SPEED * delta, distanceToTarget)
    camera.position.addScaledVector(moveDir.current, step)

    lookTarget.current
    .copy(camera.position)
    .addScaledVector(moveDir.current, LOOK_AHEAD_DISTANCE)

    camera.lookAt(lookTarget.current)
})


    return null
    }
