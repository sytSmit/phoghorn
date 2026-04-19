import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import RadialFloorSelector from './RadialFloorSelector'

const floors = [
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 3, label: '3' },
  { id: 4, label: '4' },
  { id: 5, label: '5' },
]

const EXIT_ANIMATION_MS = 240

export default function Hand() {
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuPosition, setMenuPosition] = useState<THREE.Vector3 | null>(null)
  const groupRef = useRef<THREE.Group>(null)
  const closeTimerRef = useRef<number | null>(null)
  const openRaf1Ref = useRef<number | null>(null)
  const openRaf2Ref = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
      if (openRaf1Ref.current !== null) {
        window.cancelAnimationFrame(openRaf1Ref.current)
      }
      if (openRaf2Ref.current !== null) {
        window.cancelAnimationFrame(openRaf2Ref.current)
      }
    }
  }, [])

  const closeMenu = () => {
    setMenuVisible(false)
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }
    closeTimerRef.current = window.setTimeout(() => {
      setMenuPosition(null)
      closeTimerRef.current = null
    }, EXIT_ANIMATION_MS)
  }

  const openMenuAt = (point: THREE.Vector3) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    if (openRaf1Ref.current !== null) {
      window.cancelAnimationFrame(openRaf1Ref.current)
      openRaf1Ref.current = null
    }
    if (openRaf2Ref.current !== null) {
      window.cancelAnimationFrame(openRaf2Ref.current)
      openRaf2Ref.current = null
    }
    setMenuPosition(point.clone())
    setMenuVisible(false)
    openRaf1Ref.current = window.requestAnimationFrame(() => {
      openRaf2Ref.current = window.requestAnimationFrame(() => {
        setMenuVisible(true)
        openRaf1Ref.current = null
        openRaf2Ref.current = null
      })
    })
  }

  const placeOrCloseMenu = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()

    if (menuVisible || menuPosition) {
      closeMenu()
    } else {
      openMenuAt(e.point)
    }
  }

  const handleFloorSelect = (floorId: number) => {
    console.log(`Navigating to floor ${floorId}...`)
  }

  return (
    <group ref={groupRef}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
        onClick={placeOrCloseMenu}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {menuPosition && (
        <RadialFloorSelector
          floors={floors}
          visible={menuVisible}
          position={menuPosition}
          onSelectFloor={handleFloorSelect}
          onClose={closeMenu}
        />
      )}
    </group>
  )
}
