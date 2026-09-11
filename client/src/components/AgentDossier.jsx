import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Fingerprint, Database, Award, Zap } from 'lucide-react';

const AgentDossier = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
          
          {/* Main Modal Container */}
          <motion.div 
            className="relative w-full max-w-4xl bg-gamer-bg val-clip p-[2px] shadow-[0_0_50px_rgba(255,70,85,0.4)]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: [0, 0.8, 0.2, 1], 
              x: [50, -30, 10, 0],
              transition: { duration: 0.6, times: [0, 0.4, 0.7, 1], ease: "easeOut" }
            }}
            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
          >
            {/* Inner Content Area */}
            <div className="relative val-clip-inner bg-black w-full h-full p-8 md:p-12 overflow-hidden flex flex-col">
              
              {/* Scanline Animation */}
              <motion.div 
                className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gamer-primary/10 to-transparent pointer-events-none z-0"
                animate={{ top: ['-20%', '120%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Header */}
              <div className="relative z-10 flex justify-between items-start border-b-2 border-gamer-primary/30 pb-6 mb-8">
                <div className="flex items-center gap-4">
                  <ShieldAlert size={48} className="text-gamer-primary animate-pulse" />
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-[0.2em] glitch" data-text="AGENT DOSSIER">
                      AGENT DOSSIER
                    </h2>
                    <p className="text-gamer-primary font-mono tracking-widest mt-1">STATUS: ACTIVE // CLEARANCE: LEVEL 9</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="val-clip p-2 bg-gray-900 text-gray-400 hover:bg-gamer-primary hover:text-black transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              {/* Body */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 font-mono">
                
                {/* Identity Column */}
                <div className="flex flex-col gap-8">
                  <div className="border-l-4 border-gamer-primary pl-6 py-2 bg-gradient-to-r from-gamer-primary/10 to-transparent">
                    <p className="text-xs text-gray-500 tracking-widest mb-1">CODENAME</p>
                    <h3 className="text-3xl font-bold text-white tracking-wider">ALTAF</h3>
                    <div className="mt-4 text-gray-400 text-sm leading-relaxed">
                      Full-stack operative specializing in scalable web architectures, robust APIs, and high-performance React interfaces.
                    </div>
                  </div>

                  <div className="border border-gray-800 p-6 relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gamer-primary"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gamer-primary"></div>
                    
                    <h4 className="flex items-center gap-2 text-gamer-primary mb-4 font-bold tracking-widest">
                      <Fingerprint size={20} />
                      PRIMARY INTELLIGENCE
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-500 text-xs">MASTERS (MCA)</p>
                        <p className="text-xl text-white">Brainware University (2024-2026)</p>
                        <p className="text-sm font-black text-gamer-primary drop-shadow-[0_0_8px_rgba(255,70,85,0.6)]">CGPA: 9.25</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">BACHELORS (BCA)</p>
                        <p className="text-lg text-white">Brainware University (2021-2024)</p>
                        <p className="text-sm font-black text-gamer-primary drop-shadow-[0_0_8px_rgba(255,70,85,0.6)]">CGPA: 8.57</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Abilities Column */}
                <div className="flex flex-col gap-8">
                  <div className="border border-gray-800 p-6 relative bg-gamer-primary/5">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gamer-primary"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gamer-primary"></div>
                    
                    <h4 className="flex items-center gap-2 text-gamer-primary mb-4 font-bold tracking-widest">
                      <Zap size={20} />
                      PAST OPERATIONS
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-lg font-bold text-white mb-1">Real-Time Drowsiness Detector</p>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Engineered computer vision system (Python, OpenCV, dlib) to monitor 68 facial landmarks. Calculates EAR for real-time fatigue detection under low-light.
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white mb-1">Restaurant Management System</p>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Developed Node.js/Express backend using JWT for stateless sessions and Bcrypt. Built responsive interface for real-time API communication.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-800 p-4 flex flex-col items-center justify-center text-center">
                      <Database size={24} className="text-blue-400 mb-2" />
                      <p className="text-[10px] text-gray-500">MERN / SQL</p>
                      <p className="font-bold text-white text-sm">BACKEND</p>
                    </div>
                    <div className="border border-gray-800 p-4 flex flex-col items-center justify-center text-center">
                      <Award size={24} className="text-yellow-400 mb-2" />
                      <p className="text-[10px] text-gray-500">PYTHON / JS / DSA</p>
                      <p className="font-bold text-white text-sm">CORE SKILLS</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgentDossier;
