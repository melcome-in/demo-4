import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
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
      className="relative py-28 md:py-36 px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto rounded-[2.5rem] bg-[#06131f]/80 backdrop-blur-2xl border border-white/15 p-8 md:p-16 shadow-[0_35px_100px_rgba(0,0,0,0.7)] overflow-hidden relative">
        {/* Ambient Decorative Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#2d8ec8]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#dab87b]/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Left Column: Editorial Couple Photography Collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.0 }}
            className="lg:col-span-6 relative"
          >
            {/* Main Arch-Topped Editorial Portrait */}
            <div className="relative mx-auto max-w-md rounded-t-full rounded-b-3xl overflow-hidden border-2 border-[#dab87b]/45 shadow-[0_25px_75px_rgba(0,0,0,0.65)] aspect-[4/5] group">
              <img
                src="./assets/images/couple-hero.jpg"
                alt={`${config.brideName} & ${config.groomName}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06131f]/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-[#f2e6cd]">
                <span>Villa Azurea Archway</span>
                <span>{config.hashtag}</span>
              </div>
            </div>

            {/* Floating Secondary Candid Frame */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: 0.25, duration: 0.9 }}
              className="hidden sm:block absolute -bottom-6 -right-4 w-44 h-56 rounded-2xl overflow-hidden border-2 border-white/25 shadow-2xl"
            >
              <img
                src="./assets/images/story-met.jpg"
                alt="Couple Candid"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Right Column: Editorial Typography & Family Invitation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.0 }}
            className="lg:col-span-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#dab87b]/35 text-[10px] uppercase tracking-[0.34em] text-[#dab87b] mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chapter III • The Couple</span>
            </div>

            {/* Required Display Format:
                [BRIDE NAME]
                &
                [GROOM NAME]
            */}
            <div className="space-y-1 mb-8">
              <div className="font-display text-4xl sm:text-6xl md:text-7xl tracking-[0.16em] uppercase text-[#fcfaf5] leading-none">
                {config.brideName}
              </div>
              <div className="font-serif italic text-3xl sm:text-5xl text-[#dab87b] py-1">
                &amp;
              </div>
              <div className="font-display text-4xl sm:text-6xl md:text-7xl tracking-[0.16em] uppercase text-[#fcfaf5] leading-none">
                {config.groomName}
              </div>
            </div>

            {/* Required Invitation Quote */}
            <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#f2e6cd] font-light leading-relaxed mb-6 border-l-0 lg:border-l-2 border-[#dab87b]/50 lg:pl-6">
              “Together with our families, we invite you to celebrate our wedding.”
            </blockquote>

            <p className="text-sm md:text-base text-white/75 leading-relaxed mb-8">
              With the blessings of our parents and surrounded by the turquoise waters of{' '}
              <span className="text-[#8cc9ea] font-medium">
                {config.destinationName}
              </span>
              , we welcome you to step through The Blue Door for a three-day coastal celebration of love, music, sunset vows, and lifelong friendship.
            </p>

            {/* Bride & Groom Editorial Bio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#dab87b] mb-1">
                  The Bride
                </div>
                <div className="font-serif text-xl text-white mb-1.5">
                  {config.brideName}
                </div>
                <p className="text-xs text-white/65 leading-relaxed">
                  Architect, collector of Mediterranean pottery, and lover of golden hour coastlines and handwritten letters.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#8cc9ea] mb-1">
                  The Groom
                </div>
                <div className="font-serif text-xl text-white mb-1.5">
                  {config.groomName}
                </div>
                <p className="text-xs text-white/65 leading-relaxed">
                  Ocean sailor, vinyl jazz enthusiast, and firm believer that every great story begins at a quiet coastal café.
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 text-xs uppercase tracking-[0.28em] text-[#dab87b]/90">
              <Heart className="w-4 h-4 fill-[#dab87b]/30 text-[#dab87b]" />
              <span>{config.weddingDateDisplay}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
