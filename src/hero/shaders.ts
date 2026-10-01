export const COMMON = `
precision highp float;
uniform vec2 uRes;
uniform float uR;
uniform float uBand;
uniform float uTime;
uniform float uDpr;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash2(vec2 p) { return vec2(hash(p), hash(p + 19.19)); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0., a = .5;
  for (int i = 0; i < 5; i++) { v += a * vnoise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= .5; }
  return v;
}
float distAt(vec2 px) { return uRes.y - px.y + sin(px.x * 0.004 + 1.3) * uBand * 0.3; }
float edgeAt(vec2 px) { float n = fbm(px * 0.0035) * 0.65 + fbm(px * 0.012 + 7.) * 0.35; return uR + (n - 0.5) * uBand * 1.6; }
float cleanAt(vec2 px) { float e = edgeAt(px); return 1.0 - smoothstep(e - uBand, e, distAt(px)); }
`

export const QUAD_VS = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }
`

export const BASE_FS = COMMON + `
varying vec2 vUv;
uniform sampler2D uPhoto;
uniform vec2 uScale;
void main() {
  vec2 px = vec2(vUv.x * uRes.x, (1. - vUv.y) * uRes.y);
  vec2 puv = (vUv - 0.5) * uScale + 0.5;
  vec3 c = texture2D(uPhoto, puv).rgb;
  vec3 bl = texture2D(uPhoto, puv, 4.5).rgb;
  float L = dot(c, vec3(.299, .587, .114));
  vec3 clean = mix(vec3(L), c, 1.08);
  clean = (clean - 0.5) * 1.05 + 0.51;
  vec3 dirty = mix(c, vec3(L), 0.55) * vec3(1.0, 0.94, 0.82);
  dirty = mix(dirty, bl * vec3(0.97, 0.92, 0.82), 0.38);
  dirty = dirty * 0.78 + 0.02;
  vec2 q = vUv - 0.5;
  dirty *= 1.0 - dot(q, q) * 1.3;
  vec3 col = mix(dirty, clean, cleanAt(px));
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}
`

export const PATTERN_FS = COMMON + `
varying vec2 vUv;
float speckLayer(vec2 fc, float csz, float occ, float rmin, float rmax) {
  vec2 cs = vec2(csz * uDpr);
  vec2 cc = floor(fc / cs);
  float s = 0.;
  for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) {
    vec2 c = cc + vec2(float(i), float(j));
    if (hash(c + 1.7) < occ) {
      vec2 pos = (c + hash2(c + 3.3)) * cs;
      float rad = mix(rmin, rmax, pow(hash(c + 8.8), 2.5)) * uDpr;
      vec2 dv = fc - pos;
      float a = hash(c + 4.4) * 6.28;
      dv = mat2(cos(a), -sin(a), sin(a), cos(a)) * dv;
      dv.x *= mix(1., 2.2, hash(c + 6.6));
      float d = length(dv) + (vnoise(dv * 0.9 + c) - 0.5) * 0.8;
      s = max(s, (1. - smoothstep(rad - 0.6, rad + 0.6, d)) * mix(0.3, 1., hash(c + 2.2)));
    }
  }
  return s;
}
void main() {
  vec2 fc = gl_FragCoord.xy;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(vUv.x * asp, vUv.y);
  vec2 w = vec2(fbm(p * 2.2 + 3.1), fbm(p * 2.2 + 7.7));
  float film = smoothstep(0.36, 0.80, fbm(p * 3.2 + w * 1.9));
  film *= 0.55 + 0.9 * fbm(p * 34.0);
  vec2 e2 = abs(vUv - 0.5) * 2.;
  film *= 0.32 + smoothstep(0.45, 1.0, max(e2.x * 0.95, e2.y)) * 0.95 + smoothstep(0.38, 0.0, vUv.y) * 0.55;
  vec2 r = mat2(0.94, -0.34, 0.34, 0.94) * p;
  float st = vnoise(vec2(r.x * 3.0, r.y * 70.0)) * vnoise(vec2(r.x * 1.1 + 4., r.y * 11.0));
  float streak = smoothstep(0.22, 0.6, st) * smoothstep(0.45, 0.72, fbm(p * 1.5 + 11.));
  float ring = 0.;
  vec2 cs = vec2(85.0 * uDpr);
  vec2 cc = floor(fc / cs);
  for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) {
    vec2 c = cc + vec2(float(i), float(j));
    if (hash(c + 5.3) < 0.26) {
      vec2 pos = (c + hash2(c)) * cs;
      float rad = mix(9., 34., hash(c + 2.7)) * uDpr;
      float d = length(fc - pos);
      float rr = rad * (0.82 + 0.36 * vnoise((fc - pos) * 0.07 / uDpr + c));
      float rim = smoothstep(rr - 2.4 * uDpr, rr - 0.3 * uDpr, d) * (1. - smoothstep(rr - 0.3 * uDpr, rr + 0.7 * uDpr, d));
      float fill = (1. - smoothstep(rr * 0.1, rr, d)) * 0.22;
      ring = max(ring, (rim * 0.9 + fill) * mix(0.35, 1., hash(c + 9.1)));
    }
  }
  float dens = clamp(film * 1.3 + 0.12, 0., 1.);
  float sp = max(speckLayer(fc, 4.5, 0.20 * dens, 0.35, 1.25), speckLayer(fc + 77., 12., 0.30 * dens, 0.8, 2.6));
  gl_FragColor = vec4(clamp(film, 0., 1.), sp, ring, streak);
}
`

export const FILM_FS = COMMON + `
varying vec2 vUv;
uniform sampler2D uPat;
uniform sampler2D uPhoto;
uniform vec2 uScale;
float gauze(vec2 q, float size) {
  vec2 c = q / size;
  float d = length(c);
  float an = atan(c.y, c.x);
  float fib = vnoise(vec2(an * 120., d * 5.)) * vnoise(vec2(an * 28. + 5., d * 1.7));
  float body = smoothstep(0.85, 0.0, d + (vnoise(q * 0.012) - 0.5) * 0.35);
  return body * smoothstep(0.08, 0.55, fib) * (0.55 + 0.45 * vnoise(q * 0.05));
}
void main() {
  vec2 px = vec2(vUv.x * uRes.x, (1. - vUv.y) * uRes.y);
  float d = distAt(px);
  float e = edgeAt(px);
  float cl = 1.0 - smoothstep(e - uBand, e, d);
  vec4 pat = texture2D(uPat, vUv);
  float dirt = 1. - cl;
  float lb = dot(texture2D(uPhoto, (vUv - 0.5) * uScale + 0.5, 5.0).rgb, vec3(.299, .587, .114));
  float mm = min(uRes.x, uRes.y);
  float gz = max(gauze(px, mm * 0.5 + 70.), 0.8 * gauze(vec2(uRes.x - px.x, px.y), mm * 0.36 + 45.));
  float filmA = clamp(pat.r * 0.40 + pat.a * 0.16 + pat.b * 0.12 + gz * 0.28, 0., 0.8) * dirt * 0.6;
  vec3 filmC = vec3(0.42, 0.40, 0.37) * (0.45 + 0.45 * lb);
  float spA = clamp(pat.g * 0.45 * dirt, 0., 1.);
  vec3 spC = mix(vec3(0.87, 0.85, 0.81), vec3(0.23, 0.21, 0.18), smoothstep(0.3, 0.85, lb));
  vec2 p = vec2(vUv.x * uRes.x / uRes.y, vUv.y);
  float k = dot(p, vec2(0.80, 0.60));
  float rays = smoothstep(0.52, 0.85, fbm(vec2(k * 9.0, uTime * 0.04))) * smoothstep(1.2, 0.2, length(vUv - vec2(0.25, 0.85)));
  float rayA = rays * 0.07 * (1. - cl);
  vec3 col = filmC;
  float a = filmA;
  col = mix(col, vec3(1., 0.95, 0.84), rayA / (a + rayA + 1e-4));
  a = a + rayA * (1. - a);
  col = mix(col, spC, spA);
  a = a + spA * (1. - a);
  gl_FragColor = vec4(col, a);
}
`

export const PARTICLE_VS = COMMON + `
attribute vec2 aPos;
attribute float aSize;
attribute float aCell;
attribute vec4 aRnd;
attribute float aAlpha;
uniform float uMotion;
varying float vA;
varying float vRot;
varying float vCell;
void main() {
  vec2 P0 = aPos * uRes;
  vec2 dir = normalize(vec2((aRnd.z - 0.5) * 1.4, -1.));
  float ang = (aRnd.x - 0.5) * 1.1;
  dir = vec2(cos(ang) * dir.x - sin(ang) * dir.y, sin(ang) * dir.x + cos(ang) * dir.y);
  float d = distAt(P0);
  float e = edgeAt(P0) + (aRnd.y - 0.5) * uBand * 0.7;
  float tau = clamp((e - d) / (uBand * 1.3), 0., 1.);
  vec2 perp = vec2(-dir.y, dir.x);
  vec2 P = P0 + dir * tau * tau * (420. + aRnd.z * 950.) + perp * sin(tau * 3.14) * (aRnd.w - 0.5) * 110.;
  vA = aAlpha * (1. - smoothstep(0.35, 0.92, tau));
  vRot = aRnd.w * 6.28 + tau * (aRnd.x - 0.5) * 12.;
  vCell = aCell;
  gl_Position = vec4(P.x / uRes.x * 2. - 1., 1. - P.y / uRes.y * 2., 0., 1.);
  gl_PointSize = aSize * uDpr * (1. + tau * 0.5);
}
`

export const PARTICLE_FS = COMMON + `
uniform sampler2D uAtlas;
uniform sampler2D uPhoto;
uniform vec2 uScale;
varying float vA;
varying float vRot;
varying float vCell;
void main() {
  vec2 pc = gl_PointCoord - 0.5;
  float c = cos(vRot), s = sin(vRot);
  pc = mat2(c, -s, s, c) * pc + 0.5;
  if (pc.x < 0. || pc.y < 0. || pc.x > 1. || pc.y > 1.) discard;
  float cx = mod(vCell, 8.), cy = floor(vCell / 8.);
  float m = texture2D(uAtlas, vec2((cx + pc.x) / 8., 1. - (cy + pc.y) / 8.)).a;
  float a = m * vA * 0.5;
  if (a < 0.003) discard;
  vec2 suv = gl_FragCoord.xy / (uRes * uDpr);
  float lb = dot(texture2D(uPhoto, (suv - 0.5) * uScale + 0.5, 4.0).rgb, vec3(.299, .587, .114));
  vec3 C = mix(vec3(0.6, 0.58, 0.54), vec3(0.21, 0.19, 0.16), smoothstep(0.3, 0.85, lb));
  gl_FragColor = vec4(C, a);
}
`

export const WEB_VS = COMMON + `
attribute vec2 aP0;
attribute vec2 aP1;
attribute vec2 aS;
attribute vec2 aES;
attribute vec2 aA;
attribute vec2 aB;
attribute vec2 aMid;
attribute vec4 aInfo;
attribute float aW;
uniform float uMotion;
varying float vSide;
varying float vHW;
varying float vHE;
varying float vS;
varying float vA;
varying float vRnd;
varying vec2 vDir;
float gTau;
vec2 deform(vec2 p, float s) {
  float b = aInfo.x, rnd = aInfo.y, kind = aInfo.w;
  float w = kind < 0.5 ? sin(3.14159 * s) : s;
  float t = uTime * uMotion;
  p += vec2(sin(t * 0.8 + rnd * 20. + s * 2.5), 0.45 * cos(t * 1.1 + rnd * 13.)) * w * 1.4;
  float tr = gTau * gTau * (3. - 2. * gTau);
  if (kind < 0.5) {
    vec2 anc;
    float u;
    if (s < b) { anc = aA; u = s / b; } else { anc = aB; u = (1. - s) / (1. - b); }
    vec2 v = p - anc;
    vec2 nr = vec2(-v.y, v.x) / max(length(v), 0.001);
    p = anc + v * (1. - tr * u * 0.93) + nr * sin(u * 9. + rnd * 6.) * tr * u * 16. + vec2(0., tr * u * u * 60.);
  } else {
    vec2 v = p - aA;
    p = aA + v * (1. - tr * s * 0.9) + vec2(sin(s * 7. + rnd * 9.) * tr * s * 10., 0.);
  }
  return p;
}
void main() {
  float d = distAt(aMid);
  float e = edgeAt(aMid) + (aInfo.y - 0.5) * uBand * 0.9;
  gTau = clamp((e - d) / (uBand * 1.5), 0., 1.);
  vec2 q0 = deform(aP0, aS.x), q1 = deform(aP1, aS.y);
  vec2 dv = q1 - q0;
  vec2 dir = dv / max(length(dv), 0.001);
  vec2 n = vec2(-dir.y, dir.x);
  float wDev = aW * uDpr;
  float rw = max(wDev, 1.25);
  float he = rw * 0.5 + 1.0;
  vec2 pos = (aES.x < 0.5 ? q0 : q1) + n * aES.y * he / uDpr;
  vSide = aES.y;
  vHW = rw * 0.5;
  vHE = he;
  vS = mix(aS.x, aS.y, aES.x);
  vDir = dir;
  vRnd = aInfo.y;
  vA = aInfo.z * min(1., wDev / 1.25) * (1. - smoothstep(0.3, 0.95, gTau));
  gl_Position = vec4(pos.x / uRes.x * 2. - 1., 1. - pos.y / uRes.y * 2., 0., 1.);
}
`

export const WEB_FS = COMMON + `
uniform sampler2D uPhoto;
uniform vec2 uScale;
varying float vSide;
varying float vHW;
varying float vHE;
varying float vS;
varying float vA;
varying float vRnd;
varying vec2 vDir;
void main() {
  float dist = abs(vSide) * vHE;
  float aa = 1. - smoothstep(vHW - 0.5, vHW + 0.5, dist);
  float vis = smoothstep(0.25, 0.75, vnoise(vec2(vS * 7. + vRnd * 40., vRnd * 9.)));
  float grain = 0.6 + 0.4 * vnoise(vec2(vS * 140. + vRnd * 13., vRnd * 3.));
  float a = vA * aa * (0.25 + 0.75 * vis) * grain * 0.5;
  if (a < 0.004) discard;
  vec2 suv = gl_FragCoord.xy / (uRes * uDpr);
  float lb = dot(texture2D(uPhoto, (suv - 0.5) * uScale + 0.5, 4.0).rgb, vec3(.299, .587, .114));
  vec3 base = mix(vec3(0.84, 0.83, 0.80), vec3(0.46, 0.45, 0.43), smoothstep(0.35, 0.9, lb));
  float g = pow(abs(dot(vDir, vec2(0.7071))), 22.) * 0.35 * vis;
  gl_FragColor = vec4(min(base + g, 1.), min(a * (1. + g), 1.));
}
`