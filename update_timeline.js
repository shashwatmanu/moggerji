const fs = require('fs');
let code = fs.readFileSync('src/app/reel-studio/page.tsx', 'utf8');

// Replace getCoverFlowProps
code = code.replace(/const getCoverFlowProps[\s\S]*?};\s+};\s+const playSequence/, `const getDioramaProps = (index: number) => {
    const DIORAMA_POSITIONS = [
      { x: 0, z: 0, scale: 1.1, rotateY: 0, filter: 'blur(0px)' }, // Foreground Anchor
      { x: -300, z: -250, scale: 0.9, rotateY: 20, filter: 'blur(4px)' }, // Mid Left
      { x: 300, z: -250, scale: 0.9, rotateY: -20, filter: 'blur(4px)' }, // Mid Right
      { x: -500, z: -500, scale: 0.8, rotateY: 35, filter: 'blur(10px)' }, // Back Left
      { x: 500, z: -500, scale: 0.8, rotateY: -35, filter: 'blur(10px)' }  // Back Right
    ];
    // Map products to fixed composition positions based on visual weight (not sequence)
    // 0: SYBAU (green) -> Anchor (0)
    // 1: SUPREME (brown) -> Mid Left (1)
    // 2: ICED OUT (purple) -> Mid Right (2)
    // 3: THODA (brown) -> Back Left (3)
    // 4: CHOWKIDAR (black) -> Back Right (4)
    const productToPositionMap = [0, 1, 2, 3, 4];
    return DIORAMA_POSITIONS[productToPositionMap[index]];
  };

  const playSequence`);

