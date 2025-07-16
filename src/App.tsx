import { motion } from "framer-motion";
import { BackgroundParticles } from "./components/BackgroundParticles"; // se separou em outro arquivo

const name = "Cristian Israel da Silva";

const letterAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 200 },
  }),
};

function App() {
  return (
    <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center bg-black text-yellow-400 select-none">
      <BackgroundParticles />

      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-yellow-700 to-yellow-900 animate-gradientBlur opacity-20 pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        className="z-10 text-6xl font-bold flex gap-1 flex-wrap justify-center"
      >
        {[...name].map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterAnimation}
            className="inline bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}

export default App;
