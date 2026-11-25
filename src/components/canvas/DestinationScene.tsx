import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { BlueDoorEntrance } from './BlueDoorEntrance';
import { WeddingAisleSection } from './WeddingAisleSection';
import { MainWeddingStage } from './MainWeddingStage';
import { createOceanShaderMaterial } from './shaders/OceanShader';
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
  timeOfDayOverride,
  onTouchDoor,
}) => {
  const { camera, pointer } = useThree();

  const oceanMat = useMemo(() => createOceanShaderMaterial(), []);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const petalsInstancedRef = useRef<THREE.InstancedMesh>(null);
  const floatingLanternsRef = useRef<THREE.Group>(null);
  const sunSphereRef = useRef<THREE.Mesh>(null);
  const sunGlowRef = useRef<THREE.Mesh>(null);

  // Smooth camera state vectors
  const currentCamPos = useRef(new THREE.Vector3(0, 2.55, 25.2));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.55, 18.0));
  const targetCamPos = useRef(new THREE.Vector3(0, 2.55, 25.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 2.55, 18.0));

  // 160 Floating White Rose Petals & Golden Sunlight Pollen Particles
  const petalCount = 160;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petalData = useMemo(() => {
    return Array.from({ length: petalCount }).map(() => ({
      x: (Math.random() - 0.5) * 24,
      y: 0.4 + Math.random() * 8.5,
      z: -14 + Math.random() * 38,
      speedY: 0.14 + Math.random() * 0.22,
      driftX: 0.25 + Math.random() * 0.45,
      rotSpeed: 0.6 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      scale: 0.035 + Math.random() * 0.045,
    }));
  }, [petalCount]);

  // Coastal Headland Cliffs & Distant Tropical Islands framing the Turquoise Cove (matching aerial-drone-coast.jpg)
  const headlandRocks = useMemo(() => {
    return [
      { pos: [-26, 2.2, -24] as [number, number, number], scale: [14, 5.5, 18] as [number, number, number] },
      { pos: [-34, 3.6, -38] as [number, number, number], scale: [18, 7.8, 24] as [number, number, number] },
      { pos: [28, 2.5, -28] as [number, number, number], scale: [16, 6.2, 20] as [number, number, number] },
      { pos: [38, 4.0, -45] as [number, number, number], scale: [22, 8.5, 26] as [number, number, number] },
    ];
  }, []);

  // Floating Sunset Sky Lanterns over the ocean for the Final Sunset Experience
  const skyLanterns = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      pos: [
        (Math.random() - 0.5) * 26,
        2.5 + Math.random() * 11,
        -12 - Math.random() * 24,
      ] as [number, number, number],
      phase: i * 0.7,
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);
    const sp = scrollProgressRef.current;

    // Calculate Sunset Mix (0 = Golden Afternoon Sun, 1 = Romantic Amber-Rose Sunset)
    let sunsetMix = 0;
    if (timeOfDayOverride === 'afternoon') {
      sunsetMix = 0.05;
    } else if (timeOfDayOverride === 'golden-hour') {
      sunsetMix = 0.48;
    } else if (timeOfDayOverride === 'twilight') {
      sunsetMix = 0.95;
    } else {
      // Automatic progression as the user scrolls from Opening -> Stage -> Drone -> Finale
      sunsetMix = THREE.MathUtils.clamp((sp - 0.18) / 0.78, 0, 1);
    }

    // Update Custom GLSL Ocean Water Shader Uniforms
    oceanMat.uniforms.uTime.value = t;
    oceanMat.uniforms.uSunsetMix.value = THREE.MathUtils.lerp(
      oceanMat.uniforms.uSunsetMix.value,
      sunsetMix,
      dt * 3.0
    );
    oceanMat.uniforms.uCameraPos.value.copy(camera.position);

    // Dynamic Sun Position & Directional Lighting
    const sunY = THREE.MathUtils.lerp(14.0, 3.2, sunsetMix);
    const sunX = THREE.MathUtils.lerp(8.5, 1.5, sunsetMix);
    const sunZ = -65.0;
    oceanMat.uniforms.uSunDirection.value
      .set(sunX, sunY, sunZ)
      .normalize();

    if (dirLightRef.current) {
      dirLightRef.current.position.set(sunX, sunY + 8, 12 - sunsetMix * 28);
      const dayCol = new THREE.Color('#fff4dc');
      const sunsetCol = new THREE.Color('#ff9d5c');
      dirLightRef.current.color.lerpColors(dayCol, sunsetCol, sunsetMix);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(2.5, 1.85, sunsetMix);
    }

    if (ambientLightRef.current) {
      const ambDay = new THREE.Color('#e8f4fc');
      const ambSunset = new THREE.Color('#8c586a');
      ambientLightRef.current.color.lerpColors(ambDay, ambSunset, sunsetMix);
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(1.05, 0.78, sunsetMix);
    }

    if (sunSphereRef.current && sunGlowRef.current) {
      sunSphereRef.current.position.set(sunX * 1.6, sunY * 1.15, -72);
      sunGlowRef.current.position.set(sunX * 1.6, sunY * 1.15, -72.5);
      const sScale = 1 + sunsetMix * 0.55;
      sunSphereRef.current.scale.setScalar(sScale);
      sunGlowRef.current.scale.setScalar(sScale * 2.6);
    }

    // Animate Floating Rose Petals & Sunlight Pollen
    if (petalsInstancedRef.current) {
      for (let i = 0; i < petalCount; i++) {
        const p = petalData[i];
        const py =
          ((p.y - t * p.speedY) % 8.5 + 8.5) % 8.5 + 0.25;
        const px = p.x + Math.sin(t * p.driftX + p.phase) * 0.95;
        const pz = p.z + Math.cos(t * p.driftX * 0.8 + p.phase) * 0.65;

        dummy.position.set(px, py, pz);
        dummy.rotation.set(
          t * p.rotSpeed + p.phase,
          t * p.rotSpeed * 0.7,
          Math.sin(t + p.phase) * 0.5
        );
        dummy.scale.set(p.scale, p.scale * 0.6, p.scale);
        dummy.updateMatrix();
        petalsInstancedRef.current.setMatrixAt(i, dummy.matrix);
      }
      petalsInstancedRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate Sunset Floating Sky Lanterns
    if (floatingLanternsRef.current) {
      floatingLanternsRef.current.visible = sunsetMix > 0.25;
      floatingLanternsRef.current.children.forEach((child, i) => {
        const base = skyLanterns[i];
        if (!base) return;
        child.position.y =
          base.pos[1] + Math.sin(t * 0.65 + base.phase) * 0.65;
        child.position.x =
          base.pos[0] + Math.cos(t * 0.45 + base.phase) * 0.45;
      });
    }

    // =====================================================================
    // CINEMATIC CAMERA CHOREOGRAPHY
    // =====================================================================
    const mouseParallaxX = pointer.x * 0.32;
    const mouseParallaxY = pointer.y * 0.16;

    if (!isDoorOpened && !isOpeningInProgress) {
      // CHAPTER 0: Exterior of The Blue Door before click
      const breath = Math.sin(t * 0.8) * 0.12;
      targetCamPos.current.set(
        mouseParallaxX * 0.85,
        2.55 + mouseParallaxY * 0.5,
        25.1 + breath
      );
      targetLookAt.current.set(
        mouseParallaxX * 0.25,
        2.62 + mouseParallaxY * 0.25,
        18.0
      );
      currentCamPos.current.lerp(targetCamPos.current, dt * 4.5);
      currentLookAt.current.lerp(targetLookAt.current, dt * 4.5);
    } else if (isOpeningInProgress) {
      // CHAPTER 1: Continuous Single-Take Door Opening Shot driven by GSAP timeline
      currentCamPos.current.set(
        openingCamPosRef.current.x + mouseParallaxX * 0.18,
        openingCamPosRef.current.y + mouseParallaxY * 0.1,
        openingCamPosRef.current.z
      );
      currentLookAt.current.set(
        openingLookAtRef.current.x,
        openingLookAtRef.current.y,
        openingLookAtRef.current.z
      );
    } else if (cameraPreset !== 'scroll-auto') {
      // Manual Camera Angle Preset Override from the Director's Bar
      switch (cameraPreset) {
        case 'door-exterior':
          targetCamPos.current.set(mouseParallaxX, 2.55 + mouseParallaxY, 24.4);
          targetLookAt.current.set(0, 2.6, 18.0);
          break;
        case 'aisle-walk':
          targetCamPos.current.set(
            mouseParallaxX * 0.6,
            2.15 + mouseParallaxY * 0.4,
            10.5 + Math.sin(t * 0.4) * 1.2
          );
          targetLookAt.current.set(0, 2.0, -8.0);
          break;
        case 'stage-front':
          targetCamPos.current.set(
            mouseParallaxX * 0.7,
            1.88 + mouseParallaxY * 0.3,
            -3.2
          );
          targetLookAt.current.set(0, 2.05, -9.5);
          break;
        case 'stage-orbit-180': {
          // Continuous live 180-degree cinematic orbit around the Ocean-Facing Stage
          const orbitAngle = Math.sin(t * 0.42) * Math.PI * 0.95;
          const radius = 5.2;
          targetCamPos.current.set(
            Math.sin(orbitAngle) * radius,
            2.05 + Math.cos(orbitAngle * 0.5) * 0.35,
            -8.0 + Math.cos(orbitAngle) * radius
          );
          targetLookAt.current.set(0, 1.95, -8.0);
          break;
        }
        case 'drone-aerial':
          targetCamPos.current.set(
            -7.5 + Math.sin(t * 0.25) * 3.5,
            16.8,
            -22.5 + Math.cos(t * 0.25) * 2.5
          );
          targetLookAt.current.set(0, 1.5, -4.5);
          break;
        case 'sunset-shore':
          targetCamPos.current.set(
            2.4 + mouseParallaxX * 0.5,
            1.75 + mouseParallaxY * 0.3,
            -4.8
          );
          targetLookAt.current.set(0, 1.9, -15.0);
          break;
      }
      currentCamPos.current.lerp(targetCamPos.current, dt * 3.2);
      currentLookAt.current.lerp(targetLookAt.current, dt * 3.8);
    } else {
      // SCROLL-DRIVEN CINEMATIC SPLINE JOURNEY
      if (sp < 0.14) {
        // Zone 1: Gliding down the Wedding Entrance Aisle (z: 13.5 -> -1.8)
        const u = sp / 0.14;
        const z = THREE.MathUtils.lerp(13.5, -1.8, u);
        const y = THREE.MathUtils.lerp(2.15, 1.88, u);
        targetCamPos.current.set(mouseParallaxX * 0.5, y + mouseParallaxY * 0.25, z);
        targetLookAt.current.set(mouseParallaxX * 0.15, 1.98, -8.5);
      } else if (sp < 0.3) {
        // Zone 2: Main Wedding Stage Approach + 180-Degree Camera Orbit (0.14 -> 0.30)
        const u = (sp - 0.14) / 0.16;
        // Orbit angle sweeps smoothly from 0 (Aisle Front looking at Ocean) to PI (Ocean Back looking through Arch at Villa)
        const orbitAngle = THREE.MathUtils.smoothstep(u, 0.15, 0.95) * Math.PI;
        const radius = THREE.MathUtils.lerp(5.8, 4.9, Math.sin(u * Math.PI));
        const cx = Math.sin(orbitAngle) * radius;
        const cz = -8.0 + Math.cos(orbitAngle) * radius;
        const cy = 1.88 + Math.sin(u * Math.PI) * 0.45;

        targetCamPos.current.set(
          cx + mouseParallaxX * 0.4,
          cy + mouseParallaxY * 0.2,
          cz
        );
        targetLookAt.current.set(0, 1.98, -8.0);
      } else if (sp < 0.46) {
        // Zone 3: Cinematic Ocean Drone Experience (Rising above stage, pulling back over beach & turquoise ocean)
        const u = (sp - 0.3) / 0.16;
        const easeU = THREE.MathUtils.smoothstep(u, 0, 1);
        const cx = THREE.MathUtils.lerp(0.0, -8.2, easeU);
        const cy = THREE.MathUtils.lerp(2.15, 17.5, easeU);
        const cz = THREE.MathUtils.lerp(-12.9, -25.5, easeU);

        targetCamPos.current.set(
          cx + mouseParallaxX * 0.8,
          cy + mouseParallaxY * 0.5,
          cz
        );
        // Drone looks down at the beach wedding stage, palm trees & villa coastline
        const lookZ = THREE.MathUtils.lerp(-8.0, -3.5, easeU);
        targetLookAt.current.set(0, THREE.MathUtils.lerp(1.95, 1.2, easeU), lookZ);
      } else if (sp < 0.88) {
        // Zone 4: High Coastal Panorama & Ocean Horizon Cruise during Editorial Sections (Couple, Story, Events, Countdown, Gallery, RSVP)
        const u = (sp - 0.46) / 0.42;
        const angle = u * Math.PI * 0.65;
        const cx = -8.2 + Math.sin(angle) * 11.5;
        const cy = THREE.MathUtils.lerp(17.5, 4.2, u);
        const cz = THREE.MathUtils.lerp(-25.5, -10.5, u);

        targetCamPos.current.set(
          cx + mouseParallaxX * 0.6,
          cy + mouseParallaxY * 0.3,
          cz
        );
        targetLookAt.current.set(0, 2.0, -8.5);
      } else {
        // Zone 5: Final Sunset Experience by the Candlelit Ocean Stage (0.88 -> 1.0)
        const u = THREE.MathUtils.clamp((sp - 0.88) / 0.12, 0, 1);
        const cx = THREE.MathUtils.lerp(3.2, 0.8, u);
        const cy = THREE.MathUtils.lerp(4.2, 1.85, u);
        const cz = THREE.MathUtils.lerp(-10.5, -3.6, u);

        targetCamPos.current.set(
          cx + mouseParallaxX * 0.4,
          cy + mouseParallaxY * 0.2,
          cz
        );
        targetLookAt.current.set(0, 2.1, -14.0);
      }

      currentCamPos.current.lerp(targetCamPos.current, dt * 4.2);
      currentLookAt.current.lerp(targetLookAt.current, dt * 4.8);
    }

    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return (
    <group>
      {/* Dynamic Atmospheric Sky & Twilight Stars */}
      <Sky
        distance={450000}
        sunPosition={[4, 2.2, -30]}
        inclination={0.51}
        azimuth={0.24}
        mieCoefficient={0.005}
        mieDirectionalG={0.82}
        rayleigh={1.2}
        turbidity={7.5}
      />
      <Stars
        radius={90}
        depth={45}
        count={1200}
        factor={3}
        saturation={0.2}
        fade
        speed={0.6}
      />

      {/* Glowing Golden Horizon Sun Disc & Atmospheric Halo over the Ocean */}
      <mesh ref={sunSphereRef} position={[6, 9, -72]}>
        <sphereGeometry args={[3.4, 32, 32]} />
        <meshBasicMaterial color="#ffe49e" />
      </mesh>
      <mesh ref={sunGlowRef} position={[6, 9, -72.5]}>
        <circleGeometry args={[7.5, 32]} />
        <meshBasicMaterial
          color="#ffaa55"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main Sunlight & Ambient Illumination */}
      <ambientLight ref={ambientLightRef} intensity={1.05} color="#e8f4fc" />
      <directionalLight
        ref={dirLightRef}
        position={[8.5, 22, 12]}
        intensity={2.5}
        color="#fff4dc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={75}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0005}
      />
      <hemisphereLight
        args={['#d8f0ff', '#e7d2a7', 0.65]}
        position={[0, 25, 0]}
      />

      {/* ================================================================= */}
      {/* SCENE 1 & 2: THE BLUE DOOR & MEDITERRANEAN VILLA ENTRANCE         */}
      {/* ================================================================= */}
      <BlueDoorEntrance
        doorOpenProgressRef={doorOpenProgressRef}
        handleTurnProgressRef={handleTurnProgressRef}
        sunlightBurstRef={sunlightBurstRef}
        onTouchDoor={onTouchDoor}
        isDoorInteractive={!isDoorOpened && !isOpeningInProgress}
      />

      {/* ================================================================= */}
      {/* SCENE 3: WEDDING ENTRANCE AISLE – THE DESTINATION                 */}
      {/* ================================================================= */}
      <WeddingAisleSection />

      {/* ================================================================= */}
      {/* SCENE 4: MAIN OCEAN-FACING WEDDING STAGE – THE SHOWSTOPPER        */}
      {/* ================================================================= */}
      <MainWeddingStage />

      {/* ================================================================= */}
      {/* SCENE 5: REAL-TIME GLSL TURQUOISE OCEAN & SHORELINE WAVES         */}
      {/* ================================================================= */}
      <mesh
        position={[0, -0.08, -42.0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={oceanMat}
      >
        <planeGeometry args={[170, 68, 128, 96]} />
      </mesh>

      {/* Underwater Shallow Lagoon Sand Seabed for realistic depth refraction */}
      <mesh
        position={[0, -0.55, -42.0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[170, 68]} />
        <meshBasicMaterial color="#1ca3b0" />
      </mesh>

      {/* Coastal Headland Cliffs & Tropical Peninsula framing the Lagoon Cove */}
      {headlandRocks.map((hr, idx) => (
        <group key={idx} position={hr.pos}>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#5d5449"
              roughness={0.9}
              onBeforeCompile={(shader) => {
                shader.vertexShader = shader.vertexShader.replace(
                  '#include <begin_vertex>',
                  `vec3 transformed = vec3(position.x * ${hr.scale[0].toFixed(1)}, position.y * ${hr.scale[1].toFixed(1)}, position.z * ${hr.scale[2].toFixed(1)});`
                );
              }}
            />
          </mesh>
          {/* Green Tropical Vegetation Cap on Headland Cliffs */}
          <mesh position={[0, hr.scale[1] * 0.45, 0]}>
            <BoxVegetationCap scale={hr.scale} />
          </mesh>
        </group>
      ))}

      {/* ================================================================= */}
      {/* FLOATING ROSE PETALS & GOLDEN SUNLIGHT POLLEN PARTICLES           */}
      {/* ================================================================= */}
      <instancedMesh
        ref={petalsInstancedRef}
        args={[undefined, undefined, petalCount]}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff6e8"
          emissive="#ffdca8"
          emissiveIntensity={0.35}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </instancedMesh>

      {/* ================================================================= */}
      {/* FLOATING WARM SKY LANTERNS FOR SUNSET FINALE                      */}
      {/* ================================================================= */}
      <group ref={floatingLanternsRef} visible={false}>
        {skyLanterns.map((sl, idx) => (
          <group key={idx} position={sl.pos}>
            <mesh>
              <cylinderGeometry args={[0.18, 0.12, 0.36, 12]} />
              <meshBasicMaterial color="#ffb85c" transparent opacity={0.88} />
            </mesh>
            <mesh position={[0, -0.1, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#fff3c4" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

const BoxVegetationCap: React.FC<{ scale: [number, number, number] }> = ({
  scale,
}) => (
  <mesh>
    <cylinderGeometry
      args={[scale[0] * 0.55, scale[0] * 0.7, scale[1] * 0.35, 9]}
    />
    <meshStandardMaterial color="#274e2b" roughness={0.85} />
  </mesh>
);
