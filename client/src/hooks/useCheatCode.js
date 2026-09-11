import { useState, useEffect } from 'react';

export const useCheatCode = (secretCode = 'ACE') => {
  const [success, setSuccess] = useState(false);
  const [inputBuffer, setInputBuffer] = useState('');

  const playActivationSound = () => {
    try {
      // Create Web Audio API context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      
      // Create oscillator (the sound source)
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Sound parameters for a "tactical activation beep"
      osc.type = 'sawtooth';
      
      // Frequency slide (sci-fi activation effect)
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
      
      // Volume envelope (fade out)
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Web Audio API not supported', e);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      
      // Ignore long modifier keys to keep buffer clean
      if (key.length > 1) return;

      setInputBuffer((prev) => {
        const newBuffer = (prev + key).slice(-secretCode.length);
        if (newBuffer === secretCode) {
          setSuccess(true);
          playActivationSound();
          // Reset success state after a brief moment so it can be triggered again
          setTimeout(() => setSuccess(false), 500);
          return ''; // clear buffer
        }
        return newBuffer;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [secretCode]);

  return success;
};
