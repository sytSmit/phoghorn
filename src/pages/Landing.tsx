import { useEffect, useState } from 'react'

function Landing() {
  const [loadingDots, setLoadingDots] = useState('')

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setLoadingDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(dotInterval)
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#0b0b0f] text-[#e5e7eb] text-center font-sans">
      <div>
        <h1 className="text-5xl font-sans font-bold mb-2 text-jayhawk-blue">
          Phoghorn
        </h1>
        <p className="opacity-80 text-xl tracking-wide">
          3D Campus Map. Coming Soon
          <span className="text-ku-crimson font-bold">{loadingDots}</span>
        </p>
      </div>
    </div>
  )
}

export default Landing