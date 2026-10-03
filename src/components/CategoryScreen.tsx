import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { REGIME_SLIDES, OPPOSITION_SLIDES } from '@/data/products';

interface CategoryScreenProps {
  side: 'REGIME' | 'OPPOSITION';
  onSelectCategory: (category: string) => void;
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({ side, onSelectCategory }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const slides = side === 'REGIME' ? REGIME_SLIDES : OPPOSITION_SLIDES;
  const currentTint = slides[0].colors.tint;

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' });
    }
  }, []);

  const handleSelect = (category: string) => {
    gsap.to(containerRef.current, { opacity: 0, scale: 1.1, duration: 0.8, ease: 'power2.inOut', onComplete: () => onSelectCategory(category) });
  };

  const renderHorizontalMarquee = (items: {image: string}[], direction: 'left' | 'right', speed: number) => {
    const doubled = [...items, ...items, ...items, ...items];
    return (
      <div className="absolute inset-y-0 right-0 left-1/4 flex items-center overflow-hidden pointer-events-none">
        <div 
          className={`flex h-full items-center gap-16 w-max ${direction === 'left' ? 'animate-[scrollLeft_40s_linear_infinite]' : 'animate-[scrollRight_40s_linear_infinite]'}`}
          style={{ animationDuration: `${speed}s` }}
        >
          {doubled.map((item, idx) => (
            <div key={idx} className="relative w-[150px] md:w-[210px] aspect-[3/4] flex-shrink-0 opacity-100 mix-blend-normal">
              <Image src={item.image} alt="product" fill className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getFlex = (index: number) => {
    if (hoveredRow === index) return '0.4';
    if (hoveredRow !== null) return '0.3';
    return '0.333';
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-[60] bg-[#0a0a0a] flex flex-col overflow-hidden pt-28 md:pt-40 pb-0 px-0 gap-0">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
      `}} />

      {/* OVERSIZED TEES */}
      <div 
        onClick={() => handleSelect('TEES')}
        onMouseEnter={() => setHoveredRow(0)}
        onMouseLeave={() => setHoveredRow(null)}
        className="relative w-full flex items-center justify-start px-8 md:px-12 cursor-pointer group overflow-hidden border-b border-white/10"
        style={{
          flex: getFlex(0),
          transition: 'flex 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          backgroundColor: '#111'
        }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/tiedye.jpg')] bg-cover bg-center mix-blend-screen opacity-20 group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="absolute inset-0 mix-blend-multiply opacity-50" style={{ backgroundColor: currentTint }}></div>
          {renderHorizontalMarquee(slides, 'left', 50)}
          <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>
        </div>
        
        <h2 className="relative z-10 font-serif font-black text-5xl md:text-8xl tracking-widest text-white uppercase drop-shadow-[0_20px_40px_rgba(0,0,0,1)] group-hover:translate-x-6 transition-transform duration-700 origin-left">
          OVERSIZED TEES
        </h2>
      </div>

      {/* HOODIES */}
      <div 
        onClick={() => handleSelect('HOODIES')}
        onMouseEnter={() => setHoveredRow(1)}
        onMouseLeave={() => setHoveredRow(null)}
        className="relative w-full flex items-center justify-start px-8 md:px-12 cursor-pointer group overflow-hidden border-b border-white/10"
        style={{
          flex: getFlex(1),
          transition: 'flex 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          backgroundColor: '#111'
        }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/comic_clouds.jpg')] bg-cover bg-center mix-blend-screen opacity-30 group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="absolute inset-0 mix-blend-multiply opacity-50" style={{ backgroundColor: currentTint }}></div>
          {renderHorizontalMarquee([{image: '/pinkhoodie.png'}], 'right', 40)}
          <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>
        </div>

        <h2 className="relative z-10 font-serif font-black text-5xl md:text-8xl tracking-widest text-white uppercase drop-shadow-[0_20px_40px_rgba(0,0,0,1)] group-hover:translate-x-6 transition-transform duration-700 origin-left">
          HOODIES
        </h2>
      </div>

      {/* WHATEVER */}
      <div 
        onClick={() => handleSelect('WHATEVER')}
        onMouseEnter={() => setHoveredRow(2)}
        onMouseLeave={() => setHoveredRow(null)}
        className="relative w-full flex items-center justify-start px-8 md:px-12 cursor-pointer group overflow-hidden border-b border-white/10"
        style={{
          flex: getFlex(2),
          transition: 'flex 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          backgroundColor: '#111'
        }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/tiedye.jpg')] bg-cover bg-center mix-blend-screen opacity-20 group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="absolute inset-0 mix-blend-multiply opacity-50" style={{ backgroundColor: currentTint }}></div>
          <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent"></div>
        </div>

        <h2 className="relative z-10 font-serif font-black text-5xl md:text-8xl tracking-widest text-white uppercase drop-shadow-[0_20px_40px_rgba(0,0,0,1)] group-hover:translate-x-6 transition-transform duration-700 origin-left">
          WHATEVER
        </h2>
      </div>

    </div>
  );
};
