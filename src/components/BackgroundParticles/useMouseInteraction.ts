// components/BackgroundParticles/useMouseInteraction.ts
import { useEffect } from "react";

export function useMouseInteraction(
  mouseRef: React.MutableRefObject<{ x: number; y: number }>,
  setIsMouseDown: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseRef, setIsMouseDown]);
}
