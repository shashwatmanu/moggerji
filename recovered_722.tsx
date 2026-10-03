"use client";

import { useState, useRef, useEffect, WheelEvent as ReactWheelEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { useCart } from "@/context/CartContext";
import InfoOverlay, { Tab } from "@/components/InfoOverlay";
import { sound } from "@/utils/SoundEngine";
import { Volume2, VolumeX } from "lucide-react";

const SLIDES = [
  { 
    id: 1, 
    theme: 'supreme',
    title: 'SUPREME LEADER TEE', 
    subtitle: 'THE SUPREME LEADER HAS ARRIVED. Unfortunately, he has also arrived on a T-shirt.', 
    price: '₹1299',
    oldPrice: '₹1999',
    colors: { tint: '#b56133', bg: '#0a0503' },
    image: '/products/gptbrown.png',
    qikinkId: '64752982'
  },
  { 
    id: 2, 
    theme: 'iced',
    title: 'ICED OUT PM TEE', 
    subtitle: 'COLD EXPORTS. HEAT WAVES. The drip that destabilizes economies.', 
    price: '₹1299',
    oldPrice: '₹1999',
    colors: { tint: '#9b6bd4', bg: '#08050a' },
    image: '/products/gptpurple.png',
    qikinkId: '64753444'
  },
  { 
    id: 3, 
    theme: 'sybau',
    title: 'SYBAU TEE', 
    subtitle: 'For when you don\'t have the energy to argue. Silence the noise.', 
    price: '₹1299',
    oldPrice: '₹1999',
    colors: { tint: '#0fa853', bg: '#030a06' },
    image: '/products/gptgreen.png',
    qikinkId: '64753072'
  },
  { 
    id: 5, 
    theme: 'thoda',
    title: 'THODA KAM BOLA KAR TEE', 
    subtitle: 'VINTAGE WASHED REALITY. Stop typing and touch grass.', 
    price: '₹1299',
    oldPrice: '₹1999',
    colors: { tint: '#8a5c41', bg: '#080504' },
    image: '/products/gptnewbrown.png',
    qikinkId: '64753534'
  },
  { 
    id: 4, 
    theme: 'chowkidar',
    title: 'CHOWKIDAR TEE', 
    subtitle: 'EYES EVERYWHERE. Stealth ops for the timeline.', 
    price: '₹1299',
    oldPrice: '₹1999',
    colors: { tint: '#6c7887', bg: '#050608' },
    image: '/products/gptblack.png',
    qikinkId: '64688996'
  },
];

const ThematicBackground = ({ activeTheme }: { activeTheme: string }) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* SUPREME LEADER */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${activeTheme === 'supreme' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-[10%] w-[200%] -left-[50%] overflow-hidden bg-red-600/10 backdrop-blur-md border-y border-red-500/20 transform rotate-[-3deg] shadow-[0_-10px_30px_rgba(220,38,38,0.15)]">
          <div className="whitespace-nowrap py-3 font-serif font-black tracking-[0.2em] text-3xl md:text-4xl text-red-500/40 uppercase animate-[marquee_15s_linear_infinite]">
            SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • SUPREME • 
          </div>
        </div>
      </div>
    </div>
  );
};

const ThematicForeground = ({ activeTheme }: { activeTheme: string }) => {
  return (
    <div key={activeTheme} className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {/* ICED OUT - Fast staggered diamonds in specific spots */}
      {activeTheme === 'iced' && (
        <div className="absolute inset-0">
          <div className="absolute top-[25%] right-[15%] text-4xl md:text-5xl opacity-0 animate-[emergeVanish_1.8s_ease-in-out_0.1s_forwards] rotate-12">💎</div>
          <div className="absolute bottom-[25%] right-[30%] text-3xl md:text-4xl opacity-0 animate-[emergeVanish_1.8s_ease-in-out_0.4s_forwards] -rotate-12">💎</div>
          <div className="absolute bottom-[35%] right-[5%] text-5xl md:text-6xl opacity-0 animate-[emergeVanish_1.8s_ease-in-out_0.7s_forwards] rotate-6">💎</div>
        </div>
      )}

      {/* SYBAU - Single elegant shush emoji */}
      {activeTheme === 'sybau' && (
        <div className="absolute top-[40%] right-[18%] text-7xl md:text-[8rem] opacity-0 animate-[emergeVanish_2.5s_ease-in-out_0.2s_forwards] drop-shadow-2xl">🤫</div>
      )}

      {/* THODA - Emerge and vanish mute emoji */}
      {activeTheme === 'thoda' && (
        <div className="absolute top-[40%] right-[25%] text-5xl md:text-6xl animate-[emergeVanish_3s_ease-in-out_forwards]">🔇</div>
      )}
    </div>
  );
};

