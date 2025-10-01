// --- Screen Components ---
import KanjiGrid from "./KanjiGrid";

export const HomeScreen = ({
  kanjiList,
  onKanjiSelect,
  onStartPractice,
  isVocabHidden,
  onToggleVocab,
}) => (
  <div className="flex-grow flex flex-col">
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-gray-100">N5 漢字</h1>
      <p className="text-md text-gray-400">Kanji Flashcards</p>
    </div>
    <div className="flex justify-center items-center gap-4 mb-6">
      <button
        onClick={onStartPractice}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg transition-colors duration-300"
      >
        Practice Mode
      </button>
      <div className="flex items-center text-sm text-gray-300">
        <span className="mr-2">Hide Japanese</span>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            checked={isVocabHidden}
            onChange={onToggleVocab}
            name="global-toggle-vocab"
            id="global-toggle-vocab"
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="global-toggle-vocab"
            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"
          ></label>
        </div>
      </div>
    </div>
    <KanjiGrid kanjiList={kanjiList} onKanjiSelect={onKanjiSelect} />
  </div>
);
