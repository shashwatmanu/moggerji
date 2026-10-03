"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    // Follow mouse
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });
    };

    // Magnetic snap on interactive elements
    const interactiveElements = document.querySelectorAll(".cursor-drag");

    const onMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const isDrag = target.classList.contains("cursor-drag");

      if (isDrag) {
        gsap.to(cursor, {
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderColor: "rgba(255, 255, 255, 1)",
          mixBlendMode: "normal",
          duration: 0.3,
          ease: "power3.out",
        });
        if (cursorTextRef.current) {
          cursorTextRef.current.innerText = "DRAG";
          gsap.to(cursorTextRef.current, { opacity: 1, duration: 0.2 });
        }
      } else {
        // Expand cursor and snap to center of target
        gsap.to(cursor, {
          width: rect.width + 20,
          height: rect.height + 20,
          borderRadius: "20px",
          x: centerX,
          y: centerY,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0)",
          duration: 0.3,
          ease: "power3.out",
        });
      }
      
      gsap.to(dot, {
        scale: 0,
        duration: 0.2,
      });
    };

    const onMouseLeave = () => {
      // Revert cursor back to circle
      gsap.to(cursor, {
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderColor: "rgba(255, 255, 255, 0.5)",
        mixBlendMode: "difference",
        duration: 0.3,
        ease: "power3.out",
      });

      if (cursorTextRef.current) {
        gsap.to(cursorTextRef.current, { opacity: 0, duration: 0.2 });
      }

      gsap.to(dot, {
        scale: 1,
        duration: 0.2,
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  if (pathname === '/reel-studio') return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center mix-blend-difference"
      >
        <span ref={cursorTextRef} className="text-black font-black text-[10px] tracking-widest opacity-0 uppercase"></span>
      </div>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 hidden md:block mix-blend-difference"
      />
    </>
  );
}
