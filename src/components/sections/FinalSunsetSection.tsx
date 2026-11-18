import React from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, Sparkles, Heart, ArrowUp } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface FinalSunsetSectionProps {
  config: WeddingConfig;
  onScrollToRsvp: () => void;
  onReplayBlueDoor: () => void;
}

export const FinalSunsetSection: React.FC<FinalSunsetSectionProps> = ({
  config,
  onScrollToRsvp,
  onReplayBlueDoor,
}) => {
  return (
    <section
      id="section-finale"
      className="relative min-h-screen w-full flex flex-col justify-between items-center py-24 px-6 md:px-14 pointer-events-auto"
    >
      <div />

      {/* Center Sunset Finale Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 1.1 }}
        className="max-w-3xl w-full text-center px-6 py-12 md:px-14 md:py-16 rounded-[2.5rem] bg-[#071522]/70 backdrop-blur-2xl border border-[#dab87b]/45 shadow-[0_30px_100px_rgba(0,0,0,0.75)] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,157,92,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#dab87b]/35 text-[10px] uppercase tracking-[0.34em] text-[#dab87b] mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Twilight Over Villa Azurea</span>
          </div>

          {/* Exact Required Final Quote */}
          <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl font-light text-[#fcfaf5] leading-tight mb-6 drop-shadow-[0_6px_30px_rgba(0,0,0,0.85)]">
            “We can't wait to celebrate with you.”
          </h2>

          {/* Exact Required [BRIDE NAME] & [GROOM NAME] */}
          <div className="font-display text-2xl sm:text-4xl md:text-5xl tracking-[0.22em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#f2e6cd] via-white to-[#dab87b] mb-8">
            {config.brideName} &amp; {config.groomName}
          </div>

          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#8cc9ea] mb-10">
            {config.weddingDateDisplay} • {config.destinationName}
          </p>

          {/* Final RSVP CTA Button & Replay Door Opening */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onScrollToRsvp}
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-[#184d73] via-[#246d9e] to-[#184d73] border border-[#dab87b]/70 text-xs uppercase tracking-[0.3em] text-white font-display shadow-[0_0_45px_rgba(218,184,123,0.45)] hover:shadow-[0_0_65px_rgba(218,184,123,0.75)] hover:scale-105 transition-all"
            >
              <Heart className="w-3.5 h-3.5 text-[#dab87b] fill-[#dab87b]/30" />
              <span>RSVP Your Attendance</span>
            </button>

            <button
              type="button"
              onClick={onReplayBlueDoor}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 text-xs uppercase tracking-[0.24em] text-[#f2e6cd] transition-all"
            >
              <DoorOpen className="w-4 h-4 text-[#dab87b]" />
              <span>Replay The Blue Door</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Footer Credits */}
      <footer className="w-full max-w-6xl mx-auto pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.26em] text-white/50 border-t border-white/10">
        <div>
          {config.brandTitle} • {config.hashtag}
        </div>
        <div className="flex items-center gap-4">
          <span>{config.coordinates}</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1 text-[#dab87b] hover:text-white transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </section>
  );
};
