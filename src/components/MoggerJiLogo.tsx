import React from 'react';

interface MoggerJiLogoProps {
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
}

export function MoggerJiLogo({ className = '', style, animated = false }: MoggerJiLogoProps) {
  const fill = "#F4EFE3";
  const stroke = "#050505";
  const strokeW = 14;

  return (
    <svg 
      className={`mogger-ji-logo ${className}`} 
      style={style} 
      viewBox="0 0 1020 340" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <g className="logo-wordmark" stroke={stroke} strokeWidth={strokeW} fill={fill}>
        {/* M */}
        <path 
          className="logo-m" 
          d="M 20 260 L 40 40 L 75 40 L 105 130 L 135 40 L 175 40 L 195 260 L 145 260 L 130 140 L 105 190 L 80 140 L 65 260 Z" 
        />
        
        {/* O */}
        <path 
          className="logo-o" 
          d="M 230 40 L 290 40 Q 330 40 330 70 L 330 230 Q 330 260 290 260 L 230 260 Q 190 260 190 230 L 190 70 Q 190 40 230 40 Z M 240 80 L 280 80 Q 285 80 285 90 L 285 210 Q 285 220 280 220 L 240 220 Q 235 220 235 210 L 235 90 Q 235 80 240 80 Z" 
          fillRule="evenodd"
        />
        
        {/* G 1 */}
        <path 
          className="logo-g-1" 
          d="M 380 40 L 440 40 Q 465 40 465 65 L 465 110 L 415 110 L 415 85 L 385 85 L 385 215 L 415 215 L 415 155 L 385 155 L 385 115 L 465 115 L 465 235 Q 465 260 440 260 L 380 260 Q 340 260 340 230 L 340 70 Q 340 40 380 40 Z" 
        />

        {/* G 2 */}
        <path 
          className="logo-g-2" 
          d="M 525 38 L 585 42 Q 610 45 610 70 L 610 112 L 560 110 L 560 85 L 530 83 L 525 215 L 555 215 L 560 155 L 530 155 L 530 115 L 610 118 L 605 238 Q 600 263 575 260 L 515 258 Q 475 255 475 225 L 485 65 Q 490 35 525 38 Z" 
        />

        {/* E */}
        <path 
          className="logo-e" 
          d="M 635 40 L 710 40 L 705 85 L 675 85 L 670 125 L 700 125 L 695 170 L 665 170 L 660 215 L 705 215 L 700 260 L 620 260 Z" 
        />

        {/* R */}
        <path 
          className="logo-r" 
          d="M 740 40 L 805 40 Q 840 40 840 80 L 840 120 Q 840 160 805 160 L 775 160 L 825 260 L 775 260 L 735 175 L 725 260 L 675 260 L 695 40 Z M 745 80 L 785 80 Q 795 80 795 90 L 795 110 Q 795 120 785 120 L 735 120 Z" 
          fillRule="evenodd"
        />

        {/* J */}
        <path 
          className="logo-j" 
          d="M 870 40 L 920 40 L 910 190 Q 905 260 850 260 Q 810 260 810 220 L 810 190 L 855 190 L 855 210 Q 855 220 865 220 Q 875 220 875 190 Z" 
        />

        {/* I */}
        <path 
          className="logo-i" 
          d="M 945 40 L 985 40 L 975 260 L 935 260 Z" 
        />
      </g>

      {/* TM Mark */}
      <text 
        className="logo-tm" 
        x="1010" 
        y="55" 
        fontSize="24" 
        fontWeight="900" 
        fontFamily="sans-serif"
        textAnchor="end"
        fill={fill} 
        stroke={stroke} 
        strokeWidth="6"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        TM
      </text>

      {/* Subtitle */}
      <text 
        className="logo-subtitle" 
        x="510" 
        y="320" 
        textAnchor="middle" 
        fontSize="24" 
        fontWeight="900" 
        fontFamily="sans-serif"
        letterSpacing="0.4em" 
        fill={fill} 
        stroke={stroke} 
        strokeWidth="8"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        INDIAN INTERNET STREETWEAR
      </text>
    </svg>
  );
}
