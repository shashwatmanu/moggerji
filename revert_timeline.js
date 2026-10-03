const fs = require('fs');
let code = fs.readFileSync('src/app/reel-studio/page.tsx', 'utf8');

// Replace getDioramaProps with getCoverFlowProps
code = code.replace(/const getDioramaProps[\s\S]*?};\s+};\s+const playSequence/, `const getCoverFlowProps = (index: number, centerIndex: number) => {
    let diff = index - centerIndex;
    if (diff > 2) diff -= PRODUCTS.length;
    if (diff < -2) diff += PRODUCTS.length;
    const absDiff = Math.abs(diff);

    if (diff === 0) {
      return { x: 0, z: 0, scale: 1.25, opacity: 1, rotateY: 0, filter: 'blur(0px)' };
    }
    
    const sign = Math.sign(diff);
    return {
      x: sign * (280 + absDiff * 180),
      z: -800 - absDiff * 400,
      scale: 1,
      rotateY: diff > 0 ? -60 : 60,
      filter: \`blur(\${absDiff * 15}px)\`,
      opacity: 1 - (absDiff * 0.25)
    };
  };

  const playSequence`);

// Revert playSequence logic
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
    
    const finalStamp = document.querySelector('.final-stamp');
    if (finalStamp) {
      gsap.set(finalStamp, { opacity: 0 });
      gsap.set(finalStamp.querySelectorAll('.char'), { opacity: 0, y: 15, filter: 'blur(10px)' });
    }

    // ==========================================
    // PART 1: THE DROP
    // ==========================================
    const hero = productsRef.current[activeProductIndex];
    const heroName = productNamesRef.current[activeProductIndex];
    const prodData = PRODUCTS[activeProductIndex];

    // Master fade in from black
    tl.to(blackFadeRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 0);

    // Initial environment set based on selected meme
    tl.to(bgRef.current, { backgroundColor: prodData.bg, duration: 1 }, 0);
    tl.to(tintRef.current, { backgroundColor: prodData.tint, opacity: 1, duration: 1 }, 0);

    // Dolly-Zoom on BG
    tl.fromTo(bgRef.current,
      { scale: 1.0 },
      { scale: 1.15, duration: 4, ease: 'sine.out' },
      0
    );

    // Hero Shirt SLAMS in
    tl.fromTo(hero, 
      { opacity: 0, scale: 1.5, x: 0, z: 200, filter: 'blur(30px)', rotateY: -30, rotateX: 10 },
      { opacity: 1, scale: 0.95, x: 0, z: 0, filter: 'blur(0px)', rotateY: 10, rotateX: 0, duration: 1.2, ease: 'expo.out' },
      0
    );

    // Hero Name fades in (staggered)
    if (heroName) {
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
    }

    // Hero breathes and floats for the meme hold
    tl.to(hero, {
      rotateY: -5,
      rotateX: -2,
      scale: 1.0,
      duration: 2.8,
      ease: 'sine.inOut'
    }, 1.2);

    // ==========================================
    // PART 2: THE COVER FLOW REVEAL
    // ==========================================
    let time = 4.0;
    const slideDuration = 0.8;
    const swipeDuration = 0.6;

    // Camera pulls back slowly while other shirts fly in from the darkness
    tl.to(canvasRef.current, { z: -350, y: -50, duration: 2.0, ease: 'power3.inOut' }, time);
    
    // Environment dims slightly for the carousel
    tl.to(tintRef.current, { opacity: 0.6, duration: 1.5, ease: 'power2.inOut' }, time);

    // All shirts snap to their Cover Flow positions
    PRODUCTS.forEach((_, i) => {
      const shirt = productsRef.current[i];
      if (!shirt) return;
      const props = getCoverFlowProps(i, activeProductIndex);
      
      if (i === activeProductIndex) {
        tl.to(shirt, { ...props, duration: 1.5, ease: 'power3.inOut' }, time);
      } else {
        tl.fromTo(shirt,
          { ...props, z: props.z - 500, opacity: 0, filter: 'blur(30px)' },
          { ...props, opacity: 1, duration: 1.5, ease: 'power3.out' },
          time + 0.2
        );
      }
    });

    time += 2.0;

    // ==========================================
    // PART 3: SWIPING THROUGH THE COLLECTION
    // ==========================================
    let currentCenterIndex = activeProductIndex;
    
    // Swipe through 2 random other items
    for (let step = 0; step < 2; step++) {
      const prevCenterIndex = currentCenterIndex;
      currentCenterIndex = (currentCenterIndex + 1) % PRODUCTS.length;
      
      const prevName = productNamesRef.current[prevCenterIndex];
      const newName = productNamesRef.current[currentCenterIndex];
      const prodData = PRODUCTS[currentCenterIndex];

      // Shift the environment color to match the new center item
      tl.to(bgRef.current, { backgroundColor: prodData.bg, duration: swipeDuration, ease: 'power2.inOut' }, time);
      tl.to(tintRef.current, { backgroundColor: prodData.tint, duration: swipeDuration, ease: 'power2.inOut' }, time);

      // Snap out old name (reverse stagger)
      if (prevName) {
        const prevChars = prevName.querySelectorAll('.char');
        const prevLine = prevName.querySelector('.char-line');
        tl.to(prevChars, { opacity: 0, x: -20, filter: 'blur(5px)', duration: swipeDuration * 0.6, stagger: 0.02, ease: 'power2.in' }, time);
        tl.to(prevLine, { opacity: 0, scaleX: 0, duration: swipeDuration * 0.5, ease: 'power2.in' }, time);
      }

      // Animate all shirts to their new Cover Flow positions
      PRODUCTS.forEach((_, i) => {
        const shirt = productsRef.current[i];
        if (!shirt) return;
        const props = getCoverFlowProps(i, currentCenterIndex);
        
        // Add optical swipe rotational whip
        tl.fromTo(shirt,
          { rotateY: getCoverFlowProps(i, prevCenterIndex).rotateY },
          { rotateY: props.rotateY - (i > currentCenterIndex ? -20 : 20), duration: swipeDuration / 2, ease: 'power2.in', yoyo: true, repeat: 1 },
          time
        );

        // Use a punchy expo ease for the swipe
        tl.to(shirt, { ...props, duration: swipeDuration, ease: 'expo.inOut' }, time);
      });

      // Snap in new name (stagger)
      if (newName) {
        const newChars = newName.querySelectorAll('.char');
        const newLine = newName.querySelector('.char-line');
        tl.to(newName, { opacity: 1, duration: 0.1 }, time + 0.1);
        tl.fromTo(newChars,
          { opacity: 0, x: 30, y: 0, filter: 'blur(10px)' },
          { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', duration: swipeDuration * 1.2, stagger: 0.03, ease: 'expo.out' },
          time + 0.2
        );
        tl.fromTo(newLine,
          { opacity: 0, scaleX: 0 },
          { opacity: 1, scaleX: 1, duration: swipeDuration, ease: 'expo.out' },
          time + 0.3
        );
      }

      time += swipeDuration;

      // Small breathe on the center item
      const centerShirt = productsRef.current[currentCenterIndex];
      if (centerShirt) {
        tl.to(centerShirt, { scale: 1.28, duration: slideDuration, ease: 'none' }, time);
      }

      time += slideDuration;
    }
    
    // Final pull back and fade out names for the brand stamp
    time += 0.5;
    const finalCenterName = productNamesRef.current[currentCenterIndex];
    if (finalCenterName) {
      const chars = finalCenterName.querySelectorAll('.char');
      const line = finalCenterName.querySelector('.char-line');
      tl.to(chars, { opacity: 0, filter: 'blur(5px)', duration: 0.5, stagger: 0.02, ease: 'power2.in' }, time);
      tl.to(line, { opacity: 0, scaleX: 0, duration: 0.4 }, time);
    }
    
    tl.to(canvasRef.current, { z: -450, duration: 2.0, ease: 'power3.inOut' }, time);
    tl.to(bgRef.current, { backgroundColor: '#020202', duration: 1.5 }, time);
    tl.to(tintRef.current, { opacity: 0.2, duration: 1.5 }, time);
    
    time += 1.0;
    if (finalStamp) {
      const stampChars = finalStamp.querySelectorAll('.char');
      tl.to(finalStamp, { opacity: 1, duration: 0.1 }, time);
      tl.fromTo(stampChars,
        { opacity: 0, y: 15, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.04, ease: 'expo.out' },
        time
      );
    }
    
    time += 2.0;

    // ==========================================
    // PART 4: THE END
    // ==========================================
    // Final Fade to Black
    tl.to(blackFadeRef.current, { opacity: 1, duration: 0.6, ease: 'power2.in' }, time);
  });

  `;

code = code.substring(0, playSequenceStart) + playSequenceLogic + code.substring(playSequenceEnd);

fs.writeFileSync('src/app/reel-studio/page.tsx', code);
