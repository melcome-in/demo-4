import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass } from 'lucide-react';
import { LOVE_STORY_MILESTONES } from '../../data/weddingData';

export const LoveStorySection: React.FC = () => {
  return (
    <section
      id="section-story"
      className="relative py-28 md:py-36 px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#071624]/80 border border-[#8cc9ea]/35 text-[10px] uppercase tracking-[0.34em] text-[#8cc9ea] mb-4">
            <Compass className="w-3.5 h-3.5 text-[#dab87b]" />
            <span>Chapter IV • Our Love Story</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4">
            Five Chapters to{' '}
            <span className="italic text-[#dab87b]">The Blue Door</span>
          </h2>
          <p className="text-sm md:text-base text-white/75">
            From a chance encounter overlooking the sea to an oceanfront sanctuary where our forever begins.
          </p>
        </motion.div>

        {/* Vertical Timeline Spine & Alternating Full-Width Editorial Cards */}
        <div className="relative space-y-16 md:space-y-24">
          {/* Center Golden Timeline Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-[1px] bg-gradient-to-b from-transparent via-[#dab87b]/50 to-transparent -translate-x-1/2" />

          {LOVE_STORY_MILESTONES.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.9 }}
                className={`relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                  isEven ? '' : 'lg:direction-rtl'
                }`}
              >
                {/* Center Milestone Node */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-[#071624] border-2 border-[#dab87b] items-center justify-center z-10 shadow-[0_0_25px_rgba(218,184,123,0.5)]">
                  <span className="text-[11px] font-display text-[#dab87b]">
                    0{idx + 1}
                  </span>
                </div>

                {/* Image Card */}
                <div
                  className={`lg:col-span-6 ${
                    isEven ? 'lg:pr-10' : 'lg:order-2 lg:pl-10'
                  }`}
                >
                  <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.65)] aspect-[16/10] group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06131f]/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#06131f]/75 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-[0.26em] text-[#dab87b]">
                      {item.chapter} • {item.year}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-white/85">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8cc9ea]" />
                        {item.location}
                      </span>
                      <span className="text-[10px] font-mono text-white/60">
                        {item.coordinates}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Narrative Text Card */}
                <div
                  className={`lg:col-span-6 ${
                    isEven ? 'lg:pl-10' : 'lg:order-1 lg:pr-10'
                  }`}
                >
                  <div className="p-7 md:p-10 rounded-3xl bg-[#071624]/75 backdrop-blur-xl border border-white/15 shadow-2xl">
                    <div className="text-[10px] uppercase tracking-[0.32em] text-[#8cc9ea] mb-2">
                      {item.year} — {item.location}
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl text-white font-light mb-3">
                      {item.title}
                    </h3>
                    <p className="font-serif italic text-lg md:text-xl text-[#f2e6cd] mb-4">
                      {item.quote}
                    </p>
                    <p className="text-xs md:text-sm text-white/75 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
