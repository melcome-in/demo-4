import React from 'react';
import { motion } from 'framer-motion';
import { WeddingConfig } from '../../types/wedding';

interface CoupleIntroSectionProps {
  config: WeddingConfig;
}

export const CoupleIntroSection: React.FC<CoupleIntroSectionProps> = ({
  config,
}) => {
  return (
    <section
      id="section-couple"
      className="relative py-24 md:py-32 px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-6xl mx-auto rounded-[2.2rem] bg-[#06131f]/78 backdrop-blur-2xl border border-white/15 p-8 md:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-5"
          >
            <div className="mx-auto max-w-sm rounded-t-full rounded-b-3xl overflow-hidden border border-[#dab87b]/45 shadow-2xl aspect-[4/5]">
              <img
                src="./assets/images/couple-hero.jpg"
                alt={`${config.brideName} & ${config.groomName}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            <div className="space-y-1 mb-6">
              <div className="font-display text-4xl sm:text-6xl tracking-[0.16em] uppercase text-[#fcfaf5] leading-none">
                {config.brideName}
              </div>
              <div className="font-serif italic text-3xl sm:text-4xl text-[#dab87b] py-1">
                &amp;
              </div>
              <div className="font-display text-4xl sm:text-6xl tracking-[0.16em] uppercase text-[#fcfaf5] leading-none">
                {config.groomName}
              </div>
            </div>

            <blockquote className="font-serif italic text-2xl sm:text-3xl text-[#f2e6cd] font-light leading-relaxed mb-5">
              “Together with our families, we invite you to celebrate our wedding.”
            </blockquote>

            <p className="text-xs md:text-sm uppercase tracking-[0.28em] text-[#8cc9ea]">
              {config.weddingDateDisplay} • {config.destinationName}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
