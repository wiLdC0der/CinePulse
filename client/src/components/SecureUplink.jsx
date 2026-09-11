import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Lock, Unlock } from 'lucide-react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

const DecryptInput = ({ type, placeholder, isGamerMode, isTextarea }) => {
  const [displayText, setDisplayText] = useState(placeholder);
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const intervalRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    if (!isGamerMode || value.length > 0) return;
    
    let iteration = 0;
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setDisplayText(placeholder
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return placeholder[index];
          }
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join('')
      );
      
      if (iteration >= placeholder.length) {
        clearInterval(intervalRef.current);
      }
      
      iteration += 1 / 3;
    }, 30);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value.length === 0) {
      clearInterval(intervalRef.current);
      setDisplayText(placeholder);
    }
  };

  const commonClasses = `w-full p-4 transition-all duration-300 outline-none ${
    isGamerMode 
      ? 'bg-black text-gamer-primary font-mono border-2 border-gray-800 focus:border-gamer-primary shadow-[inset_0_0_10px_rgba(0,0,0,1)] focus:shadow-[inset_0_0_15px_rgba(255,70,85,0.2)] placeholder:text-gray-600' 
      : 'bg-white/50 backdrop-blur-sm text-gray-900 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white placeholder:text-gray-400 shadow-inner'
  }`;

  return (
    <div className="relative mb-6">
      {/* HUD Label Effect */}
      {isGamerMode && (
        <div className={`absolute -top-3 left-4 px-2 text-[10px] tracking-widest font-bold transition-colors ${isFocused || value ? 'text-gamer-primary bg-black' : 'text-gray-700 bg-transparent'}`}>
          {placeholder.toUpperCase()}
        </div>
      )}
      
      {isTextarea ? (
        <textarea
          rows="4"
          className={`${commonClasses} resize-none`}
          placeholder={isGamerMode ? displayText : placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : (
        <input
          type={type}
          className={commonClasses}
          placeholder={isGamerMode ? displayText : placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
    </div>
  );
};

const SecureUplink = ({ isGamerMode }) => {
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsTransmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsTransmitting(false);
      alert(isGamerMode ? "TRANSMISSION SUCCESSFUL" : "Message sent successfully!");
    }, 2000);
  };

  return (
    <section id="contact-section" className="w-full my-32 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className={`text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-4 ${isGamerMode ? 'text-white tracking-[0.2em] glitch' : 'text-gray-900 tracking-tight'}`} data-text={isGamerMode ? "SECURE UPLINK" : "Contact Me"}>
          {isGamerMode ? <Lock className="text-gamer-primary" size={36} /> : null}
          {isGamerMode ? 'SECURE UPLINK' : 'Let\'s Connect'}
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${isGamerMode ? 'text-gray-400 font-mono tracking-widest uppercase' : 'text-gray-600'}`}>
          {isGamerMode ? 'Establish an encrypted connection to my mainframe.' : 'Have a project in mind or want to discuss opportunities? Reach out below.'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`relative p-[2px] ${!isGamerMode ? 'rounded-2xl' : ''}`}
      >
        {isGamerMode ? (
          <div className="absolute inset-0 val-clip bg-gamer-primary opacity-50 shadow-[0_0_20px_rgba(255,70,85,0.2)]"></div>
        ) : (
          <div className="absolute inset-0 rounded-2xl bg-white/40 backdrop-blur-lg border border-white shadow-[0_8px_30px_rgb(0,0,0,0.05)]"></div>
        )}

        <div className={`relative z-10 w-full p-8 md:p-12 ${isGamerMode ? 'val-clip-inner bg-black/90' : 'bg-transparent'}`}>
          <form onSubmit={handleSubmit} className="flex flex-col">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <DecryptInput type="text" placeholder="Designation (Name)" isGamerMode={isGamerMode} />
              <DecryptInput type="email" placeholder="Comms Channel (Email)" isGamerMode={isGamerMode} />
            </div>
            
            <DecryptInput isTextarea placeholder="Encrypted Payload (Message)" isGamerMode={isGamerMode} />

            <button
              type="submit"
              disabled={isTransmitting}
              className={`
                mt-4 flex items-center justify-center gap-3 py-4 px-8 font-bold transition-all duration-300 mx-auto min-w-[250px]
                ${isGamerMode 
                  ? 'val-clip bg-gamer-primary text-black tracking-[0.2em] uppercase text-lg shadow-[0_0_20px_rgba(255,70,85,0.8)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none' 
                  : 'rounded-full bg-blue-600 text-white text-lg shadow-md hover:bg-blue-700 hover:shadow-lg disabled:bg-blue-300'
                }
              `}
            >
              {isTransmitting ? (
                <>
                  <Unlock className="animate-pulse" size={24} />
                  <span>{isGamerMode ? 'TRANSMITTING...' : 'Sending...'}</span>
                </>
              ) : (
                <>
                  <Send size={24} />
                  <span>{isGamerMode ? 'INITIALIZE TRANSMISSION' : 'Send Message'}</span>
                </>
              )}
            </button>
            
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default SecureUplink;
