import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Sun,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CELEBRATION_EVENTS } from '../../data/weddingData';
import { CelebrationEvent, WeddingConfig } from '../../types/wedding';

interface WeddingCelebrationSectionProps {
  config: WeddingConfig;
  timeOfDayOverride: 'auto' | 'afternoon' | 'golden-hour' | 'twilight';
  onChangeTimeOfDay: (
    mood: 'auto' | 'afternoon' | 'golden-hour' | 'twilight'
  ) => void;
}

export const WeddingCelebrationSection: React.FC<
  WeddingCelebrationSectionProps
> = ({ config, timeOfDayOverride, onChangeTimeOfDay }) => {
  const handleDownloadICS = (ev: CelebrationEvent) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Melcome//The Blue Door Wedding//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${config.brideName} & ${config.groomName} — ${ev.title}`,
      `DESCRIPTION:${ev.description.replace(/\n/g, ' ')}`,
      `LOCATION:${ev.venue}, ${ev.venueArea}`,
      'DTSTART:20270214T110000Z',
      'DTEND:20270214T160000Z',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ev.id}-melcome-wedding.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="section-events"
      className="relative py-28 md:py-36 px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#071624]/80 border border-[#dab87b]/35 text-[10px] uppercase tracking-[0.34em] text-[#dab87b] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chapter V • Wedding Celebration</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4">
            Three Days in{' '}
            <span className="italic text-[#f2e6cd]">Coastal Paradise</span>
          </h2>
          <p className="text-sm md:text-base text-white/75 mb-6">
            Each celebration unfolds in a distinct corner of {config.destinationName} — from the bougainvillea-draped courtyard to the oceanfront floral stage and starlit palm promenade.
          </p>

          {/* 3D Lighting Atmosphere Switcher */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-[#071624]/85 border border-white/15">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#8cc9ea] px-3 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#dab87b]" />
              <span>3D Sky Lighting:</span>
            </span>
            {(
              [
                { id: 'auto', label: 'Auto Scroll' },
                { id: 'afternoon', label: 'Mehndi Afternoon' },
                { id: 'golden-hour', label: 'Wedding Golden Hour' },
                { id: 'twilight', label: 'Reception Twilight' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeTimeOfDay(m.id)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.18em] transition-all ${
                  timeOfDayOverride === m.id
                    ? 'bg-[#dab87b] text-[#071624] font-semibold'
                    : 'text-white/75 hover:bg-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Three Luxury Celebration Event Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CELEBRATION_EVENTS.map((ev, idx) => (
            <motion.article
              key={ev.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.85, delay: idx * 0.12 }}
              className="group rounded-3xl bg-[#071624]/80 backdrop-blur-2xl border border-white/15 hover:border-[#dab87b]/50 overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.65)] flex flex-col justify-between transition-all duration-500"
            >
              <div>
                {/* Event Photograph Header */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071624] via-[#071624]/25 to-transparent" />

                  <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#071624]/80 backdrop-blur-md border border-[#dab87b]/40 text-[10px] uppercase tracking-[0.28em] text-[#dab87b]">
                    Event 0{idx + 1}
                  </div>

                  <button
                    type="button"
                    onClick={() => onChangeTimeOfDay(ev.timeOfDayMood)}
                    className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 hover:bg-[#2d8ec8]/70 backdrop-blur-md border border-white/20 text-[10px] uppercase tracking-[0.18em] text-white transition-all"
                  >
                    Preview 3D Light
                  </button>

                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="text-[11px] uppercase tracking-[0.26em] text-[#8cc9ea] mb-1">
                      {ev.subtitle}
                    </div>
                    <h3 className="font-serif text-3xl text-white font-light">
                      {ev.title}
                    </h3>
                  </div>
                </div>

                {/* Event Details Body */}
                <div className="p-6 md:p-7 space-y-5">
                  {/* Date, Time, Venue */}
                  <div className="space-y-2.5 text-xs text-white/85 border-b border-white/10 pb-5">
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
                      <div>
                        <div className="font-medium text-white">{ev.venue}</div>
                        <div className="text-[11px] text-white/60">
                          {ev.venueArea}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-white/75 leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-1.5">
                    {ev.highlights.map((hl) => (
                      <li
                        key={hl}
                        className="flex items-center gap-2 text-xs text-[#f2e6cd]/90"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#dab87b] shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Dress Code & Swatches */}
                  <div className="pt-2">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-white/55 mb-2">
                      Attire: {ev.dressCode}
                    </div>
                    <div className="flex items-center gap-2">
                      {ev.palette.map((sw) => (
                        <div
                          key={sw.name}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/80"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/30"
                            style={{ backgroundColor: sw.hex }}
                          />
                          <span>{sw.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions: Google Maps Link & Calendar */}
              <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                <a
                  href={ev.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#184d73] to-[#246d9e] hover:from-[#1e5f8f] hover:to-[#2d8ec8] border border-[#dab87b]/40 text-[11px] uppercase tracking-[0.2em] text-white transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#dab87b]" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-75" />
                </a>

                <button
                  type="button"
                  onClick={() => handleDownloadICS(ev)}
                  className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-[11px] uppercase tracking-[0.18em] text-white/80 transition-all"
                >
                  + Calendar
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
