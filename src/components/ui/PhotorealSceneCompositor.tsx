import React, { useEffect, useRef } from 'react';

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

const WALKING_FRAMES = [
  {
    src: './assets/images/wedding-aisle-white.jpg',
    alt: 'White Floral Wedding Entrance Aisle',
  },
  {
    src: './assets/images/walk-2-mid-aisle.jpg',
    alt: 'Walking Forward Through White Floral Arches',
  },
  {
    src: './assets/images/walk-3-beach-arch.jpg',
    alt: 'Arriving at the Oceanfront White Floral Arch',
  },
  {
    src: './assets/images/walk-4-ocean-view.jpg',
    alt: 'Crystal Clear Turquoise Ocean Horizon',
  },
];

export const PhotorealSceneCompositor: React.FC<
  PhotorealSceneCompositorProps
> = ({ isDoorOpened, renderMode }) => {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targetScrollRef = useRef(0);
  const smoothScrollRef = useRef(0);

  useEffect(() => {
    if (!isDoorOpened || renderMode === 'pure-3d') return;

    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      targetScrollRef.current =
        maxScroll > 0
          ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
          : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    let rafId = 0;
    const animate = () => {
      const isMobile = window.innerWidth < 768;
      // Slightly faster damping on mobile touch so walking motion feels tightly coupled to finger swipe
      const damp = isMobile ? 0.16 : 0.1;
      smoothScrollRef.current +=
        (targetScrollRef.current - smoothScrollRef.current) * damp;

      const sp = smoothScrollRef.current;
      const segments = WALKING_FRAMES.length - 1; // 3 segments across 4 frames
      const s = sp * segments; // 0.0 -> 3.0

      // Subtle walking stride micro-bob
      const strideBobY = Math.sin(sp * Math.PI * 14) * (isMobile ? 1.6 : 2.4);
      const zoomFactor = isMobile ? 0.24 : 0.34;

      for (let i = 0; i < WALKING_FRAMES.length; i++) {
        const el = layerRefs.current[i];
        if (!el) continue;

        const local = s - i; // active range around [0, 1]

        let opacity = 0;
        let scale = 1.0;

        if (i === 0) {
          opacity = local < 1.15 ? 1 : 0;
          scale = 1.0 + Math.max(0, Math.min(1.15, local)) * zoomFactor;
        } else {
          if (local <= -0.38) {
            opacity = 0;
            scale = 0.96;
          } else if (local < 0) {
            const t = (local + 0.38) / 0.38;
            opacity = t * t * (3 - 2 * t);
            scale = 0.96 + opacity * 0.04;
          } else if (local <= 1.15) {
            opacity = 1;
            const maxZoom = i === WALKING_FRAMES.length - 1 ? 0.14 : zoomFactor;
            scale = 1.0 + Math.min(1.15, local) * maxZoom;
          } else {
            opacity = 0;
            scale = 1.0 + zoomFactor;
          }
        }

        el.style.opacity = opacity.toFixed(4);
        el.style.transform = `translate3d(0, ${strideBobY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isDoorOpened, renderMode]);

  if (!isDoorOpened || renderMode === 'pure-3d') {
    return null;
  }

  return (
    <div className="fixed inset-0 h-[100dvh] pointer-events-none z-[2] overflow-hidden bg-[#07131e]">
      {WALKING_FRAMES.map((frame, idx) => (
        <div
          key={frame.src}
          ref={(el) => {
            layerRefs.current[idx] = el;
          }}
          style={{
            opacity: idx === 0 ? 1 : 0,
            transformOrigin: '50% 48%',
            zIndex: idx + 1,
          }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={frame.src}
            alt={frame.alt}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Minimal top/bottom edge vignette for crisp legibility without dulling HD clarity */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#07131e]/20 via-transparent to-[#07131e]/35 pointer-events-none" />
    </div>
  );
};
