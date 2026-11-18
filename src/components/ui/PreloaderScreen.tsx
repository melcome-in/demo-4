import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeddingConfig } from '../../types/wedding';

interface PreloaderScreenProps {
  config: WeddingConfig;
  onFinished: () => void;
}

export const PreloaderScreen: React.FC<PreloaderScreenProps> = ({
  config,
  onFinished,
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 1750;

    let rafId = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          onFinished();
        }, 320);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onFinished]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#06111b] text-[#fcfaf5] px-6 select-none"
        >
          {/* Ambient radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,142,200,0.18)_0%,rgba(6,17,27,0.96)_70%)] pointer-events-none" />

          {/* Architectural Blue Door Crest SVG */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mb-8 flex flex-col items-center"
          >
            <div className="w-20 h-28 rounded-t-full border border-[#dab87b]/50 p-1.5 flex items-center justify-center shadow-[0_0_50px_rgba(45,142,200,0.28)] bg-[#0b2236]/80">
              <div className="w-full h-full rounded-t-full border border-[#55abdd]/40 grid grid-cols-2 overflow-hidden">
                <div className="border-r border-[#dab87b]/40 bg-gradient-to-b from-[#1e5b86] to-[#123a58] flex items-center justify-end pr-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dab87b]" />
                </div>
                <div className="bg-gradient-to-b from-[#1e5b86] to-[#123a58] flex items-center justify-start pl-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dab87b]" />
                </div>
              </div>
            </div>

            <span className="mt-5 text-[11px] uppercase tracking-[0.42em] text-[#dab87b]/90 font-display">
              {config.brandTitle}
            </span>
          </motion.div>

          {/* Couple Names */}
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-serif text-3xl md:text-5xl font-light tracking-[0.12em] text-center text-[#fcfaf5] mb-3"
          >
            {config.brideName}{' '}
            <span className="italic text-[#dab87b] font-normal">&amp;</span>{' '}
            {config.groomName}
          </motion.h1>

          <p className="text-xs uppercase tracking-[0.3em] text-[#8cc9ea]/80 mb-8 text-center">
            Preparing 3D Villa Architecture &amp; Coastal Shaders • {progress}%
          </p>

          {/* Progress Bar */}
          <div className="w-64 md:w-80 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2d8ec8] via-[#dab87b] to-[#8cc9ea]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 text-[10px] tracking-[0.28em] text-white/40 uppercase">
            {config.coordinates}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