export default function Home() {
  const { addToCart, totalQuantity, setIsCartOpen, items } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoTab, setInfoTab] = useState<Tab>("SIZING");
  const [isMuted, setIsMuted] = useState(true);
  
  const container = useRef<HTMLDivElement>(null);
  const cartIconRef = useRef<HTMLButtonElement>(null);
  
  // Background Refs
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const tintLayerRef = useRef<HTMLDivElement>(null);
  const texture1Ref = useRef<HTMLDivElement>(null);
  const texture2Ref = useRef<HTMLDivElement>(null);

  const shirtsRef = useRef<HTMLDivElement>(null);
  const shirtContainerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { contextSafe } = useGSAP({ scope: container });

  // Continuous ambient animations
  useGSAP(() => {
    if (!mounted || !shirtContainerRef.current) return;
    
    // Floating Shirt
    const swayAmount = window.innerWidth < 768 ? 0 : 15; // Disabled on mobile
    gsap.to(shirtContainerRef.current, {
      y: swayAmount,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Floating Tie-Dye Texture Layers (Lateral Drift)
    if (texture1Ref.current && texture2Ref.current) {
      gsap.to(texture1Ref.current, {
        x: '-8%',
        y: 'random(-3%, 3%)',
        duration: 20,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(texture2Ref.current, {
        x: '8%',
        y: 'random(-3%, 3%)',
        duration: 25,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }, [mounted]);

  // Pointer Drag State
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    currentX: 0
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current.isDragging = true;
    dragState.current.startX = e.clientX;
    if (shirtContainerRef.current) {
      shirtContainerRef.current.style.cursor = 'grabbing';
      gsap.to(shirtContainerRef.current, { scale: 0.95, duration: 0.3 });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.isDragging) return;
    dragState.current.currentX = e.clientX;
    const deltaX = dragState.current.currentX - dragState.current.startX;
    
    if (shirtContainerRef.current) {
      // Rotate based on drag distance, giving a physical leaning effect
      const rotateY = (deltaX / window.innerWidth) * 45; 
      
      gsap.to(shirtContainerRef.current, { 
        x: deltaX * 0.5, 
        rotateY: rotateY,
        duration: 0.5, 
        ease: 'power2.out' 
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;
    
    if (shirtContainerRef.current) {
      shirtContainerRef.current.style.cursor = 'grab';
      gsap.to(shirtContainerRef.current, { 
        scale: 1, 
        x: 0, 
        rotateX: 0,
        rotateY: 0,
        duration: 0.5, 
        ease: 'elastic.out(1, 0.5)' 
      });
    }

    const deltaX = dragState.current.currentX - dragState.current.startX;
    if (Math.abs(deltaX) > 100) {
      if (deltaX < 0) {
        next();
      } else {
        prev();
      }
    }
    dragState.current.currentX = 0;
    dragState.current.startX = 0;
  };

  const handleMouseMove = contextSafe((e: React.MouseEvent) => {
    if (!shirtContainerRef.current || !shirtsRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    
    // Smooth, heavy damping (physics)
    gsap.to(shirtContainerRef.current, {
      rotateX: -y * 15,
      rotateY: x * 15,
      duration: 1.2,
      ease: 'power3.out'
    });
    
    // Dynamic Drop Shadow opposing the mouse direction
    gsap.to(shirtsRef.current, {
      filter: `drop-shadow(${x * -25}px ${y * -25 + 35}px 30px rgba(0,0,0,0.6))`,
      duration: 1.2,
      ease: 'power3.out'
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (!shirtContainerRef.current || !shirtsRef.current) return;
    gsap.to(shirtContainerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.5,
      ease: 'power3.out'
    });
    gsap.to(shirtsRef.current, {
      filter: 'drop-shadow(0 35px 45px rgba(0,0,0,0.5))',
      duration: 1.5,
      ease: 'power3.out'
    });
  });

  const goToSlide = contextSafe((newIndex: number, direction: 'next' | 'prev') => {
    if (isAnimating || !mounted) return;
    setIsAnimating(true);

    const targetSlide = SLIDES[newIndex];
    
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
      }
    });

    sound.playTransition();

    // Smoothly transition background and tint colors (faster!)
    tl.to(bgLayerRef.current, { backgroundColor: targetSlide.colors.bg, duration: 0.3, ease: 'power1.out' }, 0);
    tl.to(tintLayerRef.current, { backgroundColor: targetSlide.colors.tint, duration: 0.3, ease: 'power1.out' }, 0);

    if (shirtsRef.current && detailsRef.current) {
      const detailsElements = detailsRef.current.children;
      const currentDetails = detailsElements[currentIndex];
      const nextDetails = detailsElements[newIndex];
      
      const shirtElements = shirtsRef.current.children;
      const currentShirt = shirtElements[currentIndex];
      const nextShirt = shirtElements[newIndex];

      const outDetailsY = direction === 'next' ? -50 : 50;
      const inDetailsY = direction === 'next' ? 50 : -50;
      
      const outShirtX = direction === 'next' ? -300 : 300;
      const inShirtX = direction === 'next' ? 300 : -300;

      gsap.set(nextDetails, { opacity: 1, display: 'block' });
      gsap.set(nextShirt, { x: inShirtX, scale: 0.85, opacity: 0, display: 'block' });

      tl.to(currentDetails.children, {
        y: outDetailsY,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(currentDetails, { display: 'none' });
          gsap.set(currentDetails.children, { y: 0, opacity: 1 }); // reset children for future
        }
      }, 0);

      tl.to(currentShirt, {
        x: outShirtX,
        scale: 0.85,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => gsap.set(currentShirt, { display: 'none' })
      }, 0);

      tl.fromTo(nextDetails.children, {
        y: inDetailsY,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
      }, 0.2);
      
      tl.to(nextShirt, {
        x: 0,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      }, 0.1);
    }
  });

  const next = () => { sound.playClick(); goToSlide((currentIndex + 1) % SLIDES.length, 'next'); };
  const prev = () => { sound.playClick(); goToSlide((currentIndex - 1 + SLIDES.length) % SLIDES.length, 'prev'); };

  const handleWheel = (e: ReactWheelEvent) => {
    if (isAnimating) return;
    if (e.deltaY > 50) {
      next();
    } else if (e.deltaY < -50) {
      prev();
    }
  };
  const handleSizeSelect = (slideId: number, size: string) => {
    sound.playHover();
    setSelectedSizes(prev => ({ ...prev, [slideId]: size }));
  };

  const handleAddToCart = (slide: typeof SLIDES[0], e: React.MouseEvent) => {
    const size = selectedSizes[slide.id];
    if (!size) {
      alert("Please select a size first");
      return;
    }
    // Flying Tee Animation
    const shirtRect = shirtContainerRef.current?.getBoundingClientRect();
    const cartRect = cartIconRef.current?.getBoundingClientRect();
    
    if (cartRect && shirtRect) {
      const clone = document.createElement("img");
      clone.src = slide.image;
      clone.style.position = "fixed";
      clone.style.left = `${shirtRect.left}px`;
      clone.style.top = `${shirtRect.top}px`;
      clone.style.width = `${shirtRect.width}px`;
      clone.style.height = `${shirtRect.height}px`;
      clone.style.objectFit = "contain";
      clone.style.zIndex = "9999";
      clone.style.pointerEvents = "none";
      document.body.appendChild(clone);

      const shirtCenterX = shirtRect.left + shirtRect.width / 2;
      const shirtCenterY = shirtRect.top + shirtRect.height / 2;
      const cartCenterX = cartRect.left + cartRect.width / 2;
      const cartCenterY = cartRect.top + cartRect.height / 2;

      gsap.to(clone, {
        x: cartCenterX - shirtCenterX,
        y: cartCenterY - shirtCenterY,
        scale: 0.05,
        opacity: 0,
        rotation: 360,
        duration: 1.4,
        ease: "power2.inOut",
        onComplete: () => {
          clone.remove();
          
          // Trigger Context Add AFTER animation finishes
          sound.playSuccess();
          addToCart({
            slideId: slide.id,
            title: slide.title,
            price: parseInt(slide.price.replace('₹', '')),
            image: slide.image,
            size: size,
            qikinkId: slide.qikinkId
          });

          if (cartIconRef.current) {
            gsap.fromTo(cartIconRef.current, 
              { scale: 1 },
              { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 }
            );
          }
        }
      });
    } else {
      // Fallback if refs fail
      addToCart({
        slideId: slide.id,
        title: slide.title,
        price: parseInt(slide.price.replace('₹', '')),
        image: slide.image,
        size: size,
        qikinkId: slide.qikinkId
      });
    }
  };

  return (
    <main 
      ref={container} 
      className="relative w-screen h-screen overflow-hidden text-white font-sans select-none flex flex-col items-center justify-center bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      style={{ perspective: 1000, filter: 'url(#glitch-filter)' }}
    >
      <svg className="hidden">
        <filter id="glitch-filter">
          <feTurbulence ref={turbulenceRef} type="fractalNoise" baseFrequency="0 0" numOctaves="1" result="warp" />
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="40" in="SourceGraphic" in2="warp" />
        </filter>
      </svg>
      {/* High-Fidelity Tie-Dye Background Engine */}
      <div 
        ref={bgLayerRef} 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ backgroundColor: SLIDES[0].colors.bg }}
      >
        {/* Layer 1: Base Texture (Screen) */}
        <div 
          ref={texture1Ref}
          className="absolute w-[120vw] h-[120vh] top-[-10vh] left-[-10vw] bg-no-repeat bg-cover bg-center mix-blend-screen opacity-70"
          style={{ backgroundImage: 'url(/tiedye.jpg)' }}
        />
        {/* Layer 2: Offset Texture (Screen) for depth */}
        <div 
          ref={texture2Ref}
          className="absolute w-[120vw] h-[120vh] top-[-10vh] left-[-10vw] bg-no-repeat bg-cover bg-center mix-blend-screen opacity-50 transform rotate-180 scale-110"
          style={{ backgroundImage: 'url(/tiedye.jpg)' }}
        />
        
        {/* Layer 3: Dynamic Color Overlay (Multiply) */}
        <div 
          ref={tintLayerRef}
          className="absolute inset-0 mix-blend-multiply transition-colors duration-1000"
          style={{ backgroundColor: SLIDES[0].colors.tint }}
        />

        {/* Layer 4: Vignette & Grain */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Thematic Background Overlays */}
      <ThematicBackground activeTheme={SLIDES[currentIndex].theme} />

      {/* Thematic Foreground Overlays */}
      <ThematicForeground activeTheme={SLIDES[currentIndex].theme} />

      {/* Top Bar */}
      <header className="absolute top-0 left-0 w-full z-40 p-6 md:p-12 flex justify-between items-center pointer-events-auto">
        <div className="text-2xl font-serif font-black tracking-tighter cursor-pointer drop-shadow-md">
          MOGGER<span className="text-white/60"> JI</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMuted(sound.toggleMute())}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-md"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button 
            ref={cartIconRef}
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 p-2 pr-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            
            {items.length > 0 && (
              <div className="flex -space-x-3 ml-1 mr-1">
                {items.slice(-3).map((item, i) => (
                  <div key={item.id + i} className="w-7 h-7 rounded-full bg-black/80 border border-white/30 overflow-hidden relative z-10 flex items-center justify-center" style={{ zIndex: items.length - i }}>
                    <Image src={item.image} alt="shirt" fill className="object-cover scale-150 transform translate-y-1" />
                  </div>
                ))}
              </div>
            )}
            
            <span className="text-xs font-bold font-sans">
              {totalQuantity > 0 ? `${totalQuantity} ITEMS` : 'EMPTY'}
            </span>
          </button>
        </div>
      </header>
      
      {/* Slide Counter (Vertical Right Side) */}
      <div className="absolute top-1/2 right-4 md:right-12 z-40 transform -translate-y-1/2 flex flex-col items-center gap-4 text-xs font-bold font-sans tracking-widest text-white/50 mix-blend-difference hidden md:flex pointer-events-none">
        <span className="text-white">0{currentIndex + 1}</span>
        <div className="w-[1px] h-24 bg-white/20 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full bg-white transition-all duration-700 ease-out"
            style={{ height: `${((currentIndex + 1) / SLIDES.length) * 100}%` }}
          />
        </div>
        <span>0{SLIDES.length}</span>
      </div>
      
      {/* Product Details & Actions Layer (Left Side) */}
      <div className="absolute inset-y-0 left-0 w-full md:w-1/2 z-30 pointer-events-none p-8 md:p-16 lg:p-24">
        <div ref={detailsRef} className="pointer-events-auto relative w-full h-full">
          {SLIDES.map((slide, i) => (
             <div 
               key={`details-${slide.id}`} 
               className="w-full absolute bottom-12 md:bottom-auto md:top-1/2 left-0 md:-translate-y-1/2 flex flex-col md:block items-center md:items-start text-center md:text-left"
               style={{ 
                 display: i === 0 ? 'block' : 'none',
                 opacity: i === 0 ? 1 : 0,
               }}
             >
               <div className="overflow-hidden">
                 <h2 className="text-4xl md:text-7xl lg:text-[6rem] font-serif font-black tracking-tight mb-2 md:mb-4 drop-shadow-2xl leading-none uppercase">
                   {slide.title}
                 </h2>
               </div>
               
               <div className="overflow-hidden hidden md:block">
                 <p className="text-base md:text-xl text-white font-medium mb-4 md:mb-6 max-w-md leading-relaxed font-sans drop-shadow-md">
                   {slide.subtitle}
                 </p>
               </div>
               
               <div className="mb-4 md:mb-6 overflow-hidden flex flex-col items-center md:items-start">
                  <div className="hidden md:flex flex-wrap gap-2 mb-3 md:mb-4">
                    <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-xl">
                      🔥 Get 3 for ₹2499 Only
                    </div>
                    <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-xl">
                      ✨ Get all 5 for ₹3499 Only
                    </div>
                  </div>
                 <div className="flex items-end gap-3">
                   <span className="text-2xl md:text-4xl font-bold tracking-tight drop-shadow-md">{slide.price}</span>
                   <span className="text-base md:text-xl line-through text-white/50 mb-1">{slide.oldPrice}</span>
                 </div>
               </div>

               <div className="flex flex-col gap-4 overflow-hidden items-center md:items-start w-full">
                 {/* Size Selector */}
                  <div className="flex gap-2">
                   {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                     const isSelected = selectedSizes[slide.id] === size;
                     return (
                       <button 
                         key={size} 
                         onClick={() => handleSizeSelect(slide.id, size)}
                         className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold transition-colors backdrop-blur-md ${isSelected ? 'bg-white text-black border-white' : 'border-white/20 hover:bg-white/10 hover:text-white'}`}
                       >
                         {size}
                       </button>
                      );
                    })}
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={(e) => handleAddToCart(slide, e)}
                      className="cursor-magnetic group relative overflow-hidden px-8 py-3 md:px-10 md:py-4 bg-white text-black font-bold rounded-full transition-all uppercase tracking-widest text-xs md:text-sm shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                      <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                        Add to Cart
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute -right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    </button>
                  </div>

                 {/* Trust Badges */}
                 <div className="hidden md:block text-[9px] md:text-[10px] text-white/40 tracking-[0.15em] uppercase font-bold mt-2">
                   HEAVYWEIGHT • 240 GSM COTTON • OVERSIZED FIT • PAN-INDIA SHIPPING
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* Product Image Layer (Right Side) */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none perspective-[1200px]">
        <div 
          ref={shirtContainerRef} 
          className="cursor-drag relative flex items-center justify-center transform-gpu -translate-y-24 md:translate-y-0 md:translate-x-32 lg:translate-x-48" 
          style={{ transformStyle: 'preserve-3d', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Radial Shadow */}
          <div className="absolute -bottom-16 w-[350px] h-20 bg-black/40 blur-3xl rounded-[100%] transform scale-y-50"></div>
          
          <div 
            ref={shirtsRef} 
            className="relative w-[300px] h-[380px] md:w-[500px] md:h-[650px]"
            style={{ transform: 'translateZ(80px)' }}
          >
            {SLIDES.map((slide, i) => (
              <div 
                key={`shirt-${slide.id}`} 
                className="absolute inset-0"
                style={{ 
                  opacity: i === 0 ? 1 : 0, 
                  display: i === 0 ? 'block' : 'none',
                  transform: i === 0 ? 'scale(1)' : 'scale(0.85)',
                  filter: 'drop-shadow(0 35px 45px rgba(0,0,0,0.5))'
                }}
              >
                <Image 
                  src={slide.image} 
                  alt={slide.title} 
                  fill 
                  className="object-contain"
                  priority={i === 0}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Controls Container */}
      <div className="absolute bottom-0 left-0 w-full z-40 p-6 md:p-12 flex justify-between items-end pointer-events-auto">
        <div className="flex gap-4 md:gap-6 text-[10px] md:text-xs font-semibold tracking-widest uppercase opacity-50">
          {(["RETURNS", "SIZING", "CONTACT"] as Tab[]).map((tab) => (
            <button 
              key={tab} 
              onClick={() => { setInfoTab(tab); setIsInfoOpen(true); }}
              className="cursor-magnetic hover:opacity-100 hover:text-white hover:animate-[glitch_0.3s_ease-in-out_infinite] transition-all"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-3 md:gap-4">
          <button 
            onClick={prev}
            disabled={isAnimating}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group backdrop-blur-sm shadow-lg"
            aria-label="Previous Slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:-translate-x-1 transition-transform md:w-6 md:h-6">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            onClick={next}
            disabled={isAnimating}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group backdrop-blur-sm shadow-lg"
            aria-label="Next Slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform md:w-6 md:h-6">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <InfoOverlay 
        isOpen={isInfoOpen} 
        onClose={() => setIsInfoOpen(false)} 
        initialTab={infoTab} 
      />
    </main>
  );
}

