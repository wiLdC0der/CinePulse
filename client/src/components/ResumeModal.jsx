import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin } from 'lucide-react';

const ResumeModal = ({ isOpen, onClose }) => {
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
          
          {/* Main Modal Container */}
          <motion.div 
            className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-200"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.3 } }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
          >
            {/* Header & Close Button */}
            <div className="flex justify-end p-4 absolute top-0 right-0 z-10">
              <button 
                onClick={onClose}
                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 md:p-12 overflow-y-auto text-gray-800 font-serif">
              
              {/* Header Section */}
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Md Altaf Raja</h1>
                <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600 font-sans">
                  <a href="mailto:md9altaf@gmail.com" className="flex items-center gap-1 hover:text-blue-600">
                    <Mail size={16} /> md9altaf@gmail.com
                  </a>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Phone size={16} /> +91-7044688393
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={16} /> Kolkata, West Bengal
                  </span>
                </div>
              </div>

              {/* Career Summary */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-500 tracking-wider uppercase border-b-2 border-gray-200 pb-2 mb-4 font-sans">
                  Career Summary
                </h2>
                <p className="leading-relaxed text-gray-700">
                  Aspiring Software Engineer and current MCA student with a strong foundation in <strong>Web Development</strong> and <strong>Data Structures and Algorithms (DSA)</strong>. Proficient in building responsive, user-centric interfaces using JavaScript. Passionate about learning new technologies, building web applications, and continuously improving coding skills. Seeking an opportunity to learn, grow, and contribute as a developer.
                </p>
              </div>

              {/* Technical Skills */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-500 tracking-wider uppercase border-b-2 border-gray-200 pb-2 mb-4 font-sans">
                  Technical Skills
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Programming:</strong> Python, JavaScript</li>
                  <li><strong>Frontend Technologies:</strong> HTML, CSS</li>
                  <li><strong>Backend Technologies:</strong> Node.js (NodeJS), Express.js, REST APIs</li>
                  <li><strong>CS Fundamentals:</strong> Data Structures & Algorithms (DSA)</li>
                  <li><strong>Database:</strong> SQL</li>
                </ul>
              </div>

              {/* Projects */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-500 tracking-wider uppercase border-b-2 border-gray-200 pb-2 mb-4 font-sans">
                  Projects
                </h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Drowsiness Detector System</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                    <li><strong>Facial Landmark Analysis:</strong> Engineered a computer vision system using <strong>Python, OpenCV, and dlib</strong> to monitor <strong>68 facial landmarks</strong> and calculate <strong>Eye Aspect Ratio (EAR)</strong> for real-time fatigue detection.</li>
                    <li><strong>Robust Signal Processing:</strong> Implemented <strong>Histogram Equalization</strong> and frame-counter logic to maintain high accuracy under <strong>low-lighting conditions</strong>.</li>
                    <li>Developed a responsive frontend using <strong>JavaScript</strong> to visualize session analytics, live video feed telemetry, and automated emergency alert panels.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Restaurant Management System</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                    <li><strong>Secure Auth Architecture:</strong> Developed a <strong>Node.js/Express</strong> backend using <strong>JWT</strong> for stateless sessions and <strong>Bcrypt</strong> for password hashing.</li>
                    <li><strong>Frontend Integration:</strong> Built a responsive interface to handle real-time table status updates via <strong>RESTful API</strong> communication.</li>
                    <li><strong>Session Management:</strong> Implemented client-side protected routes by validating backend tokens stored in LocalStorage for secure access.</li>
                  </ul>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-lg font-bold text-gray-500 tracking-wider uppercase border-b-2 border-gray-200 pb-2 mb-4 font-sans">
                  Education
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Master of Computer Applications, Brainware University</strong> | 2024 - 2026 | Current CGPA: <strong>9.25</strong></li>
                  <li><strong>Bachelor of Computer Applications, Brainware University</strong> | 2021 - 2024 | CGPA: <strong>8.57</strong></li>
                </ul>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal;
