import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { REGIME_SLIDES, OPPOSITION_SLIDES } from '@/data/products';

interface VsScreenProps {
  currentIndex: number;
  onSelectRegime: () => void;
  onSelectOpposition: () => void;
}

export const VsScreen: React.FC<VsScreenProps> = ({ currentIndex, onSelectRegime, onSelectOpposition }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const vsRef = useRef<HTMLDivElement>(null);

  // Intro animation
  useEffect(() => {
    if (!leftRef.current || !rightRef.current || !vsRef.current) return;
    
    const tl = gsap.timeline();
    tl.fromTo(leftRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0);
    tl.fromTo(rightRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0);
    tl.fromTo(vsRef.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, 0.4);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-50 flex flex-col md:flex-row items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto overflow-hidden">
      
      {/* TEAM REGIME */}
      <div 
        ref={leftRef}
        onClick={onSelectRegime}
        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen" />
        
        <h2 className="text-3xl md:text-5xl font-black font-serif tracking-[0.2em] mb-2 md:mb-8 text-white/80 group-hover:text-white transition-colors drop-shadow-lg z-10 text-center uppercase">
          TEAM REGIME
        </h2>
        
        <div className="relative w-[200px] h-[250px] md:w-[350px] md:h-[450px] transform group-hover:scale-105 transition-transform duration-700 ease-out z-10">
          {REGIME_SLIDES.map((slide, i) => (
             <div 
                key={`regime-${slide.id}`}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === currentIndex ? 1 : 0, filter: 'drop-shadow(0 35px 45px rgba(0,0,0,0.5))' }}
             >
                <Image 
                  src={slide.image} 
                  alt="Regime Hero" 
                  fill 
                  className="object-contain"
                />
             </div>
          ))}
        </div>
        
        <p className="mt-2 md:mt-8 text-xs font-bold tracking-[0.3em] text-white/50 group-hover:text-white/90 uppercase z-10">
          5 TEES (SCROLL TO VIEW)
        </p>
      </div>

      {/* VS DIVIDER */}
      <div 
        ref={vsRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-none"
      >
        <div className="w-16 h-16 md:w-24 md:h-24 bg-black border border-white/20 rounded-full flex items-center justify-center text-xl md:text-3xl font-black italic tracking-tighter backdrop-blur-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          VS
        </div>
        <div className="hidden md:block absolute w-[1px] h-[100vh] bg-white/10 -z-10" />
      </div>

      {/* TEAM OPPOSITION */}
      <div 
        ref={rightRef}
        onClick={onSelectOpposition}
        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen" />
        
        <h2 className="text-3xl md:text-5xl font-black font-serif tracking-[0.2em] mb-2 md:mb-8 text-white/80 group-hover:text-white transition-colors drop-shadow-lg z-10 text-center uppercase mt-4 md:mt-0">
          TEAM OPPOSITION
        </h2>
        
        <div className="relative w-[200px] h-[250px] md:w-[350px] md:h-[450px] transform group-hover:scale-105 transition-transform duration-700 ease-out z-10">
          {OPPOSITION_SLIDES.map((slide, i) => (
             <div 
                key={`opp-${slide.id}`}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === currentIndex ? 1 : 0, filter: 'drop-shadow(0 35px 45px rgba(0,0,0,0.5))' }}
             >
                <Image 
                  src={slide.image} 
                  alt="Opposition Hero" 
                  fill 
                  className="object-contain"
                />
             </div>
          ))}
        </div>
        
        <p className="mt-2 md:mt-8 text-xs font-bold tracking-[0.3em] text-white/50 group-hover:text-white/90 uppercase z-10">
          5 TEES (SCROLL TO VIEW)
        </p>
      </div>
      
    </div>
  );
};
