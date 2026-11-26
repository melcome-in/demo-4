import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import Lenis from 'lenis';

import { DEFAULT_WEDDING_CONFIG } from './data/weddingData';
import { CameraPresetId, WeddingConfig } from './types/wedding';
import { soundscape } from './utils/soundscape';

import { DestinationScene } from './components/canvas/DestinationScene';
import { PhotorealSceneCompositor } from './components/ui/PhotorealSceneCompositor';
import { PreloaderScreen } from './components/ui/PreloaderScreen';
import { NavigationHUD } from './components/ui/NavigationHUD';
import { PersonalizeModal } from './components/ui/PersonalizeModal';
import { JourneyTimelineScrubber } from './components/ui/JourneyTimelineScrubber';

import { OpeningBlueDoorHero } from './components/sections/OpeningBlueDoorHero';
import { WeddingEntranceSection } from './components/sections/WeddingEntranceSection';
import { MainStageSection } from './components/sections/MainStageSection';
import { OceanDroneSection } from './components/sections/OceanDroneSection';
import { CoupleIntroSection } from './components/sections/CoupleIntroSection';
import { LoveStorySection } from './components/sections/LoveStorySection';
import { WeddingCelebrationSection } from './components/sections/WeddingCelebrationSection';
import { CountdownSection } from './components/sections/CountdownSection';
import { GallerySection } from './components/sections/GallerySection';
import { RsvpSection } from './components/sections/RsvpSection';
import { FinalSunsetSection } from './components/sections/FinalSunsetSection';

