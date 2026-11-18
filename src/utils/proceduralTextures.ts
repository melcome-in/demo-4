import * as THREE from 'three';

let cachedTextures: {
  blueWoodColor?: THREE.CanvasTexture;
  blueWoodBump?: THREE.CanvasTexture;
  whiteStuccoColor?: THREE.CanvasTexture;
  whiteStuccoBump?: THREE.CanvasTexture;
  flagstoneColor?: THREE.CanvasTexture;
  flagstoneBump?: THREE.CanvasTexture;
  sandColor?: THREE.CanvasTexture;
  sandBump?: THREE.CanvasTexture;
} = {};

export function getArchitecturalPBRTextures() {
  if (
    cachedTextures.blueWoodColor &&
    cachedTextures.blueWoodBump &&
    cachedTextures.whiteStuccoColor &&
    cachedTextures.whiteStuccoBump &&
    cachedTextures.flagstoneColor &&
    cachedTextures.flagstoneBump &&
    cachedTextures.sandColor &&
    cachedTextures.sandBump
  ) {
    return cachedTextures as Required<typeof cachedTextures>;
  }

  // 1. Weathered Aegean Blue Timber Texture + Bump
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 512;
  woodCanvas.height = 1024;
  const wCtx = woodCanvas.getContext('2d')!;

  const woodBumpCanvas = document.createElement('canvas');
  woodBumpCanvas.width = 512;
  woodBumpCanvas.height = 1024;
  const wbCtx = woodBumpCanvas.getContext('2d')!;

  // Base Aegean Cobalt Blue
  const grad = wCtx.createLinearGradient(0, 0, 512, 1024);
  grad.addColorStop(0, '#184b70');
  grad.addColorStop(0.5, '#1e5b86');
  grad.addColorStop(1, '#133d5e');
  wCtx.fillStyle = grad;
  wCtx.fillRect(0, 0, 512, 1024);

  wbCtx.fillStyle = '#808080';
  wbCtx.fillRect(0, 0, 512, 1024);

  // Fine vertical timber grain lines & weathered patina streaks
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 1024;
    const h = 40 + Math.random() * 240;
    const w = 1 + Math.random() * 2.5;
    const isLight = Math.random() > 0.45;
    wCtx.fillStyle = isLight
      ? 'rgba(115, 175, 215, 0.08)'
      : 'rgba(10, 30, 48, 0.14)';
    wCtx.fillRect(x, y, w, h);

    wbCtx.fillStyle = isLight
      ? 'rgba(210, 210, 210, 0.16)'
      : 'rgba(45, 45, 45, 0.18)';
    wbCtx.fillRect(x, y, w, h);
  }

  // Plank seams
  for (let px = 64; px < 512; px += 64) {
    wCtx.fillStyle = 'rgba(8, 22, 36, 0.35)';
    wCtx.fillRect(px, 0, 2, 1024);
    wbCtx.fillStyle = 'rgba(20, 20, 20, 0.7)';
    wbCtx.fillRect(px, 0, 3, 1024);
  }

  // Subtle weathered gold/timber undercoat specks
  for (let i = 0; i < 160; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 1024;
    wCtx.fillStyle = 'rgba(185, 155, 115, 0.09)';
    wCtx.fillRect(x, y, 2 + Math.random() * 6, 8 + Math.random() * 35);
  }

  const blueWoodColor = new THREE.CanvasTexture(woodCanvas);
  blueWoodColor.colorSpace = THREE.SRGBColorSpace;
  const blueWoodBump = new THREE.CanvasTexture(woodBumpCanvas);

  // 2. White Mediterranean Limewashed Stucco Wall Texture + Bump
  const stuccoCanvas = document.createElement('canvas');
  stuccoCanvas.width = 512;
  stuccoCanvas.height = 512;
  const sCtx = stuccoCanvas.getContext('2d')!;

  const stuccoBumpCanvas = document.createElement('canvas');
  stuccoBumpCanvas.width = 512;
  stuccoBumpCanvas.height = 512;
  const sbCtx = stuccoBumpCanvas.getContext('2d')!;

  sCtx.fillStyle = '#f7f3eb';
  sCtx.fillRect(0, 0, 512, 512);
  sbCtx.fillStyle = '#808080';
  sbCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 2 + Math.random() * 14;
    const shade = 236 + Math.floor(Math.random() * 18);
    sCtx.fillStyle = `rgba(${shade}, ${shade - 4}, ${shade - 10}, 0.25)`;
    sCtx.beginPath();
    sCtx.arc(x, y, r, 0, Math.PI * 2);
    sCtx.fill();

    const bShade = 100 + Math.floor(Math.random() * 60);
    sbCtx.fillStyle = `rgba(${bShade}, ${bShade}, ${bShade}, 0.22)`;
    sbCtx.beginPath();
    sbCtx.arc(x, y, r * 0.8, 0, Math.PI * 2);
    sbCtx.fill();
  }

  const whiteStuccoColor = new THREE.CanvasTexture(stuccoCanvas);
  whiteStuccoColor.wrapS = whiteStuccoColor.wrapT = THREE.RepeatWrapping;
  whiteStuccoColor.repeat.set(3, 3);
  whiteStuccoColor.colorSpace = THREE.SRGBColorSpace;

  const whiteStuccoBump = new THREE.CanvasTexture(stuccoBumpCanvas);
  whiteStuccoBump.wrapS = whiteStuccoBump.wrapT = THREE.RepeatWrapping;
  whiteStuccoBump.repeat.set(3, 3);

  // 3. White Flagstone Pathway Texture (matching wedding-aisle-env.jpg)
  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 512;
  flagCanvas.height = 512;
  const fCtx = flagCanvas.getContext('2d')!;

  const flagBumpCanvas = document.createElement('canvas');
  flagBumpCanvas.width = 512;
  flagBumpCanvas.height = 512;
  const fbCtx = flagBumpCanvas.getContext('2d')!;

  // Grout background
  fCtx.fillStyle = '#d8d0c3';
  fCtx.fillRect(0, 0, 512, 512);
  fbCtx.fillStyle = '#383838';
  fbCtx.fillRect(0, 0, 512, 512);

  // Voronoi-like stone pavers
  const cols = 5;
  const rows = 5;
  const cellW = 512 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * cellW + cellW * 0.5 + (Math.random() - 0.5) * 14;
      const cy = r * cellH + cellH * 0.5 + (Math.random() - 0.5) * 14;
      const rx = cellW * (0.41 + Math.random() * 0.06);
      const ry = cellH * (0.41 + Math.random() * 0.06);

      const tone = 242 + Math.floor(Math.random() * 11);
      fCtx.fillStyle = `rgb(${tone}, ${tone - 2}, ${tone - 6})`;
      fbCtx.fillStyle = '#dedede';

      fCtx.beginPath();
      fbCtx.beginPath();
      const sides = 7;
      for (let s = 0; s < sides; s++) {
        const ang = (s / sides) * Math.PI * 2;
        const jitter = 0.88 + Math.sin(s * 2.7 + r * 3 + c) * 0.12;
        const px = cx + Math.cos(ang) * rx * jitter;
        const py = cy + Math.sin(ang) * ry * jitter;
        if (s === 0) {
          fCtx.moveTo(px, py);
          fbCtx.moveTo(px, py);
        } else {
          fCtx.lineTo(px, py);
          fbCtx.lineTo(px, py);
        }
      }
      fCtx.closePath();
      fCtx.fill();
      fbCtx.closePath();
      fbCtx.fill();
    }
  }

  const flagstoneColor = new THREE.CanvasTexture(flagCanvas);
  flagstoneColor.wrapS = flagstoneColor.wrapT = THREE.RepeatWrapping;
  flagstoneColor.repeat.set(2, 14);
  flagstoneColor.colorSpace = THREE.SRGBColorSpace;

  const flagstoneBump = new THREE.CanvasTexture(flagBumpCanvas);
  flagstoneBump.wrapS = flagstoneBump.wrapT = THREE.RepeatWrapping;
  flagstoneBump.repeat.set(2, 14);

  // 4. White Tropical Coral Sand Texture
  const sandCanvas = document.createElement('canvas');
  sandCanvas.width = 512;
  sandCanvas.height = 512;
  const sdCtx = sandCanvas.getContext('2d')!;

  const sandBumpCanvas = document.createElement('canvas');
  sandBumpCanvas.width = 512;
  sandBumpCanvas.height = 512;
  const sdbCtx = sandBumpCanvas.getContext('2d')!;

  sdCtx.fillStyle = '#f2e8d7';
  sdCtx.fillRect(0, 0, 512, 512);
  sdbCtx.fillStyle = '#808080';
  sdbCtx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 2) {
    const wave = Math.sin(y * 0.09) * 10;
    sdCtx.fillStyle =
      wave > 0 ? 'rgba(255, 250, 240, 0.14)' : 'rgba(210, 192, 168, 0.14)';
    sdCtx.fillRect(0, y, 512, 2);

    sdbCtx.fillStyle =
      wave > 0 ? 'rgba(215, 215, 215, 0.2)' : 'rgba(60, 60, 60, 0.2)';
    sdbCtx.fillRect(0, y, 512, 2);
  }

  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    sdCtx.fillStyle =
      Math.random() > 0.5
        ? 'rgba(255,255,255,0.22)'
        : 'rgba(195,175,148,0.22)';
    sdCtx.fillRect(x, y, 1.5, 1.5);
  }

  const sandColor = new THREE.CanvasTexture(sandCanvas);
  sandColor.wrapS = sandColor.wrapT = THREE.RepeatWrapping;
  sandColor.repeat.set(16, 16);
  sandColor.colorSpace = THREE.SRGBColorSpace;

  const sandBump = new THREE.CanvasTexture(sandBumpCanvas);
  sandBump.wrapS = sandBump.wrapT = THREE.RepeatWrapping;
  sandBump.repeat.set(16, 16);

  cachedTextures = {
    blueWoodColor,
    blueWoodBump,
    whiteStuccoColor,
    whiteStuccoBump,
    flagstoneColor,
    flagstoneBump,
    sandColor,
    sandBump,
  };

  return cachedTextures as Required<typeof cachedTextures>;
}
