const KanjiGrid = ({ kanjiList, onKanjiSelect }) => (
  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
    {kanjiList.map((kanji, index) => (
      <button
        key={kanji.kanji + index + kanji.onyomi}
        onClick={() => onKanjiSelect(index)}
        className="bg-gray-800 p-2 rounded-lg shadow-md text-3xl font-bold flex items-center justify-center aspect-square transition-all duration-200 hover:bg-indigo-600 hover:scale-105"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        {kanji.kanji}
      </button>
    ))}
  </div>
);

export default KanjiGrid;
