import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./TypingSlider.css"; // ou embutir no Tailwind

const phrases = [
  "Desenvolvedora Frontend",
  "Apaixonada por Design",
  "Bruna Formenton",
];

export function TypingSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-16 overflow-hidden font-mono font-bold text-3xl text-center text-shadow-yellow-500">
      <motion.div
        key={phrases[index]}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.6 }}
        className="inline-block typing-effect"
      >
        {phrases[index]}
        <motion.span
          className="ml-1 inline-block w-[2px] h-7 bg-yellow-500"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </motion.div>
    </div>
  );
}