export const App: React.FC = () => {
  const [config, setConfig] = useState<WeddingConfig>(DEFAULT_WEDDING_CONFIG);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Door Opening & 3D Camera State
  const [isDoorOpened, setIsDoorOpened] = useState(false);
  const [isOpeningInProgress, setIsOpeningInProgress] = useState(false);
  const [cameraPreset, setCameraPreset] =
    useState<CameraPresetId>('scroll-auto');
  const [renderMode, setRenderMode] = useState<'hybrid' | 'pure-3d' | 'cinema'>(
    'hybrid'
  );
  const [timeOfDayOverride, setTimeOfDayOverride] = useState<
    'auto' | 'afternoon' | 'golden-hour' | 'twilight'
  >('auto');
  const [activeZone, setActiveZone] = useState<
    | 'blue-door'
    | 'entrance-aisle'
    | 'wedding-stage'
    | 'ocean-drone'
    | 'editorial'
    | 'sunset-finale'
  >('blue-door');

  const [isMuted, setIsMuted] = useState(false);
  const [isAutoTourPlaying, setIsAutoTourPlaying] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // High-frequency animation refs shared with Three.js useFrame
  const doorOpenProgressRef = useRef(0);
  const handleTurnProgressRef = useRef(0);
  const sunlightBurstRef = useRef(0);
  const openingCamPosRef = useRef({ x: 0, y: 2.6, z: 28.2 });
  const openingLookAtRef = useRef({ x: 0, y: 2.6, z: 18.0 });
  const scrollProgressRef = useRef(0);

  const lenisRef = useRef<Lenis | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Initialize Lenis Smooth Scrolling & Scroll Progress tracking once inside The Blue Door
  useEffect(() => {
    if (!isDoorOpened) return;

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const updateScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const sp =
        maxScroll > 0
          ? THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1)
          : 0;
      scrollProgressRef.current = sp;

      if (sp < 0.13) {
        setActiveZone('entrance-aisle');
      } else if (sp < 0.29) {
        setActiveZone('wedding-stage');
      } else if (sp < 0.45) {
        setActiveZone('ocean-drone');
      } else if (sp < 0.88) {
        setActiveZone('editorial');
      } else {
        setActiveZone('sunset-finale');
      }
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

  // Auto-Play Cinematic Film Tour loop
  useEffect(() => {
    if (!isAutoTourPlaying || !isDoorOpened) return;

    let rafId = 0;
    const step = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY < maxScroll - 2) {
        window.scrollBy(0, 1.65);
        rafId = requestAnimationFrame(step);
      } else {
        setIsAutoTourPlaying(false);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isAutoTourPlaying, isDoorOpened]);

  // =========================================================================
  // THE BLUE DOOR OPENING CINEMATIC SEQUENCE (GSAP Continuous Single-Take Shot)
  // =========================================================================
  const handleOpenDoor = useCallback(() => {
    if (isOpeningInProgress) return;

    // Trigger procedural Web Audio door latch + sunlight harmonic swell + ocean waves
    soundscape.playDoorOpeningSequence();

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    window.scrollTo({ top: 0 });
    scrollProgressRef.current = 0;
    setCameraPreset('scroll-auto');
    setIsDoorOpened(false);
    setIsOpeningInProgress(true);
    setActiveZone('blue-door');

    doorOpenProgressRef.current = 0;
    handleTurnProgressRef.current = 0;
    sunlightBurstRef.current = 0;
    openingCamPosRef.current = { x: 0, y: 2.6, z: 28.2 };
    openingLookAtRef.current = { x: 0, y: 2.6, z: 18.0 };

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpeningInProgress(false);
        setIsDoorOpened(true);
        setActiveZone('entrance-aisle');
      },
    });
    timelineRef.current = tl;

    // Step 1: Camera slowly approaches the full blue wooden double doors (0.0s -> 1.1s)
    tl.to(
      openingCamPosRef.current,
      {
        z: 23.2,
        y: 2.6,
        duration: 1.1,
        ease: 'power2.inOut',
      },
      0
    );

    // Step 2: Both blue wooden doors swing slowly inward (0.7s -> 3.1s)
    tl.to(
      doorOpenProgressRef,
      {
        current: 1,
        duration: 2.4,
        ease: 'power3.inOut',
      },
      0.7
    );

    // Step 3: Camera smoothly travels straight through the open doorway into the photorealistic 3D wedding entrance aisle (1.4s -> 4.3s)
    tl.to(
      openingCamPosRef.current,
      {
        z: 15.2,
        y: 2.6,
        duration: 2.9,
        ease: 'power2.inOut',
      },
      1.4
    );
    tl.to(
      openingLookAtRef.current,
      {
        z: 8.0,
        y: 2.6,
        duration: 2.9,
        ease: 'power2.inOut',
      },
      1.4
    );
  }, [isOpeningInProgress]);

  const handleJumpToSection = (sectionId: string) => {
    setIsAutoTourPlaying(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleMute = () => {
    const muted = soundscape.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07131e] text-[#fcfaf5] selection:bg-[#2d8ec8]/40">
      {/* 1. Initial Loading Screen */}
      <PreloaderScreen
        config={config}
        onFinished={() => setIsPreloaded(true)}
      />

      {/* 2. Fixed Full-Screen Real-Time 3D WebGL Destination Canvas */}
      <div className="fixed inset-0 z-[1]">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 2.6, 28.2], fov: 46, near: 0.1, far: 250 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.12,
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
              cameraPreset={cameraPreset}
              timeOfDayOverride={timeOfDayOverride}
              onTouchDoor={handleOpenDoor}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 3. Photorealistic 8K Multi-Plane Compositor Layer */}
      <PhotorealSceneCompositor
        isDoorOpened={isDoorOpened}
        activeZone={activeZone}
        renderMode={renderMode}
      />

      {/* 4. Top Floating Navigation & 3D Camera Angle Director HUD */}
      <NavigationHUD
        config={config}
        isDoorOpened={isDoorOpened}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        cameraPreset={cameraPreset}
        onSelectCameraPreset={(preset) => {
          setCameraPreset(preset);
          soundscape.playChimeAccent();
        }}
        renderMode={renderMode}
        onChangeRenderMode={setRenderMode}
        isAutoTourPlaying={isAutoTourPlaying}
        onToggleAutoTour={() => setIsAutoTourPlaying((v) => !v)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onReplayDoorOpening={handleOpenDoor}
        onJumpToSection={handleJumpToSection}
      />

      {/* Right-Edge Interactive 3D Journey Scrubber */}
      <JourneyTimelineScrubber
        isDoorOpened={isDoorOpened}
        activeZone={activeZone}
        onJumpToSection={handleJumpToSection}
        onSelectCameraPreset={setCameraPreset}
        onReplayBlueDoor={handleOpenDoor}
      />

      {/* 5. Opening Experience – The Blue Door (Full-Screen Gate) */}
      {isPreloaded && (
        <OpeningBlueDoorHero
          config={config}
          isDoorOpened={isDoorOpened}
          isOpeningInProgress={isOpeningInProgress}
          onOpenDoor={handleOpenDoor}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />
      )}

      {/* 6. Scroll-Driven Destination Chapters revealed after passing through The Blue Door */}
      {isDoorOpened && (
        <main className="relative z-10">
          {/* Section 3: Wedding Entrance – The Destination */}
          <WeddingEntranceSection
            config={config}
            onSelectCameraPreset={setCameraPreset}
            onNextSection={() => handleJumpToSection('section-stage')}
          />

          {/* Section 4: Main Wedding Stage – The Showstopper (with 180-Degree Camera Movement) */}
          <MainStageSection
            cameraPreset={cameraPreset}
            onSelectCameraPreset={setCameraPreset}
            onNextSection={() => handleJumpToSection('section-drone')}
          />

          {/* Section 5: Cinematic Ocean Drone Experience */}
          <OceanDroneSection
            config={config}
            cameraPreset={cameraPreset}
            onSelectCameraPreset={setCameraPreset}
            renderMode={renderMode}
            onChangeRenderMode={setRenderMode}
            onNextSection={() => handleJumpToSection('section-couple')}
          />

          {/* Section 6: Couple Introduction */}
          <CoupleIntroSection config={config} />

          {/* Section 7: Our Love Story */}
          <LoveStorySection />

          {/* Section 8: Wedding Celebration (Mehndi, Wedding, Reception) */}
          <WeddingCelebrationSection
            config={config}
            timeOfDayOverride={timeOfDayOverride}
            onChangeTimeOfDay={setTimeOfDayOverride}
          />

          {/* Section 9: Countdown Experience */}
          <CountdownSection config={config} />

          {/* Section 10: Cinematic Gallery */}
          <GallerySection />

          {/* Section 11: RSVP Concierge */}
          <RsvpSection config={config} />

          {/* Section 12: Final Sunset Experience */}
          <FinalSunsetSection
            config={config}
            onScrollToRsvp={() => handleJumpToSection('section-rsvp')}
            onReplayBlueDoor={handleOpenDoor}
          />
        </main>
      )}

      {/* 7. Live Bride & Groom Name Personalizer Modal */}
      <PersonalizeModal
        isOpen={isCustomizerOpen}
        config={config}
        onClose={() => setIsCustomizerOpen(false)}
        onSave={setConfig}
      />
    </div>
  );
};

export default App;
