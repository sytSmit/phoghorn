import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Navbar = () => {
  const positionerRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLElement>(null);
  const arrowBtnRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");

  useGSAP(() => {
    let lastScrollY = window.scrollY;
    let velocity = 0;
    let position = 0;

    const updatePhysics = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      const targetVelocity = gsap.utils.clamp(-50, 50, delta * 0.5);
      velocity += (targetVelocity - velocity) * 0.1;

      position += velocity;
      position += (0 - position) * 0.1;

      if (moverRef.current) {
        gsap.set(moverRef.current, { y: -position * 1.5 });
      }
    };

    gsap.ticker.add(updatePhysics);
    return () => gsap.ticker.remove(updatePhysics);
  }, []);

  useGSAP(
    () => {
      const glass = glassRef.current;
      const arrow = arrowBtnRef.current;
      const content = contentRef.current;
      const measurer = measureRef.current;

      if (!glass || !arrow || !content || !measurer) return;

      tlRef.current?.kill();
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
      tlRef.current = tl;

      const rect = measurer.getBoundingClientRect();
      const targetW = Math.ceil(rect.width);
      const targetH = Math.ceil(rect.height);

      if (isOpen) {
        tl.to(glass, { 
            width: targetW, 
            height: targetH, 
            borderRadius: "16px", 
            duration: 0.4, 
            ease: "power3.out" 
          })
          .to(arrow, { rotate: 180, duration: 0.3, ease: "power2.out" }, "<")
          .set(content, { display: "flex" }, "<0.1")
          .to(content, { autoAlpha: 1, duration: 0.2, ease: "power2.out" }, "<");
      } else {
        tl.to(content, { autoAlpha: 0, duration: 0.15, ease: "power1.out" })
          .set(content, { display: "none" })
          .to(glass, { 
            width: 48, 
            height: 48, 
            borderRadius: "24px", 
            duration: 0.35, 
            ease: "power3.inOut" 
          }, "<0.05")
          .to(arrow, { rotate: 0, duration: 0.3, ease: "power2.out" }, "<");
      }
    },
    { dependencies: [isOpen], scope: positionerRef }
  );

  return (
    <>
      <div className="hidden md:block">
        <div ref={positionerRef} className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
          <div ref={moverRef}>
            <div className="p-6">
              <nav
                ref={glassRef as any}
                className="relative overflow-hidden bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl flex will-change-transform"
                style={{ width: 48, height: 48, borderRadius: "24px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

                <div 
                  ref={contentRef} 
                  className="relative z-10 w-full h-full p-4 pr-10 opacity-0 hidden flex-col gap-4"
                >
                  <div className="flex flex-col gap-2 shrink-0 mt-1">
                    <div className="flex items-center bg-black/20 border border-white/10 rounded-md px-3 py-2 shadow-inner">
                      <span className="text-white/50 text-xs font-semibold mr-2 uppercase tracking-wider">From:</span>
                      <input 
                        type="text" 
                        value={fromText}
                        onChange={(e) => setFromText(e.target.value)}
                        className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-white/20" 
                        placeholder="Starting point..."
                      />
                    </div>
                    <div className="flex items-center bg-black/20 border border-white/10 rounded-md px-3 py-2 shadow-inner">
                      <span className="text-white/50 text-xs font-semibold mr-2 uppercase tracking-wider">To:</span>
                      <input 
                        type="text" 
                        value={toText}
                        onChange={(e) => setToText(e.target.value)}
                        className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-white/20" 
                        placeholder="Destination..."
                      />
                    </div>
                  </div>

                  <div className="flex-grow overflow-y-auto pr-2">
                    {toText.trim() === "1310" ? (
                      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="border-b border-white/10 pb-3">
                          <h2 className="text-xl font-bold text-white tracking-wide mb-1">Room 1310</h2>
                          <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Study Room</p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-sm text-white/80">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/50">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span>Capacity: 6 Seating</span>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-white/80">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/50">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                            <span>Outlets Available</span>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-white/80">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/50">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <span>TV Monitor</span>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-white/80">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/50">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                            <span>Whiteboard</span>
                          </div>
                        </div>

                        <div className="mt-2 bg-[#E8000D]/10 border border-[#E8000D]/20 rounded-md p-3">
                          <p className="text-[#E8000D] text-xs font-semibold uppercase tracking-wider mb-1">Status</p>
                          <p className="text-[#E8000D]/80 text-sm">Booked from 2-3pm today</p>
                        </div>

                        <a 
                          href="https://engrconnector.ku.edu/survey?embed=1&survey_uid=9c56d169-830c-11ee-b2fc-0e9dd4d3253d" 
                          target="_blank" 
                          rel="noreferrer"
                          className="mt-2 w-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white text-sm font-medium py-2.5 rounded-md flex items-center justify-center gap-2"
                        >
                          <span>Book Room</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider mb-1">Quick Links</p>
                        
                        <button 
                          onClick={() => setToText("Nearest Bathroom")}
                          className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium py-2.5 px-3 rounded-md text-left cursor-pointer group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Nearest Bathroom</span>
                        </button>

                        <button 
                          onClick={() => setToText("Vending Machine")}
                          className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium py-2.5 px-3 rounded-md text-left cursor-pointer group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          <span>Vending Machine</span>
                        </button>

                        <button 
                          onClick={() => setToText("Nearest Printer")}
                          className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium py-2.5 px-3 rounded-md text-left cursor-pointer group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                          </svg>
                          <span>Nearest Printer</span>
                        </button>

                        <button 
                          onClick={() => setToText("Microwave")}
                          className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/80 hover:text-white text-sm font-medium py-2.5 px-3 rounded-md text-left cursor-pointer group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                          </svg>
                          <span>Microwave</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  ref={arrowBtnRef}
                  onClick={() => setIsOpen(!isOpen)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer z-20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
          <div ref={measureRef} className="w-64 h-128 bg-black/75 border border-white/10"></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
