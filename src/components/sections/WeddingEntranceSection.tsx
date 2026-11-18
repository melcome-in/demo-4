import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, ArrowDown } from 'lucide-react';
import { CameraPresetId, WeddingConfig } from '../../types/wedding';

interface WeddingEntranceSectionProps {
  config: WeddingConfig;
  onSelectCameraPreset: (preset: CameraPresetId) => void;
  onNextSection: () => void;
}

export const WeddingEntranceSection: React.FC<WeddingEntranceSectionProps> = ({
  config,
  onSelectCameraPreset,
  onNextSection,
}) => {
  return (
    <section
      id="section-entrance"
      className="relative min-h-screen w-full flex flex-col justify-between py-28 px-6 md:px-14 pointer-events-none"
    >
      {/* Top Left Environmental Chapter Marker */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.9 }}
        className="max-w-md pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#071624]/70 backdrop-blur-md border border-[#8cc9ea]/35 text-[10px] uppercase tracking-[0.3em] text-[#8cc9ea] mb-3">
          <Compass className="w-3.5 h-3.5 text-[#dab87b]" />
          <span>Chapter I • Beyond The Blue Door</span>
        </div>
        <p className="text-xs md:text-sm text-white/80 leading-relaxed bg-[#071624]/55 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          A white limestone pathway framed by wild magenta bougainvillea, billowing ivory silk floral arches, swaying coconut palms, and warm brass candle lanterns leading toward the turquoise sea.
        </p>
      </motion.div>

      {/* Center / Bottom-Center Welcome Card required by Section 3 */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 1.0 }}
        className="mx-auto max-w-2xl w-full text-center px-6 py-8 md:px-12 md:py-10 rounded-3xl bg-[#071624]/65 backdrop-blur-xl border border-[#dab87b]/35 shadow-[0_25px_80px_rgba(0,0,0,0.6)] pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.36em] text-[#dab87b] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Wedding Entrance</span>
        </div>

        {/* Exact Required Welcome Message */}
        <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#fcfaf5] font-light mb-4 drop-shadow">
          “Welcome to our little paradise”
        </p>

        {/* Exact Required [BRIDE NAME] & [GROOM NAME] */}
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl tracking-[0.22em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#f2e6cd] via-[#ffffff] to-[#dab87b] mb-6">
          {config.brideName} &amp; {config.groomName}
        </h2>

        {/* Interactive Aisle Inspection Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => onSelectCameraPreset('aisle-walk')}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#2d8ec8]/40 border border-white/20 text-[11px] uppercase tracking-[0.2em] text-white transition-all"
          >
            Inspect Aisle Walk
          </button>
          <button
            type="button"
            onClick={() => onSelectCameraPreset('door-exterior')}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-[11px] uppercase tracking-[0.2em] text-white/80 transition-all"
          >
            Look Back at Blue Door
          </button>
          <button
            type="button"
            onClick={onNextSection}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#1e71aa] to-[#2d8ec8] border border-[#dab87b]/50 text-[11px] uppercase tracking-[0.22em] text-white shadow-lg transition-all"
          >
            <span>Approach The Ocean Stage</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};
