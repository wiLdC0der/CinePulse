import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, RotateCcw, Trophy } from 'lucide-react';

const TARGET_TEXT = "SYSTEM OVERRIDE INITIATED. NEURAL LINK ESTABLISHED. READY FOR COMBAT SIMULATION.";

const TypingSpeedChallenge = () => {
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef(null);

  const calculateWPM = (start, end) => {
    const timeInSeconds = (end - start) / 1000;
    const timeInMinutes = timeInSeconds / 60;
    const wordsCount = TARGET_TEXT.split(' ').length;
    return Math.round(wordsCount / timeInMinutes);
  };

  const handleInputChange = (e) => {
    if (isFinished) return;

    const val = e.target.value.toUpperCase(); // Force uppercase for HUD feel
    setInputText(val);

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    if (val === TARGET_TEXT) {
      setIsFinished(true);
      const endTime = Date.now();
      setWpm(calculateWPM(startTime || endTime, endTime));
    }
  };

  const resetChallenge = () => {
    setInputText('');
    setStartTime(null);
    setWpm(0);
    setIsFinished(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Split text for rendering correct/incorrect/pending characters
  const renderText = () => {
    return TARGET_TEXT.split('').map((char, index) => {
      let charClass = "opacity-30 text-gray-500";
      
      if (index < inputText.length) {
        if (inputText[index] === char) {
          charClass = "text-gamer-primary font-bold opacity-100 drop-shadow-[0_0_8px_rgba(255,70,85,0.8)]";
        } else {
          charClass = "text-white bg-gamer-primary opacity-100";
        }
      } else if (index === inputText.length && !isFinished) {
        charClass = "border-b-4 border-gamer-primary animate-pulse opacity-100 drop-shadow-[0_0_8px_rgba(255,70,85,0.8)]";
      }

      return (
        <span key={index} className={`transition-all duration-75 ${charClass}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <section className="w-full my-24 px-4 max-w-4xl mx-auto font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="text-4xl font-bold tracking-[0.2em] mb-4 flex items-center justify-center gap-4 text-white">
          <Terminal className="text-gamer-primary" size={36} />
          <span className="glitch" data-text="COMBAT LOGS">COMBAT LOGS</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-400 uppercase tracking-widest">
          Initiate training sequence to calibrate neural reaction speed.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative group p-[2px]"
      >
        <div className="absolute inset-0 val-clip bg-gamer-primary shadow-[0_0_20px_rgba(255,70,85,0.3)] opacity-70"></div>
        
        <div className="relative z-10 val-clip-inner bg-black p-8 flex flex-col items-center">
          
          <div className="w-full text-2xl md:text-3xl leading-relaxed mb-8 select-none p-6 bg-gray-900/50 border border-gray-800 tracking-wider">
            {renderText()}
          </div>

          {!isFinished ? (
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              className="w-full p-6 text-xl bg-black text-white border-2 border-gray-800 focus:border-gamer-primary outline-none transition-all duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,1)] tracking-wider uppercase"
              placeholder="AWAITING INPUT..."
              autoComplete="off"
              spellCheck="false"
            />
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center p-8 border-2 border-gamer-primary bg-gamer-primary/10 shadow-[inset_0_0_30px_rgba(255,70,85,0.2)]"
            >
              <Trophy size={64} className="mb-6 text-gamer-primary drop-shadow-[0_0_15px_rgba(255,70,85,0.8)]" />
              <h3 className="text-4xl font-bold mb-2 tracking-[0.2em] text-white">SIMULATION COMPLETE</h3>
              <p className="text-2xl mb-8 flex items-center gap-4 text-gray-300">
                REACTION RATING: <span className="text-5xl font-black text-gamer-primary drop-shadow-[0_0_10px_rgba(255,70,85,0.8)]">{wpm} WPM</span>
              </p>
              
              <button 
                onClick={resetChallenge}
                className="val-clip flex items-center gap-3 px-8 py-4 bg-gamer-primary text-black font-bold text-xl tracking-[0.2em] transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]"
              >
                <RotateCcw size={24} />
                RECALIBRATE
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default TypingSpeedChallenge;
