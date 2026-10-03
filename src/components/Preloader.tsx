"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { sound } from "@/utils/SoundEngine";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (pathname === '/reel-studio') return;

    // Initialize sound engine on first user interaction
    const initSound = () => {
      sound.init();
      window.removeEventListener('click', initSound);
      window.removeEventListener('touchstart', initSound);
    };
    window.addEventListener('click', initSound);
    window.addEventListener('touchstart', initSound);

    const tl = gsap.timeline();

    // Fast counter animation
    tl.to({ val: 0 }, {
      val: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: function() {
        setProgress(Math.round(this.targets()[0].val));
      }
    });

    // Hold a tiny bit
    tl.to({}, { duration: 0.2 });

    // Morph the SVG mask
    // We start with a full rectangle, then morph it to an organic shape that pulls upward and disappears
    const initialPath = `M 0 0 L 100 0 L 100 100 L 0 100 Z`;
    const curvePath = `M 0 0 L 100 0 L 100 0 Q 50 20 0 0 Z`; // Shrinks to top
    
    tl.to(textRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.6,
      ease: "power3.in",
    });

    if (pathRef.current) {
      tl.to(pathRef.current, {
        attr: { d: curvePath },
        duration: 0.8,
        ease: "power4.inOut",
      }, "-=0.2");
    }

    // Unmount (hide) container
    tl.set(containerRef.current, { display: "none" });

    return () => {
      window.removeEventListener('click', initSound);
      window.removeEventListener('touchstart', initSound);
    }
  }, [pathname]);

  if (pathname === '/reel-studio') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] pointer-events-none flex flex-col items-center justify-center bg-transparent"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path 
          ref={pathRef}
          d="M 0 0 L 100 0 L 100 100 L 0 100 Z" 
          fill="black" 
        />
      </svg>
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center z-20"
      >
        <div className="text-center">
          <div className="font-serif font-black text-white text-[8rem] md:text-[12rem] tracking-tighter leading-none mix-blend-difference">
            {progress}%
          </div>
          <span className="block text-xs tracking-[0.5em] mt-2 text-white/50 font-sans font-bold uppercase mix-blend-difference">
            LOADING EXPERIENCE
          </span>
        </div>
      </div>
    </div>
  );
}
