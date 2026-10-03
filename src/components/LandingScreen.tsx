import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { REGIME_SLIDES, OPPOSITION_SLIDES } from '@/data/products';

interface LandingScreenProps {
  onSelectRegime: () => void;
  onSelectOpposition: () => void;
  onSelectVs: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onSelectRegime, onSelectOpposition, onSelectVs }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const [selectedSide, setSelectedSide] = useState<'regime' | 'opposition' | null>(null);
  const [gifSrc, setGifSrc] = useState('/rdj.gif');

  useEffect(() => {
    // Restart the GIF exactly when it slides in (4s)
    const timer = setTimeout(() => {
      setGifSrc(`/rdj.gif?t=${Date.now()}`);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!pillRef.current || !titleRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' }, 0);
    tl.fromTo(titleRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.5);
    tl.fromTo(pillRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }, 0.8);

    // Third Option Entrance Animation
    gsap.to('.third-option-gif', { y: 0, opacity: 1, duration: 1, ease: 'back.out(1.5)', delay: 4 });
    gsap.to('.third-option-container', { maxWidth: 500, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 5 });
    gsap.to('.third-option-text', { x: 0, duration: 1.5, ease: 'power3.out', delay: 5 });
  }, []);

  const handleSelect = (side: 'regime' | 'opposition', callback: () => void) => {
    if (selectedSide) return;
    setSelectedSide(side);

    const tl = gsap.timeline({
      onComplete: callback
    });

    // Fade out everything else
    tl.to([titleRef.current, pillRef.current], { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 0);
    
    // Fade out the typography of both sides
    tl.to('.side-typography', { scale: 1.2, opacity: 0, filter: 'blur(10px)', duration: 0.8, ease: 'power2.inOut' }, 0);

    // Pop in the gamified stats
    tl.fromTo('.gamified-stats', 
      { scale: 2, opacity: 0, filter: 'blur(20px)' }, 
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'back.out(1.5)' }, 
      0.6
    );

    // Fade the whole container to black before routing
    tl.to(containerRef.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 2.8);
  };

  const renderScrollingColumn = (slides: typeof REGIME_SLIDES, direction: 'up' | 'down', delay: number) => {
    // Duplicate slides to create seamless infinite loop
    const doubledSlides = [...slides, ...slides];
    
    return (
      <div className="flex-1 h-full overflow-hidden relative">
        <div 
          className={`flex flex-col gap-8 md:gap-16 w-full ${direction === 'down' ? 'animate-[scrollDown_30s_linear_infinite]' : 'animate-[scrollUp_30s_linear_infinite]'}`}
          style={{ animationDelay: `${delay}s`, width: '150px', margin: '0 auto' }}
        >
          {doubledSlides.map((slide, idx) => (
            <div key={`${slide.id}-${idx}`} className="relative w-[150px] h-[200px] md:w-[200px] md:h-[260px] opacity-80 flex-shrink-0">
              <Image src={slide.image} alt={slide.title} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-[60] flex flex-col md:flex-row bg-[#0a0a0a] overflow-hidden pointer-events-auto"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
        @keyframes scrollUp {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .anim-float { animation: float 5s ease-in-out infinite; }
        .anim-float-delayed { animation: float 5s ease-in-out 2.5s infinite; }
      `}} />
      
      {/* Absolute Title */}
      <h1 ref={titleRef} className="absolute top-8 left-1/2 transform -translate-x-1/2 font-serif font-black tracking-[0.2em] text-xl md:text-3xl text-white uppercase drop-shadow-2xl z-40 pointer-events-none w-full text-center">
        PICK YOUR SIDE
      </h1>

      {/* LEFT SIDE - REGIME */}
      <div 
        onClick={() => handleSelect('regime', onSelectRegime)}
        onMouseEnter={() => setHoverSide('left')}
        onMouseLeave={() => setHoverSide(null)}
        className={`relative w-full md:w-auto h-1/2 md:h-full flex flex-col items-center justify-center cursor-pointer group overflow-hidden border-b md:border-b-0 md:border-r border-white/10 ${selectedSide === 'regime' ? 'z-50' : 'z-10'}`}
        style={{ 
          flex: selectedSide === 'regime' ? '1' : selectedSide === 'opposition' ? '0' : hoverSide === 'left' ? '0.52' : hoverSide === 'right' ? '0.48' : '0.5', 
          transition: 'flex 1.2s cubic-bezier(0.76, 0, 0.24, 1), opacity 1.2s ease',
          opacity: selectedSide === 'opposition' ? 0 : 1
        }}
      >
        
        {/* Infinite Scrolling Background */}
        <div className="absolute inset-0 w-[150%] h-[150%] top-[-25%] left-[-25%] flex justify-between pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity duration-700 transform -rotate-12 scale-110">
          {renderScrollingColumn(REGIME_SLIDES, 'down', 0)}
          {renderScrollingColumn(REGIME_SLIDES, 'up', -5)}
          {renderScrollingColumn(REGIME_SLIDES, 'down', -10)}
        </div>

        {/* Cinematic Typography */}
        <h2 className="side-typography relative z-30 font-serif font-black text-3xl md:text-[3.5vw] tracking-[0.1em] text-white/90 group-hover:scale-105 transition-transform duration-700 uppercase text-center px-4 leading-[1.1] drop-shadow-[0_20px_30px_rgba(0,0,0,1)]">
          <span className="whitespace-nowrap">I F*CK WITH</span><br/>
          <span className="whitespace-nowrap">THE CURRENT REGIME</span>
        </h2>

      </div>

      {/* RIGHT SIDE - OPPOSITION */}
      <div 
        onClick={() => handleSelect('opposition', onSelectOpposition)}
        onMouseEnter={() => setHoverSide('right')}
        onMouseLeave={() => setHoverSide(null)}
        className={`relative w-full md:w-auto h-1/2 md:h-full flex flex-col items-center justify-center cursor-pointer group overflow-hidden ${selectedSide === 'opposition' ? 'z-50' : 'z-10'}`}
        style={{ 
          flex: selectedSide === 'opposition' ? '1' : selectedSide === 'regime' ? '0' : hoverSide === 'right' ? '0.52' : hoverSide === 'left' ? '0.48' : '0.5', 
          transition: 'flex 1.2s cubic-bezier(0.76, 0, 0.24, 1), opacity 1.2s ease',
          opacity: selectedSide === 'regime' ? 0 : 1
        }}
      >
        
        {/* Infinite Scrolling Background */}
        <div className="absolute inset-0 w-[150%] h-[150%] top-[-25%] left-[-25%] flex justify-between pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity duration-700 transform rotate-12 scale-110">
          {renderScrollingColumn(OPPOSITION_SLIDES, 'up', 0)}
          {renderScrollingColumn(OPPOSITION_SLIDES, 'down', -5)}
          {renderScrollingColumn(OPPOSITION_SLIDES, 'up', -10)}
        </div>

        {/* Cinematic Typography */}
        <h2 className="side-typography relative z-30 font-serif font-black text-3xl md:text-[3.5vw] tracking-[0.1em] text-white/90 group-hover:scale-105 transition-transform duration-700 uppercase text-center px-4 leading-[1.1] drop-shadow-[0_20px_30px_rgba(0,0,0,1)]">
          <span className="whitespace-nowrap">I DON'T F*CK WITH</span><br/>
          <span className="whitespace-nowrap">THE CURRENT REGIME</span>
        </h2>

      </div>

      {/* THIRD OPTION PILL (BOTTOM CENTER) */}
      <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 z-40 ${selectedSide ? 'pointer-events-none' : 'pointer-events-auto'}`}>
        <button 
          ref={pillRef}
          onClick={onSelectVs}
          className="relative flex items-center justify-start group cursor-pointer"
        >
          {/* Escaping GIF (Massive) - Shifted Right */}
          <div className="third-option-gif absolute left-[-5px] md:left-[5px] -bottom-4 md:-bottom-6 w-16 h-24 md:w-24 md:h-36 rounded-md overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.6)] transform -rotate-6 hover:-rotate-12 transition-transform duration-300 z-20 border border-black/20 opacity-0 translate-y-12">
            <Image src={gifSrc} alt="Eye roll" fill className="object-cover" unoptimized />
          </div>
          
          {/* Sliding Text Container - Animates on Load */}
          <div className="third-option-container ml-[35px] md:ml-[45px] h-10 md:h-14 bg-white border border-white/20 rounded-full flex items-center overflow-hidden max-w-0 opacity-0 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <span className="third-option-text inline-block pl-16 pr-6 md:pl-20 md:pr-8 text-black font-black tracking-widest uppercase text-[10px] md:text-xs whitespace-nowrap transform -translate-x-full">
              JUST SHOW ME THE COLLECTION BRO
            </span>
          </div>
        </button>
      </div>

      {/* GAMIFIED STATS OVERLAY */}
      {selectedSide && (
        <div className="gamified-stats absolute inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none mix-blend-difference drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-center gap-6 md:gap-16 scale-[0.8] md:scale-100">
            {/* Regime Stat */}
            <div className={`flex flex-col items-center transition-all duration-700 ${selectedSide === 'regime' ? 'text-white scale-110' : 'text-white/30 scale-75 blur-[2px]'}`}>
              <span className="font-serif font-black text-6xl md:text-9xl">14,204</span>
              <span className="font-sans font-bold tracking-[0.3em] text-xs md:text-sm mt-4 text-white/80">REGIME BACKERS</span>
            </div>
            
            <div className="text-3xl md:text-5xl font-black text-white/40 italic mx-4">VS</div>
            
            {/* Opposition Stat */}
            <div className={`flex flex-col items-center transition-all duration-700 ${selectedSide === 'opposition' ? 'text-white scale-110' : 'text-white/30 scale-75 blur-[2px]'}`}>
              <span className="font-serif font-black text-6xl md:text-9xl">9,430</span>
              <span className="font-sans font-bold tracking-[0.3em] text-xs md:text-sm mt-4 text-white/80">OPPOSITION BACKERS</span>
            </div>
          </div>
          
          <div className="mt-16 text-center animate-pulse">
            <span className="font-sans font-bold tracking-[0.5em] text-white/50 text-xs md:text-sm uppercase">
              ENTERING {selectedSide} TERRITORY...
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
