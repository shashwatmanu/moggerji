"use client";

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { MoggerJiLogo } from '@/components/MoggerJiLogo';

const PRODUCTS = [
  { id: 'sybau', name: 'SYBAU TEE', image: '/products/gptgreen.png', tint: '#0fa853', bg: '#030a06', meme: '/memes/sybau.jpg' },
  { id: 'supreme', name: 'SUPREME LEADER', image: '/products/gptbrown.png', tint: '#b56133', bg: '#0a0503', meme: '/memes/sybau.jpg' },
  { id: 'iced', name: 'ICED OUT PM', image: '/products/gptpurple.png', tint: '#9b6bd4', bg: '#08050a', meme: '/memes/sybau.jpg' },
  { id: 'thoda', name: 'THODA KAM BOLA', image: '/products/gptnewbrown.png', tint: '#8a5c41', bg: '#080504', meme: '/memes/sybau.jpg' },
  { id: 'chowkidar', name: 'CHOWKIDAR', image: '/products/gptblack.png', tint: '#6c7887', bg: '#050608', meme: '/memes/sybau.jpg' },
];

export default function ReelStudio() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const blackFadeRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const productNamesRef = useRef<(HTMLDivElement | null)[]>([]);
  const bgTextsRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);
  const memeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { contextSafe } = useGSAP({ scope: containerRef });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Setup initial idle state (pure black, waiting for play)
  useGSAP(() => {
    resetScene();
  }, [activeProductIndex]);

  const resetScene = contextSafe(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    setIsPlaying(false);
    
    // Hide everything
    gsap.set(canvasRef.current, { z: 0, opacity: 1 });
    gsap.set(blackFadeRef.current, { opacity: 1 }); // Start completely black
    gsap.set(bgRef.current, { backgroundColor: '#000000' });
    gsap.set(tintRef.current, { backgroundColor: '#000000', opacity: 0 });
    gsap.set(lightRef.current, { opacity: 0, x: '-50%', y: '-50%', scale: 1 });
    gsap.set(brandRef.current, { opacity: 0, y: 10 });
    
    PRODUCTS.forEach((_, i) => {
      const el = productsRef.current[i];
      if (el) {
        // Position everything far back by default
        gsap.set(el, { opacity: 0, scale: 0, x: 0, y: 0, z: -1000, rotateY: 0, rotateX: 0, filter: 'blur(20px)' });
      }
      const textEl = productNamesRef.current[i];
      if (textEl) {
        gsap.set(textEl, { opacity: 0, x: 0, y: 0, scale: 1 });
        const chars = textEl.querySelectorAll('.char');
        const line = textEl.querySelector('.char-line');
        if (chars) gsap.set(chars, { opacity: 0, y: 15, filter: 'blur(10px)' });
        if (line) gsap.set(line, { opacity: 0, scaleX: 0 });
      }

      const bgText = bgTextsRef.current[i];
      if (bgText) {
        gsap.set(bgText, { opacity: 0, x: 200, scale: 1.5 });
      }

      const meme = memeRefs.current[i];
      if (meme) {
        gsap.set(meme, { opacity: 0, scale: 0.5, rotateZ: 0, filter: 'blur(20px)' });
      }
    });

    gsap.set(flashRef.current, { opacity: 0 });
  });

  const getCoverFlowProps = (index: number, centerIndex: number) => {
    // Calculate shortest distance in a circle (so items wrap around)
    // Actually, Cover Flow is usually linear, not circular. Let's make it circular so it loops infinitely if we wanted,
    // but we only have 5 items so we just show them in a line.
    
    // 0 means it's the center. -1 means it's to the left. +1 means to the right.
    // We want the array to flow right-to-left.
    
    let diff = index - centerIndex;
    
    // Adjust diff to find the shortest path around the 5 items (wrap around logic)
    if (diff > 2) diff -= PRODUCTS.length;
    if (diff < -2) diff += PRODUCTS.length;

    const absDiff = Math.abs(diff);

    // If it's the center item
    if (diff === 0) {
      return {
        x: 0,
        z: 0,
        scale: 1.25,
        opacity: 1,
        rotateY: 0,
        filter: 'blur(0px)',
      };
    }
    
    // If it's on the sides
    return {
      x: diff * 350, // Space them out horizontally
      z: -absDiff * 400, // Push them back
      scale: 1,
      opacity: 1 - (absDiff * 0.3), // Fade out the further they are
      rotateY: diff > 0 ? -30 : 30, // Angle them inward
      filter: `blur(${absDiff * 10}px)`,
    };
  };

  const playSequence = contextSafe(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    resetScene();

    const tl = gsap.timeline({
      onComplete: () => setIsPlaying(false)
    });
    timelineRef.current = tl;

    const hero = productsRef.current[activeProductIndex];
    const activeProdData = PRODUCTS[activeProductIndex];
    const heroName = productNamesRef.current[activeProductIndex];

    // ==========================================
    // PART 1: THE MEME DROP (0.0s - 1.5s)
    // ==========================================
    
    // Reveal from black
    tl.to(blackFadeRef.current, { opacity: 0, duration: 0.1 }, 0);
    
    // Atmosphere instantly hits
    tl.set(bgRef.current, { backgroundColor: activeProdData.bg }, 0);
    tl.set(tintRef.current, { backgroundColor: activeProdData.tint, opacity: 0.8 }, 0);
    
    // Light sweeps across
    tl.fromTo(lightRef.current,
      { opacity: 0.8, x: '-100%', y: '-100%', scale: 2 },
      { opacity: 0.6, x: '100%', y: '100%', duration: 7, ease: 'sine.inOut' },
      0
    );

    // Dolly-Zoom on BG (Background zooms IN while camera seems to pull back)
    tl.fromTo(bgRef.current,
      { scale: 1.0 },
      { scale: 1.15, duration: 5.5, ease: 'sine.out' }, // Increased duration for meme phase
      0
    );

    // Meme SLAMS in
    const heroMeme = memeRefs.current[activeProductIndex];
    if (heroMeme) {
      tl.fromTo(heroMeme,
        { opacity: 0, scale: 2, filter: 'blur(30px)', rotateZ: -10 },
        { opacity: 1, scale: 1, filter: 'blur(0px)', rotateZ: 0, duration: 0.6, ease: 'back.out(1.5)' },
        0.2
      );
      // Meme floats slightly
      tl.to(heroMeme, { scale: 1.05, duration: 1.2, ease: 'sine.inOut' }, 0.8);
      
      // Meme gets sucked out violently just before shirt slams in
      tl.to(heroMeme, { opacity: 0, scale: 0.2, filter: 'blur(20px)', rotateZ: 20, duration: 0.3, ease: 'back.in(2)' }, 1.3);
    }

    // ==========================================
    // PART 2: THE SHIRT DROP (1.6s - 4.5s)
    // ==========================================

    // Hero Shirt SLAMS in
    tl.fromTo(hero, 
      { opacity: 0, scale: 1.5, x: 0, z: 200, filter: 'drop-shadow(40px 0 rgba(255,0,0,0.5)) drop-shadow(-40px 0 rgba(0,255,255,0.5)) blur(30px)', rotateY: -30, rotateX: 10 },
      { opacity: 1, scale: 0.95, x: 0, z: 0, filter: 'drop-shadow(0px 0 rgba(255,0,0,0)) drop-shadow(0px 0 rgba(0,255,255,0)) blur(0px)', rotateY: 10, rotateX: 0, duration: 1.2, ease: 'expo.out' },
      1.6 // Shifted to happen right after meme gets sucked out
    );

    // Hero Background Text SLAMS in
    const heroBgText = bgTextsRef.current[activeProductIndex];
    if (heroBgText) {
      tl.fromTo(heroBgText,
        { opacity: 0, x: 300, scale: 1.5 },
        { opacity: 0.15, x: -100, scale: 1.5, duration: 8, ease: 'power2.out' },
        1.6
      );
    }

    // Hero Name fades in (staggered)
    if (heroName) {
      const heroChars = heroName.querySelectorAll('.char');
      const heroLine = heroName.querySelector('.char-line');
      
      tl.to(heroName, { opacity: 1, duration: 0.1 }, 2.1);
      tl.to(heroChars, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.05,
        ease: 'back.out(1.5)'
      }, 2.1);
      tl.to(heroLine, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'expo.out' }, 2.4);
    }

    // Hero breathes and floats for the meme hold
    tl.to(hero, {
      rotateY: 0,
      rotateX: -2,
      scale: 1.0,
      duration: 2.8,
      ease: 'sine.inOut'
    }, 2.6);

    // ==========================================
    // PART 3: THE COVER FLOW PULLBACK (5.5s)
    // ==========================================
    let time = 5.4; // Shifted from 3.8 to 5.4
    
    // Aggressive Camera Pullback to show the whole formation (Zoomed out more)
    tl.to(canvasRef.current, {
      z: -900,
      y: -50,
      duration: 1.5,
      ease: 'power3.inOut'
    }, time);

    // Keep the dynamic background, but fade it slightly darker for the outro
    tl.to(tintRef.current, { opacity: 0.4, duration: 1.5, ease: 'power2.inOut' }, time);

    // Fade in the minimal MOGGER JI EXCLUSIVE label at the bottom
    tl.fromTo(brandRef.current, 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' },
      time
    );

    // Bring the other shirts into the Cover Flow formation
    PRODUCTS.forEach((_, i) => {
      const shirt = productsRef.current[i];
      if (!shirt) return;
      
      const props = getCoverFlowProps(i, activeProductIndex);
      
      // The hero is already there, just needs to snap to exact 0,0,0
      if (i === activeProductIndex) {
        tl.to(shirt, { ...props, duration: 1.5, ease: 'power3.inOut' }, time);
      } else {
        // The others emerge from the dark background
        tl.fromTo(shirt, 
          { ...props, z: props.z - 500, opacity: 0, filter: 'blur(30px)' },
          { ...props, duration: 1.5, ease: 'power3.out' },
          time
        );
      }
    });

    // ==========================================
    // PART 4: THE COVER FLOW SWIPE (6.5s - ...)
    // ==========================================
    time = 6.4;
    const slideDuration = 0.5; // Hold
    const swipeDuration = 0.6; // Punchy swipe

    // We swipe 4 times to show the remaining 4 shirts
    for (let step = 1; step <= 4; step++) {
      const currentCenterIndex = (activeProductIndex + step) % PRODUCTS.length;
      const prevCenterIndex = (activeProductIndex + step - 1) % PRODUCTS.length;
      
      const prevName = productNamesRef.current[prevCenterIndex];
      const newName = productNamesRef.current[currentCenterIndex];
      const prodData = PRODUCTS[currentCenterIndex];

      // Update background colors for dynamic energy
      tl.to(bgRef.current, { backgroundColor: prodData.bg, duration: swipeDuration, ease: 'power2.inOut' }, time);
      tl.to(tintRef.current, { backgroundColor: prodData.tint, duration: swipeDuration, ease: 'power2.inOut' }, time);

      // Snap out old name (reverse stagger)
      if (prevName) {
        const prevChars = prevName.querySelectorAll('.char');
        const prevLine = prevName.querySelector('.char-line');
        tl.to(prevChars, { opacity: 0, x: -20, filter: 'blur(5px)', duration: swipeDuration * 0.6, stagger: 0.02, ease: 'power2.in' }, time);
        tl.to(prevLine, { opacity: 0, scaleX: 0, duration: swipeDuration * 0.5, ease: 'power2.in' }, time);
      }

      // Snap out old BG text
      const prevBgText = bgTextsRef.current[prevCenterIndex];
      if (prevBgText) {
        tl.to(prevBgText, { opacity: 0, x: -400, duration: swipeDuration, ease: 'power2.inOut' }, time);
      }

      // STUDIO STROBE FLASH (Removed per user feedback)
      // tl.set(flashRef.current, { opacity: 1 }, time);
      // tl.to(flashRef.current, { opacity: 0, duration: 0.4, ease: 'expo.out' }, time);

      // Animate all shirts to their new Cover Flow positions
      PRODUCTS.forEach((_, i) => {
        const shirt = productsRef.current[i];
        if (!shirt) return;
        const props = getCoverFlowProps(i, currentCenterIndex);
        
        // Chromatic Aberration & Whip during swipe
        if (i === currentCenterIndex) {
          // The one coming into the center gets the heavy chromatic aberration
          tl.set(shirt, { rotateY: getCoverFlowProps(i, prevCenterIndex).rotateY, filter: 'drop-shadow(80px 0 rgba(255,0,0,0.8)) drop-shadow(-80px 0 rgba(0,255,255,0.8)) blur(10px)' }, time);
          tl.to(shirt, { ...props, filter: 'drop-shadow(0px 0 rgba(255,0,0,0)) drop-shadow(0px 0 rgba(0,255,255,0)) blur(0px)', duration: swipeDuration, ease: 'power3.inOut' }, time);
        } else {
          // Others just rotate and slide normally
          tl.set(shirt, { rotateY: getCoverFlowProps(i, prevCenterIndex).rotateY }, time);
          tl.to(shirt, { ...props, duration: swipeDuration, ease: 'power3.inOut' }, time);
        }
      });

      // Snap in new BG text
      const newBgText = bgTextsRef.current[currentCenterIndex];
      if (newBgText) {
        tl.set(newBgText, { opacity: 0, x: 200, scale: 1.5 }, time);
        tl.to(newBgText, { opacity: 0.15, x: -100, scale: 1.5, duration: slideDuration + swipeDuration + 2, ease: 'power2.out' }, time);
      }

      // Snap in new name (stagger)
      if (newName) {
        const newChars = newName.querySelectorAll('.char');
        const newLine = newName.querySelector('.char-line');
        tl.to(newName, { opacity: 1, duration: 0.1 }, time + 0.1);
        
        tl.set(newChars, { opacity: 0, x: 30, y: 0, filter: 'blur(10px)' }, time + 0.1);
        tl.to(newChars, { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', duration: swipeDuration * 1.2, stagger: 0.03, ease: 'power3.out' }, time + 0.2);
        
        tl.set(newLine, { opacity: 0, scaleX: 0 }, time + 0.1);
        tl.to(newLine, { opacity: 1, scaleX: 1, duration: swipeDuration, ease: 'power3.out' }, time + 0.3);
      }

      time += swipeDuration;

      // Small breathe on the center item
      const centerShirt = productsRef.current[currentCenterIndex];
      if (centerShirt) {
        tl.to(centerShirt, { scale: 1.28, duration: slideDuration, ease: 'none' }, time);
      }

      time += slideDuration;
    }

    // ==========================================
    // PART 5: THE OUTRO (MOGGER JI LOGO SLAM)
    // ==========================================
    time += 0.5; // Small hold after the final center focus

    // 1. Wipe out everything else
    PRODUCTS.forEach((_, i) => {
      const shirt = productsRef.current[i];
      if (shirt) tl.to(shirt, { scale: 0, opacity: 0, duration: 0.5, ease: 'back.in(1.7)' }, time);
    });
    
    // Fade out marquee and text
    PRODUCTS.forEach((_, i) => {
      if (bgTextsRef.current[i]) tl.to(bgTextsRef.current[i], { opacity: 0, duration: 0.3 }, time);
      if (productNamesRef.current[i]) tl.to(productNamesRef.current[i], { opacity: 0, duration: 0.3 }, time);
    });

    time += 0.5;

    // 2. Logo Slam Animation
    if (logoRef.current) {
      tl.set(logoRef.current, { opacity: 1 }, time);
      
      const logoPaths = logoRef.current.querySelectorAll('.logo-wordmark path');
      const logoSubtitle = logoRef.current.querySelector('.logo-subtitle');
      const logoTm = logoRef.current.querySelector('.logo-tm');

      // Slam letters in individually
      if (logoPaths.length > 0) {
        tl.fromTo(logoPaths,
          { opacity: 0, scale: 3, filter: 'blur(20px)', rotateZ: () => (Math.random() - 0.5) * 45 },
          { opacity: 1, scale: 1, filter: 'blur(0px)', rotateZ: 0, duration: 0.5, stagger: 0.05, ease: 'expo.out' },
          time
        );
      }

      // Glitch subtitle in
      if (logoSubtitle && logoTm) {
        tl.fromTo([logoSubtitle, logoTm],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          time + 0.6
        );
      }
    }
  });

  return (
    <div className="flex w-screen h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* SVG FILTERS */}
      <svg className="hidden">
        <filter id="atmosphere-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>


      {/* LEFT SIDEBAR: SIMPLE CONTROLS */}
      <div className="w-80 bg-black border-r border-white/10 p-8 flex flex-col gap-12 z-50 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-serif font-black tracking-tighter mb-1">REEL STUDIO</h1>
          <p className="text-[10px] text-white/40 tracking-widest uppercase">Cover Flow Carousel</p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-bold tracking-widest text-white/40 uppercase">1. Select Meme Target</h2>
          <div className="flex flex-col gap-2">
            {PRODUCTS.map((p, i) => (
              <button 
                key={p.id}
                onClick={() => { setActiveProductIndex(i); resetScene(); }}
                disabled={isPlaying}
                className={`text-left px-5 py-4 rounded-xl transition-all border disabled:opacity-50 ${activeProductIndex === i ? 'bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-transparent hover:bg-white/5'}`}
              >
                <div className="text-sm font-bold tracking-wide">{p.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-auto pb-8">
          <button 
            onClick={playSequence}
            disabled={isPlaying}
            className="w-full bg-white text-black disabled:opacity-50 hover:bg-white/90 py-5 rounded-xl text-base font-black uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all"
          >
            {isPlaying ? 'RECORDING...' : 'PLAY SEQUENCE'}
          </button>
          
          <button 
            onClick={resetScene}
            className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest mt-2 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* CENTER: CANVAS */}
      <div className="flex-1 flex items-center justify-center bg-[#030303] relative pattern-dots">
        
        {/* Helper overlay */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/20 text-xs font-bold tracking-widest pointer-events-none">
          RECORD BOUNDARY [1080 × 1920]
        </div>

        {/* 9:16 Canvas */}
        <div 
          ref={containerRef}
          className="relative bg-black overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 rounded-sm"
          style={{
            aspectRatio: '9/16',
            height: '92vh', 
            maxHeight: '1920px',
            perspective: 1200
          }}
        >
          {/* OUTRO LOGO CONTAINER */}
          <div 
            ref={logoRef} 
            className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none opacity-0 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <MoggerJiLogo className="w-[90%] max-w-[360px] h-auto" />
          </div>

          {/* Environment */}
          <div ref={bgRef} className="absolute inset-0 z-0 bg-black">
            {/* Atmospheric Smoke */}
            <div 
              className="absolute inset-0 opacity-40 mix-blend-screen"
              style={{ backgroundImage: 'url(/tiedye.jpg)', backgroundSize: 'cover', filter: 'blur(30px) saturate(0)' }}
            />
            {/* Dynamic Tint */}
            <div ref={tintRef} className="absolute inset-0 mix-blend-multiply opacity-0" />
            
            {/* Fine Grain */}
            <div className="absolute inset-0 mix-blend-overlay opacity-60 pointer-events-none" style={{ filter: 'url(#atmosphere-noise) contrast(1.5)' }} />
            
            {/* Dynamic Volumetric Light */}
            <div 
              ref={lightRef}
              className="absolute w-[200%] h-[200%] pointer-events-none mix-blend-screen opacity-0"
              style={{ background: `radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 50%)` }}
            />
            
            {/* Deep Vignette */}
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ background: `radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.95) 100%)` }}
            />
          </div>

          {/* MEME OVERLAY LAYER */}
          <div className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none">
            {PRODUCTS.map((p, i) => (
              <div
                key={`meme-${p.id}`}
                ref={el => { memeRefs.current[i] = el; }}
                className="absolute inset-0 flex items-center justify-center opacity-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={p.meme} 
                  alt={`${p.name} Meme`} 
                  className="w-[85%] h-auto max-h-[70%] object-contain rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-white/10" 
                />
              </div>
            ))}
          </div>

          {/* Architectural Marquee Backdrop (Behind Shirts) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none mix-blend-overlay">
            {PRODUCTS.map((p, i) => (
              <h1 
                key={`bg-text-${p.id}`}
                ref={el => { bgTextsRef.current[i] = el; }}
                className="absolute text-[150px] font-sans font-black uppercase whitespace-nowrap text-transparent tracking-tighter" 
                style={{ WebkitTextStroke: '3px rgba(255,255,255,0.8)', opacity: 0, transform: 'scale(1.5)' }}
              >
                {p.name}
              </h1>
            ))}
          </div>

          {/* 3D Scene Node (Cover Flow Container) */}
          <div 
            ref={canvasRef}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" 
            style={{ transformStyle: 'preserve-3d' }}
          >
            {PRODUCTS.map((p, i) => (
              <div 
                key={`prod-${p.id}`}
                ref={el => { productsRef.current[i] = el; }}
                className="absolute flex flex-col items-center justify-center w-[120%] h-[70%]"
                style={{ opacity: 0, transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 z-10">
                  {/* The Main Shirt */}
                  <Image 
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain"
                    unoptimized
                    priority
                  />
                  
                  {/* Fabric Scanning Light Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent mix-blend-overlay opacity-30 transform -skew-x-12 translate-x-[200%] group-hover:translate-x-[-200%] transition-transform duration-[3s]" />
                </div>
                
                {/* The Glossy Floor Reflection */}
                <div 
                  className="absolute inset-0 z-0 pointer-events-none opacity-10" 
                  style={{ 
                    transform: 'translateY(85%) scaleY(-1)', 
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 20%, rgba(0,0,0,1) 100%)', 
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 20%, rgba(0,0,0,1) 100%)' 
                  }}
                >
                  <Image 
                    src={p.image}
                    alt={`${p.name} reflection`}
                    fill
                    className="object-contain"
                    unoptimized
                    priority
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Large Bold Names Container (Pushed Up & Centered Perfectly) */}
          <div className="absolute bottom-[20%] w-full flex flex-col items-center justify-center pointer-events-none z-30">
            {PRODUCTS.map((p, i) => {
              const nameParts = p.name.split(' ');
              const hasTee = nameParts[nameParts.length - 1].toUpperCase() === 'TEE';
              const baseName = hasTee ? nameParts.slice(0, -1).join(' ') : p.name;
              const chars = baseName.split('');

              return (
                <div 
                  key={`name-${p.id}`}
                  ref={el => { productNamesRef.current[i] = el; }}
                  className="absolute w-full flex flex-col items-center opacity-0"
                >
                  <h3 
                    className="flex text-2xl md:text-3xl text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] px-4 py-2 items-end" 
                    style={{ marginRight: '-0.2em' }}
                  >
                    <span className="font-serif tracking-[0.2em] uppercase" style={{ fontVariant: 'small-caps' }}>
                      {chars.map((char, charIdx) => (
                        <span key={charIdx} className="char inline-block" style={{ filter: 'blur(10px)', opacity: 0, transform: 'translateY(15px)' }}>
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </span>
                    <span className="char font-sans italic text-lg md:text-xl font-light tracking-[0.1em] text-white/70 ml-2 mb-[2px]" style={{ filter: 'blur(10px)', opacity: 0, transform: 'translateY(15px)' }}>
                      TEE
                    </span>
                  </h3>
                  <div className="char-line w-12 h-[1px] bg-white/40 mt-1 opacity-0 scale-x-0 origin-center"></div>
                </div>
              );
            })}
          </div>

          {/* Minimal Global Footer */}
          <div 
            ref={brandRef}
            className="absolute bottom-6 w-full flex items-center justify-center pointer-events-none z-30 opacity-0"
          >
            <p className="text-[8px] font-sans tracking-[0.8em] text-white/40 uppercase">
              Mogger Ji Exclusive
            </p>
          </div>

          {/* Strobe Flash Node */}
          <div ref={flashRef} className="absolute inset-0 z-40 bg-white pointer-events-none opacity-0 mix-blend-screen" />

          {/* Master Black Fade (For the start and end of sequence) */}
          <div ref={blackFadeRef} className="absolute inset-0 z-50 bg-black pointer-events-none opacity-1" />
        </div>
      </div>
    </div>
  );
}
