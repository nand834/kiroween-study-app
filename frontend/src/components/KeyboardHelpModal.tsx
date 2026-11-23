import React from 'react';
import { X, Command } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Flip Flashcard / Submit answer' },
    { key: '← / →', desc: 'Previous or Next Flashcard' },
    { key: '1', desc: 'Mark Flashcard as "Still Cursed" (or Select Quiz Option A)' },
    { key: '2', desc: 'Mark Flashcard as "Purified" (or Select Quiz Option B)' },
    { key: '3 / 4', desc: 'Select Quiz Option C / D' },
    { key: 'Enter', desc: 'Cast Answer / Advance to next Quiz question' },
    { key: '?', desc: 'Open / Close this Arcane Shortcuts Codex' },
    { key: 'Esc', desc: 'Dismiss active dialog or overlay' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="haunted-glass-card rounded-2xl max-w-md w-full border border-arcane-500/50 p-6 shadow-glow-purple-lg relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-arcane-900 mb-5">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-arcane-400" />
            <h3 className="font-cinzel text-lg font-bold text-ghost-100">
              Arcane Keyboard Codex
            </h3>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1 rounded-lg hover:bg-sanctum-800 text-ghost-400 hover:text-ghost-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {shortcuts.map((s, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-2.5 rounded-xl bg-sanctum-900/80 border border-arcane-900/80 text-xs"
            >
              <span className="text-ghost-300 font-medium">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-sanctum-950 border border-arcane-800 text-flame-400 font-mono font-bold text-[11px] shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="text-center pt-2 border-t border-arcane-900/60">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-arcane-600 to-flame-600 text-white text-xs font-semibold shadow-glow-purple hover:shadow-glow-orange transition-all"
          >
            Close Codex
          </button>
        </div>
      </div>
    </div>
  );
};
