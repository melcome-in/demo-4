import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import Lenis from 'lenis';

import { DEFAULT_WEDDING_CONFIG } from './data/weddingData';
import { soundscape } from './utils/soundscape';

import { DestinationScene } from './components/canvas/DestinationScene';
import { PhotorealSceneCompositor } from './components/ui/PhotorealSceneCompositor';
import { NavigationHUD } from './components/ui/NavigationHUD';

import { WeddingEntranceSection } from './components/sections/WeddingEntranceSection';
import { CoupleIntroSection } from './components/sections/CoupleIntroSection';
import { LoveStorySection } from './components/sections/LoveStorySection';
import { WeddingCelebrationSection } from './components/sections/WeddingCelebrationSection';
import { CountdownSection } from './components/sections/CountdownSection';
import { GallerySection } from './components/sections/GallerySection';
import { RsvpSection } from './components/sections/RsvpSection';
import { FinalSunsetSection } from './components/sections/FinalSunsetSection';

export const App: React.FC = () => {
  const config = DEFAULT_WEDDING_CONFIG;

  const [isDoorOpened, setIsDoorOpened] = useState(false);
  const [isOpeningInProgress, setIsOpeningInProgress] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const doorOpenProgressRef = useRef(0);
  const handleTurnProgressRef = useRef(0);
  const sunlightBurstRef = useRef(0);
  const openingCamPosRef = useRef({ x: 0, y: 2.6, z: 28.2 });
  const openingLookAtRef = useRef({ x: 0, y: 2.6, z: 18.0 });
  const scrollProgressRef = useRef(0);

  const lenisRef = useRef<Lenis | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!isDoorOpened) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const updateScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current =
        maxScroll > 0
          ? THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1)
          : 0;
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isDoorOpened]);

  const handleOpenDoor = useCallback(() => {
    if (isOpeningInProgress) return;

    soundscape.playDoorOpeningSequence();

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    window.scrollTo({ top: 0 });
    scrollProgressRef.current = 0;
    setIsDoorOpened(false);
    setIsOpeningInProgress(true);

    doorOpenProgressRef.current = 0;
    handleTurnProgressRef.current = 0;
    sunlightBurstRef.current = 0;
    openingCamPosRef.current = { x: 0, y: 2.6, z: 28.2 };
    openingLookAtRef.current = { x: 0, y: 2.6, z: 18.0 };

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpeningInProgress(false);
        setIsDoorOpened(true);
      },
    });
    timelineRef.current = tl;

    tl.to(
      openingCamPosRef.current,
      {
        z: 23.2,
        y: 2.6,
        duration: 1.0,
        ease: 'power2.inOut',
      },
      0
    );

    tl.to(
      doorOpenProgressRef,
      {
        current: 1,
        duration: 2.2,
        ease: 'power3.inOut',
      },
      0.6
    );

    tl.to(
      openingCamPosRef.current,
      {
        z: 15.2,
        y: 2.6,
        duration: 2.6,
        ease: 'power2.inOut',
      },
      1.3
    );
    tl.to(
      openingLookAtRef.current,
      {
        z: 8.0,
        y: 2.6,
        duration: 2.6,
        ease: 'power2.inOut',
      },
      1.3
    );
  }, [isOpeningInProgress]);

  const handleJumpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleMute = () => {
    setIsMuted(soundscape.toggleMute());
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07131e] text-[#fcfaf5] selection:bg-[#2d8ec8]/40">
      {/* 1. Fixed Full-Screen Real-Time 3D Blue Door & Destination Canvas */}
      <div className="fixed inset-0 z-[1]">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 2.6, 28.2], fov: 46, near: 0.1, far: 250 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
          }}
        >
          <Suspense fallback={null}>
            <DestinationScene
              isDoorOpened={isDoorOpened}
              isOpeningInProgress={isOpeningInProgress}
              doorOpenProgressRef={doorOpenProgressRef}
              handleTurnProgressRef={handleTurnProgressRef}
              sunlightBurstRef={sunlightBurstRef}
              openingCamPosRef={openingCamPosRef}
              openingLookAtRef={openingLookAtRef}
              scrollProgressRef={scrollProgressRef}
              cameraPreset="scroll-auto"
              timeOfDayOverride="auto"
              onTouchDoor={handleOpenDoor}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. Single Crisp Full-White-Flower Background with 3D Scroll Parallax */}
      <PhotorealSceneCompositor
        isDoorOpened={isDoorOpened}
        activeZone="entrance-aisle"
        renderMode="hybrid"
      />

      {/* 3. Minimal Floating Navigation Bar (shown only after opening the door) */}
      <NavigationHUD
        config={config}
        isDoorOpened={isDoorOpened}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onJumpToSection={handleJumpToSection}
      />

      {/* 4. Essential Wedding Invitation Sections */}
      {isDoorOpened && (
        <main className="relative z-10">
          <WeddingEntranceSection
            config={config}
            onNextSection={() => handleJumpToSection('section-couple')}
          />
          <CoupleIntroSection config={config} />
          <LoveStorySection />
          <WeddingCelebrationSection config={config} />
          <CountdownSection config={config} />
          <GallerySection />
          <RsvpSection config={config} />
          <FinalSunsetSection
            config={config}
            onScrollToRsvp={() => handleJumpToSection('section-rsvp')}
            onReplayBlueDoor={handleOpenDoor}
          />
        </main>
      )}
    </div>
  );
};

export default App;
