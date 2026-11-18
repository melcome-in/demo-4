import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Camera,
  Play,
  Pause,
  SlidersHorizontal,
  Compass,
  DoorOpen,
  Layers,
  Menu,
  X,
} from 'lucide-react';
import { CameraPresetId, WeddingConfig } from '../../types/wedding';

interface NavigationHUDProps {
  config: WeddingConfig;
  isDoorOpened: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  cameraPreset: CameraPresetId;
  onSelectCameraPreset: (preset: CameraPresetId) => void;
  renderMode: 'hybrid' | 'pure-3d' | 'cinema';
  onChangeRenderMode: (mode: 'hybrid' | 'pure-3d' | 'cinema') => void;
  isAutoTourPlaying: boolean;
  onToggleAutoTour: () => void;
  onOpenCustomizer: () => void;
  onReplayDoorOpening: () => void;
  onJumpToSection: (sectionId: string) => void;
}

const NAV_CHAPTERS = [
  { id: 'section-entrance', label: 'Entrance' },
  { id: 'section-stage', label: 'The Stage' },
  { id: 'section-drone', label: 'Ocean Drone' },
  { id: 'section-couple', label: 'Couple' },
  { id: 'section-story', label: 'Love Story' },
  { id: 'section-events', label: 'Celebration' },
  { id: 'section-countdown', label: 'Countdown' },
  { id: 'section-gallery', label: 'Gallery' },
  { id: 'section-rsvp', label: 'RSVP' },
];

