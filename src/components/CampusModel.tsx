// src/components/CampusModel.tsx
import { useGLTF, Html } from '@react-three/drei'
import { useState } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import NodePopup from './NodePopup'

interface NodeInfo {
  name: string
  position: THREE.Vector3
  meshName: string
}

export default function CampusModel() {
  const { scene } = useGLTF('/src/assets/campus.glb')
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null)

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const mesh = e.object

    // Only respond to meshes named like doors/POIs
    // This relies on your naming convention in Blender
    if (mesh.name.startsWith('door_') || mesh.name.startsWith('poi_')) {
      setSelectedNode({
        name: mesh.name,
        position: e.point.clone(),
        meshName: mesh.name,
      })
    }
  }

  const handleMissedClick = () => setSelectedNode(null)

  return (
    <>
      <primitive
        object={scene}
        scale={1}
        onClick={handleClick}
        onPointerMissed={handleMissedClick}
      />

      {selectedNode && (
        <Html position={selectedNode.position} distanceFactor={80}>
          <NodePopup
            name={selectedNode.name}
            onClose={() => setSelectedNode(null)}
          />
        </Html>
      )}
    </>
  )
}

// Preload for performance
useGLTF.preload('/src/assets/campus.glb')