import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, Sparkles } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface CountdownSectionProps {
  config: WeddingConfig;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  config,
}) => {
  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(config.weddingDateISO).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [config.weddingDateISO]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section
      id="section-countdown"
      className="relative py-24 md:py-32 px-6 md:px-14 pointer-events-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.95 }}
        className="max-w-5xl mx-auto relative rounded-[2.5rem] bg-gradient-to-br from-[#0a263b]/65 via-[#071827]/75 to-[#0b2a40]/65 backdrop-blur-2xl border border-[#8cc9ea]/35 p-8 md:p-16 text-center shadow-[0_30px_100px_rgba(0,0,0,0.65)] overflow-hidden"
      >
        {/* Subtle Ocean Caustic Wave Shimmer Overlay */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-48 rounded-full bg-[#3cd3d8]/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[32rem] h-48 rounded-full bg-[#dab87b]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#8cc9ea]/35 text-[10px] uppercase tracking-[0.34em] text-[#8cc9ea] mb-4">
            <Waves className="w-3.5 h-3.5 text-[#dab87b]" />
            <span>Chapter VI • The Countdown</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white mb-2">
            Until We Step Through{' '}
            <span className="italic text-[#dab87b]">The Blue Door</span>
          </h2>
          <p className="text-xs md:text-sm uppercase tracking-[0.28em] text-white/65 mb-10">
            {config.weddingDateDisplay} • {config.destinationName}
          </p>

          {/* Days | Hours | Minutes | Seconds Glass Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {units.map((u, idx) => (
              <div
                key={u.label}
                className="relative group rounded-3xl bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-xl border border-white/15 hover:border-[#dab87b]/55 py-6 px-4 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
              >
                <div className="font-display text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white via-[#fcfaf5] to-[#8cc9ea] tracking-wider mb-2">
                  {String(u.value).padStart(2, '0')}
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-[0.32em] text-[#dab87b]">
                  {u.label}
                </div>
                {idx < 3 && (
                  <span className="hidden sm:block absolute -right-3.5 top-1/2 -translate-y-1/2 text-[#dab87b]/40 font-serif text-2xl">
                    |
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 inline-flex items-center gap-2 text-xs font-serif italic text-[#f2e6cd]/85">
            <Sparkles className="w-3.5 h-3.5 text-[#dab87b]" />
            <span>
              “Every tide brings us closer to celebrating with you by the turquoise sea.”
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
