import { useState, useMemo, useId, useEffect } from 'react'
import icon from '../../assets/icon.svg'
import teamImg from '../../assets/team.jpg'
import githubIcon from '../../assets/github.svg'

const ICONS = {
  typescript: new URL('../../assets/stack/typescript.svg', import.meta.url).href,
  tailwindcss: new URL('../../assets/stack/tailwindcss.svg', import.meta.url).href,
  threejs: new URL('../../assets/stack/threejs.svg', import.meta.url).href,
  react: new URL('../../assets/stack/react.svg', import.meta.url).href,
  npm: new URL('../../assets/stack/npm.svg', import.meta.url).href,
  vite: new URL('../../assets/stack/vite.svg', import.meta.url).href,
  raspberrypi: new URL('../../assets/stack/raspberrypi.svg', import.meta.url).href,
  nginx: new URL('../../assets/stack/nginx.svg', import.meta.url).href,
  cloudflare: new URL('../../assets/stack/cloudflare.svg', import.meta.url).href,
  site: icon,
}

const TECH_NODES = [
  { id: 'ts', label: 'TypeScript', role: 'Language', icon: ICONS.typescript, color: '#3178C6', x: 0.1, y: 0.15 },
  { id: 'tailwind', label: 'Tailwind', role: 'Styling', icon: ICONS.tailwindcss, color: '#06B6D4', x: 0.1, y: 0.5 },
  { id: 'three', label: 'Three.js', role: '3D Render', icon: ICONS.threejs, color: '#FFFFFF', x: 0.1, y: 0.85 },
  { id: 'react', label: 'React', role: 'UI Library', icon: ICONS.react, color: '#61DAFB', x: 0.3, y: 0.3 },
  { id: 'npm', label: 'NPM', role: 'Packages', icon: ICONS.npm, color: '#CB3837', x: 0.3, y: 0.7 },
  { id: 'vite', label: 'Vite', role: 'Bundler', icon: ICONS.vite, color: '#646CFF', x: 0.45, y: 0.5 },
  { id: 'pi', label: 'Raspberry Pi', role: 'Host Hardware', icon: ICONS.raspberrypi, color: '#C51A4A', x: 0.75, y: 0.5 },
  { id: 'nginx', label: 'Nginx', role: 'Web Server', icon: ICONS.nginx, color: '#009639', x: 0.9, y: 0.25 },
  { id: 'cloudflare', label: 'Cloudflare', role: 'Tunnel / DNS', icon: ICONS.cloudflare, color: '#F38020', x: 0.9, y: 0.75 },
]

const HUB = { id: 'phoghorn', label: 'Phoghorn', role: 'The App', icon: ICONS.site, color: '#0051BA', x: 0.6, y: 0.5 }

const CONNECTIONS = [
  { from: 'ts', to: 'react' },
  { from: 'tailwind', to: 'react' },
  { from: 'three', to: 'react' },
  { from: 'react', to: 'vite' },
  { from: 'npm', to: 'vite' },
  { from: 'vite', to: 'phoghorn' },
  { from: 'phoghorn', to: 'pi' },
  { from: 'pi', to: 'nginx' },
  { from: 'nginx', to: 'cloudflare' },
]

type TeamMember = {
  name: string
  role: string
  url: string
}

const BASE_TEAM: TeamMember[] = [
  { name: 'Matthew Bisbee', role: 'UI / UX + Hosting', url: 'https://matthewbisbee.com' },
  { name: 'Shlok Prabhu', role: '3D Development', url: 'https://www.linkedin.com/in/shlockie/' },
  { name: 'Sydney Smith', role: 'Backend Development', url: 'https://www.linkedin.com/in/sydneyysmithh/' },
  { name: 'Will Webb', role: 'Just Will', url: 'https://www.linkedin.com/in/william-webb-5845b331b/' },
]

