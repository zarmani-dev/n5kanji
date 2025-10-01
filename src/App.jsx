import React, { useState, useMemo } from "react";
import kanjiData from "./lib/N5kanji.json";
import { HomeScreen } from "./components/HomeScreen";
import { DetailScreen } from "./components/DetailScreen";
import { PracticeScreen } from "./components/PracticeScreen"; // Practice mode component would be
// --- Main App Component ---

export default function App() {
  const [allKanji] = useState(kanjiData);
  const [currentView, setCurrentView] = useState("home"); // 'home', 'detail', 'practice'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVocabHidden, setIsVocabHidden] = useState(false);

  const handleKanjiSelect = (index) => {
    setCurrentIndex(index);
    setCurrentView("detail");
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allKanji.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + allKanji.length) % allKanji.length
    );
  };

  const currentKanji = useMemo(
    () => allKanji[currentIndex],
    [allKanji, currentIndex]
  );

  const renderView = () => {
    switch (currentView) {
      case "detail":
        return (
          <DetailScreen
            kanji={currentKanji}
            onBack={() => setCurrentView("home")}
            onNext={handleNext}
            onPrev={handlePrev}
            isVocabHidden={isVocabHidden}
          />
        );
      case "practice":
        return (
          <PracticeScreen
            kanjiList={allKanji}
            onQuit={() => setCurrentView("home")}
          />
        );
      // Note: Practice mode component would be here. It is omitted for brevity but the structure is ready.

      case "home":
      default:
        return (
          <HomeScreen
            kanjiList={allKanji}
            onKanjiSelect={handleKanjiSelect}
            onStartPractice={() => setCurrentView("practice")}
            isVocabHidden={isVocabHidden}
            onToggleVocab={() => setIsVocabHidden((prev) => !prev)}
          />
        );
    }
  };

  return (
    <>
      {/* This style block is essential for the card flip animation and basic layout */}
      <style>{`
        :root {
            --background: #111827; /* gray-900 */
            --card-bg: #1f2937; /* gray-800 */
            --text-main: #f3f4f6; /* gray-100 */
            --text-muted: #9ca3af; /* gray-400 */
            --accent: #4f46e5; /* indigo-600 */
            --accent-hover: #4338ca; /* indigo-700 */
        }
        body {
            font-family: 'Inter', 'Noto Sans JP', sans-serif;
            background-color: var(--background);
            color: var(--text-main);
            -webkit-tap-highlight-color: transparent;
        }
        .perspective { perspective: 1000px; }
        .flip-card {
            transform-style: preserve-3d;
            transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
        .flip-card.flipped { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
        }
        .flip-card-back { transform: rotateY(180deg); }
        .btn-nav {
             background-color: var(--accent); color: white; font-weight: bold;
             padding: 0.5rem 1rem; border-radius: 9999px;
             transition: background-color 0.3s; display: flex; align-items: center;
             justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .btn-nav:hover { background-color: var(--accent-hover); }
        .toggle-checkbox:checked { right: 0; border-color: var(--accent); }
        .toggle-checkbox:checked + .toggle-label { background-color: var(--accent); }
      `}</style>
      <div
        id="app"
        className="container mx-auto p-4 max-w-2xl min-h-screen flex flex-col"
      >
        <main id="main-content" className="flex-grow flex flex-col">
          {renderView()}
        </main>
      </div>
    </>
  );
}
