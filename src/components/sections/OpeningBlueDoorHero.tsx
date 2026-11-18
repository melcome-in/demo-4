import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Volume2, SlidersHorizontal } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface OpeningBlueDoorHeroProps {
  config: WeddingConfig;
  isDoorOpened: boolean;
  isOpeningInProgress: boolean;
  onOpenDoor: () => void;
  onOpenCustomizer: () => void;
}

export const OpeningBlueDoorHero: React.FC<OpeningBlueDoorHeroProps> = ({
  config,
  isDoorOpened,
  isOpeningInProgress,
  onOpenDoor,
  onOpenCustomizer,
}) => {
  return (
    <AnimatePresence>
      {!isDoorOpened && (
        <motion.section
          key="blue-door-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.1, ease: 'easeInOut' } }}
          className="fixed inset-0 z-30 flex flex-col justify-between items-center p-6 md:p-10 pointer-events-none select-none"
        >
          {/* Subtle Cinematic Vignette framing the 3D Blue Door */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,19,30,0.22)_0%,rgba(7,19,30,0.68)_95%)] pointer-events-none" />

          {/* Top Bar: Melcome Crest & Quick Personalize Trigger */}
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{
              y: 0,
              opacity: isOpeningInProgress ? 0 : 1,
            }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-6xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#55abdd] shadow-[0_0_12px_#55abdd]" />
              <span className="text-[11px] md:text-xs font-display tracking-[0.35em] uppercase text-[#fcfaf5]/90">
                {config.brandTitle}
              </span>
            </div>

            <button
              type="button"
              onClick={onOpenCustomizer}
              className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#091c2b]/75 hover:bg-[#12334d]/90 border border-[#dab87b]/35 text-[11px] tracking-[0.2em] uppercase text-[#f2e6cd] backdrop-blur-md transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#dab87b]" />
              <span>Personalize Names</span>
            </button>
          </motion.div>

          {/* Center Invitation Focal Card */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{
              scale: isOpeningInProgress ? 1.08 : 1,
              opacity: isOpeningInProgress ? 0 : 1,
              y: isOpeningInProgress ? -18 : 0,
            }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative z-10 max-w-2xl w-full text-center px-6 py-9 md:px-12 md:py-12 rounded-3xl bg-[#071624]/60 backdrop-blur-md border border-white/15 shadow-[0_25px_90px_rgba(0,0,0,0.65)]"
          >
            {/* Decorative Gold Filigree Header */}
            <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-white/5 border border-[#dab87b]/30 text-[10px] md:text-[11px] uppercase tracking-[0.34em] text-[#e7d2a7] mb-5">
              <Sparkles className="w-3 h-3 text-[#dab87b]" />
              <span>{config.destinationName}</span>
            </div>

            {/* Couple Monogram Preview */}
            <div className="text-xs md:text-sm font-display uppercase tracking-[0.38em] text-[#8cc9ea] mb-3">
              {config.brideName} &amp; {config.groomName}
            </div>

            {/* Required Central Opening Quote */}
            <h1 className="font-serif italic text-2xl sm:text-4xl md:text-[42px] leading-[1.28] font-light text-[#fcfaf5] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] mb-8">
              “Some beautiful moments deserve a beautiful beginning.”
            </h1>

            {/* Required CTA Button: [ OPEN YOUR INVITATION ] */}
            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                disabled={isOpeningInProgress}
                onClick={onOpenDoor}
                className="pointer-events-auto group relative inline-flex items-center justify-center px-8 py-4 md:px-11 md:py-5 rounded-full bg-gradient-to-r from-[#184d73] via-[#246d9e] to-[#184d73] text-[#fcfaf5] font-display text-xs md:text-sm tracking-[0.32em] uppercase border border-[#dab87b]/60 shadow-[0_0_45px_rgba(45,142,200,0.45)] hover:shadow-[0_0_65px_rgba(218,184,123,0.65)] hover:border-[#f2e6cd] hover:scale-[1.03] active:scale-[0.99] transition-all duration-500 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-[#dab87b] opacity-80">[</span>
                  <span>OPEN YOUR INVITATION</span>
                  <span className="text-[#dab87b] opacity-80">]</span>
                </span>
              </button>

              <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-white/60">
                <Volume2 className="w-3.5 h-3.5 text-[#8cc9ea]" />
                <span>Interactive 3D Experience with Coastal Soundscape</span>
              </div>
            </div>
          </motion.div>

          {/* Bottom Destination Coordinates & Status during Door Opening */}
          <div className="relative z-10 flex flex-col items-center gap-2 text-center">
            {isOpeningInProgress ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 py-2 rounded-full bg-[#091e30]/80 border border-[#dab87b]/40 backdrop-blur-md text-xs uppercase tracking-[0.32em] text-[#f2e6cd]"
              >
                Stepping Through The Blue Door into Paradise...
              </motion.div>
            ) : (
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.34em] text-white/55">
                {config.weddingDateDisplay} • {config.destinationLocation}
              </div>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