const CAMERA_PRESETS: { id: CameraPresetId; label: string }[] = [
  { id: 'scroll-auto', label: 'Scroll Path (Auto)' },
  { id: 'door-exterior', label: 'The Blue Door' },
  { id: 'aisle-walk', label: 'Entrance Aisle' },
  { id: 'stage-front', label: 'Ocean Stage' },
  { id: 'stage-orbit-180', label: '180° Stage Orbit' },
  { id: 'drone-aerial', label: 'Aerial Drone' },
  { id: 'sunset-shore', label: 'Sunset Shore' },
];

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  config,
  isDoorOpened,
  isMuted,
  onToggleMute,
  cameraPreset,
  onSelectCameraPreset,
  renderMode,
  onChangeRenderMode,
  isAutoTourPlaying,
  onToggleAutoTour,
  onOpenCustomizer,
  onReplayDoorOpening,
  onJumpToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCameraBar, setShowCameraBar] = useState(false);

  if (!isDoorOpened) return null;

  return (
    <>
      {/* Top Floating Luxury Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 pt-3 md:pt-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-2.5 md:px-6 md:py-3 rounded-full bg-[#071624]/75 backdrop-blur-xl border border-white/15 shadow-[0_12px_45px_rgba(0,0,0,0.45)] pointer-events-auto">
          {/* Brand & Couple Monogram */}
          <button
            type="button"
            onClick={() => onJumpToSection('section-entrance')}
            className="flex items-center gap-3 text-left group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#2d8ec8] group-hover:bg-[#dab87b] transition-colors shadow-[0_0_12px_#2d8ec8]" />
            <div>
              <div className="text-[10px] font-display tracking-[0.32em] uppercase text-[#dab87b]">
                MELCOME
              </div>
              <div className="font-serif text-sm md:text-base tracking-[0.12em] text-[#fcfaf5] leading-none">
                {config.brideName} &amp; {config.groomName}
              </div>
            </div>
          </button>

          {/* Desktop Chapter Links */}
          <nav className="hidden xl:flex items-center gap-5">
            {NAV_CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  onSelectCameraPreset('scroll-auto');
                  onJumpToSection(ch.id);
                }}
                className="text-[11px] uppercase tracking-[0.22em] text-white/75 hover:text-[#dab87b] transition-colors"
              >
                {ch.label}
              </button>
            ))}
          </nav>

          {/* Action Controls: Film Auto-Tour, 3D Camera Angles, Sound, Personalize */}
          <div className="flex items-center gap-2">
            {/* Auto-Play Cinematic Tour Button */}
            <button
              type="button"
              onClick={onToggleAutoTour}
              title="Auto-Play Cinematic Film Tour"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.18em] border transition-all ${
                isAutoTourPlaying
                  ? 'bg-[#dab87b] text-[#071624] border-[#dab87b] font-semibold shadow-[0_0_24px_rgba(218,184,123,0.6)]'
                  : 'bg-white/5 hover:bg-white/10 text-[#f2e6cd] border-[#dab87b]/40'
              }`}
            >
              {isAutoTourPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pause Film</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Film Tour</span>
                </>
              )}
            </button>

            {/* 3D Camera & Realism Director Toggle */}
            <button
              type="button"
              onClick={() => setShowCameraBar((v) => !v)}
              title="3D Camera Angles & Realism Mode"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.18em] border transition-all ${
                showCameraBar || cameraPreset !== 'scroll-auto'
                  ? 'bg-[#1e71aa] text-white border-[#8cc9ea]'
                  : 'bg-white/5 hover:bg-white/10 text-white/85 border-white/15'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#8cc9ea]" />
              <span className="hidden md:inline">3D Angles</span>
            </button>

            {/* Replay Blue Door Opening */}
            <button
              type="button"
              onClick={onReplayDoorOpening}
              title="Replay The Blue Door Opening Shot"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] uppercase tracking-[0.18em] text-white/80 transition-all"
            >
              <DoorOpen className="w-3.5 h-3.5 text-[#dab87b]" />
              <span className="hidden lg:inline">Blue Door</span>
            </button>

            {/* Personalize Bride & Groom Names */}
            <button
              type="button"
              onClick={onOpenCustomizer}
              title="Customize Bride & Groom Names"
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-[#dab87b] transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Soundscape Mute / Unmute */}
            <button
              type="button"
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Coastal Soundscape' : 'Mute Soundscape'}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-[#8cc9ea] transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/45" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#8cc9ea]" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="xl:hidden p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable 3D Camera Preset & Photoreal Mode Bar */}
        {showCameraBar && (
          <div className="max-w-5xl mx-auto mt-2 p-3 rounded-2xl bg-[#071624]/90 backdrop-blur-xl border border-[#8cc9ea]/30 shadow-2xl pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#8cc9ea] mr-2 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Camera:
              </span>
              {CAMERA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectCameraPreset(preset.id)}
                  className={`px-3 py-1 rounded-full text-[11px] tracking-[0.15em] uppercase transition-all ${
                    cameraPreset === preset.id
                      ? 'bg-[#2d8ec8] text-white font-medium shadow-[0_0_15px_rgba(45,142,200,0.6)]'
                      : 'bg-white/5 hover:bg-white/10 text-white/75'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 border-t md:border-t-0 md:border-l border-white/15 pt-2 md:pt-0 md:pl-3">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#dab87b] mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> View:
              </span>
              {(
                [
                  { id: 'hybrid', label: '3D + Photoreal' },
                  { id: 'pure-3d', label: 'Pure 3D WebGL' },
                  { id: 'cinema', label: '8K Cinema' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangeRenderMode(m.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] tracking-[0.15em] uppercase transition-all ${
                    renderMode === m.id
                      ? 'bg-[#dab87b] text-[#071624] font-semibold'
                      : 'bg-white/5 hover:bg-white/10 text-white/70'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-2 p-4 rounded-2xl bg-[#071624]/95 backdrop-blur-xl border border-white/15 pointer-events-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NAV_CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    onSelectCameraPreset('scroll-auto');
                    onJumpToSection(ch.id);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-left text-xs uppercase tracking-[0.2em] text-white/85"
                >
                  {ch.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  onReplayDoorOpening();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-xl bg-[#184d73]/60 text-left text-xs uppercase tracking-[0.2em] text-[#dab87b]"
              >
                Replay Blue Door
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
