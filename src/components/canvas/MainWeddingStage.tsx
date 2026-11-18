import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getArchitecturalPBRTextures } from '../../utils/proceduralTextures';
import { BrassCandleLantern } from './WeddingAisleSection';

export const MainWeddingStage: React.FC = () => {
  const pbr = useMemo(() => getArchitecturalPBRTextures(), []);
  const drapesGroupRef = useRef<THREE.Group>(null);
  const chandelierRef = useRef<THREE.Group>(null);

  // Generate 3D White Rose & Cascading Orchid clusters for the Mandap Canopy & Ocean-Facing Floral Arch Ring
  const canopyFlorals = useMemo(() => {
    const items: {
      pos: [number, number, number];
      scale: number;
      color: string;
    }[] = [];
    const colors = ['#ffffff', '#fdfaf2', '#f7edd9', '#eef5ea', '#fff6e5'];

    // 1. Top Perimeter Floral Cornice around the 4-poster mandap
    for (let i = 0; i < 88; i++) {
      const side = i % 4;
      const t = (Math.floor(i / 4) / 22) * 2 - 1; // -1 .. 1
      let x = 0;
      let z = 0;
      if (side === 0) {
        // Front (Aisle-facing) cornice
        x = t * 2.85;
        z = 1.95;
      } else if (side === 1) {
        // Back (Ocean-facing) cornice
        x = t * 2.85;
        z = -1.95;
      } else if (side === 2) {
        // Left cornice
        x = -2.85;
        z = t * 1.95;
      } else {
        // Right cornice
        x = 2.85;
        z = t * 1.95;
      }
      const y = 3.95 + (Math.random() - 0.5) * 0.42;
      items.push({
        pos: [
          x + (Math.random() - 0.5) * 0.25,
          y,
          z + (Math.random() - 0.5) * 0.25,
        ],
        scale: 0.22 + Math.random() * 0.19,
        color: colors[i % colors.length],
      });
    }

    // 2. Signature Circular Floral Arch framing the Turquoise Ocean at the back of the stage (z = -1.85 local)
    for (let i = 0; i < 48; i++) {
      const angle = -0.15 + (i / 47) * (Math.PI + 0.3);
      const radius = 1.92 + (Math.random() - 0.5) * 0.18;
      const x = Math.cos(angle) * radius;
      const y = 1.65 + Math.sin(angle) * radius;
      const z = -1.85 + (Math.random() - 0.5) * 0.22;
      if (y > 0.4) {
        items.push({
          pos: [x, y, z],
          scale: 0.2 + Math.random() * 0.16,
          color: colors[i % colors.length],
        });
      }
    }

    // 3. Four Pillar Mid-Height Tieback Floral Bouquets
    const pillars: [number, number][] = [
      [-2.65, 1.8],
      [2.65, 1.8],
      [-2.65, -1.8],
      [2.65, -1.8],
    ];
    pillars.forEach(([px, pz]) => {
      for (let k = 0; k < 10; k++) {
        const ang = (k / 10) * Math.PI * 2;
        items.push({
          pos: [
            px + Math.cos(ang) * 0.28,
            1.82 + (Math.random() - 0.5) * 0.32,
            pz + Math.sin(ang) * 0.28,
          ],
          scale: 0.16 + Math.random() * 0.12,
          color: colors[k % colors.length],
        });
      }
    });

    return items;
  }, []);

  // Guest Seating Chairs arranged in 4 rows on Left and Right of the beach boardwalk
  const seatingPositions = useMemo(() => {
    const chairs: { pos: [number, number, number]; rotY: number; isAisle: boolean }[] = [];
    const rowsZ = [-1.8, -3.1, -4.4, -5.7];
    rowsZ.forEach((rz) => {
      for (let c = 0; c < 4; c++) {
        // Left block
        chairs.push({
          pos: [-2.4 - c * 0.92, 0.02, rz],
          rotY: 0.12,
          isAisle: c === 0,
        });
        // Right block
        chairs.push({
          pos: [2.4 + c * 0.92, 0.02, rz],
          rotY: -0.12,
          isAisle: c === 0,
        });
      }
    });
    return chairs;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (drapesGroupRef.current) {
      drapesGroupRef.current.children.forEach((child, idx) => {
        child.rotation.z =
          (idx % 2 === 0 ? 0.06 : -0.06) + Math.sin(t * 1.45 + idx) * 0.025;
      });
    }
    if (chandelierRef.current) {
      chandelierRef.current.rotation.y = Math.sin(t * 0.5) * 0.08;
    }
  });

  return (
    <group>
      {/* 1. Pristine Tropical White Coral Sand Beach Cove sloping into the Ocean */}
      <mesh
        position={[0, 0.0, -7.2]}
        rotation={[-Math.PI / 2 + 0.015, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[95, 16.5]} />
        <meshStandardMaterial
          map={pbr.sandColor}
          bumpMap={pbr.sandBump}
          bumpScale={0.025}
          roughness={0.86}
        />
      </mesh>

      {/* 2. White Timber Beach Boardwalk connecting Flagstone Aisle to Main Stage */}
      <mesh position={[0, 0.07, -3.1]} receiveShadow castShadow>
        <boxGeometry args={[2.65, 0.1, 5.4]} />
        <meshStandardMaterial color="#fbf8f1" roughness={0.52} />
      </mesh>

      {/* White Rose Petal Carpet Runners along the edges of the Boardwalk */}
      <mesh
        position={[-1.08, 0.125, -3.1]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.36, 5.2]} />
        <meshStandardMaterial color="#fff9ed" roughness={0.6} />
      </mesh>
      <mesh
        position={[1.08, 0.125, -3.1]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[0.36, 5.2]} />
        <meshStandardMaterial color="#fff9ed" roughness={0.6} />
      </mesh>

      {/* ================================================================= */}
      {/* 3. THE SHOWSTOPPER OCEAN-FACING WEDDING STAGE (Centered at z=-8.0) */}
      {/* ================================================================= */}
      <group position={[0, 0, -8.0]}>
        {/* Lower & Upper White Beachfront Stage Platforms */}
        <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
          <boxGeometry args={[7.2, 0.24, 5.1]} />
          <meshStandardMaterial color="#f8f4ec" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.28, 0]} receiveShadow castShadow>
          <boxGeometry args={[6.5, 0.16, 4.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.38} />
        </mesh>

        {/* Four Corner Mandap Structural Columns */}
        {[
          [-2.65, 1.8],
          [2.65, 1.8],
          [-2.65, -1.8],
          [2.65, -1.8],
        ].map(([px, pz], idx) => (
          <mesh
            key={idx}
            position={[px, 2.15, pz]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.11, 0.13, 3.7, 20]} />
            <meshStandardMaterial color="#fbf7ef" roughness={0.45} />
          </mesh>
        ))}

        {/* Top Mandap Canopy Frame Beams */}
        <mesh position={[0, 3.96, 1.8]} castShadow>
          <boxGeometry args={[5.7, 0.16, 0.18]} />
          <meshStandardMaterial color="#f6efe2" roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.96, -1.8]} castShadow>
          <boxGeometry args={[5.7, 0.16, 0.18]} />
          <meshStandardMaterial color="#f6efe2" roughness={0.5} />
        </mesh>
        <mesh position={[-2.65, 3.96, 0]} castShadow>
          <boxGeometry args={[0.18, 0.16, 3.8]} />
          <meshStandardMaterial color="#f6efe2" roughness={0.5} />
        </mesh>
        <mesh position={[2.65, 3.96, 0]} castShadow>
          <boxGeometry args={[0.18, 0.16, 3.8]} />
          <meshStandardMaterial color="#f6efe2" roughness={0.5} />
        </mesh>

        {/* Billowing Champagne & White Silk Pillar Drapery (matching wedding-stage-ocean.jpg) */}
        <group ref={drapesGroupRef}>
          {[
            [-2.52, 1.75],
            [2.52, 1.75],
            [-2.52, -1.75],
            [2.52, -1.75],
          ].map(([px, pz], idx) => (
            <mesh key={idx} position={[px, 2.15, pz]} castShadow>
              <cylinderGeometry args={[0.34, 0.46, 3.65, 20, 8, true]} />
              <meshStandardMaterial
                color={idx < 2 ? '#f4e5cd' : '#fbf5e9'}
                roughness={0.34}
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* Overhead Sheer Champagne Silk Ceiling Swags */}
        {[-1.2, 0, 1.2].map((zOff, i) => (
          <mesh
            key={i}
            position={[0, 3.82, zOff]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.35, 0.35, 5.2, 16, 1, true]} />
            <meshStandardMaterial
              color="#fbf4e6"
              transparent
              opacity={0.76}
              roughness={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Crystal & Warm Gold Chandelier suspended in center of Mandap */}
        <group ref={chandelierRef} position={[0, 3.35, 0]}>
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
            <meshStandardMaterial color="#d4af63" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <torusGeometry args={[0.45, 0.025, 12, 28]} />
            <meshStandardMaterial color="#e0bd72" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh position={[0, -0.14, 0]}>
            <torusGeometry args={[0.28, 0.02, 12, 24]} />
            <meshStandardMaterial color="#e0bd72" metalness={0.92} roughness={0.18} />
          </mesh>
          {/* Glowing Crystal Pendants */}
          {Array.from({ length: 12 }).map((_, ci) => {
            const ang = (ci / 12) * Math.PI * 2;
            return (
              <mesh
                key={ci}
                position={[Math.cos(ang) * 0.44, -0.08, Math.sin(ang) * 0.44]}
              >
                <octahedronGeometry args={[0.045, 0]} />
                <meshBasicMaterial color="#fff3cf" />
              </mesh>
            );
          })}
          <pointLight intensity={1.8} distance={8} color="#ffdfa0" />
        </group>

        {/* Centerpiece Bride & Groom Ceremony Chairs & Low Floral Altar Table */}
        {/* Low Ivory Ceremony Table */}
        <mesh position={[0, 0.62, -0.35]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 0.52, 0.72]} />
          <meshStandardMaterial color="#faf5ea" roughness={0.45} />
        </mesh>
        {/* Golden Ceremonial Bowls & Candles on Altar Table */}
        <mesh position={[0, 0.94, -0.35]} castShadow>
          <cylinderGeometry args={[0.18, 0.12, 0.12, 16]} />
          <meshStandardMaterial color="#d6ab58" metalness={0.88} roughness={0.22} />
        </mesh>
        {/* Bride & Groom Ivory Couches/Chairs facing each other & the ocean */}
        {[-1.15, 1.15].map((cx, i) => (
          <group
            key={i}
            position={[cx, 0.36, -0.35]}
            rotation={[0, i === 0 ? Math.PI / 2 - 0.25 : -Math.PI / 2 + 0.25, 0]}
          >
            {/* Seat */}
            <mesh position={[0, 0.26, 0]} castShadow>
              <boxGeometry args={[0.62, 0.12, 0.58]} />
              <meshStandardMaterial color="#f9f3e5" roughness={0.5} />
            </mesh>
            {/* Curved Upholstered Backrest */}
            <mesh position={[0, 0.64, -0.24]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.68, 16]} />
              <meshStandardMaterial color="#fdfaf2" roughness={0.45} />
            </mesh>
            {/* Gold Legs */}
            {[-0.24, 0.24].map((lx) =>
              [-0.22, 0.22].map((lz) => (
                <mesh key={`${lx}-${lz}`} position={[lx, 0.11, lz]}>
                  <cylinderGeometry args={[0.022, 0.018, 0.22, 8]} />
                  <meshStandardMaterial
                    color="#cf9f56"
                    metalness={0.85}
                    roughness={0.25}
                  />
                </mesh>
              ))
            )}
          </group>
        ))}

        {/* Lush 3D White Rose & Cascading Orchid Canopy + Circular Ocean Arch */}
        {canopyFlorals.map((cf, idx) => (
          <mesh key={idx} position={cf.pos} castShadow>
            <dodecahedronGeometry args={[cf.scale, 1]} />
            <meshStandardMaterial
              color={cf.color}
              roughness={0.42}
              emissive={cf.color}
              emissiveIntensity={0.08}
            />
          </mesh>
        ))}

        {/* Stage Perimeter Brass & Glass Candle Lanterns */}
        <BrassCandleLantern position={[-1.75, 0.24, 2.25]} seed={21} />
        <BrassCandleLantern position={[-2.1, 0.24, 2.15]} seed={22} />
        <BrassCandleLantern position={[1.75, 0.24, 2.25]} seed={23} />
        <BrassCandleLantern position={[2.1, 0.24, 2.15]} seed={24} />
        <BrassCandleLantern position={[-3.05, 0.12, 1.9]} seed={25} />
        <BrassCandleLantern position={[3.05, 0.12, 1.9]} seed={26} />
        <BrassCandleLantern position={[-2.95, 0.24, -1.9]} seed={27} />
        <BrassCandleLantern position={[2.95, 0.24, -1.9]} seed={28} />
      </group>

      {/* ================================================================= */}
      {/* 4. LUXURY GUEST SEATING FACING THE STAGE & TURQUOISE OCEAN        */}
      {/* ================================================================= */}
      {seatingPositions.map((ch, idx) => (
        <group
          key={idx}
          position={ch.pos}
          rotation={[0, Math.PI + ch.rotY, 0]}
        >
          {/* White Chiavari Chair Cushion */}
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.07, 0.46]} />
            <meshStandardMaterial color="#fdf9f0" roughness={0.5} />
          </mesh>
          {/* Chair Backrest Frame */}
          <mesh position={[0, 0.78, -0.21]} castShadow>
            <boxGeometry args={[0.46, 0.62, 0.04]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Chair Legs */}
          <mesh position={[-0.2, 0.22, -0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0.2, 0.22, -0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[-0.2, 0.22, 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0.2, 0.22, 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* White Rose Chair Floral Accent on Aisle Seats */}
          {ch.isAisle && (
            <mesh position={[ch.pos[0] < 0 ? 0.26 : -0.26, 0.82, -0.21]}>
              <dodecahedronGeometry args={[0.11, 1]} />
              <meshStandardMaterial color="#fff9ec" roughness={0.45} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};
