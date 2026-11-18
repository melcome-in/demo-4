import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Waves, Layers, ArrowDown } from 'lucide-react';
import { CameraPresetId, WeddingConfig } from '../../types/wedding';

interface OceanDroneSectionProps {
  config: WeddingConfig;
  cameraPreset: CameraPresetId;
  onSelectCameraPreset: (preset: CameraPresetId) => void;
  renderMode: 'hybrid' | 'pure-3d' | 'cinema';
  onChangeRenderMode: (mode: 'hybrid' | 'pure-3d' | 'cinema') => void;
  onNextSection: () => void;
}

export const OceanDroneSection: React.FC<OceanDroneSectionProps> = ({
  config,
  cameraPreset,
  onSelectCameraPreset,
  renderMode,
  onChangeRenderMode,
  onNextSection,
}) => {
  return (
    <section
      id="section-drone"
      className="relative min-h-[125vh] w-full flex flex-col justify-between py-28 px-6 md:px-14 pointer-events-none"
    >
      {/* Top Drone Telemetry HUD Header */}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 px-5 py-3 rounded-2xl bg-[#071624]/65 backdrop-blur-xl border border-[#8cc9ea]/30 pointer-events-auto"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#8cc9ea] font-display">
            Aerial Cinema Drone • Altitude 48m • {config.coordinates}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectCameraPreset('drone-aerial')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] border transition-all ${
              cameraPreset === 'drone-aerial'
                ? 'bg-[#2d8ec8] text-white border-[#8cc9ea]'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/15'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>Lock Drone Orbit</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChangeRenderMode(renderMode === 'cinema' ? 'hybrid' : 'cinema')
            }
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-[#dab87b]/40 text-[10px] uppercase tracking-[0.2em] text-[#f2e6cd] transition-all"
          >
            <Layers className="w-3 h-3 text-[#dab87b]" />
            <span>
              {renderMode === 'cinema'
                ? 'Blend 3D + Aerial Plate'
                : 'Full 8K Aerial Plate'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Center Feature Quote required by Section 5 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="my-auto mx-auto max-w-3xl w-full text-center px-6 py-10 md:px-14 md:py-14 rounded-3xl bg-[#071624]/60 backdrop-blur-xl border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.65)] pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-[#8cc9ea]/35 text-[10px] uppercase tracking-[0.34em] text-[#8cc9ea] mb-5">
          <Waves className="w-3.5 h-3.5 text-[#dab87b]" />
          <span>The Coastline &amp; Turquoise Lagoon</span>
        </div>

        {/* Exact Required Quote */}
        <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl font-light text-[#fcfaf5] leading-tight drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)] mb-6">
          “Two hearts. One beautiful journey.”
        </h2>

        <p className="max-w-xl mx-auto text-xs md:text-sm text-white/80 leading-relaxed mb-8">
          Rising above the palm-fringed shoreline of {config.destinationName}, where the white Mediterranean villa and its iconic blue doors meet the endless turquoise horizon.
        </p>

        {/* Mini Aerial Preview Thumbnail Strip */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
          <div className="rounded-xl overflow-hidden border border-white/15 relative group h-20">
            <img
              src="./assets/images/blue-door-texture.jpg"
              alt="The Blue Door"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <span className="absolute bottom-1 left-2 text-[9px] uppercase tracking-widest text-white drop-shadow">
              01. The Villa
            </span>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/15 relative group h-20">
            <img
              src="./assets/images/wedding-stage-ocean.jpg"
              alt="The Beach Stage"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <span className="absolute bottom-1 left-2 text-[9px] uppercase tracking-widest text-white drop-shadow">
              02. The Stage
            </span>
          </div>
          <div className="rounded-xl overflow-hidden border border-[#dab87b]/60 relative group h-20">
            <img
              src="./assets/images/aerial-drone-coast.jpg"
              alt="The Cove Panorama"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <span className="absolute bottom-1 left-2 text-[9px] uppercase tracking-widest text-[#dab87b] font-semibold drop-shadow">
              03. The Cove
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onNextSection}
          className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#184d73] to-[#246d9e] border border-[#dab87b]/50 text-xs uppercase tracking-[0.28em] text-white shadow-lg hover:scale-105 transition-all"
        >
          <span>Meet The Couple</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#dab87b]" />
        </button>
      </motion.div>

      <div />
    </section>
  );
};
