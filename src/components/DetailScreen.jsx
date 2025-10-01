import { useState, useEffect } from "react";
import { Flashcard } from "./Flashcard";

export const DetailScreen = ({
  kanji,
  onBack,
  onNext,
  onPrev,
  isVocabHidden,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [kanji]);

  return (
    <div className="flex-grow flex flex-col">
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
      </div>
      <Flashcard
        kanji={kanji}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
        isVocabHidden={isVocabHidden}
      />
      <div className="flex justify-between items-center mt-4">
        <button onClick={onPrev} className="btn-nav">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="text-center text-sm text-gray-500">
          Tap the card to flip
        </div>
        <button onClick={onNext} className="btn-nav">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
