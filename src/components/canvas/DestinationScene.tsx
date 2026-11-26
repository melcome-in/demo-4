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

// Custom GLSL Living Photorealistic 3D Depth & Breeze/Water Shimmer Shader
const photorealStageVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uParallaxStrength;
  uniform vec2 uPointer;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Subtle 3D radial depth curve so the photograph wraps around the viewer in 3D space
    float distFromCenter = (uv.x - 0.5) * 2.0;
    pos.z += (1.0 - distFromCenter * distFromCenter) * -0.85;

    // Gentle organic 3D breathing & pointer parallax displacement
    pos.x += uPointer.x * uParallaxStrength * (1.0 - abs(distFromCenter) * 0.4);
    pos.y += uPointer.y * uParallaxStrength * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const photorealStageFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uWaterShimmer;
  uniform float uWarmth;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Subtle living breeze & ocean ripple displacement on lower/water regions
    if (uWaterShimmer > 0.01) {
      float waveMask = smoothstep(0.58, 0.15, uv.y);
      float rippleX = sin(uv.y * 38.0 + uTime * 1.8) * 0.0018 * waveMask * uWaterShimmer;
      float rippleY = cos(uv.x * 28.0 + uTime * 1.4) * 0.0012 * waveMask * uWaterShimmer;
      uv += vec2(rippleX, rippleY);
    }

    // Subtle foliage breeze in upper corners
    float foliageMask = smoothstep(0.55, 0.95, uv.y) * smoothstep(0.15, 0.48, abs(uv.x - 0.5));
    uv.x += sin(uTime * 1.3 + uv.y * 12.0) * 0.0012 * foliageMask;

    vec4 texColor = texture2D(uMap, clamp(uv, 0.002, 0.998));

    // Dynamic golden-hour warmth grading
    vec3 warmTint = mix(vec3(1.0), vec3(1.06, 0.97, 0.90), uWarmth);
    vec3 finalRgb = texColor.rgb * warmTint;

    gl_FragColor = vec4(finalRgb, texColor.a * uOpacity);
  }
