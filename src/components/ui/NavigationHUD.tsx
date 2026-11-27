import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X, Home, Calendar, Image, Heart } from 'lucide-react';
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

const MOBILE_DOCK_ITEMS = [
  { id: 'section-entrance', label: 'Home', icon: Home },
  { id: 'section-events', label: 'Events', icon: Calendar },
  { id: 'section-gallery', label: 'Gallery', icon: Image },
  { id: 'section-rsvp', label: 'RSVP', icon: Heart },
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
    <>
      {/* Top Floating Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 md:px-8 pt-[max(0.75rem,env(safe-area-inset-top))] pointer-events-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 px-4 py-2 sm:px-5 md:px-7 md:py-3 rounded-full bg-[#071624]/75 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.45)] pointer-events-auto">
          <button
            type="button"
            onClick={() => onJumpToSection('section-entrance')}
            className="font-serif text-base md:text-lg tracking-[0.14em] text-[#fcfaf5] hover:text-[#dab87b] transition-colors py-1"
          >
            {config.brideName}{' '}
            <span className="text-[#dab87b] italic">&amp;</span>{' '}
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
              aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 active:scale-95 border border-white/15 text-[#8cc9ea] transition-all"
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
              aria-label="Toggle Menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 active:scale-95 border border-white/15 text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Slide-Down Menu with Large 44px+ Tap Targets */}
        {mobileMenuOpen && (
          <div className="lg:hidden max-w-5xl mx-auto mt-2 p-3 rounded-3xl bg-[#071624]/95 backdrop-blur-2xl border border-white/15 shadow-2xl pointer-events-auto">
            <div className="grid grid-cols-2 gap-2">
              {NAV_CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    onJumpToSection(ch.id);
                    setMobileMenuOpen(false);
                  }}
                  className="min-h-[44px] px-3 py-2.5 rounded-2xl bg-white/[0.06] active:bg-[#2d8ec8]/40 text-center text-xs uppercase tracking-[0.2em] text-white/95"
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Thumb-Friendly Mobile Bottom Quick Navigation Dock */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 pointer-events-none"
      >
        <div className="max-w-sm mx-auto grid grid-cols-4 gap-1 p-1.5 rounded-full bg-[#071624]/82 backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] pointer-events-auto">
          {MOBILE_DOCK_ITEMS.map((item) => {
            const Icon = item.icon;
            const isRsvp = item.id === 'section-rsvp';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onJumpToSection(item.id);
                }}
                className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-full transition-all active:scale-95 ${
                  isRsvp
                    ? 'bg-gradient-to-r from-[#184d73] to-[#246d9e] text-white border border-[#dab87b]/50'
                    : 'text-white/80 active:bg-white/10'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isRsvp ? 'text-[#dab87b]' : 'text-[#8cc9ea]'}`}
                />
                <span className="text-[10px] uppercase tracking-[0.14em]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
