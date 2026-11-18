import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { getArchitecturalPBRTextures } from '../../utils/proceduralTextures';

interface PalmTreeProps {
  position: [number, number, number];
  scale?: number;
  leanX?: number;
  seed?: number;
}

const SwayingPalmTree: React.FC<PalmTreeProps> = ({
  position,
  scale = 1,
  leanX = 0.12,
  seed = 0,
}) => {
  const crownRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (crownRef.current) {
      crownRef.current.rotation.z = Math.sin(t * 1.15 + seed) * 0.045;
      crownRef.current.rotation.x = Math.cos(t * 0.9 + seed) * 0.03;
    }
  });

  const trunkSegments = 7;
  const fronds = 10;

  return (
    <group position={position} scale={scale}>
      {/* Segmented curved coconut palm trunk */}
      {Array.from({ length: trunkSegments }).map((_, idx) => {
        const frac = idx / trunkSegments;
        const y = idx * 0.88 + 0.44;
        const xOffset = Math.pow(frac, 1.6) * leanX * 4.5;
        const rTop = 0.24 - frac * 0.11;
        const rBot = 0.26 - frac * 0.11;
        return (
          <mesh
            key={idx}
            position={[xOffset, y, 0]}
            rotation={[0, 0, -leanX * frac * 0.65]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[rTop, rBot, 0.94, 12]} />
            <meshStandardMaterial color="#705946" roughness={0.88} />
          </mesh>
        );
      })}

      {/* Swaying Palm Crown Fronds */}
      <group
        ref={crownRef}
        position={[leanX * 4.1, trunkSegments * 0.88 + 0.1, 0]}
      >
        {Array.from({ length: fronds }).map((_, fIdx) => {
          const angle = (fIdx / fronds) * Math.PI * 2;
          const pitch = 0.42 + (fIdx % 3) * 0.16;
          return (
            <group key={fIdx} rotation={[0, angle, 0]}>
              <mesh
                position={[0, 0.1, 1.45]}
                rotation={[pitch, 0, 0]}
                castShadow
              >
                <boxGeometry args={[0.62, 0.03, 2.85]} />
                <meshStandardMaterial
                  color={fIdx % 2 === 0 ? '#2f6335' : '#3d763f'}
                  roughness={0.55}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

interface FloralAisleArchProps {
  zPos: number;
  index: number;
}

const FloralAisleArch: React.FC<FloralAisleArchProps> = ({ zPos, index }) => {
  const leftDrapeRef = useRef<THREE.Mesh>(null);
  const rightDrapeRef = useRef<THREE.Mesh>(null);
  const topValanceRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const wave = Math.sin(t * 1.6 + index * 0.9);
    if (leftDrapeRef.current && rightDrapeRef.current) {
      leftDrapeRef.current.rotation.z = 0.08 + wave * 0.035;
      rightDrapeRef.current.rotation.z = -0.08 + wave * 0.035;
    }
    if (topValanceRef.current) {
      topValanceRef.current.position.y = 4.45 + Math.sin(t * 1.9 + index) * 0.03;
    }
  });

  // Procedural floral clusters (white roses, orchids, and magenta bougainvillea)
  const floralNodes = useMemo(() => {
    const list: { pos: [number, number, number]; scale: number; color: string }[] = [];
    const palette = [
      '#fcfaf5',
      '#fff8eb',
      '#f5ebd6',
      '#d61f69',
      '#e83e8c',
      '#ffffff',
    ];
    // Left pillar & top corner
    for (let i = 0; i < 26; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const isTop = i > 14;
      const x = isTop
        ? (Math.random() - 0.5) * 4.6
        : side * (2.25 + (Math.random() - 0.5) * 0.28);
      const y = isTop
        ? 4.45 + (Math.random() - 0.5) * 0.35
        : 1.5 + Math.random() * 3.1;
      const z = (Math.random() - 0.5) * 0.35;
      list.push({
        pos: [x, y, z],
        scale: 0.14 + Math.random() * 0.15,
        color: palette[i % palette.length],
      });
    }
    return list;
  }, []);

  return (
    <group position={[0, 0, zPos]}>
      {/* Left & Right Timber/Whitewashed Pergola Posts */}
      <mesh position={[-2.35, 2.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.11, 4.6, 16]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.65} />
      </mesh>
      <mesh position={[2.35, 2.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.11, 4.6, 16]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.65} />
      </mesh>
      {/* Top Crossbeam */}
      <mesh position={[0, 4.58, 0]} castShadow>
        <boxGeometry args={[5.1, 0.14, 0.16]} />
        <meshStandardMaterial color="#e8decb" roughness={0.65} />
      </mesh>

      {/* Billowing Sheer White Silk Drapes Left, Right & Top Valance */}
      <mesh
        ref={leftDrapeRef}
        position={[-2.15, 2.35, 0.08]}
        castShadow
      >
        <cylinderGeometry args={[0.24, 0.38, 4.4, 16, 8, true]} />
        <meshStandardMaterial
          color="#fffdf9"
          roughness={0.38}
          transparent
          opacity={0.86}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        ref={rightDrapeRef}
        position={[2.15, 2.35, 0.08]}
        castShadow
      >
        <cylinderGeometry args={[0.24, 0.38, 4.4, 16, 8, true]} />
        <meshStandardMaterial
          color="#fffdf9"
          roughness={0.38}
          transparent
          opacity={0.86}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        ref={topValanceRef}
        position={[0, 4.45, 0.06]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.22, 0.22, 4.5, 16, 1, true]} />
        <meshStandardMaterial
          color="#fdfaf2"
          roughness={0.35}
          transparent
          opacity={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lush 3D White Rose, Orchid & Bougainvillea Clusters */}
      {floralNodes.map((fn, idx) => (
        <mesh key={idx} position={fn.pos} castShadow>
          <dodecahedronGeometry args={[fn.scale, 1]} />
          <meshStandardMaterial
            color={fn.color}
            roughness={0.45}
            emissive={fn.color}
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}
    </group>
  );
};

interface BrassLanternProps {
  position: [number, number, number];
  seed: number;
}

export const BrassCandleLantern: React.FC<BrassLanternProps> = ({
  position,
  seed,
}) => {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flameRef.current) {
      const flicker = 0.92 + Math.sin(t * 11 + seed * 4.3) * 0.08 + Math.cos(t * 17 + seed) * 0.05;
      flameRef.current.scale.set(1, flicker, 1);
    }
  });

  return (
    <group position={position}>
      {/* Brass Base */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.19, 0.06, 6]} />
        <meshStandardMaterial color="#c69b51" metalness={0.86} roughness={0.25} />
      </mesh>
      {/* Glass Hurricane Enclosure */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.56, 6]} />
        <meshStandardMaterial
          color="#fff6e0"
          transparent
          opacity={0.26}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      {/* Brass Crown Dome & Ring */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <coneGeometry args={[0.18, 0.18, 6]} />
        <meshStandardMaterial color="#c69b51" metalness={0.88} roughness={0.24} />
      </mesh>
      {/* Ivory Pillar Candle Inside */}
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.28, 12]} />
        <meshStandardMaterial
          color="#fdf7e7"
          roughness={0.5}
          emissive="#ffbe55"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Flickering Candle Flame */}
      <mesh ref={flameRef} position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshBasicMaterial color="#ffd269" />
      </mesh>
    </group>
  );
};

