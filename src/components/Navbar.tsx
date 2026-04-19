import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const Navbar = () => {
  const positionerRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const hoverZoneRef = useRef<HTMLDivElement>(null);

  const glassRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [active, setActive] = useState("opt1");
  const [isHovered, setIsHovered] = useState(false);

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const visiblePxRef = useRef<Record<string, number>>({});

  const TEXT_COLOR = "#e4ebf5";
  const TEXT_RGB = hexToRgb(TEXT_COLOR);

  const navItems = [
    { name: "Option 1", id: "opt1" },
    { name: "Option 2", id: "opt2" },
    { name: "Option 3", id: "opt3" },
    { name: "Option 4", id: "opt4" },
    { name: "Option 5", id: "opt5" },
  ];

  // 1) VISIBILITY-BASED SCROLL SPY
  useEffect(() => {
    const sections: HTMLElement[] = [];

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) sections.push(el);
    });

    if (sections.length === 0) return;

    const thresholds: number[] = [];
    for (let t = 0; t <= 1.0; t += 0.05) thresholds.push(Number(t.toFixed(2)));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          visiblePxRef.current[id] = entry.isIntersecting ? entry.intersectionRect.height : 0;
        }

        let bestId = navItems[0]?.id ?? "opt1";
        let bestPx = -1;

        for (const item of navItems) {
          const px = visiblePxRef.current[item.id] ?? 0;
          if (px > bestPx) {
            bestPx = px;
            bestId = item.id;
          }
        }

        if (bestId && bestId !== activeRef.current) {
          setActive(bestId);
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -10% 0px",
        threshold: thresholds,
      }
    );

    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) KEEP GSAP-BASED ACTIVE EMPHASIS IN SYNC
  useEffect(() => {
    itemRefs.current.forEach((item) => {
      if (!item) return;
      const isActiveItem = item.getAttribute("data-active") === "true";

      gsap.set(item, {
        color: isActiveItem ? `rgba(${TEXT_RGB}, 1)` : `rgba(${TEXT_RGB}, 0.5)`,
        scale: isActiveItem ? 1.1 : 1,
      });
    });
  }, [active, TEXT_RGB]);

  // 3) INERTIA PHYSICS
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

  useGSAP(() => {
    gsap.set(listRef.current, { display: "none", opacity: 0, pointerEvents: "none" });
    gsap.set(arrowRef.current, { display: "flex", opacity: 1, scale: 1 });
    // Explicitly set initial border radius via GSAP instead of Tailwind
    gsap.set(glassRef.current, { width: 48, height: 48, borderRadius: "24px" });
  }, []);

  // 4) HOVER EXPAND/COLLAPSE TIMELINE
  useGSAP(
    () => {
      const glass = glassRef.current;
      const arrow = arrowRef.current;
      const list = listRef.current;
      const measurer = measureRef.current;

      if (!glass || !arrow || !list || !measurer) return;

      tlRef.current?.kill();
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
      tlRef.current = tl;

      const rect = measurer.getBoundingClientRect();
      const targetW = Math.ceil(rect.width);
      const targetH = Math.ceil(rect.height);

      if (isHovered) {
        tl.to(arrow, { opacity: 0, scale: 0.85, duration: 0.12, ease: "power2.out" })
          .set(arrow, { display: "none" })
          .set(list, { display: "flex", opacity: 0, pointerEvents: "none" })
          // Set borderRadius to "8px" for a much squarer expanded state
          .to(glass, { width: targetW, height: targetH, borderRadius: "8px", duration: 0.26, ease: "power3.out" }, "<")
          .to(
            list,
            {
              opacity: 1,
              duration: 0.16,
              ease: "power2.out",
              onStart: () => {
                gsap.set(list, { pointerEvents: "auto" });
              },
            },
            "-=0.08"
          )
          .fromTo(
            itemRefs.current,
            { opacity: 0, x: -8 },
            { opacity: 1, x: 0, stagger: 0.04, duration: 0.14, ease: "power2.out" },
            "-=0.10"
          );
      } else {
        tl.to(list, { opacity: 0, duration: 0.12, ease: "power1.out" })
          .set(list, { display: "none", pointerEvents: "none" })
          // Return borderRadius to "24px" to form a perfect 48x48 circle
          .to(glass, { width: 48, height: 48, borderRadius: "24px", duration: 0.22, ease: "power3.inOut" })
          .set(arrow, { display: "flex" })
          .to(arrow, { opacity: 1, scale: 1, duration: 0.12, ease: "power2.out" }, "<");
      }
    },
    { dependencies: [isHovered], scope: positionerRef }
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered || !glassRef.current) return;
    const navRect = glassRef.current.getBoundingClientRect();
    const mouseY = e.clientY - navRect.top;

    itemRefs.current.forEach((item) => {
      if (!item) return;
      const itemRect = item.getBoundingClientRect();
      const itemCenterY = itemRect.top - navRect.top + itemRect.height / 2;
      const distance = Math.abs(mouseY - itemCenterY);
      const maxDistance = 150;
      let opacity = 1 - distance / maxDistance;
      opacity = gsap.utils.clamp(0.5, 1, opacity);

      const isActiveItem = item.getAttribute("data-active") === "true";

      gsap.to(item, {
        color: isActiveItem ? `rgba(${TEXT_RGB}, 1)` : `rgba(${TEXT_RGB}, ${opacity})`,
        scale: isActiveItem ? 1.1 : 1 + (opacity - 0.5) * 0.1,
        duration: 0.18,
        overwrite: "auto",
      });
    });
  };

  const handleScrollTo = (id: string) => {
    if (id === "opt1") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <div ref={positionerRef} className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
          <div ref={moverRef}>
            <div
              ref={hoverZoneRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="p-6"
            >
              <nav
                ref={glassRef as any}
                onMouseMove={handleMouseMove}
                // REMOVED `rounded-full` from here so Tailwind stops fighting GSAP
                className="relative overflow-hidden bg-main-900/20 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center justify-center w-12 h-12 will-change-transform"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                <div ref={arrowRef} className="absolute inset-0 flex items-center justify-center text-white/80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>

                <div ref={listRef} className="flex-col gap-1 px-3 py-6 opacity-0 min-w-[120px]">
                  {navItems.map((item, index) => (
                    <button
                      key={item.name}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      data-active={active === item.id}
                      onClick={() => handleScrollTo(item.id)}
                      className="relative z-10 text-xs md:text-sm font-sans font-medium tracking-wide transition-none cursor-pointer py-2 px-2 text-left w-full"
                      style={{ color: `rgba(${TEXT_RGB}, ${active === item.id ? 1 : 0.5})` }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>

        <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
          <div ref={measureRef} className="flex flex-col gap-1 px-3 py-6 min-w-[120px] bg-main-900/20 border border-white/10">
            {navItems.map((item) => (
              <div key={item.id} className="text-xs md:text-sm font-sans font-medium tracking-wide py-2 px-2">
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-3 bottom-3 z-50 md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <nav className="relative flex h-11 items-center overflow-hidden rounded-full border border-white/10 bg-main-900/20 px-2 backdrop-blur-md shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className="relative z-10 w-full flex-1 cursor-pointer px-1 py-2 text-center text-[11px] font-sans font-medium tracking-wide transition-none"
                style={{
                  color: `rgba(${TEXT_RGB}, ${isActive ? 1 : 0.5})`,
                  transform: isActive ? "scale(1.06)" : "scale(1)",
                }}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;