import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TerminalSquare } from 'lucide-react';

const normalTips = [
  "Use 'const' over 'let' by default to prevent accidental reassignments.",
  "CSS Grid is perfect for two-dimensional layouts, while Flexbox is ideal for one-dimensional layouts.",
  "React's useEffect dependency array prevents infinite re-render loops.",
  "A good Git commit message explains the 'why', not just the 'what'.",
  "Arrow functions inherit 'this' from their enclosing scope."
];

const gamerHacks = [
  "INFILTRATION_LOG: Use Optional Chaining (?.) to bypass null pointer traps.",
  "TACTICAL_ADVANTAGE: Object Destructuring extracts data payloads efficiently.",
  "OVERRIDE_PROTOCOL: Use CSS 'clip-path' to slice standard geometric UI bounds.",
  "STEALTH_MODE: LocalStorage persists session state after hostile reloads.",
  "COMBAT_STIM: React.memo() prevents redundant re-renders during heavy firefights."
];

const KnowledgeBase = ({ isGamerMode }) => {
  const [currentText, setCurrentText] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Randomizer logic on toggle or mount
    const array = isGamerMode ? gamerHacks : normalTips;
    const randomIndex = Math.floor(Math.random() * array.length);
    const newText = array[randomIndex];
    
    setCurrentText(newText);
    
    if (isGamerMode) {
      // Trigger typewriter effect for Gamer Mode
      setDisplayedText("");
      let i = 0;
      const interval = setInterval(() => {
        if (i <= newText.length) {
          setDisplayedText(newText.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      // Normal mode just shows the text
      setDisplayedText(newText);
    }
  }, [isGamerMode]);

  return (
    <div className="w-full flex justify-center z-[60] my-4 px-2 sm:px-4 pointer-events-none sticky top-2 sm:top-4">
      <AnimatePresence mode="wait">
        {!isGamerMode ? (
          <motion.div
            key="normal-mode"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-md shadow-sm border border-gray-200 rounded-xl sm:rounded-full px-4 sm:px-6 py-2 sm:py-3 max-w-2xl pointer-events-auto"
          >
            <Lightbulb className="text-yellow-500 flex-shrink-0" size={18} />
            <span className="text-gray-700 font-medium text-xs sm:text-sm">{displayedText}</span>
          </motion.div>
        ) : (
          <motion.div
            key="gamer-mode"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 sm:gap-3 val-clip bg-black/80 border border-gamer-primary/40 px-4 sm:px-6 py-2 sm:py-3 max-w-2xl pointer-events-auto"
          >
            <TerminalSquare className="text-gamer-primary flex-shrink-0" size={18} />
            <div className="flex flex-col">
              <span className="text-gamer-primary text-[8px] sm:text-[10px] font-bold tracking-widest uppercase opacity-70 mb-1">Tactical Intel</span>
              <span className="text-white font-mono text-xs sm:text-sm leading-tight">
                {displayedText}
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-gamer-primary ml-1 align-middle"
                />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KnowledgeBase;
