import React from 'react';

function TranslatedText({ text, isCurrent }) {
  return (
    <div className={`p-4 max-w-2xl mx-auto mt-10 transition-all duration-500 ease-in-out ${isCurrent ? 'bg-blue-100' : 'bg-white'} rounded-lg shadow-lg`}>
      <p className={`text-lg ${isCurrent ? 'text-blue-800 font-bold' : 'text-gray-600'}`}>{text}</p>
    </div>
  );
}

export default TranslatedText;
