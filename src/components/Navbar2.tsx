import { useRef, useState, useEffect, Suspense, Component, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = new URL("../assets/person.glb", import.meta.url).href;

class ModelErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentCatch(error: any) {
    console.error(error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const AnimatedGroup = ({ position, children }: { position: [number, number, number], children: ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25; 
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {children}
    </group>
  );
};

const CameraRig = ({ radius }: { radius: number }) => {
  const { camera } = useThree();

  useEffect(() => {
    const target = new THREE.Vector3(0, 0, 0);
    const phi = Math.PI / 2.5;
    const r = radius;

    const camPos = new THREE.Vector3(
      0,
      r * Math.cos(phi),
      r * Math.sin(phi)
    ).add(target);

    camera.position.copy(camPos);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [camera, radius]);

  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      target={[0, 0, 0]}
      minPolarAngle={Math.PI / 2.5}
      maxPolarAngle={Math.PI / 1.5}
    />
  );
};

const Model = ({ scale }: { scale: number }) => {
  const { scene } = useGLTF(MODEL_URL);
  const { gl } = useThree();

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

        materials.forEach((material) => {
          if ("map" in material && material.map) {
            material.map.anisotropy = maxAnisotropy;
            material.map.needsUpdate = true;
          }
          if ("roughness" in material) {
            material.roughness = 0.7;
            material.metalness = 0.1;
            material.needsUpdate = true;
          }
        });
      }
    });
  }, [scene, gl]);

  return <primitive object={scene} scale={scale} />;
};

const Navbar2 = () => {
  const positionerRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLElement>(null);
  const arrowBtnRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [isOpen, setIsOpen] = useState(true);

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
          .set(content, { display: "flex", autoAlpha: 1 }, "<0.1")
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
        <div ref={positionerRef} className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
          <div ref={moverRef}>
            <div className="p-6">
              <nav
                ref={glassRef as any}
                className="relative overflow-hidden bg-main-900/20 backdrop-blur-md border border-white/10 shadow-2xl flex will-change-transform"
                style={{ width: 48, height: 48, borderRadius: "24px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <div 
                  ref={contentRef} 
                  className="relative z-10 w-full h-full p-4 pl-10 flex-col opacity-0"
                  style={{ display: "none" }}
                >
                  <div className="w-full h-1/2 relative border-b border-white/10 pb-2">
                    <Canvas
                      className="h-full w-full pointer-events-auto cursor-grab active:cursor-grabbing"
                      camera={{ position: [0, 0, 8], fov: 40 }}
                      gl={{
                        antialias: true,
                        powerPreference: "high-performance",
                        toneMapping: THREE.CineonToneMapping,
                        toneMappingExposure: 1.2
                      }}
                      dpr={[1, 2]}
                    >
                      <ModelErrorBoundary>
                        <Suspense fallback={null}>
                          <ambientLight intensity={2.5} />
                          <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2.5} color="#ffaa80" />
                          <spotLight position={[-10, 0, 10]} intensity={1.5} color="#ffffff" />

                          <AnimatedGroup position={[0, -2, 0]}>
                            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                              <Model scale={4.5} />
                            </Float>
                          </AnimatedGroup>

                          <Environment preset="city" />
                          <CameraRig radius={8} />
                        </Suspense>
                      </ModelErrorBoundary>
                    </Canvas>
                  </div>

                  <div className="w-full h-1/2 pt-3 flex flex-col gap-2.5">
                    <h2 className="text-xl font-bold tracking-wide text-white">Tobias Gooblah</h2>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-widest text-white/50 font-semibold">Badges</span>
                      <div className="flex gap-1.5">
                        <div className="w-9 h-9 rounded-full bg-[#E8000D]/20 border border-[#E8000D]/50 flex items-center justify-center text-[#E8000D] shadow-[0_0_8px_rgba(232,0,13,0.3)]">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-black/20 border border-white/10 flex items-center justify-center text-white/20">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-black/20 border border-white/10 flex items-center justify-center text-white/20">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="bg-black/20 border border-white/10 rounded-lg px-2.5 py-1.5 flex justify-between items-center shadow-inner">
                        <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Points</span>
                        <span className="text-base font-bold text-white">554</span>
                      </div>
                      
                      <div className="bg-black/20 border border-white/10 rounded-lg px-2.5 py-2.5 flex flex-col gap-2 shadow-inner min-h-[64px]">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Explored</span>
                          <span className="text-base font-bold text-white">23%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#E8000D] w-[23%] rounded-full shadow-[0_0_6px_rgba(232,0,13,0.8)]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  ref={arrowBtnRef}
                  onClick={() => setIsOpen(!isOpen)}
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer z-20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="fixed -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
          <div ref={measureRef} className="w-64 h-128 bg-main-900/20 border border-white/10"></div>
        </div>
      </div>
    </>
  );
};

export default Navbar2;