export const WeddingAisleSection: React.FC = () => {
  const pbr = useMemo(() => getArchitecturalPBRTextures(), []);
  const aislePhotoTex = useLoader(
    THREE.TextureLoader,
    './assets/images/wedding-aisle-env.jpg'
  );

  useMemo(() => {
    aislePhotoTex.colorSpace = THREE.SRGBColorSpace;
  }, [aislePhotoTex]);

  // Low white rose & orchid floral hedges lining both sides of the flagstone aisle
  const aisleFloralBorder = useMemo(() => {
    const items: {
      pos: [number, number, number];
      scale: number;
      color: string;
    }[] = [];
    const colors = ['#ffffff', '#fcf8ef', '#f6ead4', '#e5f2e0', '#d61f69'];
    for (let z = 15.8; z >= -3.0; z -= 0.55) {
      for (const side of [-1, 1]) {
        const x =
          side * (1.85 + Math.sin(z * 0.5) * 0.12 + (Math.random() - 0.5) * 0.35);
        const y = 0.22 + Math.random() * 0.35;
        items.push({
          pos: [x, y, z],
          scale: 0.18 + Math.random() * 0.18,
          color: colors[Math.floor(Math.random() * (z > 4 ? 5 : 4))],
        });
      }
    }
    return items;
  }, []);

  return (
    <group>
      {/* 1. White Flagstone Wedding Entrance Aisle Pathway (z: +18 down to -3.5) */}
      <mesh
        position={[0, 0.03, 7.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3.7, 22.0]} />
        <meshStandardMaterial
          map={pbr.flagstoneColor}
          bumpMap={pbr.flagstoneBump}
          bumpScale={0.035}
          roughness={0.68}
        />
      </mesh>

      {/* Lush Tropical Garden Ground flanking the flagstone pathway */}
      <mesh
        position={[-7.5, 0.01, 7.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[11.5, 22.0]} />
        <meshStandardMaterial color="#214226" roughness={0.92} />
      </mesh>
      <mesh
        position={[7.5, 0.01, 7.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[11.5, 22.0]} />
        <meshStandardMaterial color="#214226" roughness={0.92} />
      </mesh>

      {/* 2. Four Decorated White Floral & Silk Drape Colonnade Arches along the Aisle */}
      {[14.2, 10.2, 6.2, 2.2].map((zPos, idx) => (
        <FloralAisleArch key={zPos} zPos={zPos} index={idx} />
      ))}

      {/* 3. White Rose, Orchid & Bougainvillea Hedges bordering the stone aisle */}
      {aisleFloralBorder.map((fb, idx) => (
        <mesh key={idx} position={fb.pos} castShadow receiveShadow>
          <dodecahedronGeometry args={[fb.scale, 1]} />
          <meshStandardMaterial
            color={fb.color}
            roughness={0.5}
            emissive={fb.color}
            emissiveIntensity={0.06}
          />
        </mesh>
      ))}

      {/* 4. Ornate Brass & Glass Floor Candle Lanterns along the Aisle */}
      {[15.2, 12.2, 9.2, 6.2, 3.2, 0.2].map((zPos, i) => (
        <React.Fragment key={zPos}>
          <BrassCandleLantern position={[-1.52, 0.03, zPos]} seed={i * 2} />
          <BrassCandleLantern position={[1.52, 0.03, zPos]} seed={i * 2 + 1} />
        </React.Fragment>
      ))}

      {/* 5. Swaying Tropical Coconut Palm Trees lining the Resort Garden & Beach */}
      <SwayingPalmTree position={[-4.5, 0, 14.5]} scale={1.08} leanX={0.14} seed={1} />
      <SwayingPalmTree position={[4.5, 0, 14.2]} scale={1.05} leanX={-0.14} seed={2} />
      <SwayingPalmTree position={[-5.2, 0, 9.5]} scale={1.15} leanX={0.16} seed={3} />
      <SwayingPalmTree position={[5.1, 0, 9.0]} scale={1.12} leanX={-0.15} seed={4} />
      <SwayingPalmTree position={[-4.8, 0, 4.2]} scale={1.1} leanX={0.13} seed={5} />
      <SwayingPalmTree position={[4.9, 0, 3.8]} scale={1.14} leanX={-0.14} seed={6} />
      <SwayingPalmTree position={[-6.4, 0, -2.5]} scale={1.22} leanX={0.18} seed={7} />
      <SwayingPalmTree position={[6.5, 0, -2.8]} scale={1.2} leanX={-0.17} seed={8} />

      {/* 6. Photorealistic 3D Peripheral Garden & Bougainvillea Vistas flanking the Resort Courtyard */}
      <mesh
        position={[-10.2, 3.6, 8.0]}
        rotation={[0, Math.PI / 2 - 0.18, 0]}
      >
        <planeGeometry args={[18, 7.5]} />
        <meshStandardMaterial
          map={aislePhotoTex}
          roughness={0.85}
          transparent
          opacity={0.78}
        />
      </mesh>
      <mesh
        position={[10.2, 3.6, 8.0]}
        rotation={[0, -Math.PI / 2 + 0.18, 0]}
      >
        <planeGeometry args={[18, 7.5]} />
        <meshStandardMaterial
          map={aislePhotoTex}
          roughness={0.85}
          transparent
          opacity={0.78}
        />
      </mesh>

      {/* Warm Aisle Lantern Illumination Point Lights */}
      <pointLight
        position={[0, 1.4, 11.5]}
        intensity={1.3}
        distance={9}
        color="#ffd584"
      />
      <pointLight
        position={[0, 1.4, 4.5]}
        intensity={1.3}
        distance={9}
        color="#ffd584"
      />
    </group>
  );
};
