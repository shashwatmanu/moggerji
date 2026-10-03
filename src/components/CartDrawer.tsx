"use client";

import { useCart } from "@/context/CartContext";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CartDrawer() {
  const pathname = usePathname();
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isCartOpen) {
      gsap.to(overlayRef.current, { opacity: 1, display: "block", duration: 0.4, ease: "power2.out" });
      gsap.to(drawerRef.current, { x: "0%", duration: 0.6, ease: "power3.out" }); // Removed elastic bounce that escapes viewport
      if (items.length > 0) {
        gsap.fromTo(itemRefs.current, 
          { x: 50, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.2 }
        );
      }
    } else {
      gsap.to(overlayRef.current, { opacity: 0, display: "none", duration: 0.3, ease: "power2.in" });
      gsap.to(drawerRef.current, { x: "100%", duration: 0.5, ease: "power3.inOut" });
    }
  }, [isCartOpen]);

  const handleCheckout = () => {
    alert("Checkout initiated! (Integration with Qikink pending payment gateway)");
  };

  return (
    <>
      <div 
        ref={overlayRef} 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] hidden opacity-0"
        onClick={() => setIsCartOpen(false)}
      />
      
      <div 
        ref={drawerRef}
        className="fixed top-0 right-0 h-[100dvh] w-full max-w-[100vw] md:w-[450px] bg-black border-l-4 border-white/20 z-[110] transform translate-x-full flex flex-col font-sans text-white"
      >
        {/* Dynamic Cart Background Engine */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30 mix-blend-screen">
          <div 
            className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-no-repeat bg-cover bg-center animate-[spin_60s_linear_infinite]"
            style={{ backgroundImage: 'url(/tiedye.jpg)' }}
          />
        </div>
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        <div className="p-6 md:p-8 flex items-center justify-between border-b-2 border-white/20 relative z-10">
          <h2 className="text-3xl font-serif font-black tracking-tighter uppercase drop-shadow-md">CART <span className="text-white/40">[{items.length}]</span></h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 relative z-10">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-white/40">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="font-serif font-black tracking-tighter uppercase text-xl mt-4">YOUR CART IS EMPTY</p>
              <div className="w-full overflow-hidden mt-4 bg-white text-black py-2 whitespace-nowrap transform -rotate-2">
                <div className="inline-block animate-[marquee_4s_linear_infinite] font-black tracking-widest text-[10px]">
                  MOGGER JI AWAITS • MOGGER JI AWAITS • MOGGER JI AWAITS • MOGGER JI AWAITS • MOGGER JI AWAITS • MOGGER JI AWAITS •
                </div>
              </div>
            </div>
          ) : (
            items.map((item, index) => (
              <div 
                key={item.id} 
                ref={(el) => { itemRefs.current[index] = el; }}
                className="flex gap-4 p-4 bg-white/5 border border-white/10 relative group hover:border-white/30 transition-colors"
              >
                <div className="w-24 h-28 relative bg-black/60 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-2 scale-125" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-serif font-black text-sm md:text-base tracking-tighter uppercase line-clamp-2 leading-tight">{item.title}</h3>
                    <p className="text-[10px] text-white/50 mt-1 uppercase font-bold tracking-widest">SIZE: {item.size}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 bg-black border border-white/20 px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-white/50 hover:text-white px-2 font-bold">-</button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-white/50 hover:text-white px-2 font-bold">+</button>
                    </div>
                    <p className="font-serif font-black text-lg tracking-tight">₹{item.price * item.quantity}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 md:p-8 border-t-2 border-white/20 bg-black relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Subtotal</span>
              <span className="font-serif font-black text-2xl tracking-tighter">₹{totalPrice}</span>
            </div>
            
            {/* Magic Cart Progress Bar */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] sm:text-[10px] tracking-wider font-bold uppercase mb-2 gap-1">
                <span className={items.reduce((acc, curr) => acc + curr.quantity, 0) >= 3 ? "text-green-400" : "text-white/50"}>
                  {items.reduce((acc, curr) => acc + curr.quantity, 0) < 3 
                    ? `ADD ${3 - items.reduce((acc, curr) => acc + curr.quantity, 0)} FOR BUNDLE 1` 
                    : (items.reduce((acc, curr) => acc + curr.quantity, 0) < 5 
                        ? `🔥 BUNDLE 1 - ADD ${5 - items.reduce((acc, curr) => acc + curr.quantity, 0)} FOR ULTIMATE` 
                        : "✨ ULTIMATE BUNDLE UNLOCKED")}
                </span>
                <span className="text-white/30 text-right">{items.reduce((acc, curr) => acc + curr.quantity, 0)}/5</span>
              </div>
              <div className="w-full h-1 bg-white/10 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${Math.min((items.reduce((acc, curr) => acc + curr.quantity, 0) / 5) * 100, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
                </div>
                {/* Milestone Markers */}
                <div className="absolute top-0 bottom-0 left-[60%] w-px bg-black z-10"></div>
                <div className="absolute top-0 bottom-0 right-0 w-px bg-black z-10"></div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="cursor-magnetic group relative overflow-hidden w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                CHECKOUT NOW
              </span>
              <div className="absolute inset-0 bg-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
