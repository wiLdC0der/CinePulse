import { motion } from 'framer-motion';

const DynamicSky = ({ timePhase }) => {
  const isDay = timePhase === 'morning' || timePhase === 'afternoon';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {isDay ? (
        // Clouds for Morning/Afternoon
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute bg-white/20 blur-3xl rounded-full"
              style={{
                width: `${Math.random() * 300 + 200}px`,
                height: `${Math.random() * 100 + 100}px`,
                top: `${Math.random() * 60}%`,
              }}
              initial={{ x: '-100vw', opacity: 0.2 }}
              animate={{ x: '100vw', opacity: 0.6 }}
              transition={{
                duration: Math.random() * 40 + 40,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 20,
              }}
            />
          ))}
        </>
      ) : (
        // Stars for Evening/Night
        <>
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: Math.random() }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default DynamicSky;
