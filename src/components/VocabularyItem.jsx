export const VocabularyItem = ({ example, isHidden, onReveal, onSpeak }) => {
  // const speak = useSpeechSynthesis();

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const reading = example.j.match(/\((.*?)\)/)?.[1] || example.j;

  return (
    <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between items-start">
      <div className="flex-grow">
        {isHidden ? (
          <button
            onClick={(e) => handleActionClick(e, onReveal)}
            className="w-full text-left text-lg font-semibold text-indigo-400 py-1 px-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors"
          >
            Tap to reveal
          </button>
        ) : (
          <p className="japanese-term text-lg font-semibold text-indigo-400">
            {example.j}
          </p>
        )}
        <p className="text-sm text-gray-300">{example.e}</p>
        <p className="text-sm text-gray-400">{example.m}</p>
      </div>
      <button
        className="speak-btn p-2 ml-2 rounded-full hover:bg-gray-600 flex-shrink-0"
        onClick={(e) => handleActionClick(e, () => onSpeak(reading))}
      >
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.858l4.707-4.707a1 1 0 011.414 0V19.707a1 1 0 01-1.414 0L5.858 15z"
          ></path>
        </svg>
      </button>
    </div>
  );
};
