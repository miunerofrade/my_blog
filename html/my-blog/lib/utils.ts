import {PoemBlock} from '@/type';

function shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}

export function generatePoemBlocks(poems: { text: string, mustL1?: boolean }[]): PoemBlock[] {
  const count = poems.length;
  
  const laneIndices = Array.from({ length: count }, (_, i) => i);
  const shuffledLanes = laneIndices.sort(() => Math.random() - 0.5);

  const perLayer = Math.ceil(count / 3);
  const layerPool = laneIndices.map(i => (Math.floor(i / perLayer) + 1) as 1|2|3).sort(() => Math.random() - 0.5);

  return poems.map((poem, index) => {
    const laneIndex = shuffledLanes[index];
    const layer = poem.mustL1 ? 1 : layerPool[index];

    const isRightSide = index >= count / 2;
    
    let left = 0;
    if (!isRightSide) {
      const leftZoneWidth = 35;
      const normalizedIndex = index / (count / 2); 
      left = normalizedIndex * leftZoneWidth;
    } else {
      const rightZoneWidth = 35;
      const normalizedIndex = (index - count / 2) / (count / 2);
      left = 65 + (normalizedIndex * rightZoneWidth);
    }

    left += (Math.random() - 0.5) * 5; 

    const topBase = Math.random() * 40 ; 

    return {
      text: poem.text,
      layer,
      style: {
        left: `${left}%`,
        top: `${topBase}%`,
      }
    };
  });
}
