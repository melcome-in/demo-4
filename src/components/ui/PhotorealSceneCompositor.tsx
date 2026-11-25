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

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Zone 1: Wedding Entrance Aisle — 3D Scroll-Driven Depth & Dolly */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: activeZone === 'entrance-aisle' ? 0.92 : 0,
          scale: activeZone === 'entrance-aisle' ? 1.03 : 1.15,
          rotateX: activeZone === 'entrance-aisle' ? 0 : 2,
        }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src="./assets/images/wedding-aisle-env.jpg"
          alt="Wedding Entrance Aisle"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07131e]/35 via-transparent to-[#07131e]/75" />
      </motion.div>

      {/* Zone 2: Main Ocean-Facing Wedding Stage — 3D Scroll Parallax */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: activeZone === 'wedding-stage' ? 0.94 : 0,
          scale: activeZone === 'wedding-stage' ? 1.02 : 1.14,
          rotateY: activeZone === 'wedding-stage' ? 0 : -2,
        }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src="./assets/images/wedding-stage-ocean.jpg"
          alt="Ocean-Facing Wedding Stage"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07131e]/75 via-transparent to-[#07131e]/35" />
      </motion.div>

      {/* Zone 3: Cinematic Aerial Ocean Drone View — 3D Altitude Pull-Back */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity:
            activeZone === 'ocean-drone' || activeZone === 'editorial'
              ? activeZone === 'editorial'
                ? 0.55
                : 0.95
              : 0,
          scale: activeZone === 'ocean-drone' ? 1.0 : 1.18,
          y: activeZone === 'ocean-drone' ? 0 : 20,
        }}
        transition={{ duration: 1.7, ease: 'easeOut' }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src="./assets/images/aerial-drone-coast.jpg"
          alt="Aerial Drone Coastline & Wedding Cove"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07131e]/35 via-transparent to-[#07131e]/80" />
      </motion.div>

      {/* Zone 4: Sunset Beach Finale — 3D Twilight Descent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: activeZone === 'sunset-finale' ? 0.95 : 0,
          scale: activeZone === 'sunset-finale' ? 1.02 : 1.14,
        }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src="./assets/images/sunset-beach-finale.jpg"
          alt="Sunset Beach Wedding Finale"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07131e]/85 via-[#07131e]/20 to-[#07131e]/45" />
      </motion.div>
    </div>
  );
};
