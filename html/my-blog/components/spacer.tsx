export function Spacer({ h = 8 }: { h?: number | string }) {
  return (
    <span 
      className="block w-full" 
      style={{ height: `${Number(h) * 0.25}rem` }} 
      aria-hidden="true" 
    />
  );
}