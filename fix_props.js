const fs = require('fs');
let code = fs.readFileSync('src/app/reel-studio/page.tsx', 'utf8');

const startIdx = code.indexOf('const getDioramaProps = (index: number) => {');
const endIdx = code.indexOf('  const playSequence = contextSafe(() => {');

const replacement = `const getCoverFlowProps = (index: number, centerIndex: number) => {
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

`;

code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
fs.writeFileSync('src/app/reel-studio/page.tsx', code);
