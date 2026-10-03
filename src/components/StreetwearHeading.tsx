import React, { useMemo } from 'react';

interface StreetwearHeadingProps {
  text: string;
  className?: string;
}

export function StreetwearHeading({ text, className = '' }: StreetwearHeadingProps) {
  // Deterministic pseudo-random based on string and index to prevent SSR hydration mismatch
  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const { dy, rotate } = useMemo(() => {
    const chars = text.split('');
    const baseSeed = text.charCodeAt(0) + text.length;
    
    return {
      // Small vertical shifts for each character
      dy: chars.map((_, i) => (pseudoRandom(baseSeed + i) * 8 - 4).toFixed(1)).join(' '),
      // Small rotations for each character (in degrees)
      rotate: chars.map((_, i) => (pseudoRandom(baseSeed + i + 100) * 8 - 4).toFixed(1)).join(' ')
    };
  }, [text]);

  // Approximate width per character for the Bangers font at fontSize="140"
  const svgWidth = text.length * 68 + 40; // 40px extra padding for the heavy stroke on ends

  return (
    <div className={`relative flex items-center justify-center md:justify-start w-full ${className}`}>
      <svg 
        viewBox={`0 0 ${svgWidth} 200`}
        className="w-full h-auto overflow-visible drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] max-w-full"
      >
        <text
          x="20"
          y="50%"
          textAnchor="start"
          dominantBaseline="central"
          fontSize="140"
          fontWeight="400"
          letterSpacing="0.05em"
          style={{
            fontFamily: 'var(--font-bangers)',
            fill: '#F4EFE3',
            stroke: '#050505',
            strokeWidth: '12px',
            strokeLinejoin: 'round',
            strokeLinecap: 'round',
            paintOrder: 'stroke fill',
          }}
        >
          <tspan dy={dy} rotate={rotate}>{text}</tspan>
        </text>
      </svg>
    </div>
  );
}
