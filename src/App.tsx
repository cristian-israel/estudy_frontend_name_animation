import { BackgroundParticles } from "./components/BackgroundParticles";
import { AnimatedName } from "./components/AnimatedName";

function App() {
  return (
    <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center bg-black text-yellow-400 select-none">
      {/* <section className="flex flex-col w-full h-screen overflow-auto select-none selection:bg-yellow-900/50 selection:text-white"> */}
      <BackgroundParticles />

      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-yellow-700 to-yellow-900 animate-gradientBlur opacity-20 pointer-events-none" />

      <AnimatedName name="Cristian Israel da Silva" />
    </section>
  );
}

export default App;
