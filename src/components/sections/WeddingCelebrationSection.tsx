import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { CELEBRATION_EVENTS } from '../../data/weddingData';
import { WeddingConfig } from '../../types/wedding';

interface WeddingCelebrationSectionProps {
  config: WeddingConfig;
}

export const WeddingCelebrationSection: React.FC<
  WeddingCelebrationSectionProps
> = ({ config }) => {
  return (
    <section
      id="section-events"
      className="relative py-24 md:py-32 px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white mb-3">
            Wedding <span className="italic text-[#f2e6cd]">Celebration</span>
          </h2>
          <p className="text-sm text-white/80">
            Join us for three unforgettable days at {config.destinationName}.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {CELEBRATION_EVENTS.map((ev, idx) => (
            <motion.article
              key={ev.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="group rounded-3xl bg-[#071624]/80 backdrop-blur-2xl border border-white/15 hover:border-[#dab87b]/50 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-all duration-500"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071624] via-[#071624]/25 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="font-serif text-3xl text-white font-light">
                      {ev.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2 text-xs text-white/85 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#dab87b] shrink-0" />
                      <span className="font-medium">{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#8cc9ea] shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#dab87b] shrink-0 mt-0.5" />
                      <span>{ev.venue}</span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-white/75 leading-relaxed">
                    {ev.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-1">
                <a
                  href={ev.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#184d73] to-[#246d9e] hover:from-[#1e5f8f] hover:to-[#2d8ec8] border border-[#dab87b]/40 text-[11px] uppercase tracking-[0.2em] text-white transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#dab87b]" />
                  <span>View Location</span>
                  <ExternalLink className="w-3 h-3 opacity-75" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