// Rewrite playSequence
const playSequenceStart = code.indexOf('const playSequence = contextSafe(() => {');
const playSequenceEnd = code.indexOf('return (', playSequenceStart);
const playSequenceLogic = `const playSequence = contextSafe(() => {
    if (isPlaying) return;
    setIsPlaying(true);

    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Reset everything first
    PRODUCTS.forEach((_, i) => {
      const el = productsRef.current[i];
      if (el) gsap.set(el, { opacity: 0, scale: 0.5, x: 0, y: 0, z: -1000, rotateY: 0, rotateX: 0, filter: 'blur(30px)' });
      
      const textEl = productNamesRef.current[i];
      if (textEl) {
        gsap.set(textEl, { opacity: 0, x: 0, y: 0, scale: 1 });
        const chars = textEl.querySelectorAll('.char');
        const line = textEl.querySelector('.char-line');
        if (chars) gsap.set(chars, { opacity: 0, y: 15, filter: 'blur(10px)' });
        if (line) gsap.set(line, { opacity: 0, scaleX: 0 });
      }
    });
    
    // Hide final stamp
    const finalStamp = document.querySelector('.final-stamp');
    if (finalStamp) {
      gsap.set(finalStamp, { opacity: 0 });
      gsap.set(finalStamp.querySelectorAll('.char'), { opacity: 0, y: 15, filter: 'blur(10px)' });
    }

    // ==========================================
    // PART 1: INDIVIDUAL SHOWCASE (0.0s - 4.0s)
    // ==========================================
    const hero = productsRef.current[activeProductIndex];
    const heroName = productNamesRef.current[activeProductIndex];
    const prodData = PRODUCTS[activeProductIndex];

    tl.to(blackFadeRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 0);
    tl.to(bgRef.current, { backgroundColor: prodData.bg, duration: 1 }, 0);
    tl.to(tintRef.current, { backgroundColor: prodData.tint, opacity: 1, duration: 1 }, 0);

    // Dolly-Zoom on BG
    tl.fromTo(bgRef.current,
      { scale: 1.0 },
      { scale: 1.15, duration: 4, ease: 'sine.out' },
      0
    );

    // Varied Hero Drop
    if (activeProductIndex === 0 || activeProductIndex === 3) {
      // Slow creeping push-in from darkness
      tl.fromTo(hero, 
        { opacity: 0, scale: 0.8, z: -300, filter: 'blur(20px)', rotateY: 0 },
        { opacity: 1, scale: 1.05, z: 0, filter: 'blur(0px)', duration: 2.0, ease: 'power2.out' }, 0);
    } else if (activeProductIndex === 1 || activeProductIndex === 4) {
      // Classic Dolly Slam
      tl.fromTo(hero, 
        { opacity: 0, scale: 1.5, x: 0, z: 200, filter: 'blur(30px)', rotateY: -30, rotateX: 10 },
        { opacity: 1, scale: 0.95, x: 0, z: 0, filter: 'blur(0px)', rotateY: 10, rotateX: 0, duration: 1.2, ease: 'expo.out' }, 0);
    } else {
      // Side Drift
      tl.fromTo(hero, 
        { opacity: 0, scale: 1.0, x: 200, z: 0, filter: 'blur(20px)', rotateY: -20 },
        { opacity: 1, scale: 1.0, x: 0, z: 0, filter: 'blur(0px)', rotateY: 0, duration: 1.5, ease: 'power3.out' }, 0);
    }

    // Hero Name fades in (staggered)
    const heroChars = heroName.querySelectorAll('.char');
    const heroLine = heroName.querySelector('.char-line');
    
    tl.to(heroName, { opacity: 1, duration: 0.1 }, 0.5);
    tl.to(heroChars, {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.05,
      ease: 'back.out(1.5)'
    }, 0.5);
    tl.to(heroLine, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'expo.out' }, 0.8);

    // Hero breathes
    tl.to(hero, { rotateY: 0, rotateX: -2, scale: 1.0, duration: 2.8, ease: 'sine.inOut' }, 1.2);

    // ==========================================
    // PART 2: DIORAMA REVEAL (4.0s - 5.5s)
    // ==========================================
    let time = 4.0;
    
    // Pull back camera
    tl.to(canvasRef.current, { z: -400, y: -50, duration: 1.8, ease: 'power3.inOut' }, time);
    
    // Darken background for cinematic contrast
    tl.to(tintRef.current, { opacity: 0.4, duration: 1.5, ease: 'power2.inOut' }, time);
    tl.to(bgRef.current, { backgroundColor: '#020202', duration: 1.5, ease: 'power2.inOut' }, time);
    
    // Fade out hero name cleanly
    tl.to(heroChars, { opacity: 0, filter: 'blur(5px)', duration: 0.5, stagger: 0.02, ease: 'power2.in' }, time);
    tl.to(heroLine, { opacity: 0, scaleX: 0, duration: 0.4 }, time);

    // All 5 products transition to their absolute diorama positions
    PRODUCTS.forEach((_, i) => {
      const shirt = productsRef.current[i];
      if (!shirt) return;
      const props = getDioramaProps(i);
      
      if (i === activeProductIndex) {
        // Hero smoothly transitions from its solo spot to the diorama spot
        tl.to(shirt, { ...props, opacity: 1, duration: 1.8, ease: 'power3.inOut' }, time);
      } else {
        // Others emerge from darkness
        tl.fromTo(shirt,
          { ...props, z: props.z - 500, opacity: 0, filter: 'blur(30px)' },
          { ...props, opacity: 1, duration: 1.8, ease: 'power3.out' },
          time + 0.2
        );
      }
    });

    // Slow cinematic camera push over the settled diorama (gives them time to look at the composition)
    tl.to(canvasRef.current, { z: -350, duration: 3.5, ease: 'none' }, time + 1.8);

    // ==========================================
    // PART 3: FINAL BRAND STAMP (5.5s - 7.5s)
    // ==========================================
    time = 5.5;
    
    if (finalStamp) {
      const stampChars = finalStamp.querySelectorAll('.char');
      tl.to(finalStamp, { opacity: 1, duration: 0.1 }, time);
      tl.fromTo(stampChars,
        { opacity: 0, y: 15, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.04, ease: 'expo.out' },
        time
      );
    }

    // ==========================================
    // PART 4: THE END
    // ==========================================
    tl.to(blackFadeRef.current, { opacity: 1, duration: 0.6, ease: 'power2.in' }, 7.5);
  });

  `;

code = code.substring(0, playSequenceStart) + playSequenceLogic + code.substring(playSequenceEnd);

// Add the final stamp UI and remove brandRef
code = code.replace(/\{\/\* Minimal Global Footer \*\/\}[\s\S]*?<\/div>/, `
          {/* FINAL BRAND STAMP */}
          <div className="final-stamp absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 opacity-0">
            <h2 className="font-serif text-5xl md:text-6xl tracking-[0.3em] uppercase text-white drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] text-center mt-12">
              {'MOGGER JI'.split('').map((char, i) => (
                <span key={i} className="char inline-block">{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </h2>
            <div className="char h-[1px] w-24 bg-white/40 my-4"></div>
            <p className="font-sans text-xs tracking-[1em] text-white/60 uppercase">
              {'VOL. 01'.split('').map((char, i) => (
                <span key={i} className="char inline-block">{char === ' ' ? '\u00A0' : char}</span>
              ))}
            </p>
          </div>
`);

// Also update resetScene to handle final-stamp
code = code.replace(/gsap\.set\(brandRef\.current, \{ opacity: 0, y: 10 \}\);/, `const finalStamp = document.querySelector('.final-stamp');
    if (finalStamp) gsap.set(finalStamp, { opacity: 0 });`);

// Fix the "const brandRef = useRef<HTMLDivElement>(null);" as it's no longer needed
code = code.replace(/const brandRef = useRef<HTMLDivElement>\(null\);\n/, '');

fs.writeFileSync('src/app/reel-studio/page.tsx', code);
