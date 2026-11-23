import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Flame, 
  Skull, 
  Trophy, 
  Layers,
  Award
} from 'lucide-react';
import { StudyItem, DocInfo, TopicMastery } from '../types';
import { sounds } from '../utils/soundEffects';

interface QuizSanctumProps {
  items: StudyItem[];
  activeDoc: DocInfo | null;
  topicMastery: Record<string, TopicMastery>;
  onAnswerSubmitted: (topic: string, correct: boolean) => void;
  onSwitchToFlashcards: () => void;
  onSwitchToAnalytics: () => void;
}

export const QuizSanctum: React.FC<QuizSanctumProps> = ({
  items,
  activeDoc,
  topicMastery,
  onAnswerSubmitted,
  onSwitchToFlashcards,
  onSwitchToAnalytics,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [history, setHistory] = useState<{ item: StudyItem; selected: string; correct: boolean }[]>([]);

  const currentItem = items[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setCombo(0);
    setIsCompleted(false);
    setHistory([]);
  }, [items]);

  const handleSelectOption = (option: string) => {
    if (hasSubmitted) return;
    sounds.playClick();
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || hasSubmitted || !currentItem) return;

    const isCorrect = selectedOption === currentItem.answer;
    setHasSubmitted(true);

    if (isCorrect) {
      sounds.playCorrect();
      setScore((prev) => prev + 1);
      setCombo((prev) => prev + 1);
    } else {
      sounds.playWrong();
      setCombo(0);
    }

    setHistory((prev) => [
      ...prev,
      { item: currentItem, selected: selectedOption, correct: isCorrect }
    ]);

    onAnswerSubmitted(currentItem.topic, isCorrect);
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      // Completed the quiz!
      sounds.playFanfare();
      setIsCompleted(true);
      triggerConfetti();
    }
  };

  const handleRestartQuiz = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setCombo(0);
    setIsCompleted(false);
    setHistory([]);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#f97316', '#34d399', '#ffffff'],
      });
    } catch {
      // ignore
    }
  };

  // Keyboard shortcut for A, B, C, D (1, 2, 3, 4) and Enter/Space to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (!currentItem || isCompleted) return;

      const keyIndex = parseInt(e.key) - 1;
      if (!hasSubmitted && keyIndex >= 0 && keyIndex < currentItem.options.length) {
        e.preventDefault();
        handleSelectOption(currentItem.options[keyIndex]);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!hasSubmitted && selectedOption) {
          handleSubmitAnswer();
        } else if (hasSubmitted) {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentItem, selectedOption, hasSubmitted, isCompleted]);

  if (!currentItem && !isCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="haunted-glass-card rounded-2xl p-8 border-arcane-800">
          <Skull className="w-12 h-12 text-arcane-400 mx-auto mb-4" />
          <h3 className="font-cinzel text-xl font-bold text-ghost-100 mb-2">
            No Questions Manifested
          </h3>
          <p className="text-sm text-ghost-400 mb-6">
            Please inscribe notes or select a syllabus scroll first.
          </p>
          <button
            onClick={onSwitchToFlashcards}
            className="px-4 py-2 rounded-xl bg-arcane-600 text-white text-xs font-semibold"
          >
            Go to Flashcards
          </button>
        </div>
      </div>
    );
  }

  // COMPLETION CEREMONY SCREEN
  if (isCompleted) {
    const total = items.length;
    const percentage = Math.round((score / total) * 100);
    let title = 'Arch-Mage of the Crypt';
    let subtitle = 'Flawless mastery over the ancient spirits and runes!';
    let rankColor = 'text-spectral-400';

    if (percentage < 60) {
      title = 'Cursed Wanderer';
      subtitle = 'Several runes still shroud your path in shadows. Purge the cursed topics!';
      rankColor = 'text-flame-400';
    } else if (percentage < 85) {
      title = 'Apprentice of the Shadows';
      subtitle = 'Solid grasp of the dark arts, but room for refinement.';
      rankColor = 'text-arcane-400';
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="haunted-glass-card rounded-3xl p-8 sm:p-10 border-2 border-arcane-600/70 shadow-glow-purple-lg text-center relative overflow-hidden">
          
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-sanctum-900 border border-arcane-500 flex items-center justify-center shadow-glow-purple">
            <Trophy className="w-10 h-10 text-flame-400 animate-pulse" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-arcane-400 block mb-1">
            Trial Concluded
          </span>

          <h2 className={`font-cinzel text-3xl font-extrabold mb-2 ${rankColor}`}>
            {title}
          </h2>

          <p className="text-sm text-ghost-300 max-w-md mx-auto mb-6">
            {subtitle}
          </p>

          {/* Score Badge */}
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl bg-sanctum-950 border border-arcane-800 shadow-inner mb-8">
            <div className="text-center">
              <span className="text-xs font-mono text-ghost-400 block">Score</span>
              <span className="text-2xl font-bold font-cinzel text-ghost-100">
                {score} / {total}
              </span>
            </div>
            <div className="h-8 w-px bg-arcane-900" />
            <div className="text-center">
              <span className="text-xs font-mono text-ghost-400 block">Accuracy</span>
              <span className="text-2xl font-bold font-mono text-flame-400">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="text-left mb-8 max-h-60 overflow-y-auto space-y-2 pr-1">
            <span className="text-xs font-mono text-arcane-300 uppercase block mb-2">
              Runes Examined:
            </span>
            {history.map((h, i) => (
              <div 
                key={i} 
                className="p-3 rounded-xl bg-sanctum-900/90 border border-arcane-900 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {h.correct ? (
                    <CheckCircle2 className="w-4 h-4 text-spectral-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-flame-400 flex-shrink-0" />
                  )}
                  <span className="font-medium text-ghost-200 truncate">{h.item.question}</span>
                </div>
                <span className="font-mono text-[11px] text-ghost-400 flex-shrink-0">
                  {h.item.topic}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sanctum-900 hover:bg-sanctum-800 border border-arcane-700 text-ghost-200 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-4 h-4 text-arcane-400" />
              <span>Retry Trial</span>
            </button>

            <button
              onClick={onSwitchToAnalytics}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-arcane-600 to-flame-600 text-white text-xs font-semibold shadow-glow-purple hover:shadow-glow-orange transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Inspect Curse Analytics</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  const topicInfo = topicMastery[currentItem.topic];
  const isCursedTopic = topicInfo && topicInfo.status === 'cursed';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Quiz Top Status Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-mono text-arcane-400 block mb-0.5">
            {activeDoc?.title || 'Spectral MCQ Trial'}
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-ghost-100 flex items-center gap-2">
            <span>Question {currentIndex + 1} of {items.length}</span>
            {isCursedTopic && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-flame-950 border border-flame-700/60 text-flame-400 flex items-center gap-1 animate-pulse">
                <Skull className="w-3 h-3" />
                Adaptive Focus: Cursed Topic
              </span>
            )}
          </h2>
        </div>

        {/* Score & Combo */}
        <div className="flex items-center gap-3">
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-flame-950/90 border border-flame-600/60 text-flame-400 text-xs font-mono font-bold animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-flame-500 text-flame-500" />
              <span>{combo}x Combo!</span>
            </div>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-sanctum-900 border border-arcane-800 text-ghost-200 text-xs font-mono">
            Score: <span className="text-spectral-400 font-bold">{score}</span> / {items.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-sanctum-900 rounded-full h-1.5 mb-6 overflow-hidden border border-arcane-900">
        <div
          className="h-full bg-gradient-to-r from-arcane-500 to-flame-500 transition-all duration-300"
          style={{ width: `${Math.round(((currentIndex + 1) / items.length) * 100)}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="haunted-glass-card rounded-2xl p-6 sm:p-8 border border-arcane-800 shadow-xl mb-6">
        
        {/* Topic Tag */}
        <div className="mb-4">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-sanctum-900 border border-arcane-700 text-arcane-300">
            {currentItem.topic}
          </span>
        </div>

        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-ghost-100 leading-relaxed mb-6">
          {currentItem.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentItem.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedOption === option;
            const isCorrectAnswer = option === currentItem.answer;

            let optionStyle = 'bg-sanctum-900/80 border-arcane-800/80 hover:border-arcane-500 text-ghost-200';

            if (isSelected && !hasSubmitted) {
              optionStyle = 'bg-arcane-950 border-arcane-400 text-white shadow-glow-purple';
            } else if (hasSubmitted) {
              if (isCorrectAnswer) {
                optionStyle = 'bg-spectral-950/80 border-spectral-400 text-spectral-200 shadow-glow-emerald';
              } else if (isSelected && !isCorrectAnswer) {
                optionStyle = 'bg-flame-950/80 border-flame-500 text-flame-200 shadow-glow-orange';
              } else {
                optionStyle = 'bg-sanctum-900/40 border-sanctum-800/40 text-ghost-400 opacity-60';
              }
            }

            return (
              <button
                key={index}
                disabled={hasSubmitted}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 relative ${optionStyle}`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${
                  isSelected && !hasSubmitted
                    ? 'bg-arcane-600 text-white'
                    : hasSubmitted && isCorrectAnswer
                    ? 'bg-spectral-500 text-white'
                    : hasSubmitted && isSelected && !isCorrectAnswer
                    ? 'bg-flame-600 text-white'
                    : 'bg-sanctum-950 text-ghost-400 border border-sanctum-800'
                }`}>
                  {letter}
                </span>

                <span className="text-xs sm:text-sm leading-relaxed flex-1">
                  {option}
                </span>

                {hasSubmitted && isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-spectral-400 flex-shrink-0 mt-0.5" />
                )}
                {hasSubmitted && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-flame-400 flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Accordion (Visible on Submission) */}
        {hasSubmitted && (
          <div className="mt-6 p-4 rounded-xl bg-sanctum-950/90 border border-arcane-800 animate-fadeIn">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-flame-400" />
              <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-arcane-300">
                Grimoire Wisdom & Explanation
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ghost-300 leading-relaxed font-sans">
              {currentItem.explanation}
            </p>
          </div>
        )}

      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={onSwitchToFlashcards}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sanctum-900 border border-arcane-800 hover:border-arcane-500 text-ghost-300 hover:text-white text-xs font-medium transition-all"
        >
          <Layers className="w-4 h-4 text-arcane-400" />
          <span>Switch to Flashcards</span>
        </button>

        {!hasSubmitted ? (
          <button
            disabled={!selectedOption}
            onClick={handleSubmitAnswer}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedOption
                ? 'bg-gradient-to-r from-arcane-600 to-flame-600 text-white shadow-glow-purple hover:shadow-glow-orange cursor-pointer'
                : 'bg-sanctum-900 text-ghost-500 border border-sanctum-800 cursor-not-allowed'
            }`}
          >
            <span>Cast Answer</span>
            <Sparkles className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-arcane-600 to-flame-600 text-white text-xs sm:text-sm font-semibold shadow-glow-purple hover:shadow-glow-orange transition-all"
          >
            <span>{currentIndex + 1 < items.length ? 'Next Trial' : 'Complete Ceremony'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
