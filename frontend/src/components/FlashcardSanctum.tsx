import React, { useState, useEffect, useCallback } from 'react';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Volume2, 
  Shuffle, 
  Sparkles, 
  Skull, 
  CheckCircle, 
  Award
} from 'lucide-react';
import { StudyItem, DocInfo, TopicMastery } from '../types';
import { sounds } from '../utils/soundEffects';

interface FlashcardSanctumProps {
  items: StudyItem[];
  activeDoc: DocInfo | null;
  topicMastery: Record<string, TopicMastery>;
  onAnswerCard: (topic: string, correct: boolean) => void;
  onSwitchToQuiz: () => void;
}

export const FlashcardSanctum: React.FC<FlashcardSanctumProps> = ({
  items: initialItems,
  activeDoc,
  topicMastery,
  onAnswerCard,
  onSwitchToQuiz,
}) => {
  const [items, setItems] = useState<StudyItem[]>(initialItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'cursed' | 'starred'>('all');
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setItems(initialItems);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [initialItems]);

  // Filter items based on current mode
  const filteredItems = items.filter((item) => {
    if (filterMode === 'starred') return starredIds.has(item.id);
    if (filterMode === 'cursed') {
      const mastery = topicMastery[item.topic];
      return mastery && mastery.status === 'cursed';
    }
    return true;
  });

  const currentCard = filteredItems[currentIndex] || items[0];

  const handleFlip = useCallback(() => {
    sounds.playCardFlip();
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (filteredItems.length === 0) return;
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (filteredItems.length === 0) return;
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  const handleToggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    sounds.playClick();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
      }
      return next;
    });
  };

  const handleShuffle = () => {
    sounds.playClick();
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    setItems(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRate = (correct: boolean) => {
    if (!currentCard) return;
    if (correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
    onAnswerCard(currentCard.topic, correct);
    handleNext();
  };

  const handleSpeakText = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard || !('speechSynthesis' in window)) return;
    sounds.playClick();
    window.speechSynthesis.cancel();
    const textToRead = isFlipped ? `${currentCard.answer}. ${currentCard.explanation}` : currentCard.question;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.pitch = 0.85; // slightly eerie lower tone
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        e.preventDefault();
        handleRate(false);
      } else if (e.key === '2') {
        e.preventDefault();
        handleRate(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, currentCard]);

  if (!currentCard) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="haunted-glass-card rounded-2xl p-8 border-arcane-800">
          <Skull className="w-12 h-12 text-arcane-400 mx-auto mb-4 animate-bounce" />
          <h3 className="font-cinzel text-xl font-bold text-ghost-100 mb-2">
            No Runes Found in this Vault
          </h3>
          <p className="text-sm text-ghost-400 mb-6">
            There are no flashcards matching this filter ({filterMode}).
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="px-4 py-2 rounded-xl bg-arcane-600 hover:bg-arcane-500 text-white text-xs font-semibold"
          >
            Show All Flashcards
          </button>
        </div>
      </div>
    );
  }

  const topicInfo = topicMastery[currentCard.topic];
  const isCursedTopic = topicInfo && topicInfo.status === 'cursed';
  const isPurifiedTopic = topicInfo && topicInfo.status === 'purified';
  const progressPercent = Math.round(((currentIndex + 1) / filteredItems.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Top Deck Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-mono text-arcane-400 uppercase tracking-widest block mb-0.5">
            {activeDoc?.title || 'Arcane Flashcard Sanctum'}
          </span>
          <h2 className="font-cinzel text-2xl font-bold text-ghost-100 flex items-center gap-2">
            <span>Tomes of Memory</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-sanctum-900 border border-arcane-800 text-ghost-300">
              {currentIndex + 1} / {filteredItems.length}
            </span>
          </h2>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center gap-2">
          
          {/* Filter Dropdown / Buttons */}
          <div className="flex items-center bg-sanctum-900/90 p-1 rounded-xl border border-arcane-900">
            <button
              onClick={() => { sounds.playClick(); setFilterMode('all'); setCurrentIndex(0); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterMode === 'all' ? 'bg-arcane-700 text-white' : 'text-ghost-400 hover:text-ghost-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { sounds.playClick(); setFilterMode('cursed'); setCurrentIndex(0); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                filterMode === 'cursed' ? 'bg-flame-700 text-white' : 'text-ghost-400 hover:text-flame-300'
              }`}
            >
              <Skull className="w-3 h-3 text-flame-400" />
              <span>Cursed</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setFilterMode('starred'); setCurrentIndex(0); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                filterMode === 'starred' ? 'bg-arcane-700 text-white' : 'text-ghost-400 hover:text-yellow-300'
              }`}
            >
              <Star className="w-3 h-3 text-yellow-400" />
              <span>Starred</span>
            </button>
          </div>

          {/* Shuffle Deck */}
          <button
            onClick={handleShuffle}
            title="Shuffle Runes"
            className="p-2 rounded-xl bg-sanctum-900 border border-arcane-800 text-ghost-400 hover:text-ghost-200 text-xs transition-colors"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-sanctum-900 rounded-full h-1.5 mb-6 overflow-hidden border border-arcane-900">
        <div 
          className="h-full bg-gradient-to-r from-arcane-500 to-flame-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* THE 3D FLIP CARD CONTAINER */}
      <div className="perspective-1000 w-full min-h-[380px] sm:min-h-[420px] mb-6">
        <div
          onClick={handleFlip}
          className={`w-full h-full min-h-[380px] sm:min-h-[420px] transition-transform duration-500 transform-style-3d cursor-pointer relative select-none rounded-2xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          
          {/* ================= CARD FRONT (QUESTION) ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden haunted-glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between border-2 border-arcane-800/80 shadow-glow-purple">
            
            {/* Header: Topic & Star */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-sanctum-900 border border-arcane-700 text-arcane-300 font-medium">
                  {currentCard.topic}
                </span>

                {isCursedTopic && (
                  <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-flame-950 text-flame-400 border border-flame-700/60 animate-pulse">
                    <Skull className="w-3 h-3" />
                    Cursed Topic ({topicInfo.accuracy}%)
                  </span>
                )}

                {isPurifiedTopic && (
                  <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-spectral-950 text-spectral-300 border border-spectral-700/60">
                    <Award className="w-3 h-3" />
                    Purified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakText}
                  title="Whisper aloud (TTS)"
                  className="p-1.5 rounded-lg bg-sanctum-900/60 hover:bg-sanctum-800 text-ghost-400 hover:text-ghost-200 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleToggleStar}
                  title="Bookmark Card"
                  className="p-1.5 rounded-lg bg-sanctum-900/60 hover:bg-sanctum-800 text-ghost-400 hover:text-yellow-400 transition-colors"
                >
                  <Star 
                    className={`w-4 h-4 ${
                      starredIds.has(currentCard.id) ? 'fill-yellow-400 text-yellow-400' : ''
                    }`} 
                  />
                </button>
              </div>
            </div>

            {/* Question Center */}
            <div className="my-auto py-6 text-center">
              <span className="text-3xl block mb-4 opacity-60">📜</span>
              <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-ghost-100 leading-relaxed max-w-2xl mx-auto">
                {currentCard.question}
              </h3>
            </div>

            {/* Bottom Flip Hint */}
            <div className="flex items-center justify-between text-xs text-arcane-300/70 font-mono border-t border-arcane-900/60 pt-4">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-flame-400 animate-spin-slow" />
                <span>Click card or press <kbd className="px-1.5 py-0.5 rounded bg-sanctum-900 border border-arcane-800 text-ghost-200">Space</kbd> to reveal wisdom</span>
              </span>
              <span className="hidden sm:inline">Use ← / → arrows to navigate</span>
            </div>

          </div>

          {/* ================= CARD BACK (ANSWER & EXPLANATION) ================= */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 haunted-glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between border-2 border-flame-600/70 shadow-glow-orange bg-sanctum-900/95">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-flame-950 border border-flame-700/60 text-flame-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-flame-400" />
                Arcane Revelation
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakText}
                  title="Whisper aloud (TTS)"
                  className="p-1.5 rounded-lg bg-sanctum-950 hover:bg-sanctum-800 text-ghost-400 hover:text-ghost-200 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleFlip}
                  title="Flip back"
                  className="p-1.5 rounded-lg bg-sanctum-950 hover:bg-sanctum-800 text-ghost-400 hover:text-ghost-200 transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Answer & Explanation */}
            <div className="my-auto py-4 overflow-y-auto max-h-[220px]">
              <div className="mb-4">
                <span className="text-xs uppercase font-mono text-ghost-400 block mb-1">
                  Correct Answer:
                </span>
                <p className="font-cinzel text-base sm:text-xl font-bold text-flame-300">
                  {currentCard.answer}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-sanctum-950/80 border border-arcane-900/80 text-xs sm:text-sm text-ghost-300/90 leading-relaxed font-sans">
                <span className="font-semibold text-arcane-300 block mb-1">
                  Grimoire Explanation:
                </span>
                {currentCard.explanation}
              </div>
            </div>

            {/* Bottom Self-Grading Buttons */}
            <div className="pt-3 border-t border-sanctum-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-ghost-400 font-mono hidden sm:block">
                Did you recall this rune?
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); handleRate(false); }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-flame-950 hover:bg-flame-700 border border-flame-600/70 text-flame-300 text-xs font-semibold shadow-inner-glow transition-all"
                >
                  <Skull className="w-3.5 h-3.5 text-flame-400" />
                  <span>Still Cursed [1]</span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleRate(true); }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-spectral-950 hover:bg-spectral-700 border border-spectral-600/70 text-spectral-300 text-xs font-semibold shadow-glow-emerald transition-all"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-spectral-400" />
                  <span>Purified! [2]</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sanctum-900 border border-arcane-800 hover:border-arcane-500 text-ghost-300 hover:text-white text-xs font-medium transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Rune</span>
        </button>

        <button
          onClick={onSwitchToQuiz}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-arcane-600 to-flame-600 text-white text-xs font-semibold shadow-glow-purple hover:shadow-glow-orange transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test in Spectral Quiz</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sanctum-900 border border-arcane-800 hover:border-arcane-500 text-ghost-300 hover:text-white text-xs font-medium transition-all"
        >
          <span>Next Rune</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
