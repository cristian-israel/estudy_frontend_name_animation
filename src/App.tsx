import { BackgroundParticles } from "./components/BackgroundParticles/BackgroundParticles";
import { AnimatedName } from "./components/AnimatedName";

function App() {
  return (
    <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center select-none selection:bg-yellow-900/50 selection:text-white">
      <BackgroundParticles />
      <AnimatedName name="Cristian Israel da Silva" />
    </section>
  );
}

export default App;