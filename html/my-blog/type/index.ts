export interface PoemBlock {
  text: string; 
  mustL1?: boolean;
  layer: 1 | 2 | 3;      
  style: {
    left: string;         
    top: string;          
  };
}