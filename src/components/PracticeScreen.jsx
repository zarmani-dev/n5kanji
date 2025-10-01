import React, { useState, useEffect, useCallback, useMemo } from "react";

// Helper function to shuffle an array
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const PracticeSettings = ({ kanjiCount, onStart, onQuit }) => {
  const [difficulty, setDifficulty] = useState("easy");
  const [range, setRange] = useState([1, kanjiCount]);

  const handleStart = () => {
    onStart({
      difficulty,
      range: { start: range[0] - 1, end: range[1] }, // Convert to 0-based index for slicing
    });
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-100">
        Practice Settings
      </h2>

      {/* Difficulty Selector */}
      <div className="mb-8 w-full max-w-sm">
        <label className="text-lg font-semibold mb-3 block">Difficulty</label>
        <div className="flex justify-center gap-3">
          {["easy", "medium", "hard"].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize transition-all duration-200 ${
                difficulty === level
                  ? "bg-indigo-600 text-white scale-105"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Kanji Range Selector */}
      <div className="mb-8 w-full max-w-sm">
        <label className="text-lg font-semibold mb-3 block">Kanji Range</label>
        <div className="text-center text-xl font-mono mb-2">
          {range[0]} - {range[1]}
        </div>
        <div className="flex items-center gap-4">
          <span>1</span>
          <input
            type="range"
            min="1"
            max={kanjiCount}
            value={range[0]}
            onChange={(e) =>
              setRange((r) => [Math.min(Number(e.target.value), r[1]), r[1]])
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span>1</span>
          <input
            type="range"
            min="1"
            max={kanjiCount}
            value={range[1]}
            onChange={(e) =>
              setRange((r) => [r[0], Math.max(Number(e.target.value), r[0])])
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span>{kanjiCount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onQuit}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg"
        >
          Quit
        </button>
        <button
          onClick={handleStart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
        >
          Start Practice
        </button>
      </div>
    </div>
  );
};

const QuizView = ({ questions, onQuit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState({ message: "", color: "" });
  const [isAnswered, setIsAnswered] = useState(false);

  // Memoize the questions list passed via props
  const memoizedQuestions = useMemo(() => questions, [questions]);

  const generateQuestion = useCallback(
    (questionIndex) => {
      const questionData = memoizedQuestions[questionIndex];
      if (!questionData) return;

      setCurrentQuestion(questionData);
      setFeedback({ message: "", color: "" });
      setIsAnswered(false);
    },
    [memoizedQuestions]
  );

  useEffect(() => {
    if (memoizedQuestions.length > 0) {
      generateQuestion(0);
    }
  }, [memoizedQuestions, generateQuestion]);

  const handleAnswer = (selectedOption) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setTotalAnswered((prev) => prev + 1);

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      setFeedback({ message: "Correct!", color: "text-green-400" });
    } else {
      setFeedback({
        message: `Incorrect! It's "${currentQuestion.correctAnswer}"`,
        color: "text-red-400",
      });
    }

    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % memoizedQuestions.length;
      setCurrentIndex(nextIndex);
      generateQuestion(nextIndex);
    }, 1500);
  };

  if (!currentQuestion) {
    return (
      <div className="flex-grow flex items-center justify-center">
        Loading Questions...
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col text-center">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onQuit}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Quit
        </button>
        <div className="text-lg font-semibold">
          Score: {score}/{totalAnswered}
        </div>
      </div>
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg flex-grow flex flex-col justify-center">
        <p
          className="text-7xl mb-4"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {currentQuestion.display}
        </p>
        <p className="text-xl mb-6">{currentQuestion.questionText}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.options.map((opt, i) => (
            <button
              key={i}
              disabled={isAnswered}
              onClick={() => handleAnswer(opt)}
              className={`w-full p-4 bg-gray-700 rounded-lg shadow transition-colors duration-200 
                                ${
                                  isAnswered
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-600"
                                }
                                ${
                                  isAnswered &&
                                  opt === currentQuestion.correctAnswer
                                    ? "!bg-green-600"
                                    : ""
                                }
                            `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div
        className={`mt-4 text-xl font-bold h-7 transition-opacity duration-300 ${
          feedback.message ? "opacity-100" : "opacity-0"
        } ${feedback.color}`}
      >
        {feedback.message || " "}
      </div>
    </div>
  );
};

export const PracticeScreen = ({ kanjiList, onQuit }) => {
  const [quizSettings, setQuizSettings] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const generateAllQuestions = useCallback(
    (settings) => {
      const { difficulty, range } = settings;
      const selectedKanji = kanjiList.slice(range.start, range.end);

      const allPossibleQuestions = [];

      selectedKanji.forEach((kanjiItem) => {
        // Base question types
        const questionTypes = ["kunyomi", "onyomi", "english"];
        // Add compound words for medium and hard
        if (
          (difficulty === "medium" || difficulty === "hard") &&
          kanjiItem.examples.length > 1
        ) {
          questionTypes.push("compound_reading", "compound_meaning");
        }

        const chosenType =
          questionTypes[Math.floor(Math.random() * questionTypes.length)];

        let question = { display: kanjiItem.kanji };

        if (chosenType === "english") {
          question.questionText = "What is the English meaning?";
          question.correctAnswer = kanjiItem.examples[0].e;
          question.options = [kanjiItem.examples[0].e];
          while (question.options.length < 4) {
            const randomKanji =
              kanjiList[Math.floor(Math.random() * kanjiList.length)];
            if (randomKanji.examples.length > 0)
              question.options.push(randomKanji.examples[0].e);
          }
        } else if (chosenType === "kunyomi" && kanjiItem.kunyomi) {
          question.questionText = "What is the Kun'yomi reading?";
          question.correctAnswer = kanjiItem.kunyomi.split(",")[0].trim();
          question.options = [question.correctAnswer];
          while (question.options.length < 4) {
            const randomKanji =
              kanjiList[Math.floor(Math.random() * kanjiList.length)];
            if (randomKanji.kunyomi)
              question.options.push(randomKanji.kunyomi.split(",")[0].trim());
          }
        } else if (chosenType === "onyomi" && kanjiItem.onyomi) {
          question.questionText = "What is the On'yomi reading?";
          question.correctAnswer = kanjiItem.onyomi.split(",")[0].trim();
          question.options = [question.correctAnswer];
          while (question.options.length < 4) {
            const randomKanji =
              kanjiList[Math.floor(Math.random() * kanjiList.length)];
            if (randomKanji.onyomi)
              question.options.push(randomKanji.onyomi.split(",")[0].trim());
          }
        } else if (chosenType.startsWith("compound")) {
          const compoundExample =
            kanjiItem.examples.find(
              (ex) => ex.j.includes(kanjiItem.kanji) && ex.j.length > 1
            ) ||
            kanjiItem.examples[1] ||
            kanjiItem.examples[0];
          const compoundWord = compoundExample.j.split(" ")[0];
          const reading = compoundExample.j.match(/\((.*?)\)/)?.[1];

          question.display = compoundWord;

          if (chosenType === "compound_reading" && reading) {
            question.questionText = "What is the reading?";
            question.correctAnswer = reading;
            question.options = [reading];
            while (question.options.length < 4) {
              const rKanji =
                kanjiList[Math.floor(Math.random() * kanjiList.length)];
              if (rKanji.examples.length > 1) {
                const rReading = rKanji.examples[1].j.match(/\((.*?)\)/)?.[1];
                if (rReading) question.options.push(rReading);
              }
            }
          } else {
            // Fallback to compound meaning
            question.questionText = "What is the English meaning?";
            question.correctAnswer = compoundExample.e;
            question.options = [compoundExample.e];
            while (question.options.length < 4) {
              const rKanji =
                kanjiList[Math.floor(Math.random() * kanjiList.length)];
              if (rKanji.examples.length > 1)
                question.options.push(rKanji.examples[1].e);
            }
          }
        } else {
          return; // Skip if no valid question can be formed
        }

        question.options = shuffleArray(Array.from(new Set(question.options)));
        allPossibleQuestions.push(question);
      });
      setGeneratedQuestions(shuffleArray(allPossibleQuestions));
    },
    [kanjiList]
  );

  const handleStartPractice = (settings) => {
    setQuizSettings(settings);
    generateAllQuestions(settings);
  };

  const handleQuit = () => {
    setQuizSettings(null);
    setGeneratedQuestions([]);
    onQuit();
  };

  if (!quizSettings) {
    return (
      <PracticeSettings
        kanjiCount={kanjiList.length}
        onStart={handleStartPractice}
        onQuit={onQuit}
      />
    );
  }

  if (generatedQuestions.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center">
        Generating questions...
      </div>
    );
  }

  return <QuizView questions={generatedQuestions} onQuit={handleQuit} />;
};
