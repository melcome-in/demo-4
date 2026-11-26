import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface NavigationHUDProps {
  config: WeddingConfig;
  isDoorOpened: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onJumpToSection: (sectionId: string) => void;
}

const NAV_CHAPTERS = [
  { id: 'section-entrance', label: 'Welcome' },
  { id: 'section-couple', label: 'Couple' },
  { id: 'section-story', label: 'Our Story' },
  { id: 'section-events', label: 'Events' },
  { id: 'section-countdown', label: 'Countdown' },
  { id: 'section-gallery', label: 'Gallery' },
  { id: 'section-rsvp', label: 'RSVP' },
];

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  config,
  isDoorOpened,
  isMuted,
  onToggleMute,
  onJumpToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isDoorOpened) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 pt-3 md:pt-4 pointer-events-none">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-5 py-2.5 md:px-7 md:py-3 rounded-full bg-[#071624]/70 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.4)] pointer-events-auto">
        <button
          type="button"
          onClick={() => onJumpToSection('section-entrance')}
          className="font-serif text-base md:text-lg tracking-[0.14em] text-[#fcfaf5] hover:text-[#dab87b] transition-colors"
        >
          {config.brideName} <span className="text-[#dab87b] italic">&amp;</span>{' '}
          {config.groomName}
        </button>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => onJumpToSection(ch.id)}
              className="text-[11px] uppercase tracking-[0.22em] text-white/80 hover:text-[#dab87b] transition-colors"
            >
              {ch.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-[#8cc9ea] transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/45" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#8cc9ea]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden max-w-5xl mx-auto mt-2 p-4 rounded-2xl bg-[#071624]/95 backdrop-blur-xl border border-white/15 pointer-events-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {NAV_CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  onJumpToSection(ch.id);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-center text-xs uppercase tracking-[0.2em] text-white/90"
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
