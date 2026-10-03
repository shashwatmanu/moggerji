"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export type Tab = "SIZING" | "RETURNS" | "CONTACT";

export default function InfoOverlay({
  isOpen,
  onClose,
  initialTab = "SIZING"
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: Tab;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync initial tab when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, display: "flex", duration: 0.4, ease: "power2.out" });
      gsap.fromTo(contentRef.current, { y: 150, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.75)", delay: 0.1 });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, display: "none", duration: 0.3, ease: "power2.in" });
    }
  }, [isOpen]);

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[120] hidden items-center justify-center bg-black/95 backdrop-blur-xl font-sans text-white"
    >
      <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <button 
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center hover:bg-white hover:text-black transition-colors z-20 cursor-magnetic"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div ref={contentRef} className="relative z-10 w-full max-w-4xl p-6 md:p-12 flex flex-col items-center">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 md:gap-12 border-b-2 border-white/20 pb-6 mb-12 w-full justify-center">
          {(["SIZING", "RETURNS", "CONTACT"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-serif font-black tracking-tighter text-2xl md:text-5xl uppercase transition-all duration-300 ${activeTab === tab ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "text-white/20 hover:text-white/60"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-center">
          
          {activeTab === "SIZING" && (
            <div className="w-full max-w-2xl">
              <h3 className="text-xl font-bold tracking-widest uppercase mb-8 text-white/50">OVERSIZED DROP-SHOULDER FIT</h3>
              <div className="grid grid-cols-4 gap-2 md:gap-4 font-bold text-sm md:text-base text-center">
                <div className="bg-white/10 p-4 border border-white/20">SIZE</div>
                <div className="bg-white/10 p-4 border border-white/20">CHEST</div>
                <div className="bg-white/10 p-4 border border-white/20">LENGTH</div>
                <div className="bg-white/10 p-4 border border-white/20">SLEEVE</div>
                
                <div className="bg-black/50 p-4 border border-white/10">S</div>
                <div className="bg-black/50 p-4 border border-white/10">44"</div>
                <div className="bg-black/50 p-4 border border-white/10">28"</div>
                <div className="bg-black/50 p-4 border border-white/10">9"</div>
                
                <div className="bg-black/50 p-4 border border-white/10">M</div>
                <div className="bg-black/50 p-4 border border-white/10">46"</div>
                <div className="bg-black/50 p-4 border border-white/10">29"</div>
                <div className="bg-black/50 p-4 border border-white/10">9.5"</div>
                
                <div className="bg-black/50 p-4 border border-white/10 text-white/50">L</div>
                <div className="bg-black/50 p-4 border border-white/10 text-white/50">48"</div>
                <div className="bg-black/50 p-4 border border-white/10 text-white/50">30"</div>
                <div className="bg-black/50 p-4 border border-white/10 text-white/50">10"</div>
                
                <div className="bg-black/50 p-4 border border-white/10 text-white/30">XL</div>
                <div className="bg-black/50 p-4 border border-white/10 text-white/30">50"</div>
                <div className="bg-black/50 p-4 border border-white/10 text-white/30">31"</div>
                <div className="bg-black/50 p-4 border border-white/10 text-white/30">10.5"</div>
              </div>
            </div>
          )}

          {activeTab === "RETURNS" && (
            <div className="w-full max-w-xl">
              <h3 className="text-4xl font-serif font-black tracking-tighter uppercase mb-6 text-red-500">NO CAP. JUST FACTS.</h3>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
                Every Mogger Ji tee is strictly print-on-demand to maintain exclusivity. Because of this, we only accept returns or exchanges if there is a <span className="text-white font-bold">manufacturing defect</span> or <span className="text-white font-bold">shipping damage</span>.
              </p>
              <div className="p-6 bg-white/5 border-l-4 border-red-500 text-left">
                <p className="font-bold tracking-widest uppercase text-sm mb-2 text-white/50">THE POLICY:</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-white/80 font-medium">
                  <li>Size issues are non-refundable. Measure twice, order once.</li>
                  <li>Defects must be reported within 7 days of delivery.</li>
                  <li>Email us a photo of the defect, and we'll replace it immediately.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "CONTACT" && (
            <div className="w-full max-w-lg">
              <h3 className="text-4xl font-serif font-black tracking-tighter uppercase mb-6">TRANSMIT SIGNAL.</h3>
              <p className="text-white/50 mb-10 text-lg">Don't spam. Only reach out if absolutely necessary.</p>
              
              <a href="mailto:hello@moggerji.com" className="group relative overflow-hidden inline-flex items-center justify-center px-12 py-6 bg-white text-black font-black uppercase tracking-widest text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] hover:animate-[glitch_0.3s_ease-in-out_infinite] cursor-magnetic">
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  HELLO@MOGGERJI.COM
                </span>
                <div className="absolute inset-0 bg-red-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
