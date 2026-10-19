import React, { useState } from 'react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is the output of sizeof(char) in C programming?',
    options: ['4 bytes', '2 bytes', '1 byte', '8 bytes'],
    correct: 2,
    explanation: 'In standard C programming, a char always occupies exactly 1 byte (8 bits) of memory.',
  },
  {
    id: 2,
    question: 'Which operator is used to access members of a structure using a pointer in C?',
    options: ['. (dot)', '-> (arrow)', '* (asterisk)', '& (ampersand)'],
    correct: 1,
    explanation: 'The arrow operator (->) is used to dereference a pointer to a struct and access its members simultaneously.',
  },
  {
    id: 3,
    question: 'What does dynamic memory allocation function malloc() return upon failure?',
    options: ['0', 'NULL', 'Garbage value', '-1'],
    correct: 1,
    explanation: 'malloc() returns NULL pointer if sufficient heap memory is not available.',
  },
];

export const InteractiveCodingQuiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const q = QUIZ_QUESTIONS[currentQ];

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === q.correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOpt(null);
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setSelectedOpt(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#0B3561] to-[#071E38] text-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-[#12A5B0]/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#12A5B0]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="bg-[#FFD54A] text-[#071E38] font-heading font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
              Live Interactive Coding Quiz
            </span>
            <h3 className="font-display font-black italic text-2xl sm:text-3xl mt-1 text-white">
              Test Your C & BTech Concepts
            </h3>
          </div>
          {!showResult && (
            <span className="font-code text-xs text-[#DDF3F4] bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
            </span>
          )}
        </div>

        {!showResult ? (
          <div className="space-y-6">
            <h4 className="font-heading font-bold text-lg sm:text-xl text-white">
              {q.question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {q.options.map((opt, idx) => {
                let btnStyle = 'bg-white/10 border-white/20 hover:bg-white/20 text-white';
                if (selectedOpt !== null) {
                  if (idx === q.correct) {
                    btnStyle = 'bg-[#13834D] border-[#13834D] text-white shadow-lg animate-pulse';
                  } else if (idx === selectedOpt) {
                    btnStyle = 'bg-[#C0392B] border-[#C0392B] text-white';
                  } else {
                    btnStyle = 'bg-white/5 border-white/10 text-white/50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOpt !== null}
                    className={`p-4 rounded-2xl border text-left font-heading font-semibold text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    <span className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center text-xs font-mono">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl space-y-3 animate-fade-in">
                <p className="text-xs text-[#DDF3F4] leading-relaxed">
                  <strong className="text-[#FFD54A]">Explanation:</strong> {q.explanation}
                </p>
                <button
                  onClick={nextQuestion}
                  className="bg-[#12A5B0] text-[#071E38] font-heading font-black px-6 py-2.5 rounded-xl text-xs hover:brightness-105 transition shadow-md cursor-pointer"
                >
                  {currentQ < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Your Score →'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 rounded-full bg-[#12A5B0]/30 border-2 border-[#12A5B0] flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black italic text-3xl text-white">Quiz Completed!</h3>
              <p className="text-sm text-[#DDF3F4]">
                You scored <strong className="text-[#FFD54A] font-bold text-lg">{score}</strong> out of <strong className="font-bold">{QUIZ_QUESTIONS.length}</strong> correct.
              </p>
              <p className="text-xs text-[#DDF3F4]/80 max-w-md mx-auto">
                {score === QUIZ_QUESTIONS.length ? 'Outstanding! You have exceptional concept clarity ready for top-tier placement exams.' : 'Great effort! Review our handwritten notes to master every programming concept with 100% confidence.'}
              </p>
            </div>
            <button
              onClick={restartQuiz}
              className="bg-[#FFD54A] text-[#071E38] font-heading font-black px-8 py-3 rounded-xl text-xs hover:brightness-105 transition shadow-lg cursor-pointer uppercase tracking-wider"
            >
              Try Again ↺
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
