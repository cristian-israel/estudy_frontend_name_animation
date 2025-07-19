import { useEffect, useState } from "react";

const phrases = [
  "I'm Cristian Israel",
  "Developer Full Stack",
  "No coffee, no code",
];

export function TypingSlider() {
  const [index, setIndex] = useState(0); // frase atual
  const [text, setText] = useState(""); // texto exibido
  const [isDeleting, setIsDeleting] = useState(false); // apagando?
  const [speed, setSpeed] = useState(100); // velocidade de digitação

  useEffect(() => {
    const current = phrases[index];
    let typingSpeed = speed;

    const handleTyping = () => {
      if (isDeleting) {
        setText((prev) => prev.slice(0, -1));
        typingSpeed = 50;
      } else {
        setText((prev) => current.slice(0, prev.length + 1));
        typingSpeed = 100;
      }

      if (!isDeleting && text === current) {
        typingSpeed = 1000; // espera ao terminar de escrever
        setIsDeleting(true);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
        typingSpeed = 500;
      }

      setSpeed(typingSpeed);
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, index]);

  return (
    <div className="relative h-16 overflow-hidden font-mono font-bold text-3xl text-center text-shadow-yellow-500">
      <span>{text}</span>
      <span className="inline-block w-[2px] h-8 align-middle bg-yellow-500 animate-blink ml-1" />
    </div>
  );
}
