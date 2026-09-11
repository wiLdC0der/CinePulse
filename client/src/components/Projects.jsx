import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Code, Activity, Server, Layout, CheckCircle2 } from 'lucide-react';

const Waveform = ({ isGamerMode }) => {
  return (
    <div className="flex items-end gap-1.5 h-16 opacity-80 mt-4">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-2 rounded-t-sm ${isGamerMode ? 'bg-gamer-primary' : 'bg-blue-500'}`}
          animate={{ height: ["20%", "100%", "20%"] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
        />
      ))}
    </div>
  );
};

const ProjectCard = ({ project, index, isGamerMode, primaryText, secondaryText, timePhase }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const glitchVariant = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const normalVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  let normalCardClass = 'bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300';
  if (!isGamerMode) {
    if (timePhase === 'evening') {
      normalCardClass = 'bg-[#2a1b18] shadow-lg border border-amber-900/30';
    } else if (timePhase === 'night') {
      normalCardClass = 'bg-[#1a1a1a] shadow-lg border border-gray-800';
    }
  }

  return (
    <motion.div
      ref={cardRef}
      variants={isGamerMode ? glitchVariant : normalVariant}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={isGamerMode ? { scale: 1.02 } : {}}
      style={!isGamerMode ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
      className={`group relative w-full mb-16 last:mb-0 rounded-2xl overflow-hidden
        ${project.featured ? 'min-h-[500px]' : 'min-h-[400px]'}
        ${isGamerMode ? 'z-0' : normalCardClass}`}
    >
      {isGamerMode && (
        <>
          <div className={`absolute inset-0 val-clip transition-all duration-500 bg-gamer-primary ${project.featured ? 'shadow-[0_0_30px_rgba(255,70,85,0.6)] animate-[pulse_3s_ease-in-out_infinite]' : 'opacity-40 group-hover:shadow-[0_0_20px_rgba(255,70,85,0.8)] group-hover:opacity-100'}`}></div>
          <div className="absolute inset-0 val-clip-inner bg-gamer-bg m-[2px] z-0 overflow-hidden">
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gamer-primary/70"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gamer-primary/70"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gamer-primary/70"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gamer-primary/70"></div>
            <div className={`absolute bottom-0 left-0 h-1 bg-gamer-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,70,85,1)] w-0 group-hover:w-full`}></div>
          </div>
        </>
      )}

      <div className={`relative z-10 flex flex-col h-full p-6 md:p-10 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`} style={!isGamerMode ? { transform: "translateZ(30px)" } : {}}>
        
        {/* Project Visual/Preview */}
        <div className={`w-full md:w-1/2 aspect-video rounded-xl flex flex-col items-center justify-center relative overflow-hidden group-hover:shadow-2xl transition-all duration-500 ${isGamerMode ? 'bg-black border border-gamer-primary/30' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
          <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105" style={{ backgroundImage: `url(${project.image || ''})` }}></div>
          {!project.image && (
             <div className="relative z-10 flex flex-col items-center">
               <Activity className={isGamerMode ? 'text-gamer-primary mb-2 opacity-50' : 'text-blue-500 mb-2 opacity-50'} size={32} />
               <span className={`font-medium ${isGamerMode ? 'text-gamer-primary/80 font-mono tracking-widest text-sm' : 'text-gray-500'}`}>PREVIEW</span>
               {isGamerMode && <Waveform isGamerMode={isGamerMode} />}
             </div>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm">
            <a href={project.demo} className={`px-6 py-3 font-bold rounded-full ${isGamerMode ? 'bg-gamer-primary text-black val-clip' : 'bg-white text-black'}`}>View Live Demo</a>
          </div>
        </div>
        
        {/* Project Details */}
        <div className="flex flex-col flex-grow w-full md:w-1/2">
          {project.featured && (
            <div className={`text-sm font-bold uppercase tracking-widest mb-3 ${isGamerMode ? 'text-gamer-primary drop-shadow-[0_0_5px_rgba(255,70,85,0.8)] glitch' : 'text-blue-600'}`} data-text="FEATURED PROTOCOL">
              {isGamerMode ? 'FEATURED PROTOCOL' : 'Featured Project'}
            </div>
          )}
          
          <h3 className={`text-3xl md:text-4xl font-extrabold mb-4 tracking-tight ${isGamerMode ? 'text-white' : primaryText}`}>{project.title}</h3>
          
          <div className={`mb-6 space-y-4 ${isGamerMode ? 'text-gray-400 font-mono text-sm' : secondaryText}`}>
            <div>
              <span className={`font-bold block mb-1 ${isGamerMode ? 'text-gray-300' : primaryText}`}>The Problem:</span>
              <p>{project.problem}</p>
            </div>
            <div>
              <span className={`font-bold block mb-1 ${isGamerMode ? 'text-gray-300' : primaryText}`}>The Solution:</span>
              <p>{project.solution}</p>
            </div>
          </div>

          <div className="mb-6">
            <span className={`font-bold block mb-2 text-sm uppercase tracking-wider ${isGamerMode ? 'text-gamer-primary' : primaryText}`}>Key Features:</span>
            <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ${isGamerMode ? 'text-gray-400 font-mono' : secondaryText}`}>
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className={isGamerMode ? 'text-gamer-primary' : 'text-blue-500'} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map(t => (
              <span 
                key={t} 
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                  isGamerMode 
                    ? 'bg-gamer-primary/10 text-gamer-primary border border-gamer-primary/20' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-4 mt-auto">
            <a 
              href={project.github} 
              className={`flex items-center gap-2 font-bold px-6 py-3 transition-all ${
                isGamerMode 
                  ? 'val-clip bg-gray-900 text-gray-300 hover:bg-white hover:text-black border border-gray-700' 
                  : 'rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 font-semibold'
              }`}
            >
              <Code size={18} />
              <span className={isGamerMode ? 'tracking-widest text-xs' : ''}>Source Code</span>
            </a>
            <a 
              href={project.demo} 
              className={`flex items-center gap-2 font-bold px-6 py-3 transition-all text-white ${
                isGamerMode 
                  ? 'val-clip bg-gamer-primary hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.8)]' 
                  : 'rounded-full bg-gray-900 hover:bg-black shadow-md'
              }`}
            >
              <ExternalLink size={18} />
              <span className={isGamerMode ? 'tracking-widest text-xs' : ''}>Live Demo</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = ({ isGamerMode, timePhase }) => {
  const projects = [
    {
      id: 1,
      title: "Mobile Screen Recorder with Rolling Buffer",
      problem: "Traditional screen recorders fill up storage quickly and cause thermal throttling during long gaming sessions.",
      solution: "A high-performance Android screen recorder utilizing a circular buffer to continuously record but only save the last N minutes when triggered.",
      features: ["Rolling buffer architecture", "Minimal battery impact", "Hardware accelerated encoding", "Direct-to-memory write"],
      tech: ["Android", "Java", "MediaCodec", "FFmpeg", "C++"],
      featured: true,
      github: "#",
      demo: "#",
      image: ""
    },
    {
      id: 2,
      title: "E-Commerce AI Dashboard",
      problem: "Store owners struggle to make sense of complex sales data and predict future inventory needs.",
      solution: "A comprehensive admin dashboard with real-time analytics and predictive inventory modeling powered by machine learning.",
      features: ["Real-time sales tracking", "Predictive ML models", "Automated reordering", "Role-based access control"],
      tech: ["React", "Node.js", "Python", "MongoDB", "Tailwind"],
      featured: false,
      github: "#",
      demo: "#",
      image: ""
    },
    {
      id: 3,
      title: "Task Master AI",
      problem: "Standard to-do lists rely on manual prioritization, leading to decision fatigue and missed deadlines.",
      solution: "An intelligent task management app that auto-prioritizes your workflow based on context, habits, and urgency.",
      features: ["Context-aware prioritization", "NLP task entry", "Calendar integration", "Productivity analytics"],
      tech: ["Next.js", "OpenAI API", "PostgreSQL", "Prisma"],
      featured: false,
      github: "#",
      demo: "#",
      image: ""
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  let primaryText = isGamerMode ? 'text-white' : 'text-gray-900';
  let secondaryText = isGamerMode ? 'text-gray-400' : 'text-gray-600';

  if (!isGamerMode) {
    if (timePhase === 'evening') {
      primaryText = 'text-amber-50';
      secondaryText = 'text-amber-100/80';
    } else if (timePhase === 'night') {
      primaryText = 'text-gray-50';
      secondaryText = 'text-gray-400';
    }
  }

  return (
    <section id="projects-section" className="relative w-full py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-24"
      >
        <h2 className={`text-5xl md:text-6xl font-black mb-6 ${isGamerMode ? 'tracking-[0.2em] text-gamer-primary glitch' : `tracking-tight ${primaryText}`}`} data-text="FEATURED ARSENAL">
          {isGamerMode ? 'FEATURED ARSENAL' : 'Selected Works'}
        </h2>
        <p className={`text-xl max-w-3xl mx-auto ${isGamerMode ? 'text-gray-400 font-mono tracking-widest uppercase' : secondaryText}`}>
          A collection of projects showcasing my expertise in solving complex problems through robust software engineering.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-8 w-full"
      >
        {projects.map((project, index) => (
          <motion.div key={project.id} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} className="w-full">
            <ProjectCard 
              project={project} 
              index={index} 
              isGamerMode={isGamerMode} 
              primaryText={primaryText}
              secondaryText={secondaryText}
              timePhase={timePhase}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;
