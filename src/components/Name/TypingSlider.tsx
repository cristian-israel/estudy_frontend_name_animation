import { useEffect, useState } from "react";
import "./TypingSlider.css";

const phrases = [
  "**Bruna** Letícia Formenton",
  "Uma bela moça, apelido **Meu bem**",
  "Incrivelmente **inteligente** e **encantadora**!",
];

type Mode = "typing" | "deleting" | "correcting" | "waiting";

export function TypingSlider() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("typing");
  const [mistakeMade, setMistakeMade] = useState(false);

  const rawPhrase = phrases[index];
  const visibleText = text;

  useEffect(() => {
    const strippedPhrase = rawPhrase.replace(/\*\*(.*?)\*\*/g, "$1");
    let timeout = 150;

    const handleTyping = () => {
      if (mode === "typing") {
        const next = strippedPhrase.slice(0, text.length + 1);
        setText(next);

        if (next === strippedPhrase) {
          setMode("waiting");
          timeout = 2000; // 🔁 AQUI: espera 2 segundos ao terminar frase
          return;
        }

        if (!mistakeMade && text.length > 3 && Math.random() < 0.2) {
          setMode("correcting");
          setMistakeMade(true);
          timeout = 300;
          return;
        }

        timeout = 120 + Math.random() * 100;
      }

      else if (mode === "correcting") {
        setText((prev) => prev.slice(0, -1));
        setMode("typing");
        timeout = 300;
      }

      else if (mode === "waiting") {
        setMode("deleting");
        timeout = 0;
      }

      else if (mode === "deleting") {
        if (text.length > 0) {
          setText((prev) => prev.slice(0, -1));
          timeout = 40; // 🔁 AQUI: mais rápido para deletar
        } else {
          setMistakeMade(false);
          setIndex((prev) => (prev + 1) % phrases.length);
          setMode("typing");
          timeout = 600;
        }
      }
    };

    const timer = setTimeout(handleTyping, timeout);
    return () => clearTimeout(timer);
  }, [text, mode, index, mistakeMade]);

  // 🔥 Função que aplica destaque nas palavras com ** **
  const renderHighlightedText = (raw: string, visible: string) => {
    const cleanVisible = visible;
    const parts = [];
    let match: RegExpExecArray | null;
    let lastIndex = 0;
    const regex = /\*\*(.*?)\*\*/g;
    let plainIndex = 0;

    while ((match = regex.exec(raw)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;
      const before = raw.slice(lastIndex, start).replace(/\*\*/g, '');
      const highlighted = match[1];
      const rawUntilNow = raw.slice(0, end).replace(/\*\*/g, '');
      const visibleSlice = cleanVisible.slice(0, rawUntilNow.length);

      if (visibleSlice.length <= plainIndex) break;

      if (before) {
        const slice = visibleSlice.slice(plainIndex, plainIndex + before.length);
        if (slice) parts.push(<span key={plainIndex}>{slice}</span>);
        plainIndex += before.length;
      }

      if (highlighted) {
        const slice = visibleSlice.slice(plainIndex, plainIndex + highlighted.length);
        if (slice)
          parts.push(
            <span key={plainIndex} className="text-yellow-500">
              {slice}
            </span>
          );
        plainIndex += highlighted.length;
      }

      lastIndex = end;
    }

    const remaining = cleanVisible.slice(plainIndex);
    if (remaining) {
      parts.push(<span key={plainIndex}>{remaining}</span>);
    }

    return parts;
  };

  return (
    <div className="relative overflow-hidden font-mono font-bold text-8xl text-center leading-tight">
      <span>{renderHighlightedText(rawPhrase, visibleText)}</span>
      <span className="inline-block w-[3px] h-14 align-middle bg-yellow-500 animate-blink ml-1" />
    </div>
  );
}
