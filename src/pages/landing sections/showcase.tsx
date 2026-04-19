import { useState, useEffect, useRef } from 'react'
import showcaseVideo from '../../assets/demo.mp4'

function Showcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShowDrawer(true), 800)
        } else {
          setShowDrawer(false)
        }
      },
      { threshold: 0.6 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      id="showcase" 
      ref={sectionRef}
      className="relative flex h-[100svh] w-full snap-start snap-always flex-col items-center justify-center overflow-hidden px-4 md:h-screen md:px-6"
    >
      <div className="relative flex h-full w-full max-w-7xl items-start justify-center pt-12 sm:pt-16 md:items-center md:pt-0">
        
        {/* THE SHOWCASE MEDIA */}
        <div 
          className={`absolute z-20 aspect-video w-[90vw] max-w-2xl overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]
            ${showDrawer 
              ? 'scale-95 -translate-y-[34%] sm:-translate-y-[30%] md:translate-y-0 md:-translate-x-[40%]' 
              : 'scale-100 translate-x-0 translate-y-0'
            }`}
        >
          <video
            src={showcaseVideo}
            className="pointer-events-none h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* THE INFORMATION DRAWER */}
        <div 
          className={`absolute z-10 flex w-[95vw] max-w-5xl overflow-hidden rounded-2xl border border-sapphire-700 bg-sapphire-900/90 text-left shadow-2xl backdrop-blur-xl transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] 
            /* Height and positioning */
            min-h-[340px] sm:min-h-[380px] md:h-[55%]
            ${showDrawer 
              ? 'opacity-100 translate-y-[14%] sm:translate-y-[20%] md:translate-y-0 md:translate-x-[15%] scale-100' 
              : 'opacity-0 translate-x-0 translate-y-0 scale-95'
            }`}
        >
          {/* Internal Layout for the Drawer */}
          <div className="flex h-full w-full flex-col md:flex-row">
            
            {/* 1. THE SPACER: Keeps the text from being under the video on desktop */}
            <div className="hidden md:block md:w-[45%] lg:w-[42%] shrink-0" />

            {/* 2. THE CONTENT AREA: Now has full room to breathe */}
            <div className="flex flex-col justify-center p-6 pt-[36%] sm:p-8 sm:pt-[42%] md:p-12 md:pt-12">
              <h2 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                The indoor 3D campus map for KU
              </h2>
              <p className="max-w-prose text-sm leading-relaxed text-sapphire-200 sm:text-base lg:text-lg">
                No more wandering the halls looking for Room 1215. Phoghorn provides multi-floor 3D routing so you know how to get directly to your desk before the first day of class.
              </p>
            </div>
          </div>
        </div>

      </div>
      
      {/* DOWN ARROW */}
      <a 
        href="#dev"
        className="group absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-30 flex flex-col items-center text-xs tracking-[0.2em] text-sapphire-400 transition-colors hover:text-white sm:bottom-8"
      >
        <svg 
          className="h-6 w-6 animate-bounce text-sapphire-300 transition-colors group-hover:text-white" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>
    </section>
  )
}

export default Showcase
