import { Html } from '@react-three/drei'
import { useMemo, useState } from 'react'
import * as THREE from 'three'

interface FloorItem {
  id: number
  label: string
}

interface RadialFloorSelectorProps {
  floors: FloorItem[]
  visible: boolean
  position: THREE.Vector3 | null
  onSelectFloor: (floorId: number) => void
  onClose: () => void
}

export default function RadialFloorSelector({
  floors,
  visible,
  position,
  onSelectFloor,
  onClose,
}: RadialFloorSelectorProps) {
  if (!position) return null

  const [hoveredFloorId, setHoveredFloorId] = useState<number | null>(null)
  const radius = 130
  const totalAngleSpan = 135
  const startAngleOffset = -140
  const accentColor = '#0051ba'
  const baseBlueTint = '#001633'
  const svgSize = radius * 2.5
  const centerPos = svgSize / 2
  const spread = visible ? 1 : 0

  const buttonPositions = useMemo(() => {
    return floors.map((floor, index) => {
      const total = floors.length
      const angleStep = total > 1 ? totalAngleSpan / (total - 1) : 0
      const currentAngleDegrees = startAngleOffset + index * angleStep
      const currentAngleRadians = currentAngleDegrees * (Math.PI / 180)
      const x = Math.cos(currentAngleRadians) * radius
      const y = Math.sin(currentAngleRadians) * radius
      return { id: floor.id, x, y }
    })
  }, [floors])

  const selectAndClose = (floorId: number) => {
    onSelectFloor(floorId)
    onClose()
  }

  return (
    <Html center position={position}>
      <div
        className="relative z-50"
        style={{
          width: svgSize,
          height: svgSize,
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <svg
          className="absolute inset-0"
          width={svgSize}
          height={svgSize}
        >
          <defs>
            {floors.map((floor, index) => {
              const buttonPos = buttonPositions[index]
              return (
                <linearGradient
                  key={`stem-grad-${floor.id}`}
                  id={`stem-grad-${floor.id}`}
                  x1={centerPos}
                  y1={centerPos}
                  x2={centerPos + buttonPos.x * spread}
                  y2={centerPos + buttonPos.y * spread}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
                  <stop offset="35%" stopColor={accentColor} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0.95" />
                </linearGradient>
              )
            })}
          </defs>
          {floors.map((floor, index) => {
            const buttonPos = buttonPositions[index]
            return (
              <line
                key={`line-${floor.id}`}
                x1={centerPos}
                y1={centerPos}
                x2={centerPos + buttonPos.x * spread}
                y2={centerPos + buttonPos.y * spread}
                stroke={`url(#stem-grad-${floor.id})`}
                strokeWidth="2.2"
                strokeLinecap="round"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: 'opacity 220ms ease',
                  pointerEvents: 'none',
                }}
              />
            )
          })}
          {floors.map((floor, index) => {
            const buttonPos = buttonPositions[index]
            return (
              <line
                key={`hit-line-${floor.id}`}
                x1={centerPos}
                y1={centerPos}
                x2={centerPos + buttonPos.x * spread}
                y2={centerPos + buttonPos.y * spread}
                stroke="transparent"
                strokeWidth="8"
                strokeLinecap="round"
                pointerEvents={visible ? 'stroke' : 'none'}
                onMouseEnter={() => setHoveredFloorId(floor.id)}
                onMouseLeave={() => setHoveredFloorId(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  selectAndClose(floor.id)
                }}
              />
            )
          })}
        </svg>

        {floors.map((floor, index) => {
          const buttonPos = buttonPositions[index]
          const hoverFactor = hoveredFloorId === floor.id ? 1.16 : 1
          return (
            <button
              key={floor.id}
              onMouseEnter={() => setHoveredFloorId(floor.id)}
              onMouseLeave={() => setHoveredFloorId(null)}
              onClick={(e) => {
                e.stopPropagation()
                selectAndClose(floor.id)
              }}
              className="
                absolute flex items-center justify-center
                h-20 w-20
                rounded-full
                text-3xl font-bold font-sans
                text-white
                pointer-events-auto
                active:scale-95
                group
              "
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${buttonPos.x * spread * hoverFactor}px), calc(-50% + ${buttonPos.y * spread * hoverFactor}px))`,
                opacity: visible ? 1 : 0,
                transition: `transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease`,
              }}
            >
              <div className="relative h-16 w-16">
                <div
                  className="absolute inset-px rounded-full border shadow-inner"
                  style={{ backgroundColor: baseBlueTint, borderColor: '#0058cc' }}
                />
                <div className="absolute inset-0 rounded-full border-[3px] border-jayhawk-blue shadow-[0_0_12px_rgba(0,81,186,0.55)] transition-shadow group-hover:shadow-[0_0_16px_rgba(0,110,255,0.75)]" />
                <span className="relative z-10 flex h-full w-full items-center justify-center text-white">{floor.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </Html>
  )
}
