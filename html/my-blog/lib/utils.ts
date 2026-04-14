import {PoemBlock} from '@/type';

function shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}

export function generatePoemBlocks(poems: { text: string, mustL1?: boolean }[]): PoemBlock[] {
  const count = poems.length;
  
  const laneWidth = 100 / count; 
  
  const laneIndices = Array.from({ length: count }, (_, i) => i);
  const shuffledLanes = laneIndices.sort(() => Math.random() - 0.5);

  const perLayer = Math.ceil(count / 3);
  const layerPool = laneIndices.map(i => (Math.floor(i / perLayer) + 1) as 1|2|3).sort(() => Math.random() - 0.5);

  return poems.map((poem, index) => {
    const laneIndex = shuffledLanes[index];
    const layer = poem.mustL1 ? 1 : layerPool[index];

    const left = (laneIndex * laneWidth) + (Math.random() * (laneWidth * 0.4));
    
    const topBase = Math.random() * 30; 
    const top = topBase;

    return {
      text: poem.text,
      layer,
      style: {
        left: `${left}%`,
        top: `${top}%`,
      }
    };
  });
}