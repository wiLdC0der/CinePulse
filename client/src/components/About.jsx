import { motion } from 'framer-motion';
import { User, Code2, Briefcase, GraduationCap } from 'lucide-react';

const About = ({ isGamerMode, timePhase }) => {
  const skills = [
    { name: 'Frontend', level: 90 },
    { name: 'Backend', level: 85 },
    { name: 'Database', level: 80 },
    { name: 'DevOps', level: 70 }
  ];

  const education = [
    {
      degree: 'Master of Computer Applications (MCA)',
      institution: 'University Name', // The user didn't specify, we'll leave it generic or blank
      period: '2024 - 2025',
      description: 'Advanced studies in computer science, software engineering, and application development.'
    },
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'University Name',
      period: '2021 - 2024',
      description: 'Foundational studies in programming, database management, and web technologies.'
    }
  ];

  let primaryText = isGamerMode ? 'text-white' : 'text-gray-900';
  let secondaryText = isGamerMode ? 'text-gray-400' : 'text-gray-600';
  let cardBg = isGamerMode ? 'bg-black/80 border-gamer-primary/30' : 'bg-white shadow-xl border-gray-100';

  if (!isGamerMode) {
    if (timePhase === 'evening') {
      primaryText = 'text-amber-50';
      secondaryText = 'text-amber-100/80';
      cardBg = 'bg-[#2a1b18] shadow-lg border-amber-900/30';
    } else if (timePhase === 'night') {
      primaryText = 'text-gray-50';
      secondaryText = 'text-gray-400';
      cardBg = 'bg-[#1a1a1a] shadow-lg border-gray-800';
    }
  }

  return (
    <section id="about-section" className="relative w-full py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className={`text-5xl font-black mb-4 ${isGamerMode ? 'tracking-[0.2em] text-gamer-primary glitch' : `tracking-tight ${primaryText}`}`} data-text="AGENT DOSSIER">
          {isGamerMode ? 'AGENT DOSSIER' : 'About Me'}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* About & Skills */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`relative p-[2px] ${!isGamerMode ? 'rounded-3xl' : ''}`}
        >
          {isGamerMode ? (
            <div className="absolute inset-0 val-clip bg-gamer-primary opacity-50 shadow-[0_0_20px_rgba(255,70,85,0.2)]"></div>
          ) : (
            <div className={`absolute inset-0 rounded-3xl border ${cardBg}`}></div>
          )}
          <div className={`relative z-10 w-full h-full p-8 md:p-10 ${isGamerMode ? 'val-clip-inner bg-black/90' : 'bg-transparent'}`}>
            <div className="flex items-center gap-3 mb-6">
              <User className={isGamerMode ? 'text-gamer-primary' : 'text-blue-600'} size={28} />
              <h3 className={`text-2xl font-bold ${primaryText}`}>The Developer</h3>
            </div>
            <p className={`mb-8 leading-relaxed ${secondaryText} ${isGamerMode ? 'font-mono text-sm' : ''}`}>
              I am a software engineer dedicated to building high-performance, accessible, and beautiful web experiences. 
              With a strong foundation in algorithmic problem-solving and full-stack development, I bridge the gap between complex backend logic and seamless frontend interfaces.
            </p>

            <div className="flex items-center gap-3 mb-6">
              <Code2 className={isGamerMode ? 'text-gamer-primary' : 'text-blue-600'} size={28} />
              <h3 className={`text-2xl font-bold ${primaryText}`}>Proficiency</h3>
            </div>
            <div className="space-y-6">
              {skills.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className={`font-medium ${primaryText} ${isGamerMode ? 'font-mono uppercase tracking-wider text-sm' : ''}`}>{skill.name}</span>
                    <span className={`${secondaryText} ${isGamerMode ? 'font-mono' : ''}`}>{skill.level}%</span>
                  </div>
                  <div className={`h-2 w-full rounded-full overflow-hidden ${isGamerMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${isGamerMode ? 'bg-gamer-primary shadow-[0_0_10px_rgba(255,70,85,0.8)]' : 'bg-blue-600'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`relative p-[2px] ${!isGamerMode ? 'rounded-3xl' : ''}`}
        >
          {isGamerMode ? (
            <div className="absolute inset-0 val-clip bg-gamer-primary opacity-50 shadow-[0_0_20px_rgba(255,70,85,0.2)]"></div>
          ) : (
            <div className={`absolute inset-0 rounded-3xl border ${cardBg}`}></div>
          )}
          <div className={`relative z-10 w-full h-full p-8 md:p-10 ${isGamerMode ? 'val-clip-inner bg-black/90' : 'bg-transparent'}`}>
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className={isGamerMode ? 'text-gamer-primary' : 'text-blue-600'} size={28} />
              <h3 className={`text-2xl font-bold ${primaryText}`}>Education</h3>
            </div>
            
            <div className="space-y-8">
              {education.map((edu, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-800">
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${isGamerMode ? 'bg-gamer-primary shadow-[0_0_10px_rgba(255,70,85,0.8)]' : 'bg-blue-600'}`}></div>
                  <div className={`text-sm font-bold mb-1 ${isGamerMode ? 'text-gamer-primary font-mono' : 'text-blue-600'}`}>{edu.period}</div>
                  <h4 className={`text-xl font-bold mb-1 ${primaryText}`}>{edu.degree}</h4>
                  <div className={`font-medium mb-3 ${isGamerMode ? 'text-gray-300 font-mono text-sm' : 'text-gray-600'}`}>
                    {isGamerMode ? 'INSTITUTION_RECORD' : 'Academic Record'}
                  </div>
                  <p className={`${secondaryText} ${isGamerMode ? 'font-mono text-sm' : ''}`}>{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
