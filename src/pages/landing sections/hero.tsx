import logo from '../../assets/logo.svg'

function Hero() {
  return (
    <section id="home" className="relative flex h-screen w-full snap-start snap-always flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <img 
          src={logo} 
          alt="Phoghorn Logo" 
          className="mb-8 h-24 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] sm:h-32"
        />
        
        <div className="flex flex-col gap-2">
          <p className="text-xl font-medium text-white sm:text-2xl">
            Walk your classes without walking your classes.
          </p>
        </div>

        <div className="mt-12">
          <a
            href="/app"
            className="group flex items-center justify-center rounded-full bg-jayhawk-blue px-12 py-5 text-xl font-bold text-white shadow-[0_0_20px_rgba(0,81,186,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-sapphire-500 hover:shadow-[0_0_40px_rgba(0,110,255,0.6)]"
          >
            Launch App
          </a>
        </div>
      </div>

      {/* SEE MORE BUTTON */}
      <a 
        href="#showcase"
        className="group absolute bottom-8 flex flex-col items-center text-xs tracking-[0.2em] text-sapphire-400 transition-colors hover:text-white"
      >
        <p className="mb-2">SEE MORE ABOUT THE SITE</p>
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

export default Hero