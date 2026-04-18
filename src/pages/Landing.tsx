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
    <div style={appStyles.container}>
      <div>
        <h1 style={appStyles.title}>Phoghorn</h1>
        <p style={appStyles.subtitle}>
          3D Campus Map. Coming Soon{loadingDots}
        </p>
      </div>
    </div>
  )
}

const appStyles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b0b0f',
    color: '#e5e7eb',
    fontFamily: 'system-ui, sans-serif',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    opacity: 0.7,
    fontSize: '1.2rem',
  },
}

export default Landing