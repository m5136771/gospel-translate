import React, { useState, useEffect, useRef } from "react";
import TranslatedText from "./components/TranslatedText";

function App() {
  const [translations, setTranslations] = useState([]);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToCenter = () => {
    window.requestAnimationFrame(() => {
      if (containerRef.current && messagesEndRef.current) {
        const containerHeight = containerRef.current.offsetHeight;
        const messageHeight = messagesEndRef.current.offsetHeight;
        const scrollPosition =
          messagesEndRef.current.offsetTop -
          containerHeight / 2 +
          messageHeight / 2;
        containerRef.current.scrollTop = scrollPosition;
      }
    });
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      console.log("Received raw data:", event.data);
      try {
        const message = JSON.parse(event.data);
        if (message.translation) {
          setTranslations((prevTranslations) => [
            ...prevTranslations,
            message.translation,
          ]);
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    scrollToCenter();
  }, [translations]);

  return (
    <div
      className="min-h-screen w-full overflow-hidden p-4 flex items-center justify-center"
      aria-live="polite"
    >
      <div
        ref={containerRef}
        className="w-full max-h-full overflow-y-auto flex flex-col justify-center items-center"
      >
        {translations.map((text, index) => (
          <p
            key={index}
            style={{
              opacity: 1 - (translations.length - index - 1) * 0.05,
              transition: "opacity 0.5s ease-in-out",
              fontWeight: `${
                index === translations.length - 1 ? "bold" : "normal"
              }`,
              color: `${index === translations.length - 1 ? "#fff" : "#ccc"}`,
            }}
            className="leading-relaxed text-center last:mb-0"
          >
            <TranslatedText text={text} />
          </p>
        ))}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
}

export default App;
