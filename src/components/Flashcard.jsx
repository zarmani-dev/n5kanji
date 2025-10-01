import { useState, useEffect, useCallback } from "react";
import { AiSentences } from "./AiSentences";
import { VocabularyItem } from "./VocabularyItem";

export const Flashcard = ({ kanji, isFlipped, onFlip, isVocabHidden }) => {
  const [revealedVocab, setRevealedVocab] = useState({});

  // MOVING THE SPEECH LOGIC DIRECTLY INTO THE COMPONENT
  const speak = useCallback((text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    synth.speak(utterance);
  }, []);

  useEffect(() => {
    setRevealedVocab({});
  }, [kanji]);

  const handleReveal = (index) => {
    setRevealedVocab((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="perspective w-full h-[28rem] flex-grow" onClick={onFlip}>
      <div
        className={`flip-card relative w-full h-full cursor-pointer rounded-2xl shadow-lg ${
          isFlipped ? "flipped" : ""
        }`}
      >
        {/* Card Front */}
        <div className="flip-card-front absolute w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center">
          <p
            className="text-9xl font-bold"
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            {kanji.kanji}
          </p>
        </div>
        {/* Card Back */}
        <div className="flip-card-back absolute w-full h-full bg-gray-800 rounded-2xl p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-2xl mb-2">
                <span className="font-semibold text-lg text-gray-400">
                  Kun:
                </span>{" "}
                {kanji.kunyomi || "N/A"}
              </p>
              <p className="text-2xl">
                <span className="font-semibold text-lg text-gray-400">On:</span>{" "}
                {kanji.onyomi || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm uppercase text-gray-400 font-semibold tracking-wider mb-2">
                Vocabulary
              </h3>
              <div className="space-y-2">
                {kanji.examples.map((ex, i) => (
                  <VocabularyItem
                    key={i}
                    example={ex}
                    isHidden={isVocabHidden && !revealedVocab[i]}
                    onReveal={() => handleReveal(i)}
                    onSpeak={speak}
                  />
                ))}
              </div>
            </div>

            <AiSentences kanji={kanji.kanji} />
          </div>
        </div>
      </div>
    </div>
  );
};
