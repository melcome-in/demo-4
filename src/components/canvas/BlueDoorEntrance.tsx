import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, ThreeEvent } from '@react-three/fiber';
import { getArchitecturalPBRTextures } from '../../utils/proceduralTextures';

interface BlueDoorEntranceProps {
  doorOpenProgressRef: React.MutableRefObject<number>;
  handleTurnProgressRef: React.MutableRefObject<number>;
  sunlightBurstRef: React.MutableRefObject<number>;
  onTouchDoor?: () => void;
  isDoorInteractive?: boolean;
}

// Helper to create a plane with custom UV bounds and world bounds
function createUVMappedBoxFace(
  width: number,
  height: number,
  depth: number,
  uMin: number,
  uMax: number,
  vMin: number,
  vMax: number,
  offsetX: number,
  offsetY: number
): THREE.BufferGeometry {
  const geom = new THREE.BoxGeometry(width, height, depth, 1, 1, 1);
  geom.translate(offsetX, offsetY, 0);

  // Remap front face (+Z is face index 4 in BoxGeometry: vertices 16..19) and back face (-Z: vertices 20..23)
  const uvAttr = geom.attributes.uv;
  // Front face vertices in Three.js BoxGeometry: 16 (top-left), 17 (top-right), 18 (bottom-left), 19 (bottom-right)
  uvAttr.setXY(16, uMin, vMax);
  uvAttr.setXY(17, uMax, vMax);
  uvAttr.setXY(18, uMin, vMin);
  uvAttr.setXY(19, uMax, vMin);

  // Back face vertices (mirrored horizontally so back of door looks like real blue wood doors too)
  uvAttr.setXY(20, uMax, vMax);
  uvAttr.setXY(21, uMin, vMax);
  uvAttr.setXY(22, uMax, vMin);
  uvAttr.setXY(23, uMin, vMin);

  uvAttr.needsUpdate = true;
  return geom;
}

