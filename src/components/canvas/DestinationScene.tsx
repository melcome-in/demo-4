import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { BlueDoorEntrance } from './BlueDoorEntrance';
import { CameraPresetId } from '../../types/wedding';

interface DestinationSceneProps {
  isDoorOpened: boolean;
  isOpeningInProgress: boolean;
  doorOpenProgressRef: React.MutableRefObject<number>;
  handleTurnProgressRef: React.MutableRefObject<number>;
  sunlightBurstRef: React.MutableRefObject<number>;
  openingCamPosRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  openingLookAtRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  scrollProgressRef: React.MutableRefObject<number>;
  cameraPreset: CameraPresetId;
  timeOfDayOverride: 'auto' | 'afternoon' | 'golden-hour' | 'twilight';
  onTouchDoor?: () => void;
}

export const DestinationScene: React.FC<DestinationSceneProps> = ({
  isDoorOpened,
  isOpeningInProgress,
  doorOpenProgressRef,
  handleTurnProgressRef,
  sunlightBurstRef,
  openingCamPosRef,
  openingLookAtRef,
  scrollProgressRef,
  cameraPreset,
  onTouchDoor,
}) => {
  const { camera, pointer, size } = useThree();

  // Compute exact responsive camera Z distance so 100% of the full Blue Door image (W=6.45, H=8.6) is visible on any screen aspect ratio
  const fullDoorCamZ = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(46 * 0.5));
    const distForFullHeight = (8.6 * 0.5) / tanHalfFov; // 10.13m
    const distForFullWidth = (6.45 * 0.5) / (aspect * tanHalfFov);
    return 18.0 + Math.max(distForFullHeight, distForFullWidth);
  }, [size.width, size.height]);

  // Single ultra-crisp full-white-flower destination background revealed behind the Blue Door
  const aisleWhiteTex = useLoader(
    THREE.TextureLoader,
    './assets/images/wedding-aisle-white.jpg'
  );

  useMemo(() => {
    aisleWhiteTex.colorSpace = THREE.SRGBColorSpace;
    aisleWhiteTex.anisotropy = 16;
    aisleWhiteTex.minFilter = THREE.LinearMipmapLinearFilter;
    aisleWhiteTex.magFilter = THREE.LinearFilter;
    aisleWhiteTex.generateMipmaps = true;
  }, [aisleWhiteTex]);

  // Smooth camera state vectors
  const currentCamPos = useRef(new THREE.Vector3(0, 2.6, 28.2));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.6, 18.0));
  const targetCamPos = useRef(new THREE.Vector3(0, 2.6, 28.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 2.6, 18.0));

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);
    const sp = scrollProgressRef.current;

    const mouseParallaxX = pointer.x * 0.22;
    const mouseParallaxY = pointer.y * 0.12;

    if (!isDoorOpened && !isOpeningInProgress) {
      // CHAPTER 0: Full 100% view of The Blue Door before touch
      const breath = Math.sin(t * 0.75) * 0.04;
      targetCamPos.current.set(
        mouseParallaxX * 0.35,
        2.6 + mouseParallaxY * 0.25,
        fullDoorCamZ + breath
      );
      targetLookAt.current.set(
        mouseParallaxX * 0.1,
        2.6 + mouseParallaxY * 0.1,
        18.0
      );
      currentCamPos.current.lerp(targetCamPos.current, dt * 6.0);
      currentLookAt.current.lerp(targetLookAt.current, dt * 6.0);
    } else if (isOpeningInProgress) {
      // CHAPTER 1: Continuous Single-Take Door Opening Shot driven by GSAP timeline
      currentCamPos.current.set(
        openingCamPosRef.current.x + mouseParallaxX * 0.12,
        openingCamPosRef.current.y + mouseParallaxY * 0.08,
        openingCamPosRef.current.z
      );
      currentLookAt.current.set(
        openingLookAtRef.current.x,
        openingLookAtRef.current.y,
        openingLookAtRef.current.z
      );
    } else if (cameraPreset === 'door-exterior') {
      targetCamPos.current.set(
        mouseParallaxX * 0.35,
        2.6 + mouseParallaxY * 0.25,
        fullDoorCamZ
      );
      targetLookAt.current.set(0, 2.6, 18.0);
      currentCamPos.current.lerp(targetCamPos.current, dt * 3.5);
      currentLookAt.current.lerp(targetLookAt.current, dt * 3.8);
    } else {
      // Keep the single crisp full-white-flower background steady with subtle 3D scroll depth & parallax
      const scrollZ = THREE.MathUtils.lerp(15.2, 13.8, sp);
      const subtlePan = Math.sin(sp * Math.PI) * 0.28;

      targetCamPos.current.set(
        subtlePan + mouseParallaxX * 0.6,
        2.6 + mouseParallaxY * 0.35,
        scrollZ
      );
      targetLookAt.current.set(
        -subtlePan * 0.2 + mouseParallaxX * 0.18,
        2.6 + mouseParallaxY * 0.15,
        8.0
      );

      currentCamPos.current.lerp(targetCamPos.current, dt * 4.2);
      currentLookAt.current.lerp(targetLookAt.current, dt * 4.8);
    }

    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return (
    <group>
      {/* 1. Photorealistic 3D Blue Door & Mediterranean Stone Facade */}
      <BlueDoorEntrance
        doorOpenProgressRef={doorOpenProgressRef}
        handleTurnProgressRef={handleTurnProgressRef}
        sunlightBurstRef={sunlightBurstRef}
        onTouchDoor={onTouchDoor}
        isDoorInteractive={!isDoorOpened && !isOpeningInProgress}
      />

      {/* 2. Single High-Clarity Full-White-Flower Wedding Entrance Background in 3D Depth */}
      <mesh position={[0, 2.6, 8.5]}>
        <planeGeometry args={[15.4, 8.8]} />
        <meshBasicMaterial map={aisleWhiteTex} toneMapped={false} />
      </mesh>
    </group>
  );
};
