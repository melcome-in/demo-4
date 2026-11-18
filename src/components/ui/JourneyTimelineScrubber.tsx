import React from 'react';
import { CameraPresetId } from '../../types/wedding';

interface JourneyTimelineScrubberProps {
  isDoorOpened: boolean;
  activeZone:
    | 'blue-door'
    | 'entrance-aisle'
    | 'wedding-stage'
    | 'ocean-drone'
    | 'editorial'
    | 'sunset-finale';
  onJumpToSection: (sectionId: string) => void;
  onSelectCameraPreset: (preset: CameraPresetId) => void;
  onReplayBlueDoor: () => void;
}

const STOPS = [
  {
    id: 'blue-door',
    num: '01',
    label: 'The Blue Door',
    sectionId: 'door',
  },
  {
    id: 'entrance-aisle',
    num: '02',
    label: 'Wedding Entrance',
    sectionId: 'section-entrance',
  },
  {
    id: 'wedding-stage',
    num: '03',
    label: 'Ocean Stage 180°',
    sectionId: 'section-stage',
  },
  {
    id: 'ocean-drone',
    num: '04',
    label: 'Ocean Drone',
    sectionId: 'section-drone',
  },
  {
    id: 'editorial',
    num: '05',
    label: 'Story & Events',
    sectionId: 'section-couple',
  },
  {
    id: 'sunset-finale',
    num: '06',
    label: 'Sunset Finale',
    sectionId: 'section-finale',
  },
] as const;

export const JourneyTimelineScrubber: React.FC<
  JourneyTimelineScrubberProps
> = ({
  isDoorOpened,
  activeZone,
  onJumpToSection,
  onSelectCameraPreset,
  onReplayBlueDoor,
}) => {
  if (!isDoorOpened) return null;

  return (
    <aside
      aria-label="3D Destination Journey Progress"
      className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-auto"
    >
      <div className="px-3 py-4 rounded-full bg-[#071624]/75 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col items-center gap-4">
        {STOPS.map((stop) => {
          const isActive = activeZone === stop.id;
          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => {
                if (stop.id === 'blue-door') {
                  onReplayBlueDoor();
                } else {
                  onSelectCameraPreset('scroll-auto');
                  onJumpToSection(stop.sectionId);
                }
              }}
              className="group relative flex items-center justify-center"
              title={`${stop.num} • ${stop.label}`}
            >
              {/* Hover Tooltip on Left */}
              <span className="absolute right-8 px-3 py-1 rounded-full bg-[#071624]/95 border border-[#dab87b]/40 text-[10px] uppercase tracking-[0.22em] text-[#f2e6cd] whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all pointer-events-none shadow-lg">
                {stop.num} • {stop.label}
              </span>

              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#dab87b] scale-125 shadow-[0_0_12px_#dab87b]'
                    : 'bg-white/30 group-hover:bg-[#8cc9ea]'
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
};
