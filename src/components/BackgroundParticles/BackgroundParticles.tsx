// components/BackgroundParticles/index.tsx
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useParticleSystem } from "./useParticleSystem";
import { useMouseInteraction } from "./useMouseInteraction";

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const [isMouseDown, setIsMouseDown] = useState(false);
  useMouseInteraction(mouse, setIsMouseDown);
  useParticleSystem(canvasRef, mouse, isMouseDown);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
}
