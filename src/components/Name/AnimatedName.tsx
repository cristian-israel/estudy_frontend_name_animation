  import { motion } from "framer-motion";
  import "./AnimatedName.css"; // esse CSS conterá o estilo `::before`/`::after`

  interface AnimatedNameProps {
    name: string;
  }

  const letterAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
    }),
  };

  export function AnimatedName({ name }: AnimatedNameProps) {
    if (!name) return null;

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        className="z-10 flex flex-wrap justify-center"
      >
        {[...name].map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterAnimation}
            data-text={char}
            className="letter-effect"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    );
  }
