import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Layers, 
  Sparkles, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Radio, 
  HelpCircle, 
  Flame,
  FileText,
  Server
} from 'lucide-react';
import { StudyMode, DocInfo } from '../types';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  activeDoc: DocInfo | null;
  onOpenShortcuts: () => void;
  streak: number;
  isBackendConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  activeDoc,
  onOpenShortcuts,
  streak,
  isBackendConnected,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientOn, setIsAmbientOn] = useState(false);

  useEffect(() => {
    setIsMuted(sounds.getMuted());
    setIsAmbientOn(sounds.getIsAmbientPlaying());
  }, []);

  const handleToggleMute = () => {
    const next = !isMuted;
    sounds.setMuted(next);
    setIsMuted(next);
    if (!next) sounds.playClick();
  };

  const handleToggleAmbient = () => {
    const active = sounds.toggleAmbient();
    setIsAmbientOn(active);
    if (active) sounds.playClick();
  };

  const navItems: { id: StudyMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'upload', label: 'Scrolls & Notes', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'flashcards', label: 'Arcane Cards', icon: <Layers className="w-4 h-4" /> },
    { id: 'quiz', label: 'Spectral Trial', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'analytics', label: 'Curse Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-arcane-900/60 haunted-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div 
          onClick={() => onSelectMode('upload')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-arcane-600 via-sanctum-800 to-flame-600 p-[1.5px] shadow-glow-purple group-hover:shadow-glow-purple-lg transition-all duration-300">
            <div className="w-full h-full bg-sanctum-900 rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <span className="text-xl animate-float-slow">📖</span>
              <div className="absolute inset-0 bg-arcane-500/10 group-hover:bg-arcane-500/20 transition-colors" />
            </div>
            {/* Tiny magical flame spark */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-flame-500 rounded-full animate-ping opacity-75" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg font-bold tracking-wider text-ghost-100 group-hover:text-arcane-300 transition-colors flex items-center gap-1.5">
                GRIMOIRE <span className="text-flame-400 font-extrabold">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-flame-950/80 border border-flame-600/40 text-flame-300 font-semibold tracking-wider">
                Kiroween '26
              </span>
            </div>
            <p className="text-[11px] text-arcane-300/60 font-mono hidden md:block">
              Haunted AI Study Sanctum
            </p>
          </div>
        </div>

        {/* Center Mode Navigation */}
        <nav className="flex items-center gap-1 bg-sanctum-900/80 p-1 rounded-xl border border-arcane-900/70">
          {navItems.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectMode(item.id);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-arcane-600 to-arcane-700 text-white shadow-glow-purple'
                    : 'text-ghost-300/80 hover:text-ghost-100 hover:bg-sanctum-800/60'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-flame-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Bar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Active Document Indicator */}
          {activeDoc && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sanctum-850 border border-arcane-800 text-xs text-ghost-200 max-w-[200px] truncate">
              <FileText className="w-3.5 h-3.5 text-arcane-400 flex-shrink-0" />
              <span className="truncate">{activeDoc.title}</span>
            </div>
          )}

          {/* Streak Badge */}
          <div 
            title={`${streak} Day Study Streak`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-flame-950/70 border border-flame-600/30 text-flame-400 text-xs font-mono font-semibold"
          >
            <Flame className="w-3.5 h-3.5 fill-flame-500 text-flame-500 animate-pulse" />
            <span>{streak}d</span>
          </div>

          {/* Ambient Sound Drone Toggle */}
          <button
            onClick={handleToggleAmbient}
            title={isAmbientOn ? 'Mute Haunted Library Ambient Drone' : 'Summon Haunted Library Ambient Drone'}
            className={`p-2 rounded-lg border text-xs transition-colors flex items-center justify-center ${
              isAmbientOn
                ? 'bg-arcane-950/90 border-arcane-500 text-arcane-300 shadow-glow-purple'
                : 'bg-sanctum-850/80 border-sanctum-700 text-ghost-400 hover:text-ghost-200'
            }`}
          >
            <Radio className={`w-4 h-4 ${isAmbientOn ? 'animate-pulse text-arcane-400' : ''}`} />
          </button>

          {/* Audio Effects Toggle */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2 rounded-lg bg-sanctum-850/80 border border-sanctum-700 text-ghost-400 hover:text-ghost-200 text-xs transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-flame-400" /> : <Volume2 className="w-4 h-4 text-ghost-300" />}
          </button>

          {/* Backend Online/Offline Status */}
          <div 
            title={isBackendConnected ? 'Connected to Kiro Backend (/upload, /generate, /answer)' : 'Arcane Local Engine Active (Zero backend dependencies)'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono ${
              isBackendConnected 
                ? 'bg-spectral-950/60 border-spectral-500/40 text-spectral-300' 
                : 'bg-sanctum-850 border-arcane-800/60 text-arcane-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-spectral-400 animate-ping' : 'bg-arcane-400'}`} />
            <Server className="w-3 h-3" />
            <span>{isBackendConnected ? 'API Live' : 'Arcane Engine'}</span>
          </div>

          {/* Shortcuts Help */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenShortcuts();
            }}
            title="Grimoire Keyboard Shortcuts (?)"
            className="p-2 rounded-lg bg-sanctum-850/80 border border-sanctum-700 text-ghost-400 hover:text-arcane-300 text-xs transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
