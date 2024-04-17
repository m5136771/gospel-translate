import React, { useState, useEffect, useRef } from "react"; // Added useRef import
import TranslatedText from "./components/TranslatedText";

function App() {
  const [translations, setTranslations] = useState([]); // Initialize as an array, not a string
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
          scrollToBottom();
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div
      className="App overflow-y-auto h-96 bg-gray-100 p-4 space-y-2 font-sans text-dark"
      aria-live="polite"
    >
      {translations.map((text, index) => (
        <div
          key={index}
          className={`transition-opacity duration-300 ease-in-out ${
            index < translations.length - 5
              ? "opacity-50"
              : "bg-current-bg opacity-100"
          }`}
        >
          <div className="p-2 md:p-4 line-normal bg-highlight-bg">
            <TranslatedText text={text} />
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default App;
