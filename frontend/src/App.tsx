import React, { useState, useEffect, useCallback } from 'react';
import { 
  StudyMode, 
  DocInfo, 
  StudyItem, 
  TopicMastery 
} from './types';
import { api } from './services/api';
import { SAMPLE_COURSES } from './data/sampleNotes';
import { sounds } from './utils/soundEffects';

import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navbar } from './components/Navbar';
import { UploadSanctum } from './components/UploadSanctum';
import { FlashcardSanctum } from './components/FlashcardSanctum';
import { QuizSanctum } from './components/QuizSanctum';
import { TopicAnalytics } from './components/TopicAnalytics';
import { KeyboardHelpModal } from './components/KeyboardHelpModal';
import { ExportModal } from './components/ExportModal';
import { Download, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<StudyMode>('upload');
  const [activeDoc, setActiveDoc] = useState<DocInfo | null>(null);
  const [items, setItems] = useState<StudyItem[]>([]);
  const [recentDocs, setRecentDocs] = useState<DocInfo[]>([]);
  const [topicMastery, setTopicMastery] = useState<Record<string, TopicMastery>>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [streak, setStreak] = useState(3);

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    // Check backend health
    api.checkHealth().then(setIsBackendConnected);

    // Load topic mastery from storage
    const records = api.getMasteryRecords();
    setTopicMastery(records);

    // Load recent docs
    const savedDocs = api.getSavedDocs();
    setRecentDocs(savedDocs);

    // Load streak from storage or default
    const savedStreak = localStorage.getItem('grimoire_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }

    // Default to the first sample course if no active doc
    const defaultCourse = SAMPLE_COURSES[0];
    const defaultDoc: DocInfo = {
      docId: defaultCourse.id,
      title: `${defaultCourse.code}: ${defaultCourse.title}`,
      summary: defaultCourse.summary,
      pageCount: 6,
      wordCount: 1450,
      uploadedAt: new Date().toISOString(),
    };
    setActiveDoc(defaultDoc);
    setItems(defaultCourse.items);
  }, []);

  // Listen for global '?' shortcut
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsExportOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // Handle document loaded/summoned
  const handleDocumentLoaded = async (doc: DocInfo, autoMode: 'flashcards' | 'quiz' = 'flashcards') => {
    setIsLoading(true);
    setLoadingStep('Deciphering ancient runes and bindings...');
    sounds.playClick();

    setTimeout(() => {
      setLoadingStep('Consulting the spectral knowledge matrix...');
    }, 600);

    setTimeout(() => {
      setLoadingStep('Synthesizing arcane flashcards & spectral trials...');
    }, 1200);

    try {
      const generated = await api.generateItems({ docId: doc.docId, mode: autoMode });
      setTimeout(() => {
        setActiveDoc(doc);
        setItems(generated);
        setRecentDocs(api.getSavedDocs());
        setIsLoading(false);
        setCurrentMode(autoMode);
        sounds.playFanfare();
      }, 1600);
    } catch {
      setIsLoading(false);
      setActiveDoc(doc);
      setItems(SAMPLE_COURSES[0].items);
      setCurrentMode(autoMode);
    }
  };

  // Submit Answer to update weak-topic tracking in real time
  const handleAnswer = useCallback(async (topic: string, correct: boolean) => {
    if (!activeDoc) return;
    const updated = await api.submitAnswer({
      docId: activeDoc.docId,
      topic,
      correct,
    });

    setTopicMastery((prev) => ({
      ...prev,
      [topic]: updated,
    }));
  }, [activeDoc]);

  // Focus study session only on cursed topics
  const handlePracticeCursedTopics = () => {
    const cursed = items.filter((item) => {
      const m = topicMastery[item.topic];
      return m && m.status === 'cursed';
    });

    if (cursed.length > 0) {
      setItems(cursed);
      setCurrentMode('flashcards');
    }
  };

  const handleResetMastery = () => {
    api.resetMastery();
    setTopicMastery({});
  };

  return (
    <div className="relative min-h-screen text-ghost-100 flex flex-col justify-between selection:bg-arcane-600/40 selection:text-white">
      
      {/* Dynamic Background Atmosphere */}
      <BackgroundCanvas />

      {/* Top Atmospheric Navbar */}
      <div className="relative z-30">
        <Navbar
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          activeDoc={activeDoc}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          streak={streak}
          isBackendConnected={isBackendConnected}
        />
      </div>

      {/* Main Content Sanctum */}
      <main className="relative z-10 flex-1 pb-16">
        
        {/* Quick Document Action Strip (When viewing Flashcards or Quiz) */}
        {activeDoc && currentMode !== 'upload' && (
          <div className="max-w-4xl mx-auto px-4 pt-4 flex items-center justify-between text-xs text-ghost-400 font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="text-arcane-400">Current Sanctum:</span>
              <span className="text-ghost-200 font-semibold truncate">{activeDoc.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => { sounds.playClick(); setIsExportOpen(true); }}
                className="flex items-center gap-1.5 hover:text-arcane-300 transition-colors"
                title="Export Flashcards as Markdown/JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Deck</span>
              </button>

              <button
                onClick={() => { sounds.playClick(); setCurrentMode('upload'); }}
                className="flex items-center gap-1.5 hover:text-flame-400 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Switch Scroll</span>
              </button>
            </div>
          </div>
        )}

        {/* View Routing */}
        {currentMode === 'upload' && (
          <UploadSanctum
            onDocumentLoaded={handleDocumentLoaded}
            recentDocs={recentDocs}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        )}

        {currentMode === 'flashcards' && (
          <FlashcardSanctum
            items={items}
            activeDoc={activeDoc}
            topicMastery={topicMastery}
            onAnswerCard={handleAnswer}
            onSwitchToQuiz={() => setCurrentMode('quiz')}
          />
        )}

        {currentMode === 'quiz' && (
          <QuizSanctum
            items={items}
            activeDoc={activeDoc}
            topicMastery={topicMastery}
            onAnswerSubmitted={handleAnswer}
            onSwitchToFlashcards={() => setCurrentMode('flashcards')}
            onSwitchToAnalytics={() => setCurrentMode('analytics')}
          />
        )}

        {currentMode === 'analytics' && (
          <TopicAnalytics
            topicMastery={topicMastery}
            activeDoc={activeDoc}
            onPracticeCursedTopics={handlePracticeCursedTopics}
            onResetMastery={handleResetMastery}
          />
        )}
      </main>

      {/* Atmospheric Gothic Footer */}
      <footer className="relative z-20 border-t border-arcane-950/80 bg-sanctum-950/90 backdrop-blur-md py-6 px-4 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ghost-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-ghost-200">GRIMOIRE AI</span>
            <span>—</span>
            <span>Haunted AI Study Sanctum for Kiroween 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-arcane-400">
              Built with Kiro • React • TypeScript • Tailwind CSS
            </span>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="text-ghost-400 hover:text-flame-400 transition-colors"
            >
              Shortcuts (?)
            </button>
          </div>
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardHelpModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Export Deck Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activeDoc={activeDoc}
        items={items}
      />

    </div>
  );
};
