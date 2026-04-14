"use client";

import {useState, useEffect} from 'react';
import { PoemBlock } from '@/type';
import { generatePoemBlocks } from '@/lib/utils';
import poems from '@/data/poems.json';

export default function Home() {
  const [poemBlocks, setPoemBlocks] = useState<PoemBlock[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    setPoemBlocks(generatePoemBlocks(poems));
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
  <main onMouseMove={handleMouseMove} className="relative w-screen h-screen bg-[#f4f4f2] overflow-hidden font-brush">
    
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{

        WebkitMaskImage: `radial-gradient(16rem circle at ${mousePos.x}px ${mousePos.y}px, transparent 80%, black 100%)`,
        maskImage: `radial-gradient(16rem circle at ${mousePos.x}px ${mousePos.y}px, transparent 80%, black 100%)`,
      }}
    >
      {poemBlocks.map((b, i) => (
        <div key={`black-${i}`} style={b.style} 
          className={`absolute [writing-mode:vertical-rl] whitespace-nowrap text-ink/90 
              ${b.layer === 3 ? 'blur-[3px] scale-125 text-[clamp(2rem,2vw,3rem)]' : ''}
              ${b.layer === 2 ? 'blur-[2px] scale-125 text-[clamp(2rem,2vw,3rem)]' : ''}
              ${b.layer === 1 ? 'blur-[1px] scale-125 text-[clamp(3rem,3vw,4rem)]' : ''}`}
          >{b.text}
        </div>
      ))}
    </div>

    <div 
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        WebkitMaskImage: `radial-gradient(16rem circle at ${mousePos.x}px ${mousePos.y}px, black 80%, transparent 100%)`,
        maskImage: `radial-gradient(16rem circle at ${mousePos.x}px ${mousePos.y}px, black 80%, transparent 100%)`,
      }}
    >
      {poemBlocks.map((b, i) => (
        <div key={`gold-${i}`} style={b.style} 
          className={`absolute [writing-mode:vertical-rl] whitespace-nowrap text-[#deba46] 
              ${b.layer === 3 ? 'blur-[3px] scale-125 text-[clamp(2rem,2vw,3rem)]' : ''}
              ${b.layer === 2 ? 'blur-[2px] scale-125 text-[clamp(2rem,2vw,3rem)]' : ''}
              ${b.layer === 1 ? 'blur-[1px] scale-125 text-[clamp(3rem,3vw,4rem)]'  : ''}`} 
          >
          {b.text}
        </div>
      ))}
    </div>

  </main> 
);
}