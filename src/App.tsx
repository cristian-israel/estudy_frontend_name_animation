import { BrowserRouter, Route, Routes } from "react-router-dom";

import { GeralContexts } from "./context/AppContexts";
import LoginPage from "./pages/login/LoginPage";
import MainPage from "./pages/main/MainPage";
import { ParticlesBackground } from "./components/ux/decorations/ParticlesBackground";

function App() {
  return (
    <section className="flex flex-col w-full h-screen overflow-auto select-none selection:bg-red-900/50 selection:text-white">
      <BrowserRouter>
        <GeralContexts>
          <ParticlesBackground />

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<MainPage />} />
          </Routes>
        </GeralContexts>
      </BrowserRouter>
    </section>
  );
}

export default App;
