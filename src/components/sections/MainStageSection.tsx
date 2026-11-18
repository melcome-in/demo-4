import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Orbit, Eye, Sparkles, ArrowDown, Camera } from 'lucide-react';
import { CameraPresetId } from '../../types/wedding';

interface MainStageSectionProps {
  cameraPreset: CameraPresetId;
  onSelectCameraPreset: (preset: CameraPresetId) => void;
  onNextSection: () => void;
}

export const MainStageSection: React.FC<MainStageSectionProps> = ({
  cameraPreset,
  onSelectCameraPreset,
  onNextSection,
}) => {
  const [showDetailCard, setShowDetailCard] = useState<'arch' | 'stage' | null>(
    'arch'
  );

  return (
    <section
      id="section-stage"
      className="relative min-h-[135vh] w-full flex flex-col justify-between py-28 px-6 md:px-14 pointer-events-none"
    >
      {/* Top Row: Stage Architectural Brief & 180-Degree Camera Orbit Trigger */}
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9 }}
          className="max-w-lg p-6 md:p-8 rounded-3xl bg-[#071624]/70 backdrop-blur-xl border border-[#dab87b]/35 shadow-[0_20px_70px_rgba(0,0,0,0.55)] pointer-events-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#dab87b]/30 text-[10px] uppercase tracking-[0.3em] text-[#dab87b] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chapter II • The Showstopper</span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-light text-white leading-tight mb-3">
            The Oceanfront{' '}
            <span className="italic text-[#f2e6cd]">Floral Mandap</span>
          </h2>

          <p className="text-xs md:text-sm text-white/80 leading-relaxed mb-6">
            Poised at the edge of the turquoise lagoon, our four-poster wedding stage is crafted from hand-wired white Avalanche roses, cascading phalaenopsis orchids, sheer champagne silk drapery, crystal chandelier drops, and warm candlelit hurricane lanterns facing the sunset horizon.
          </p>

          {/* Multi-Angle 3D Camera Controls */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-[0.26em] text-[#8cc9ea] flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Interactive Stage Camera Angles</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSelectCameraPreset('stage-orbit-180')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] border transition-all ${
                  cameraPreset === 'stage-orbit-180'
                    ? 'bg-[#dab87b] text-[#071624] border-[#dab87b] font-semibold shadow-[0_0_25px_rgba(218,184,123,0.5)]'
                    : 'bg-white/10 hover:bg-white/15 text-white border-[#dab87b]/40'
                }`}
              >
                <Orbit className="w-3.5 h-3.5" />
                <span>180° Ocean Orbit</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectCameraPreset('stage-front')}
                className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] border transition-all ${
                  cameraPreset === 'stage-front'
                    ? 'bg-[#2d8ec8] text-white border-[#8cc9ea]'
                    : 'bg-white/5 hover:bg-white/15 text-white/85 border-white/15'
                }`}
              >
                Aisle Front View
              </button>

              <button
                type="button"
                onClick={() => onSelectCameraPreset('scroll-auto')}
                className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] border transition-all ${
                  cameraPreset === 'scroll-auto'
                    ? 'bg-[#184d73] text-white border-[#8cc9ea]/50'
                    : 'bg-white/5 hover:bg-white/15 text-white/75 border-white/15'
                }`}
              >
                Scroll Spline
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Macro Editorial Close-Up Inspector Card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="w-full max-w-sm rounded-3xl bg-[#071624]/75 backdrop-blur-xl border border-white/15 overflow-hidden shadow-2xl pointer-events-auto self-end lg:self-start"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-[10px] uppercase tracking-[0.26em] text-[#dab87b] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Photographer’s Close-Up Study</span>
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setShowDetailCard('arch')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                  showDetailCard === 'arch'
                    ? 'bg-[#dab87b] text-[#071624] font-semibold'
                    : 'bg-white/5 text-white/70'
                }`}
              >
                Floral Arch
              </button>
              <button
                type="button"
                onClick={() => setShowDetailCard('stage')}
                className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                  showDetailCard === 'stage'
                    ? 'bg-[#dab87b] text-[#071624] font-semibold'
                    : 'bg-white/5 text-white/70'
                }`}
              >
                Full Stage
              </button>
            </div>
          </div>

          <div className="relative h-52 overflow-hidden">
            <img
              src={
                showDetailCard === 'arch'
                  ? './assets/images/floral-arch-closeup.jpg'
                  : './assets/images/wedding-stage-ocean.jpg'
              }
              alt="Wedding Stage Floral Detail"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071624] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-xs text-white/90 font-serif italic">
              {showDetailCard === 'arch'
                ? '“White Avalanche roses, cascading phalaenopsis orchids & champagne silk drapery.”'
                : '“Complete ocean-facing ceremony stage framed against the golden horizon.”'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Transition Prompt to Aerial Drone View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        className="mx-auto text-center pointer-events-auto"
      >
        <button
          type="button"
          onClick={onNextSection}
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#071624]/80 hover:bg-[#12334d]/90 border border-[#dab87b]/45 text-xs uppercase tracking-[0.28em] text-[#f2e6cd] backdrop-blur-xl shadow-2xl transition-all"
        >
          <span>Ascend to Aerial Ocean Drone View</span>
          <ArrowDown className="w-4 h-4 text-[#dab87b]" />
        </button>
      </motion.div>
    </section>
  );
};