export const BlueDoorEntrance: React.FC<BlueDoorEntranceProps> = ({
  doorOpenProgressRef,
  handleTurnProgressRef,
  sunlightBurstRef,
  onTouchDoor,
  isDoorInteractive = true,
}) => {
  const [isDoorHovered, setIsDoorHovered] = useState(false);

  const handleDoorPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isDoorInteractive) return;
    setIsDoorHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handleDoorPointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDoorHovered(false);
    document.body.style.cursor = 'default';
  };

  const handleDoorTap = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isDoorInteractive) return;
    document.body.style.cursor = 'default';
    setIsDoorHovered(false);
    onTouchDoor?.();
  };

  const blockOutsideWallClick = (e: ThreeEvent<MouseEvent>) => {
    // Clicking the stone walls around the door must NOT open the door
    e.stopPropagation();
  };
  const doorTexture = useLoader(
    THREE.TextureLoader,
    './assets/images/blue-door-texture.jpg'
  );

  useMemo(() => {
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    doorTexture.anisotropy = 16;
  }, [doorTexture]);

  const pbr = useMemo(() => getArchitecturalPBRTextures(), []);

  const leftDoorGroupRef = useRef<THREE.Group>(null);
  const rightDoorGroupRef = useRef<THREE.Group>(null);
  const leftHandleRef = useRef<THREE.Group>(null);
  const rightHandleRef = useRef<THREE.Group>(null);
  const sunShaftRef = useRef<THREE.Mesh>(null);

  // Exact facade coordinate calibration matching blue-door-texture.jpg
  const W = 6.4;
  const H = 7.6;
  const xMin = -W / 2; // -3.2
  const xMax = W / 2; // +3.2
  const yMin = -0.75;
  const yMax = yMin + H; // +6.85

  const uL = 0.232;
  const uM = 0.5;
  const uR = 0.768;
  const vB = 0.118;
  const vT = 0.774;

  const xL = xMin + uL * W; // -1.7152
  const xM = 0.0;
  const xR = xMin + uR * W; // +1.7152
  const yB = yMin + vB * H; // +0.1468
  const yT = yMin + vT * H; // +5.1324

  const doorW = xM - xL; // 1.7152
  const doorH = yT - yB; // 4.9856
  const doorDepth = 0.14;
  const wallDepth = 0.55;

  const geometries = useMemo(() => {
    // 1. Left Door (pivoted at x = xL, y = yB)
    const leftDoor = createUVMappedBoxFace(
      doorW,
      doorH,
      doorDepth,
      uL,
      uM,
      vB,
      vT,
      doorW / 2,
      doorH / 2
    );

    // 2. Right Door (pivoted at x = xR, y = yB)
    const rightDoor = createUVMappedBoxFace(
      doorW,
      doorH,
      doorDepth,
      uM,
      uR,
      vB,
      vT,
      -doorW / 2,
      doorH / 2
    );

    // 3. Left Wall Wing (xMin .. xL, yMin .. yMax)
    const leftWallW = xL - xMin;
    const leftWall = createUVMappedBoxFace(
      leftWallW,
      H,
      wallDepth,
      0,
      uL,
      0,
      1,
      xMin + leftWallW / 2,
      yMin + H / 2
    );

    // 4. Right Wall Wing (xR .. xMax, yMin .. yMax)
    const rightWallW = xMax - xR;
    const rightWall = createUVMappedBoxFace(
      rightWallW,
      H,
      wallDepth,
      uR,
      1,
      0,
      1,
      xR + rightWallW / 2,
      yMin + H / 2
    );

    // 5. Top Lintel & Bougainvillea Crown (xL .. xR, yT .. yMax)
    const topWallW = xR - xL;
    const topWallH = yMax - yT;
    const topWall = createUVMappedBoxFace(
      topWallW,
      topWallH,
      wallDepth,
      uL,
      uR,
      vT,
      1,
      0,
      yT + topWallH / 2
    );

    // 6. Bottom Stone Threshold Step (xL .. xR, yMin .. yB)
    const botWallH = yB - yMin;
    const botWall = createUVMappedBoxFace(
      topWallW,
      botWallH,
      wallDepth + 0.16,
      uL,
      uR,
      0,
      vB,
      0,
      yMin + botWallH / 2
    );

    return { leftDoor, rightDoor, leftWall, rightWall, topWall, botWall };
  }, [W, H, xMin, xMax, yMin, yMax, xL, xR, yB, yT, doorW, doorH]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const openP = doorOpenProgressRef.current;
    const handleP = handleTurnProgressRef.current;
    const burstP = sunlightBurstRef.current;

    // 1. Swing both Blue Doors inward realistically (up to 104 degrees = 1.81 rad)
    if (leftDoorGroupRef.current && rightDoorGroupRef.current) {
      const maxAngle = 1.82;
      const hoverNudge = isDoorHovered && openP === 0 ? 0.035 : 0;
      // Left door hinged on left, swings inward (-Z is inside, so +Y rotation swings inward toward -Z)
      leftDoorGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        leftDoorGroupRef.current.rotation.y,
        openP * maxAngle + hoverNudge,
        0.18
      );
      // Right door hinged on right, swings inward (-Y rotation swings inward toward -Z)
      rightDoorGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rightDoorGroupRef.current.rotation.y,
        -openP * maxAngle - hoverNudge,
        0.18
      );
    }

    // 2. Realistic brass door handle rotation & latch motion
    if (leftHandleRef.current && rightHandleRef.current) {
      const hoverHandle = isDoorHovered && handleP === 0 ? 0.14 : 0;
      const turnAngle = Math.sin(handleP * Math.PI) * 0.58 + hoverHandle;
      leftHandleRef.current.rotation.z = -turnAngle;
      rightHandleRef.current.rotation.z = turnAngle;
    }

    // 3. Volumetric golden sunlight beam streaming through opening doors
    if (sunShaftRef.current) {
      const mat = sunShaftRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = burstP * 0.36 * (0.88 + 0.12 * Math.sin(t * 2.5));
      sunShaftRef.current.scale.x = 0.2 + openP * 1.65;
    }
  });

  return (
    <group position={[0, 0, 18.0]}>
      {/* Photorealistic 3D Stone Wall Surround with Real Open Portal Cutout */}
      <mesh
        geometry={geometries.leftWall}
        onClick={blockOutsideWallClick}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={doorTexture}
          bumpMap={pbr.whiteStuccoBump}
          bumpScale={0.015}
          roughness={0.78}
        />
      </mesh>

      <mesh
        geometry={geometries.rightWall}
        onClick={blockOutsideWallClick}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={doorTexture}
          bumpMap={pbr.whiteStuccoBump}
          bumpScale={0.015}
          roughness={0.78}
        />
      </mesh>

      <mesh
        geometry={geometries.topWall}
        onClick={blockOutsideWallClick}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={doorTexture}
          bumpMap={pbr.whiteStuccoBump}
          bumpScale={0.015}
          roughness={0.78}
        />
      </mesh>

      <mesh
        geometry={geometries.botWall}
        onClick={blockOutsideWallClick}
        receiveShadow
      >
        <meshStandardMaterial
          map={doorTexture}
          bumpMap={pbr.flagstoneBump}
          bumpScale={0.02}
          roughness={0.72}
        />
      </mesh>

      {/* Extended White Limewashed Villa Courtyard Wings Left, Right & Upper Parapet so wall spans full viewport */}
      <mesh position={[-7.8, 3.05, -0.08]} onClick={blockOutsideWallClick} castShadow receiveShadow>
        <boxGeometry args={[9.4, 7.6, 0.5]} />
        <meshStandardMaterial
          map={pbr.whiteStuccoColor}
          bumpMap={pbr.whiteStuccoBump}
          bumpScale={0.03}
          color="#faf6ee"
          roughness={0.85}
        />
      </mesh>
      <mesh position={[7.8, 3.05, -0.08]} onClick={blockOutsideWallClick} castShadow receiveShadow>
        <boxGeometry args={[9.4, 7.6, 0.5]} />
        <meshStandardMaterial
          map={pbr.whiteStuccoColor}
          bumpMap={pbr.whiteStuccoBump}
          bumpScale={0.03}
          color="#faf6ee"
          roughness={0.85}
        />
      </mesh>
      <mesh position={[0, 8.85, -0.08]} onClick={blockOutsideWallClick} receiveShadow>
        <boxGeometry args={[25.0, 4.0, 0.5]} />
        <meshStandardMaterial
          map={pbr.whiteStuccoColor}
          bumpMap={pbr.whiteStuccoBump}
          bumpScale={0.03}
          color="#faf6ee"
          roughness={0.85}
        />
      </mesh>

      {/* Deep 3D Stone Archway Tunnel Reveal (visible inside the doorway as the doors swing open!) */}
      <mesh position={[xL - 0.08, (yB + yT) / 2, -0.65]} receiveShadow>
        <boxGeometry args={[0.18, doorH + 0.2, 1.35]} />
        <meshStandardMaterial
          map={pbr.whiteStuccoColor}
          bumpMap={pbr.whiteStuccoBump}
          bumpScale={0.025}
          color="#f4efe4"
          roughness={0.8}
        />
      </mesh>
      <mesh position={[xR + 0.08, (yB + yT) / 2, -0.65]} receiveShadow>
        <boxGeometry args={[0.18, doorH + 0.2, 1.35]} />
        <meshStandardMaterial
          map={pbr.whiteStuccoColor}
          bumpMap={pbr.whiteStuccoBump}
          bumpScale={0.025}
          color="#f4efe4"
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, yT + 0.08, -0.65]} receiveShadow>
        <boxGeometry args={[doorW * 2 + 0.36, 0.18, 1.35]} />
        <meshStandardMaterial
          map={pbr.whiteStuccoColor}
          bumpMap={pbr.whiteStuccoBump}
          bumpScale={0.025}
          color="#f4efe4"
          roughness={0.8}
        />
      </mesh>

      {/* Exterior Courtyard Flagstone Forecourt in front of the Blue Doors */}
      <mesh
        position={[0, 0.02, 4.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[18, 8.8]} />
        <meshStandardMaterial
          map={pbr.flagstoneColor}
          bumpMap={pbr.flagstoneBump}
          bumpScale={0.03}
          roughness={0.75}
        />
      </mesh>

      {/* ================================================================= */}
      {/* LEFT BLUE WOODEN DOOR (Hinged at [xL, yB, 0.02])                   */}
      {/* Touching/Clicking ONLY the Left or Right Blue Door opens it!      */}
      {/* ================================================================= */}
      <group
        ref={leftDoorGroupRef}
        position={[xL, yB, 0.02]}
        onClick={handleDoorTap}
        onPointerOver={handleDoorPointerOver}
        onPointerOut={handleDoorPointerOut}
      >
        <mesh
          geometry={geometries.leftDoor}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={doorTexture}
            bumpMap={pbr.blueWoodBump}
            bumpScale={0.022}
            roughness={0.62}
            metalness={0.06}
          />
        </mesh>

        {/* 3D Carved Timber Panel Relief Moldings on Left Door */}
        {[3.85, 2.22, 0.95].map((py, idx) => (
          <mesh
            key={idx}
            position={[doorW * 0.52, py, doorDepth / 2 + 0.012]}
            castShadow
          >
            <boxGeometry
              args={[
                doorW * 0.62,
                idx === 1 ? 0.68 : 1.15,
                0.024,
              ]}
            />
            <meshStandardMaterial
              color="#1b4f75"
              roughness={0.58}
              metalness={0.08}
              transparent
              opacity={0.18}
            />
          </mesh>
        ))}

        {/* 3D Ornate Antique Brass Handle & Lever on Left Door */}
        <group
          ref={leftHandleRef}
          position={[doorW * 0.54, 2.21, doorDepth / 2 + 0.02]}
        >
          {/* Brass Rosette Backplate */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.12, 0.03, 24]} />
            <meshStandardMaterial
              color="#c89d54"
              metalness={0.88}
              roughness={0.24}
            />
          </mesh>
          {/* Sculpted Brass Knob & Lever */}
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.05, 0.07, 24]} />
            <meshStandardMaterial
              color="#dfb76c"
              metalness={0.92}
              roughness={0.18}
            />
          </mesh>
          <mesh position={[-0.08, 0, 0.06]} castShadow>
            <boxGeometry args={[0.16, 0.032, 0.028]} />
            <meshStandardMaterial
              color="#e6c278"
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* ================================================================= */}
      {/* RIGHT BLUE WOODEN DOOR (Hinged at [xR, yB, 0.02])                  */}
      {/* Touching/Clicking ONLY the Left or Right Blue Door opens it!      */}
      {/* ================================================================= */}
      <group
        ref={rightDoorGroupRef}
        position={[xR, yB, 0.02]}
        onClick={handleDoorTap}
        onPointerOver={handleDoorPointerOver}
        onPointerOut={handleDoorPointerOut}
      >
        <mesh
          geometry={geometries.rightDoor}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={doorTexture}
            bumpMap={pbr.blueWoodBump}
            bumpScale={0.022}
            roughness={0.62}
            metalness={0.06}
          />
        </mesh>

        {/* 3D Carved Timber Panel Relief Moldings on Right Door */}
        {[3.85, 2.22, 0.95].map((py, idx) => (
          <mesh
            key={idx}
            position={[-doorW * 0.52, py, doorDepth / 2 + 0.012]}
            castShadow
          >
            <boxGeometry
              args={[
                doorW * 0.62,
                idx === 1 ? 0.68 : 1.15,
                0.024,
              ]}
            />
            <meshStandardMaterial
              color="#1b4f75"
              roughness={0.58}
              metalness={0.08}
              transparent
              opacity={0.18}
            />
          </mesh>
        ))}

        {/* 3D Ornate Antique Brass Handle & Lever on Right Door */}
        <group
          ref={rightHandleRef}
          position={[-doorW * 0.54, 2.21, doorDepth / 2 + 0.02]}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.12, 0.03, 24]} />
            <meshStandardMaterial
              color="#c89d54"
              metalness={0.88}
              roughness={0.24}
            />
          </mesh>
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.05, 0.07, 24]} />
            <meshStandardMaterial
              color="#dfb76c"
              metalness={0.92}
              roughness={0.18}
            />
          </mesh>
          <mesh position={[0.08, 0, 0.06]} castShadow>
            <boxGeometry args={[0.16, 0.032, 0.028]} />
            <meshStandardMaterial
              color="#e6c278"
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Vintage Brass Keyhole Escutcheon near inner edge */}
        <mesh
          position={[-doorW + 0.14, 2.02, doorDepth / 2 + 0.02]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.042, 0.042, 0.02, 18]} />
          <meshStandardMaterial
            color="#c99e52"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
      </group>
    </group>
  );
};
