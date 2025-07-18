// components/BackgroundParticles/useParticleSystem.ts
import { useEffect } from "react";
import { initParticles, drawParticles, updateParticles } from "./utils/particles";

export function useParticleSystem(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  mouse: React.MutableRefObject<{ x: number; y: number }>,
  isMouseDown: boolean
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = initParticles(120);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateParticles(particles, mouse, isMouseDown);
      drawParticles(ctx, particles, mouse);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, mouse, isMouseDown]);
}
