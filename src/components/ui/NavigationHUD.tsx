import React from 'react';
import { Home, Calendar, Image, Heart } from 'lucide-react';
import { WeddingConfig } from '../../types/wedding';

interface NavigationHUDProps {
  config: WeddingConfig;
  isDoorOpened: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onJumpToSection: (sectionId: string) => void;
}

const MOBILE_DOCK_ITEMS = [
  { id: 'section-entrance', label: 'Home', icon: Home },
  { id: 'section-events', label: 'Events', icon: Calendar },
  { id: 'section-gallery', label: 'Gallery', icon: Image },
  { id: 'section-rsvp', label: 'RSVP', icon: Heart },
];

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  isDoorOpened,
  onJumpToSection,
}) => {
  if (!isDoorOpened) return null;

  return (
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
              onClick={() => onJumpToSection(item.id)}
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
  );
};
