import { BackgroundParticles } from "./components/BackgroundParticles/BackgroundParticles";
import { TypingSlider } from "./components/Name/TypingSlider";


function App() {
  return (
    <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center select-none selection:bg-yellow-900/50 selection:text-white">
      <BackgroundParticles />
      <TypingSlider />
    </section>
  );
}

export default App;
