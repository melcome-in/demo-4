import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface WeddingEntranceSectionProps {
  config: WeddingConfig;
  onNextSection: () => void;
}

export const WeddingEntranceSection: React.FC<WeddingEntranceSectionProps> = ({
  config,
  onNextSection,
}) => {
  return (
    <section
      id="section-entrance"
      className="relative min-h-screen w-full flex flex-col justify-end items-center pb-20 px-6 md:px-14 pointer-events-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.9 }}
        className="mx-auto max-w-xl w-full text-center px-6 py-8 md:px-10 md:py-9 rounded-3xl bg-[#071624]/55 backdrop-blur-xl border border-[#dab87b]/35 shadow-[0_25px_80px_rgba(0,0,0,0.5)] pointer-events-auto"
      >
        <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#fcfaf5] font-light mb-3">
          “Welcome to our little paradise”
        </p>

        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl tracking-[0.22em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#f2e6cd] via-[#ffffff] to-[#dab87b] mb-3">
          {config.brideName} &amp; {config.groomName}
        </h1>

        <p className="text-xs uppercase tracking-[0.28em] text-white/75 mb-6">
          {config.weddingDateDisplay} • {config.destinationName}
        </p>

        <button
          type="button"
          onClick={onNextSection}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#dab87b]/50 text-[11px] uppercase tracking-[0.24em] text-[#fcfaf5] transition-all"
        >
          <span>Explore Invitation</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#dab87b]" />
        </button>
      </motion.div>
    </section>
  );
};
