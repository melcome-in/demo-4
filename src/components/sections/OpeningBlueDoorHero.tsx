import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
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
  onOpenCustomizer,
}) => {
  return (
    <AnimatePresence>
      {!isDoorOpened && (
        <motion.section
          key="blue-door-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.0, ease: 'easeInOut' } }}
          className="fixed inset-0 z-30 flex flex-col justify-between items-center p-5 md:p-8 pointer-events-none select-none"
        >
          {/* Top Bar: Melcome Crest, Quote at top edge (never blocking the Blue Door), & Personalize Trigger */}
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{
              y: 0,
              opacity: isOpeningInProgress ? 0 : 1,
            }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-2"
          >
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#071624]/55 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-[#55abdd] shadow-[0_0_10px_#55abdd]" />
                <span className="text-[10px] md:text-xs font-display tracking-[0.32em] uppercase text-[#fcfaf5]">
                  {config.brandTitle}
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenCustomizer}
                className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071624]/65 hover:bg-[#12334d]/90 border border-[#dab87b]/40 text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#f2e6cd] backdrop-blur-md transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#dab87b]" />
                <span>Personalize Names</span>
              </button>
            </div>
          </motion.div>

          {/* Center of Screen: 100% Clear & Unobstructed View of the 3D Blue Door */}
          {/* Subtle pointer-events-none pulse indicator right over the Brass Door Handles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: isOpeningInProgress ? 0 : 1,
              scale: isOpeningInProgress ? 1.15 : 1,
            }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center pointer-events-none mt-10"
          >
            <div className="relative flex items-center justify-center">
              <span className="w-14 h-14 rounded-full border border-[#dab87b]/70 animate-ping absolute" />
              <span className="w-11 h-11 rounded-full bg-[#071624]/45 backdrop-blur-sm border border-[#dab87b] flex items-center justify-center shadow-[0_0_25px_rgba(218,184,123,0.7)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dab87b]" />
              </span>
            </div>
            <span className="mt-3 px-4 py-1.5 rounded-full bg-[#071624]/70 backdrop-blur-md border border-[#dab87b]/50 text-[10px] md:text-[11px] font-display uppercase tracking-[0.32em] text-[#fcfaf5] shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              Touch The Blue Door To Open
            </span>
          </motion.div>

          {/* Bottom Couple & Destination Footer */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
            {isOpeningInProgress ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 py-2 rounded-full bg-[#091e30]/80 border border-[#dab87b]/40 backdrop-blur-md text-xs uppercase tracking-[0.32em] text-[#f2e6cd]"
              >
                Opening The Blue Door...
              </motion.div>
            ) : (
              <div className="px-5 py-2 rounded-full bg-[#071624]/60 backdrop-blur-md border border-white/15 text-[10px] md:text-xs uppercase tracking-[0.32em] text-[#f2e6cd]">
                {config.brideName} &amp; {config.groomName} • {config.destinationName}
              </div>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
