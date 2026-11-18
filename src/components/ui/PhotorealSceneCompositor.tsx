import React from 'react';
import { motion } from 'framer-motion';

interface PhotorealSceneCompositorProps {
  isDoorOpened: boolean;
  activeZone:
    | 'blue-door'
    | 'entrance-aisle'
    | 'wedding-stage'
    | 'ocean-drone'
    | 'editorial'
    | 'sunset-finale';
  renderMode: 'hybrid' | 'pure-3d' | 'cinema';
}

export const PhotorealSceneCompositor: React.FC<
  PhotorealSceneCompositorProps
> = ({ isDoorOpened, activeZone, renderMode }) => {
  if (!isDoorOpened || renderMode === 'pure-3d') {
    return null;
  }

  // Opacity depends on whether user is in Hybrid 3D+Photoreal mode or Full Cinema Plate mode
  const maxOpacity = renderMode === 'cinema' ? 0.88 : 0.42;

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Zone 1: Wedding Entrance Aisle Photoreal Plate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: activeZone === 'entrance-aisle' ? maxOpacity : 0,
          scale: activeZone === 'entrance-aisle' ? 1.04 : 1.12,
        }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        <img
          src="./assets/images/wedding-aisle-env.jpg"
          alt="Wedding Entrance Aisle"
          className="w-full h-full object-cover object-center mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07131e]/50 via-transparent to-[#07131e]/75" />
      </motion.div>

      {/* Zone 2: Main Ocean-Facing Wedding Stage Photoreal Plate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: activeZone === 'wedding-stage' ? maxOpacity : 0,
          scale: activeZone === 'wedding-stage' ? 1.03 : 1.1,
        }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        <img
          src="./assets/images/wedding-stage-ocean.jpg"
          alt="Ocean-Facing Wedding Stage"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07131e]/75 via-transparent to-[#07131e]/45" />
      </motion.div>

      {/* Zone 3: Cinematic Aerial Ocean Drone View Photoreal Plate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: activeZone === 'ocean-drone' ? (renderMode === 'cinema' ? 0.92 : 0.58) : 0,
          scale: activeZone === 'ocean-drone' ? 1.0 : 1.16,
          y: activeZone === 'ocean-drone' ? 0 : 25,
        }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src="./assets/images/aerial-drone-coast.jpg"
          alt="Aerial Drone Coastline & Wedding Cove"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07131e]/45 via-transparent to-[#07131e]/80" />
      </motion.div>

      {/* Zone 4: Sunset Beach Finale Photoreal Plate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity:
            activeZone === 'sunset-finale'
              ? renderMode === 'cinema'
                ? 0.92
                : 0.62
              : 0,
          scale: activeZone === 'sunset-finale' ? 1.02 : 1.1,
        }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        <img
          src="./assets/images/sunset-beach-finale.jpg"
          alt="Sunset Beach Wedding Finale"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07131e]/85 via-[#07131e]/25 to-[#07131e]/55" />
      </motion.div>
    </div>
  );
};