`;

function createPhotorealStageMaterial(
  texture: THREE.Texture,
  waterShimmer: number
) {
  return new THREE.ShaderMaterial({
    vertexShader: photorealStageVertexShader,
    fragmentShader: photorealStageFragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uMap: { value: texture },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uWaterShimmer: { value: waterShimmer },
      uWarmth: { value: 0 },
      uParallaxStrength: { value: 0.35 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    },
  });
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
  timeOfDayOverride,
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

  // Load real 8K destination wedding photographs into 3D WebGL space
  const [aisleTex, stageTex, droneTex, sunsetTex] = useLoader(
    THREE.TextureLoader,
    [
      './assets/images/wedding-aisle-env.jpg',
      './assets/images/wedding-stage-ocean.jpg',
      './assets/images/aerial-drone-coast.jpg',
      './assets/images/sunset-beach-finale.jpg',
    ]
  );

  useMemo(() => {
    [aisleTex, stageTex, droneTex, sunsetTex].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 16;
    });
  }, [aisleTex, stageTex, droneTex, sunsetTex]);

  const aisleMat = useMemo(
    () => createPhotorealStageMaterial(aisleTex, 0.5),
    [aisleTex]
  );
  const stageMat = useMemo(
    () => createPhotorealStageMaterial(stageTex, 1.0),
    [stageTex]
  );
  const droneMat = useMemo(
    () => createPhotorealStageMaterial(droneTex, 1.0),
    [droneTex]
  );
  const sunsetMat = useMemo(
    () => createPhotorealStageMaterial(sunsetTex, 1.0),
    [sunsetTex]
  );

  // Smooth camera state vectors
  const currentCamPos = useRef(new THREE.Vector3(0, 2.6, 28.2));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.6, 18.0));
  const targetCamPos = useRef(new THREE.Vector3(0, 2.6, 28.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 2.6, 18.0));

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);
    const sp = scrollProgressRef.current;

    let warmth = 0;
    if (timeOfDayOverride === 'golden-hour') warmth = 0.6;
    else if (timeOfDayOverride === 'twilight') warmth = 1.0;
    else warmth = THREE.MathUtils.clamp((sp - 0.15) / 0.85, 0, 1);

    // Update 3D Photorealistic Stage Shaders
    [aisleMat, stageMat, droneMat, sunsetMat].forEach((mat) => {
      mat.uniforms.uTime.value = t;
      mat.uniforms.uWarmth.value = warmth;
      mat.uniforms.uPointer.value.set(pointer.x, pointer.y);
    });

    // Cross-fade 3D spatial depth planes based on camera Z progression & preset
    let aisleOp = 1.0;
    let stageOp = 0.0;
    let droneOp = 0.0;
    let sunsetOp = 0.0;

    if (cameraPreset === 'aisle-walk' || cameraPreset === 'door-exterior') {
      aisleOp = 1.0;
    } else if (
      cameraPreset === 'stage-front' ||
      cameraPreset === 'stage-orbit-180'
    ) {
      aisleOp = 0.0;
      stageOp = 1.0;
    } else if (cameraPreset === 'drone-aerial') {
      aisleOp = 0.0;
      droneOp = 1.0;
    } else if (cameraPreset === 'sunset-shore') {
      aisleOp = 0.0;
      sunsetOp = 1.0;
    } else {
      // Smooth 3D scroll-driven depth crossfade along the Z-axis
      aisleOp = 1.0 - THREE.MathUtils.smoothstep(sp, 0.08, 0.2);
      stageOp =
        THREE.MathUtils.smoothstep(sp, 0.08, 0.2) *
        (1.0 - THREE.MathUtils.smoothstep(sp, 0.28, 0.4));
      droneOp =
        THREE.MathUtils.smoothstep(sp, 0.28, 0.4) *
        (1.0 - THREE.MathUtils.smoothstep(sp, 0.72, 0.86));
      sunsetOp = THREE.MathUtils.smoothstep(sp, 0.72, 0.86);
    }

    aisleMat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      aisleMat.uniforms.uOpacity.value,
      aisleOp,
      dt * 5.0
    );
    stageMat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      stageMat.uniforms.uOpacity.value,
      stageOp,
      dt * 5.0
    );
    droneMat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      droneMat.uniforms.uOpacity.value,
      droneOp,
      dt * 5.0
    );
    sunsetMat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      sunsetMat.uniforms.uOpacity.value,
      sunsetOp,
      dt * 5.0
    );

    // =====================================================================
    // 3D CAMERA CHOREOGRAPHY & SCROLL PARALLAX
    // =====================================================================
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
      // 3D Scroll-Driven Dolly-Zoom & Parallax Journey through the Photorealistic 3D Portals
      const scrollZ = THREE.MathUtils.lerp(15.2, 13.4, Math.sin(sp * Math.PI));
      const orbitSway =
        cameraPreset === 'stage-orbit-180'
          ? Math.sin(t * 0.65) * 0.85
          : Math.sin(sp * Math.PI * 2.0) * 0.35;

      targetCamPos.current.set(
        orbitSway + mouseParallaxX * 0.85,
        2.6 + mouseParallaxY * 0.45,
        scrollZ
      );
      targetLookAt.current.set(
        -orbitSway * 0.3 + mouseParallaxX * 0.25,
        2.6 + mouseParallaxY * 0.2,
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
      {/* ================================================================= */}
      {/* 1. PHOTOREALISTIC 3D BLUE DOOR & MEDITERRANEAN STONE FACADE       */}
      {/* ================================================================= */}
      <BlueDoorEntrance
        doorOpenProgressRef={doorOpenProgressRef}
        handleTurnProgressRef={handleTurnProgressRef}
        sunlightBurstRef={sunlightBurstRef}
        onTouchDoor={onTouchDoor}
        isDoorInteractive={!isDoorOpened && !isOpeningInProgress}
      />

      {/* ================================================================= */}
      {/* 2. PHOTOREALISTIC 3D CURVED SPATIAL STAGES BEHIND THE BLUE DOOR   */}
      {/*    (Zero cartoon shapes — 100% real 8K photography in 3D depth)   */}
      {/* ================================================================= */}
      {/* Stage 1: Wedding Entrance Aisle (revealed immediately through the opening Blue Doors) */}
      <mesh position={[0, 2.6, 8.5]} material={aisleMat} renderOrder={1}>
        <planeGeometry args={[14.8, 8.6, 32, 32]} />
      </mesh>

      {/* Stage 2: Main Ocean-Facing Wedding Stage */}
      <mesh position={[0, 2.6, 8.2]} material={stageMat} renderOrder={2}>
        <planeGeometry args={[15.2, 8.8, 32, 32]} />
      </mesh>

      {/* Stage 3: Aerial Ocean Drone Panorama */}
      <mesh position={[0, 2.6, 7.9]} material={droneMat} renderOrder={3}>
        <planeGeometry args={[15.6, 9.0, 32, 32]} />
      </mesh>

      {/* Stage 4: Sunset Beach Finale */}
      <mesh position={[0, 2.6, 7.6]} material={sunsetMat} renderOrder={4}>
        <planeGeometry args={[16.0, 9.2, 32, 32]} />
      </mesh>
    </group>
  );
};
