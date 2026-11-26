import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, ThreeEvent } from '@react-three/fiber';

interface BlueDoorEntranceProps {
  doorOpenProgressRef: React.MutableRefObject<number>;
  handleTurnProgressRef: React.MutableRefObject<number>;
  sunlightBurstRef: React.MutableRefObject<number>;
  onTouchDoor?: () => void;
  isDoorInteractive?: boolean;
}

// Helper to create a 3D architectural box with exact UV mapping from the real photograph
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

  const uvAttr = geom.attributes.uv;
  // Front face (+Z: vertices 16..19)
  uvAttr.setXY(16, uMin, vMax);
  uvAttr.setXY(17, uMax, vMax);
  uvAttr.setXY(18, uMin, vMin);
  uvAttr.setXY(19, uMax, vMin);

  // Back face (-Z: vertices 20..23, mirrored horizontally so interior face of the swinging door is also photorealistic blue wood)
  uvAttr.setXY(20, uMax, vMax);
  uvAttr.setXY(21, uMin, vMax);
  uvAttr.setXY(22, uMax, vMin);
  uvAttr.setXY(23, uMin, vMin);

  uvAttr.needsUpdate = true;
  return geom;
}

export const BlueDoorEntrance: React.FC<BlueDoorEntranceProps> = ({
  doorOpenProgressRef,
  onTouchDoor,
  isDoorInteractive = true,
}) => {
  const [isDoorHovered, setIsDoorHovered] = useState(false);

  const doorTexture = useLoader(
    THREE.TextureLoader,
    './assets/images/blue-door-texture.jpg'
  );

  useMemo(() => {
    doorTexture.colorSpace = THREE.SRGBColorSpace;
    doorTexture.anisotropy = 16;
  }, [doorTexture]);

  const leftDoorGroupRef = useRef<THREE.Group>(null);
  const rightDoorGroupRef = useRef<THREE.Group>(null);

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
    e.stopPropagation();
  };

  // Exact 3:4 portrait aspect ratio of blue-door-texture.jpg centered vertically at y = 2.6
  const W = 6.45;
  const H = 8.6;
  const xMin = -W / 2; // -3.225
  const xMax = W / 2; // +3.225
  const yCenter = 2.6;
  const yMin = yCenter - H / 2; // -1.7
  const yMax = yCenter + H / 2; // +6.9

  const uL = 0.232;
  const uM = 0.5;
  const uR = 0.768;
  const vB = 0.118;
  const vT = 0.774;

  const xL = xMin + uL * W;
  const xM = 0.0;
  const xR = xMin + uR * W;
  const yB = yMin + vB * H;
  const yT = yMin + vT * H;

  const doorW = xM - xL;
  const doorH = yT - yB;
  const doorDepth = 0.12;
  const wallDepth = 0.45;

  const geometries = useMemo(() => {
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

    const botWallH = yB - yMin;
    const botWall = createUVMappedBoxFace(
      topWallW,
      botWallH,
      wallDepth,
      uL,
      uR,
      0,
      vB,
      0,
      yMin + botWallH / 2
    );

    // Seamless Photographic White Stone Wall Extensions for Widescreen 16:9 Viewports
    const outerWingW = 8.0;
    const leftOuterWing = createUVMappedBoxFace(
      outerWingW,
      H,
      wallDepth,
      0.13,
      0.0,
      0,
      1,
      xMin - outerWingW / 2,
      yMin + H / 2
    );

    const rightOuterWing = createUVMappedBoxFace(
      outerWingW,
      H,
      wallDepth,
      1.0,
      0.87,
      0,
      1,
      xMax + outerWingW / 2,
      yMin + H / 2
    );

    return {
      leftDoor,
      rightDoor,
      leftWall,
      rightWall,
      topWall,
      botWall,
      leftOuterWing,
      rightOuterWing,
    };
  }, [W, H, xMin, xMax, yMin, yMax, xL, xR, yB, yT, doorW, doorH]);

  useFrame(() => {
    const openP = doorOpenProgressRef.current;

    if (leftDoorGroupRef.current && rightDoorGroupRef.current) {
      const maxAngle = 1.75;
      const hoverNudge = isDoorHovered && openP === 0 ? 0.03 : 0;
      leftDoorGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        leftDoorGroupRef.current.rotation.y,
        openP * maxAngle + hoverNudge,
        0.18
      );
      rightDoorGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rightDoorGroupRef.current.rotation.y,
        -openP * maxAngle - hoverNudge,
        0.18
      );
    }
  });

  return (
    <group position={[0, 0, 18.0]}>
      {/* Photorealistic 3D Stone Wall Surround with Real Open Portal Cutout */}
      <mesh geometry={geometries.leftWall} onClick={blockOutsideWallClick}>
        <meshBasicMaterial map={doorTexture} />
      </mesh>

      <mesh geometry={geometries.rightWall} onClick={blockOutsideWallClick}>
        <meshBasicMaterial map={doorTexture} />
      </mesh>

      <mesh geometry={geometries.topWall} onClick={blockOutsideWallClick}>
        <meshBasicMaterial map={doorTexture} />
      </mesh>

      <mesh geometry={geometries.botWall} onClick={blockOutsideWallClick}>
        <meshBasicMaterial map={doorTexture} />
      </mesh>

      {/* Seamless Photographic Stone Extensions on Left & Right for Widescreen Displays */}
      <mesh geometry={geometries.leftOuterWing} onClick={blockOutsideWallClick}>
        <meshBasicMaterial map={doorTexture} />
      </mesh>
      <mesh geometry={geometries.rightOuterWing} onClick={blockOutsideWallClick}>
        <meshBasicMaterial map={doorTexture} />
      </mesh>

      {/* Left Photorealistic 3D Hinged Blue Door (Opens ONLY when touching/clicking the door) */}
      <group
        ref={leftDoorGroupRef}
        position={[xL, yB, 0.0]}
        onClick={handleDoorTap}
        onPointerOver={handleDoorPointerOver}
        onPointerOut={handleDoorPointerOut}
      >
        <mesh geometry={geometries.leftDoor}>
          <meshBasicMaterial map={doorTexture} />
        </mesh>
      </group>

      {/* Right Photorealistic 3D Hinged Blue Door (Opens ONLY when touching/clicking the door) */}
      <group
        ref={rightDoorGroupRef}
        position={[xR, yB, 0.0]}
        onClick={handleDoorTap}
        onPointerOver={handleDoorPointerOver}
        onPointerOut={handleDoorPointerOut}
      >
        <mesh geometry={geometries.rightDoor}>
          <meshBasicMaterial map={doorTexture} />
        </mesh>
      </group>
    </group>
  );
};
