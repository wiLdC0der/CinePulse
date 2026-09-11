import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ExternalLink, Code2, ArrowRight, Download, ChevronDown } from 'lucide-react';

const skills = [
  'React', 'Node.js', 'TypeScript', 'Next.js', 'MongoDB', 'Python', 'AWS', 'GraphQL', 'PostgreSQL'
];

const HeroSection = ({ isGamerMode, serverMessage, timePhase, onOpenResume }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Parallax Logic
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Typing effect state
  const [typingText, setTypingText] = useState("");
  const fullText = "Engineering Scalable Web Solutions.";
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypingText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  let primaryText = isGamerMode ? 'text-white' : 'text-gray-900';
  let secondaryText = isGamerMode ? 'text-gray-400' : 'text-gray-600';
  let normalCard = 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100';

  if (!isGamerMode) {
    if (timePhase === 'evening') {
      primaryText = 'text-amber-50';
      secondaryText = 'text-amber-100/80';
      normalCard = 'bg-[#2a1b18] shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-amber-900/50';
    } else if (timePhase === 'night') {
      primaryText = 'text-gray-50';
      secondaryText = 'text-gray-400';
      normalCard = 'bg-[#111] shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-800';
    }
  }

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects-section');
    if (projectsSection) projectsSection.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      style={{ y: parallaxY }}
      className="relative w-full flex flex-col items-center justify-center min-h-[80vh] pt-20 pb-10"
    >
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative w-full max-w-5xl mx-auto p-10 md:p-16 rounded-3xl z-10 transition-colors duration-500 ${
          isGamerMode 
            ? 'val-clip bg-black/80 border-2 border-gamer-primary/30 shadow-[0_0_40px_rgba(255,70,85,0.15)]' 
            : normalCard
        }`}
      >
        <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex flex-col items-start text-left md:items-center md:text-center">
          
          <div className={`mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide ${isGamerMode ? 'bg-gamer-primary/10 text-gamer-primary border border-gamer-primary/30' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isGamerMode ? 'bg-gamer-primary' : 'bg-blue-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isGamerMode ? 'bg-gamer-primary' : 'bg-blue-600'}`}></span>
            </span>
            Available for new opportunities
          </div>

          {/* Main Headings */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1]">
            <span 
              className={isGamerMode ? 'glitch text-white block tracking-[0.1em] mb-2' : `block mb-2 ${primaryText}`} 
              data-text="Hi, I'm Md Altaf Raja."
            >
              Hi, I'm Md Altaf Raja.
            </span>
            <span className={`block h-[1.2em] ${isGamerMode ? 'text-gamer-primary font-mono text-xl sm:text-3xl md:text-5xl' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-2xl sm:text-4xl md:text-5xl'}`}>
              {isGamerMode ? typingText : fullText}
              {isGamerMode && <span className="inline-block w-1 h-[1em] ml-1 align-middle animate-pulse bg-gamer-primary"></span>}
            </span>
          </h1>

          {/* Bio */}
          <p className={`text-lg sm:text-xl mb-8 sm:mb-10 max-w-3xl leading-relaxed ${isGamerMode ? 'text-gray-400 font-mono text-sm sm:text-base' : secondaryText}`}>
            A passionate Full-Stack Developer specializing in building high-performance web applications, optimizing complex architectures, and driving business impact through clean, maintainable code.
          </p>

          {/* CTAs */}
          <div style={{ transform: "translateZ(40px)" }} className="flex flex-col sm:flex-row gap-4 mb-14 w-full md:w-auto justify-center">
            <button 
              onClick={scrollToProjects}
              className={`group flex items-center justify-center gap-2 px-8 py-4 font-bold transition-all ${
                isGamerMode 
                  ? 'val-clip bg-gamer-primary text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]' 
                  : 'rounded-full bg-gray-900 text-white shadow-lg hover:shadow-xl hover:bg-gray-800 hover:-translate-y-1'
              }`}
            >
              <span>View Projects</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={scrollToContact}
              className={`group flex items-center justify-center gap-2 px-8 py-4 font-bold transition-all ${
                isGamerMode 
                  ? 'val-clip bg-transparent border border-gamer-primary/50 text-gamer-primary hover:bg-gamer-primary/10' 
                  : 'rounded-full bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50 hover:-translate-y-1'
              }`}
            >
              <span>Hire Me</span>
            </button>
            <button 
              onClick={onOpenResume}
              className={`group flex items-center justify-center gap-2 px-8 py-4 font-bold transition-all ${
                isGamerMode 
                  ? 'val-clip bg-transparent border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400' 
                  : 'rounded-full bg-transparent text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors'
              }`}
            >
              <Download size={18} />
              <span>Resume</span>
            </button>
          </div>

          {/* Tech Stack Bar */}
          <div style={{ transform: "translateZ(20px)" }} className="w-full max-w-4xl border-t border-gray-200/20 pt-8 mt-4">
            <p className={`text-sm font-semibold uppercase tracking-widest mb-6 opacity-70 text-center ${isGamerMode ? 'text-gamer-primary' : secondaryText}`}>
              Core Technologies
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((tech, index) => (
                <motion.div 
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 + 0.5 }}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    isGamerMode 
                      ? 'bg-black/50 border border-gray-800 text-gray-300 hover:border-gamer-primary hover:text-gamer-primary' 
                      : 'rounded-lg bg-gray-50 border border-gray-100 text-gray-700 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className={`absolute bottom-[-40px] md:bottom-[-60px] flex flex-col items-center opacity-70 ${isGamerMode ? 'text-gamer-primary' : 'text-gray-500'}`}
      >
        <span className="text-xs uppercase tracking-widest font-semibold mb-2">Scroll</span>
        <ChevronDown size={24} />
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;

