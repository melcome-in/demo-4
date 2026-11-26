import React from 'react';
import { motion } from 'framer-motion';
import { LOVE_STORY_MILESTONES } from '../../data/weddingData';

export const LoveStorySection: React.FC = () => {
  return (
    <section
      id="section-story"
      className="relative py-24 md:py-32 px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white">
            Our <span className="italic text-[#dab87b]">Love Story</span>
          </h2>
        </motion.div>

        <div className="space-y-12 md:space-y-16">
          {LOVE_STORY_MILESTONES.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center"
              >
                <div
                  className={`lg:col-span-6 ${
                    isEven ? '' : 'lg:order-2'
                  }`}
                >
                  <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl aspect-[16/10]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div
                  className={`lg:col-span-6 ${
                    isEven ? '' : 'lg:order-1'
                  }`}
                >
                  <div className="p-7 md:p-9 rounded-3xl bg-[#071624]/78 backdrop-blur-xl border border-white/15 shadow-2xl">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-[#dab87b] mb-2">
                      {item.year}
                    </div>
                    <h3 className="font-serif text-3xl text-white font-light mb-3">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-white/80 leading-relaxed">
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
