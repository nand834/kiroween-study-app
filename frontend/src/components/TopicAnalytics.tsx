import React from 'react';
import { 
  BarChart3, 
  Skull, 
  CheckCircle2, 
  RotateCcw, 
  Wand2,
  Award
} from 'lucide-react';
import { TopicMastery, DocInfo } from '../types';
import { sounds } from '../utils/soundEffects';

interface TopicAnalyticsProps {
  topicMastery: Record<string, TopicMastery>;
  activeDoc: DocInfo | null;
  onPracticeCursedTopics: () => void;
  onResetMastery: () => void;
}

export const TopicAnalytics: React.FC<TopicAnalyticsProps> = ({
  topicMastery,
  activeDoc,
  onPracticeCursedTopics,
  onResetMastery,
}) => {
  const masteryList = Object.values(topicMastery);

  // Group topics by status
  const cursedTopics = masteryList.filter((m) => m.status === 'cursed');
  const hauntedTopics = masteryList.filter((m) => m.status === 'haunted');
  const purifiedTopics = masteryList.filter((m) => m.status === 'purified');

  const totalAttempts = masteryList.reduce((acc, m) => acc + m.attempts, 0);
  const totalCorrect = masteryList.reduce((acc, m) => acc + m.correct, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Exam Readiness formula: weighted by purified topics
  const readiness = masteryList.length > 0
    ? Math.round(
        (purifiedTopics.length * 100 + hauntedTopics.length * 60 + cursedTopics.length * 20) /
          masteryList.length
      )
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono text-arcane-400 uppercase tracking-widest block mb-0.5">
            {activeDoc?.title || 'Knowledge Crypt'}
          </span>
          <h2 className="font-cinzel text-3xl font-extrabold text-ghost-100 flex items-center gap-2">
            <span>The Hall of Curses & Mastery</span>
          </h2>
          <p className="text-xs text-ghost-400 font-mono mt-1">
            Real-time tracking of weak topics and spectral exam readiness.
          </p>
        </div>

        {/* Action: Practice Weak Topics */}
        <div className="flex items-center gap-3">
          {cursedTopics.length > 0 && (
            <button
              onClick={() => { sounds.playClick(); onPracticeCursedTopics(); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-flame-600 to-arcane-600 text-white text-xs font-semibold shadow-glow-orange hover:shadow-glow-purple transition-all"
            >
              <Wand2 className="w-4 h-4" />
              <span>Purge Cursed Topics ({cursedTopics.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Clear all recorded topic mastery and curses?')) {
                sounds.playClick();
                onResetMastery();
              }
            }}
            title="Reset Topic Mastery"
            className="p-2.5 rounded-xl bg-sanctum-900 border border-arcane-900 text-ghost-400 hover:text-flame-400 text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Exam Readiness */}
        <div className="haunted-glass-card rounded-2xl p-5 border border-arcane-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-ghost-400 uppercase">Exam Readiness</span>
            <Award className="w-4 h-4 text-arcane-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-bold text-arcane-300">
              {readiness}%
            </span>
            <span className="text-xs text-ghost-400">Grave Rating</span>
          </div>
          <div className="w-full bg-sanctum-950 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="h-full bg-arcane-500 rounded-full" style={{ width: `${readiness}%` }} />
          </div>
        </div>

        {/* Cursed Topics Count */}
        <div className="haunted-glass-card rounded-2xl p-5 border border-flame-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-flame-400 uppercase">Cursed Topics</span>
            <Skull className="w-4 h-4 text-flame-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-bold text-flame-400">
              {cursedTopics.length}
            </span>
            <span className="text-xs text-ghost-400">&lt; 50% accuracy</span>
          </div>
          <div className="w-full bg-sanctum-950 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="h-full bg-flame-500 rounded-full" 
              style={{ width: `${masteryList.length ? (cursedTopics.length / masteryList.length) * 100 : 0}%` }} 
            />
          </div>
        </div>

        {/* Purified Topics Count */}
        <div className="haunted-glass-card rounded-2xl p-5 border border-spectral-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-spectral-400 uppercase">Purified Topics</span>
            <CheckCircle2 className="w-4 h-4 text-spectral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-bold text-spectral-400">
              {purifiedTopics.length}
            </span>
            <span className="text-xs text-ghost-400">&gt;= 80% accuracy</span>
          </div>
          <div className="w-full bg-sanctum-950 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="h-full bg-spectral-500 rounded-full" 
              style={{ width: `${masteryList.length ? (purifiedTopics.length / masteryList.length) * 100 : 0}%` }} 
            />
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="haunted-glass-card rounded-2xl p-5 border border-arcane-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-ghost-400 uppercase">Overall Accuracy</span>
            <BarChart3 className="w-4 h-4 text-arcane-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel text-3xl font-bold text-ghost-100">
              {overallAccuracy}%
            </span>
            <span className="text-xs text-ghost-400">{totalAttempts} answers</span>
          </div>
          <div className="w-full bg-sanctum-950 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="h-full bg-ghost-300 rounded-full" style={{ width: `${overallAccuracy}%` }} />
          </div>
        </div>

      </div>

      {/* Main Topic Breakdown Table / Cards */}
      <div className="haunted-glass-card rounded-2xl border border-arcane-800 p-6 sm:p-8">
        <h3 className="font-cinzel text-lg font-bold text-ghost-100 mb-6 flex items-center justify-between">
          <span>Topic Mastery Matrix</span>
          <span className="text-xs font-mono text-ghost-400 font-normal">
            {masteryList.length} topic{masteryList.length > 1 ? 's' : ''} tracked
          </span>
        </h3>

        {masteryList.length === 0 ? (
          <div className="text-center py-12">
            <Skull className="w-10 h-10 text-arcane-500 mx-auto mb-3 opacity-60" />
            <p className="text-sm text-ghost-300 font-mono mb-1">
              No topic trials recorded yet.
            </p>
            <p className="text-xs text-ghost-500">
              Complete flashcards or quizzes to awaken the adaptive mastery tracker!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {masteryList.map((m) => {
              const isCursed = m.status === 'cursed';
              const isPurified = m.status === 'purified';

              let badgeColor = 'bg-arcane-950 text-arcane-300 border-arcane-700';
              let badgeText = 'Haunted (50-79%)';
              let barColor = 'bg-arcane-500';

              if (isCursed) {
                badgeColor = 'bg-flame-950 text-flame-400 border-flame-700/80 animate-pulse';
                badgeText = '💀 Cursed (<50%)';
                barColor = 'bg-flame-500';
              } else if (isPurified) {
                badgeColor = 'bg-spectral-950 text-spectral-300 border-spectral-700';
                badgeText = '✨ Purified (80%+)';
                barColor = 'bg-spectral-400';
              }

              return (
                <div
                  key={m.topic}
                  className={`p-4 rounded-xl bg-sanctum-900/90 border transition-all duration-200 ${
                    isCursed
                      ? 'border-flame-800/80 hover:border-flame-500 shadow-inner-glow'
                      : isPurified
                      ? 'border-spectral-900/80 hover:border-spectral-500'
                      : 'border-arcane-900 hover:border-arcane-600'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-cinzel font-bold text-ghost-100 text-sm sm:text-base">
                        {m.topic}
                      </h4>
                      <span className="text-xs font-mono text-ghost-400">
                        {m.correct} correct / {m.wrong} incorrect ({m.attempts} attempts)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border font-semibold ${badgeColor}`}>
                        {badgeText}
                      </span>
                      <span className="font-cinzel font-bold text-ghost-100 text-base sm:text-lg min-w-[45px] text-right">
                        {m.accuracy}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-sanctum-950 rounded-full h-2 overflow-hidden border border-sanctum-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${m.accuracy}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
