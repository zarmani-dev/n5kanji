import { useState, useCallback } from "react";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${
  import.meta.env.VITE_API_KEY
}`;

export const AiSentences = ({ kanji }) => {
  const [sentences, setSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const handleGenerate = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    setError(null);
    setSentences([]);

    const prompt = `Create exactly 3 very simple Japanese example sentences for an N5 learner using the kanji "${kanji}". For any other kanji in the sentence, you MUST provide furigana. The output must be in a structured JSON format.`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              sentence: { type: "STRING" },
              furigana_html: {
                type: "STRING",
                description:
                  "The sentence with furigana in HTML ruby tags. Example: <ruby>私<rt>わたし</rt></ruby>は<ruby>学生<rt>がくせい</rt></ruby>です。",
              },
              translation: { type: "STRING" },
            },
            required: ["sentence", "furigana_html", "translation"],
          },
        },
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${errorBody}`
        );
      }
      const result = await response.json();
      const jsonText = result.candidates[0].content.parts[0].text;
      setSentences(JSON.parse(jsonText));
    } catch (err) {
      console.error("AI Sentence Generation Error:", err);
      setError(err.message);
      setSentences([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffle = (e) => {
    e.stopPropagation();
    setSentences((prev) => shuffleArray(prev));
  };

  const handleSpeak = (e, text) => {
    e.stopPropagation();
    speak(text);
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm uppercase text-gray-400 font-semibold tracking-wider mb-2">
        AI Example Sentences
      </h3>
      {isLoading && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center p-4 min-h-[100px]"
        >
          <div className="w-8 h-8 border-4 border-indigo-600 border-b-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {error && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="text-red-400 bg-red-900/50 p-3 rounded-lg"
        >
          <p className="font-bold">Error:</p>
          <p className="text-sm">
            Failed to generate sentences. Please check the console for details.
          </p>
        </div>
      )}
      {!isLoading && sentences.length === 0 && !error && (
        <button
          onClick={handleGenerate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Generate Sentences
        </button>
      )}
      {!isLoading && sentences.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={handleShuffle}
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 mb-3"
          >
            Shuffle Examples
          </button>
          {sentences.map((ex, i) => (
            <div
              key={i}
              className="border-t border-gray-700 pt-3 mt-3 flex justify-between items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p
                  className="text-lg font-semibold text-indigo-400"
                  dangerouslySetInnerHTML={{ __html: ex.furigana_html }}
                ></p>
                <p className="text-sm text-gray-300">{ex.translation}</p>
              </div>
              <button
                className="speak-btn p-2 rounded-full hover:bg-gray-600"
                onClick={(e) => handleSpeak(e, ex.sentence)}
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
          ))}
        </div>
      )}
    </div>
  );
};
