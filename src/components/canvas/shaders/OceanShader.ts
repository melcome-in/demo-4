import * as THREE from 'three';

export const oceanVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vElevation;
  varying vec3 vNormalComputed;

  // Multi-wave elevation helper
  float computeWaveHeight(vec2 pos, float t) {
    float w1 = sin(pos.x * 0.28 + t * 1.35) * cos(pos.y * 0.34 + t * 1.1) * 0.14;
    float w2 = sin(pos.y * 0.65 - t * 1.85 + pos.x * 0.15) * 0.08;
    float w3 = cos(pos.x * 1.3 - pos.y * 1.1 + t * 2.4) * 0.032;
    // Dampen wave height gently near the beach shoreline (pos.y near +75 in plane space, world z near -12)
    float shoreDamp = smoothstep(-10.5, -18.0, pos.y);
    return (w1 + w2 + w3) * (0.25 + 0.75 * shoreDamp);
  }

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    float eps = 0.25;
    float h = computeWaveHeight(worldPosition.xz, uTime);
    float hx = computeWaveHeight(worldPosition.xz + vec2(eps, 0.0), uTime);
    float hz = computeWaveHeight(worldPosition.xz + vec2(0.0, eps), uTime);

    worldPosition.y += h;
    vElevation = h;
    vWorldPos = worldPosition.xyz;

    vec3 tangent = normalize(vec3(eps, hx - h, 0.0));
    vec3 bitangent = normalize(vec3(0.0, hz - h, eps));
    vNormalComputed = normalize(cross(bitangent, tangent));

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const oceanFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSunsetMix;
  uniform vec3 uSunDirection;
  uniform vec3 uCameraPos;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vElevation;
  varying vec3 vNormalComputed;

  // Pseudo-noise for sparkling caustics & foam lace
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    // Distance from shoreline (world z around -11.5 is where water meets beach)
    float distFromShore = clamp((-11.2 - vWorldPos.z) / 55.0, 0.0, 1.0);

    // Day palette: Crystalline Maldives/Mediterranean turquoise -> deep cobalt
    vec3 shallowTurquoise = vec3(0.42, 0.91, 0.88);
    vec3 midLagoon = vec3(0.08, 0.65, 0.76);
    vec3 deepAegean = vec3(0.04, 0.24, 0.43);

    // Sunset palette: Warm amber-gold shallows -> rose-teal mid -> deep twilight sapphire
    vec3 sunsetShallow = vec3(0.84, 0.68, 0.56);
    vec3 sunsetMid = vec3(0.18, 0.45, 0.58);
    vec3 sunsetDeep = vec3(0.06, 0.14, 0.28);

    vec3 colShallow = mix(shallowTurquoise, sunsetShallow, uSunsetMix * 0.75);
    vec3 colMid = mix(midLagoon, sunsetMid, uSunsetMix * 0.75);
    vec3 colDeep = mix(deepAegean, sunsetDeep, uSunsetMix * 0.85);

    vec3 baseWater = mix(colShallow, colMid, smoothstep(0.0, 0.28, distFromShore));
    baseWater = mix(baseWater, colDeep, smoothstep(0.25, 0.92, distFromShore));

    // Fine procedural wave normal perturbation for micro-sparkles
    float n1 = noise(vWorldPos.xz * 1.8 + vec2(uTime * 0.7, -uTime * 0.9));
    float n2 = noise(vWorldPos.xz * 4.2 - vec2(uTime * 1.1, uTime * 0.8));
    vec3 N = normalize(vNormalComputed + vec3((n1 - 0.5) * 0.26, 0.0, (n2 - 0.5) * 0.26));

    vec3 V = normalize(uCameraPos - vWorldPos);
    vec3 L = normalize(uSunDirection);
    vec3 H = normalize(L + V);

    // Fresnel sky reflection
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.5);
    vec3 skyColorDay = vec3(0.78, 0.93, 0.99);
    vec3 skyColorSunset = vec3(0.99, 0.66, 0.42);
    vec3 skyReflect = mix(skyColorDay, skyColorSunset, uSunsetMix);

    vec3 color = mix(baseWater, skyReflect, fresnel * 0.52);

    // Subsurface wave crest glow
    float crest = smoothstep(0.04, 0.19, vElevation);
    vec3 sssColor = mix(vec3(0.35, 0.96, 0.90), vec3(0.98, 0.74, 0.45), uSunsetMix);
    color += sssColor * crest * 0.22;

    // Blazing specular sun path reflection on water
    float specBroad = pow(max(dot(N, H), 0.0), 42.0);
    float specSharp = pow(max(dot(N, H), 0.0), 340.0);
    vec3 sunGlintColor = mix(vec3(1.0, 0.97, 0.86), vec3(1.0, 0.68, 0.35), uSunsetMix);
    color += sunGlintColor * (specBroad * 0.55 + specSharp * 2.2);

    // Animated shoreline surf foam washing onto the beach (world z between -11.2 and -15.5)
    float waveWash = sin(uTime * 1.35 + vWorldPos.x * 0.25) * 0.65;
    float shoreZone = -11.4 + waveWash - vWorldPos.z;
    float foamLine1 = smoothstep(1.3, 0.15, abs(shoreZone - 0.55));
    float foamLine2 = smoothstep(1.6, 0.2, abs(shoreZone - 2.35)) * 0.65;
    float foamLace = noise(vWorldPos.xz * 2.6 + vec2(0.0, uTime * 0.85));
    float totalFoam = clamp((foamLine1 + foamLine2) * (0.45 + 0.75 * foamLace), 0.0, 1.0);
    // Keep foam only near shore
    totalFoam *= (1.0 - smoothstep(0.0, 0.14, distFromShore));

    vec3 foamColor = mix(vec3(0.98, 0.99, 1.0), vec3(1.0, 0.89, 0.78), uSunsetMix * 0.6);
    color = mix(color, foamColor, totalFoam * 0.88);

    // Soft horizon mist blend at extreme distance
    float horizonFade = smoothstep(0.75, 1.0, distFromShore);
    vec3 horizonColor = mix(vec3(0.86, 0.94, 0.98), vec3(0.96, 0.68, 0.48), uSunsetMix);
    color = mix(color, horizonColor, horizonFade * 0.65);

    // Smooth shoreline alpha feathering onto the wet sand
    float shoreAlpha = smoothstep(-10.8, -12.3, vWorldPos.z);

    gl_FragColor = vec4(color, shoreAlpha);
  }
`;

export function createOceanShaderMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: oceanVertexShader,
    fragmentShader: oceanFragmentShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uSunsetMix: { value: 0 },
      uSunDirection: { value: new THREE.Vector3(0.25, 0.38, -1.0).normalize() },
      uCameraPos: { value: new THREE.Vector3(0, 2.2, 24) },
    },
  });
}
