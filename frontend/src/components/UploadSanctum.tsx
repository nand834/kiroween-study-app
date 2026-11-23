import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Layers, 
  BookMarked, 
  FileCode, 
  AlertCircle,
  Wand2,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { DocInfo } from '../types';
import { SAMPLE_COURSES, SampleCourse } from '../data/sampleNotes';
import { sounds } from '../utils/soundEffects';

interface UploadSanctumProps {
  onDocumentLoaded: (doc: DocInfo, autoMode?: 'flashcards' | 'quiz') => void;
  recentDocs: DocInfo[];
  isLoading: boolean;
  loadingStep: string;
}

export const UploadSanctum: React.FC<UploadSanctumProps> = ({
  onDocumentLoaded,
  recentDocs,
  isLoading,
  loadingStep,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('samples');
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectSample = (sample: SampleCourse, autoMode: 'flashcards' | 'quiz' = 'flashcards') => {
    sounds.playClick();
    const docInfo: DocInfo = {
      docId: sample.id,
      title: `${sample.code}: ${sample.title}`,
      summary: sample.summary,
      pageCount: 6,
      wordCount: 1450,
      uploadedAt: new Date().toISOString(),
    };
    onDocumentLoaded(docInfo, autoMode);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setErrorMsg(null);
    sounds.playClick();

    if (!file.name.match(/\.(pdf|txt|md)$/i)) {
      setErrorMsg('Please summon a .pdf, .txt, or .md study scroll.');
      sounds.playWrong();
      return;
    }

    try {
      let content = '';
      if (file.name.endsWith('.pdf')) {
        // For PDF in browser without heavy backend, read file text or extract metadata
        content = await readPdfFallback(file);
      } else {
        content = await file.text();
      }

      const docInfo: DocInfo = {
        docId: `doc-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        pageCount: Math.max(1, Math.ceil(file.size / 3000)),
        wordCount: content.split(/\s+/).filter(Boolean).length || 500,
        uploadedAt: new Date().toISOString(),
      };

      // Store in memory & localStorage for generator
      localStorage.setItem(`grimoire_raw_${docInfo.docId}`, content);
      onDocumentLoaded(docInfo, 'flashcards');
    } catch (err) {
      setErrorMsg('The spirits could not decipher this document. Please try a text or markdown scroll.');
      sounds.playWrong();
    }
  };

  const readPdfFallback = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Attempt basic text extraction from binary stream
        const raw = (reader.result as string) || '';
        const matches = raw.match(/[A-Za-z0-9\s.,;:'"?!-]{8,}/g) || [];
        resolve(matches.join(' ') || `Lecture notes on ${file.name}`);
      };
      reader.readAsBinaryString(file);
    });
  };

  const handlePastedSubmit = () => {
    if (!pastedText.trim()) {
      setErrorMsg('The scroll is currently blank. Inscribe some lecture notes first.');
      sounds.playWrong();
      return;
    }

    sounds.playClick();
    const title = pastedTitle.trim() || 'Arcane Lecture Transcripts';
    const docInfo: DocInfo = {
      docId: `doc-paste-${Date.now()}`,
      title,
      pageCount: Math.max(1, Math.ceil(pastedText.length / 1800)),
      wordCount: pastedText.split(/\s+/).filter(Boolean).length,
      uploadedAt: new Date().toISOString(),
    };

    localStorage.setItem(`grimoire_raw_${docInfo.docId}`, pastedText);
    onDocumentLoaded(docInfo, 'flashcards');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      
      {/* Hero Welcome */}
      <div className="text-center mb-10 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-arcane-950/80 border border-arcane-700/60 shadow-glow-purple text-xs text-arcane-300 font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5 text-flame-400" />
          <span>Summon Knowledge from the Shadows</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-ghost-100 font-cinzel tracking-tight mb-3">
          The Haunted <span className="bg-gradient-to-r from-arcane-400 via-flame-400 to-spectral-400 bg-clip-text text-transparent">Study Sanctum</span>
        </h1>
        
        <p className="text-sm sm:text-base text-ghost-300/80 max-w-2xl mx-auto leading-relaxed">
          Upload your lecture PDFs, decipher ancient course scrolls, and summon AI-generated flashcards & exam-style trials that adaptively conquer your weakest topics.
        </p>
      </div>

      {/* Ritual Loading Screen if Summoning is in Progress */}
      {isLoading ? (
        <div className="haunted-glass-card rounded-2xl p-10 max-w-xl mx-auto text-center border-arcane-500/40 shadow-glow-purple-lg">
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-arcane-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-arcane-400 animate-spin-slow" />
            <div className="w-full h-full rounded-full bg-sanctum-900 border border-arcane-500 flex items-center justify-center shadow-glow-purple">
              <span className="text-4xl animate-pulse">🔮</span>
            </div>
          </div>

          <h3 className="font-cinzel text-xl font-bold text-ghost-100 mb-2">
            Summoning Knowledge...
          </h3>
          <p className="text-sm font-mono text-arcane-300 mb-6 animate-pulse">
            {loadingStep || 'Consulting the arcane spirits...'}
          </p>

          <div className="w-full bg-sanctum-900 rounded-full h-2 overflow-hidden border border-arcane-800">
            <div className="h-full bg-gradient-to-r from-arcane-500 via-flame-500 to-spectral-400 animate-shimmer bg-shimmer-sweep" style={{ width: '85%' }} />
          </div>
        </div>
      ) : (
        <>
          {/* Main Inscription Sanctuary Card */}
          <div className="haunted-glass-card rounded-2xl border-arcane-800 shadow-2xl p-6 sm:p-8 mb-12">
            
            {/* Mode Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8 border-b border-arcane-900/80 pb-5">
              <button
                onClick={() => { sounds.playClick(); setActiveTab('samples'); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'samples'
                    ? 'bg-gradient-to-r from-arcane-600 to-arcane-700 text-white shadow-glow-purple border border-arcane-400/40'
                    : 'text-ghost-300 hover:text-ghost-100 bg-sanctum-900/60 border border-sanctum-700/60'
                }`}
              >
                <BookMarked className="w-4 h-4 text-flame-400" />
                <span>Pre-bound Grimoires (Instant Try)</span>
              </button>

              <button
                onClick={() => { sounds.playClick(); setActiveTab('upload'); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'upload'
                    ? 'bg-gradient-to-r from-arcane-600 to-arcane-700 text-white shadow-glow-purple border border-arcane-400/40'
                    : 'text-ghost-300 hover:text-ghost-100 bg-sanctum-900/60 border border-sanctum-700/60'
                }`}
              >
                <Upload className="w-4 h-4 text-arcane-400" />
                <span>Upload PDF / File</span>
              </button>

              <button
                onClick={() => { sounds.playClick(); setActiveTab('paste'); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'paste'
                    ? 'bg-gradient-to-r from-arcane-600 to-arcane-700 text-white shadow-glow-purple border border-arcane-400/40'
                    : 'text-ghost-300 hover:text-ghost-100 bg-sanctum-900/60 border border-sanctum-700/60'
                }`}
              >
                <FileCode className="w-4 h-4 text-spectral-400" />
                <span>Inscribe / Paste Notes</span>
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-flame-950/60 border border-flame-700/60 text-flame-300 text-xs sm:text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-flame-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: PRE-BOUND GRIMOIRES (SAMPLES) */}
            {activeTab === 'samples' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-cinzel text-lg font-bold text-ghost-100 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-flame-500 animate-pulse" />
                    Select a Haunted Course Syllabus
                  </h3>
                  <span className="text-xs font-mono text-arcane-400">Ready to study in 1 click</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {SAMPLE_COURSES.map((course) => (
                    <div
                      key={course.id}
                      className="group haunted-glass rounded-xl p-5 border border-arcane-800 hover:border-flame-500/70 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-glow-purple"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl p-2 rounded-lg bg-sanctum-900 border border-arcane-900 group-hover:scale-110 transition-transform">
                            {course.icon}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-arcane-950 text-arcane-300 border border-arcane-800">
                            {course.code}
                          </span>
                        </div>

                        <h4 className="font-cinzel font-bold text-ghost-100 group-hover:text-flame-400 transition-colors mb-2 text-base">
                          {course.title}
                        </h4>

                        <p className="text-xs text-ghost-300/80 leading-relaxed mb-4">
                          {course.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-arcane-900/60 flex items-center gap-2">
                        <button
                          onClick={() => handleSelectSample(course, 'flashcards')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-arcane-900/80 hover:bg-arcane-600 border border-arcane-700/60 text-white text-xs font-medium transition-all"
                        >
                          <Layers className="w-3.5 h-3.5 text-arcane-300" />
                          <span>Flashcards</span>
                        </button>
                        <button
                          onClick={() => handleSelectSample(course, 'quiz')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-flame-950/80 hover:bg-flame-600 border border-flame-700/60 text-white text-xs font-medium transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-flame-300" />
                          <span>Take Quiz</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: UPLOAD PDF FILE */}
            {activeTab === 'upload' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.md"
                  className="hidden"
                />

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-flame-400 bg-flame-950/20 shadow-glow-orange'
                      : 'border-arcane-700/60 hover:border-arcane-400 bg-sanctum-900/40 hover:bg-sanctum-900/70'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-arcane-600/30 to-flame-600/30 border border-arcane-600/50 flex items-center justify-center shadow-inner-glow">
                    <Upload className="w-7 h-7 text-ghost-200 animate-bounce" />
                  </div>

                  <h3 className="font-cinzel text-lg font-bold text-ghost-100 mb-1">
                    Drag and drop your lecture manuscript here
                  </h3>
                  <p className="text-xs text-ghost-400 font-mono mb-4">
                    Supports PDF, TXT, and Markdown files (up to 25MB)
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-arcane-600 to-flame-600 text-white text-xs font-semibold hover:shadow-glow-purple transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Select File from Machine</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: PASTE NOTES DIRECTLY */}
            {activeTab === 'paste' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-arcane-300 mb-1.5">
                    Grimoire Title / Lecture Topic
                  </label>
                  <input
                    type="text"
                    value={pastedTitle}
                    onChange={(e) => setPastedTitle(e.target.value)}
                    placeholder="e.g. CS 418: Computer Graphics & Raytracing Shaders"
                    className="w-full px-4 py-2.5 rounded-xl bg-sanctum-900/90 border border-arcane-800 text-ghost-100 placeholder-ghost-500 text-sm focus:outline-none focus:border-arcane-500 focus:ring-1 focus:ring-arcane-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-arcane-300 mb-1.5 flex items-center justify-between">
                    <span>Inscribe Lecture Text or Transcript</span>
                    <span className="text-[11px] text-ghost-400">
                      {pastedText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </label>
                  <textarea
                    rows={7}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste textbook excerpts, professor lecture notes, code snippets, or slide transcripts here..."
                    className="w-full px-4 py-3 rounded-xl bg-sanctum-900/90 border border-arcane-800 text-ghost-100 placeholder-ghost-500 text-sm focus:outline-none focus:border-arcane-500 focus:ring-1 focus:ring-arcane-500 resize-none font-mono"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handlePastedSubmit}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-arcane-600 via-flame-600 to-arcane-700 text-white text-xs sm:text-sm font-semibold shadow-glow-purple hover:shadow-glow-orange transition-all"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Transmute into Flashcards & Trials</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RECENT SCROLLS LIBRARY */}
          {recentDocs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-cinzel text-lg font-bold text-ghost-100 flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-arcane-400" />
                  Your Library of Inscribed Scrolls
                </h3>
                <span className="text-xs font-mono text-ghost-400">
                  {recentDocs.length} manuscript{recentDocs.length > 1 ? 's' : ''} stored
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentDocs.map((doc) => (
                  <div
                    key={doc.docId}
                    className="haunted-glass rounded-xl p-4 border border-arcane-900/80 hover:border-arcane-600 transition-all flex flex-col justify-between"
                  >
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-arcane-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-spectral-400" />
                          Ready
                        </span>
                        <span className="text-[10px] text-ghost-400 font-mono">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="font-cinzel font-semibold text-ghost-100 text-sm line-clamp-1 mb-1">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-ghost-400">
                        {doc.wordCount ? `${doc.wordCount} words` : ''} 
                        {doc.pageCount ? ` • ${doc.pageCount} pages` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-sanctum-800">
                      <button
                        onClick={() => { sounds.playClick(); onDocumentLoaded(doc, 'flashcards'); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-sanctum-800 hover:bg-arcane-700/80 text-ghost-200 text-xs transition-colors"
                      >
                        <Layers className="w-3 h-3 text-arcane-400" />
                        <span>Cards</span>
                      </button>
                      <button
                        onClick={() => { sounds.playClick(); onDocumentLoaded(doc, 'quiz'); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-sanctum-800 hover:bg-flame-700/80 text-ghost-200 text-xs transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-flame-400" />
                        <span>Quiz</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
