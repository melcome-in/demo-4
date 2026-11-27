import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface FinalSunsetSectionProps {
  config: WeddingConfig;
  onScrollToRsvp: () => void;
  onReplayBlueDoor: () => void;
}

export const FinalSunsetSection: React.FC<FinalSunsetSectionProps> = ({
  config,
  onScrollToRsvp,
}) => {
  return (
    <section
      id="section-finale"
      className="relative py-24 pb-32 lg:pb-28 px-4 sm:px-6 md:px-14 pointer-events-auto flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.9 }}
        className="max-w-2xl w-full text-center px-6 py-12 md:px-12 md:py-14 rounded-[2.2rem] bg-[#071522]/72 backdrop-blur-2xl border border-[#dab87b]/40 shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
      >
        <h2 className="font-serif italic text-3xl sm:text-5xl font-light text-[#fcfaf5] leading-tight mb-5">
          “We can't wait to celebrate with you.”
        </h2>

        <div className="font-display text-2xl sm:text-4xl tracking-[0.22em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#f2e6cd] via-white to-[#dab87b] mb-8">
          {config.brideName} &amp; {config.groomName}
        </div>

        <button
          type="button"
          onClick={onScrollToRsvp}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#184d73] via-[#246d9e] to-[#184d73] border border-[#dab87b]/70 text-xs uppercase tracking-[0.28em] text-white font-display hover:scale-105 transition-all"
        >
          <Heart className="w-3.5 h-3.5 text-[#dab87b] fill-[#dab87b]/30" />
          <span>RSVP Now</span>
        </button>
      </motion.div>
    </section>
  );
};
