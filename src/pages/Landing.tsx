import { useState, type MouseEvent } from 'react'
import Hero from './landing sections/hero'
import Showcase from './landing sections/showcase'
import Dev from './landing sections/dev'

const fogSpeedSeconds = 40

function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div 
      className="relative h-screen w-full overflow-hidden bg-sapphire-950 font-sans text-sapphire-50"
      onMouseMove={handleMouseMove}
    >
      <style>
        {`
          @keyframes drift {
            from { background-position: 0px 0px; }
            to { background-position: 1000px 0px; }
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* FIXED BACKGROUND LAYERS */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-[radial-gradient(circle_at_88%_12%,rgba(255,0,13,0.18)_0%,transparent_22%),radial-gradient(circle_at_12%_88%,rgba(255,0,13,0.15)_0%,transparent_18%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-30 mix-blend-color-dodge"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '1000px 1000px',
          animation: `drift ${fogSpeedSeconds}s linear infinite`,
          maskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, transparent 10%, black 100%)`,
          WebkitMaskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, transparent 10%, black 100%)`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[3] bg-sapphire-950/60 backdrop-blur-md"
        style={{
          maskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, transparent 10%, black 100%)`,
          WebkitMaskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, transparent 10%, black 100%)`,
        }}
      />

      <div 
        className="pointer-events-none absolute inset-0 z-[4] transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,110,255,0.22), transparent 80%)`
        }}
      />

      {/* SCROLLABLE SNAP CONTAINER */}
      <div className="no-scrollbar absolute inset-0 z-10 overflow-y-auto scroll-smooth snap-y snap-mandatory">
        <Hero />
        <Showcase />
        <Dev />
      </div>
    </div>
  )
}

export default Landing