const TechWeb = () => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const gradientScopeId = useId().replace(/:/g, '')

  const getPos = (id: string) => {
    const node = id === 'phoghorn' ? HUB : TECH_NODES.find((n) => n.id === id)
    if (!node) return { x: 0, y: 0, color: '#fff' }
    return { x: node.x * 100, y: node.y * 100, color: node.color }
  }

  const sortedConnections = useMemo(() => {
    return [...CONNECTIONS].sort((a, b) => {
      const aActive = activeId && (activeId === a.from || activeId === a.to)
      const bActive = activeId && (activeId === b.from || activeId === b.to)
      if (aActive && !bActive) return 1
      if (!aActive && bActive) return -1
      return 0
    })
  }, [activeId])

  return (
    <div className="relative h-[26vh] min-h-[220px] w-full max-w-4xl select-none font-mono text-[10px] text-white sm:h-[30vh] sm:min-h-[260px] sm:text-xs">
      <style>
        {`
          @keyframes nodeFadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes lineFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-node { animation: nodeFadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
          .animate-line { animation: lineFadeIn 1s ease-out forwards; }
        `}
      </style>

      <svg className="animate-line pointer-events-none absolute inset-0 z-0 h-full w-full opacity-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {CONNECTIONS.map(({ from, to }) => {
            const start = getPos(from)
            const end = getPos(to)
            const gradId = `${gradientScopeId}-grad-${from}-${to}`
            return (
              <linearGradient key={gradId} id={gradId} gradientUnits="userSpaceOnUse" x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
                <stop offset="0%" stopColor={start.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={end.color} stopOpacity="0.6" />
              </linearGradient>
            )
          })}
        </defs>

        {sortedConnections.map(({ from, to }) => {
          const start = getPos(from)
          const end = getPos(to)
          const isActive = activeId && (activeId === from || activeId === to)
          const isDim = activeId && !isActive

          const midX = (start.x + end.x) / 2
          const pathData = `M ${start.x} ${start.y} C ${midX} ${start.y} ${midX} ${end.y} ${end.x} ${end.y}`

          return (
            <path
              key={`${from}-${to}`}
              d={pathData}
              fill="none"
              stroke={`url(#${gradientScopeId}-grad-${from}-${to})`}
              strokeWidth={isActive ? 3 : 1.5}
              vectorEffect="non-scaling-stroke"
              className={`transition-all duration-300 ${isDim ? 'opacity-5' : 'opacity-100'}`}
              strokeLinecap="round"
            />
          )
        })}
      </svg>

      {[...TECH_NODES, HUB].map((node, i) => {
        const isActive = activeId === node.id
        const isDim = activeId && !isActive

        return (
          <div
            key={node.id}
            className="animate-node absolute z-10 flex cursor-pointer flex-col items-center justify-center opacity-0"
            style={{ 
              left: `${node.x * 100}%`, 
              top: `${node.y * 100}%`, 
              opacity: isDim ? 0.2 : 1,
              animationDelay: `${i * 0.05}s` 
            }}
            onMouseEnter={() => setActiveId(node.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            <div className="flex flex-col items-center justify-center">
              <div className={`transition-transform duration-300 ease-out ${isActive ? 'scale-125' : 'scale-100'}`}>
                <div
                  className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-sapphire-600 bg-sapphire-900 shadow-lg transition-all duration-300 sm:h-14 sm:w-14"
                  style={{
                    boxShadow: isActive ? `0 0 25px ${node.color}88` : 'none',
                    borderColor: isActive ? node.color : undefined,
                  }}
                >
                  <img src={node.icon} alt={node.label} className="h-6 w-6 object-contain sm:h-8 sm:w-8" />
                </div>
              </div>
              <span
                className={`absolute top-full mt-2 max-w-[4.75rem] break-words text-center text-[9px] leading-tight font-bold tracking-tight transition-colors duration-300 sm:mt-3 sm:max-w-none sm:whitespace-nowrap sm:text-xs ${isActive ? 'text-white' : 'text-sapphire-400'}`}
                style={{ color: isActive ? node.color : undefined }}
              >
                {isActive ? node.role : node.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Dev() {
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    const shuffled = [...BASE_TEAM].sort(() => Math.random() - 0.5)
    setTeam(shuffled)
  }, [])

  return (
    <section
      id="dev"
      className="relative flex min-h-[100svh] w-full snap-start snap-always flex-col items-center justify-start overflow-visible px-4 pb-12 pt-16 text-center md:h-screen md:justify-center md:overflow-hidden md:px-6 md:pb-0 md:pt-0"
    >
      
      <div className="flex w-full flex-col items-center justify-center gap-5 sm:gap-8">
        <div className="flex items-center gap-3 sm:gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
            Under the Hood
</h2>
          <a 
            href="https://github.com/sytSmit/phoghorn" 
            target="_blank" 
            rel="noreferrer"
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <img 
              src={githubIcon} 
              alt="GitHub" 
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-15 lg:w-15 brightness-0 invert opacity-100 hover:opacity-80 transition-opacity"
            />
          </a>
        </div>

        <TechWeb />

        <div className="mt-2 flex w-full max-w-5xl flex-col items-center gap-6 border-t border-sapphire-800/50 pt-5 sm:gap-8 sm:pt-6 lg:flex-row lg:items-stretch lg:justify-between">
          
          <div className="flex w-full flex-col items-start justify-start lg:w-auto lg:py-2">
            <p className="mb-6 w-full text-left text-xs font-bold tracking-[0.2em] text-sapphire-500 sm:mb-12">
              DEVELOPED AT{' '}
              <a 
                href="https://www.hackku.org/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-sapphire-400 transition-colors hover:text-white"
              >
                HACKKU
              </a>{' '}
              2026 BY
            </p>

            <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 text-left sm:grid-cols-2 sm:gap-x-16 sm:gap-y-12 lg:gap-y-12">
              {team.map((member) => (
                <a 
                  key={member.name} 
                  href={member.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex flex-col items-start transition-transform hover:-translate-y-1"
                >
                  <span className="text-xl font-bold text-sapphire-100 transition-colors group-hover:text-jayhawk-blue group-hover:drop-shadow-[0_0_10px_rgba(0,81,186,0.6)] sm:text-3xl">
                    {member.name}
                  </span>
                  <span className="mt-1 text-sm font-medium tracking-wide text-sapphire-400 transition-colors group-hover:text-sapphire-300 sm:text-lg">
                    {member.role}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="w-full max-w-[320px] shrink-0 sm:max-w-[400px] lg:w-[420px] lg:max-w-none">
            <img 
              src={teamImg} 
              alt="Phoghorn Team" 
              className="aspect-video h-full w-full rounded-2xl border border-sapphire-700/50 object-cover shadow-[0_0_40px_rgba(0,0,0,0.4)] lg:aspect-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dev
