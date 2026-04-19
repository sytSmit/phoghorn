import { useGLTF, Html } from '@react-three/drei'
import { useState } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import NodePopup from './NodePopup'

const MODEL_URL = new URL('../assets/campus.glb', import.meta.url).href;

interface NodeInfo {
  name: string
  position: THREE.Vector3
  meshName: string
}

export default function CampusModel() {
  const { scene } = useGLTF(MODEL_URL)
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null)

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    const mesh = e.object

    if (mesh.name.startsWith('door_') || mesh.name.startsWith('poi_')) {
      e.stopPropagation()
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

useGLTF.preload(MODEL_URL)
