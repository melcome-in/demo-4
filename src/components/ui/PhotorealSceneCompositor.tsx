import React, { useEffect, useState } from 'react';

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
> = ({ isDoorOpened, renderMode }) => {
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    if (!isDoorOpened) return;

    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      setScrollRatio(ratio);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDoorOpened]);

  if (!isDoorOpened || renderMode === 'pure-3d') {
    return null;
  }

  // Subtle 3D scroll zoom & gentle vertical parallax on the single crisp full-white-flower background
  const scale = 1.0 + scrollRatio * 0.08;
  const translateY = -scrollRatio * 18;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <div
        className="absolute inset-0 will-change-transform transition-transform duration-150 ease-out"
        style={{
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
        }}
      >
        <img
          src="./assets/images/wedding-aisle-white.jpg"
          alt="Luxury White Floral Beach Wedding Entrance"
          className="w-full h-full object-cover object-center"
        />
        {/* Very subtle top/bottom edge vignette for text legibility without washing out clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07131e]/20 via-transparent to-[#07131e]/35" />
      </div>
    </div>
  );
};
