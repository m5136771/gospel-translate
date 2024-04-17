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
          setTranslations((prevTranslations) => [message.translation, ...prevTranslations].slice(0, 5));
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
    <div className="min-h-screen w-full overflow-hidden p-4 flex items-center justify-center bg-gray-800 text-white">
      <div
        ref={containerRef}
        className="w-full max-w-2xl max-h-screen overflow-y-auto p-4 bg-black bg-opacity-75 rounded-lg shadow-lg"
      >
        {translations.map((text, index) => (
          <p
            key={index}
            className={`text-center transition-opacity duration-500 ease-in-out ${
              index === 0 ? 'text-4xl opacity-100' : `opacity-${100 - index * 20}`
            }`}
            style={{
              transform: `scale(${1 - index * 0.1})`,
              filter: `blur(${index * 0.5}px)`
            }}
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