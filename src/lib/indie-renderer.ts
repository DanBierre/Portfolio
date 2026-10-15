// Indie edit renderer: one WebGL fragment shader that cuts between shots with speed ramps,
// motion blur and trails, night halation, film burns, flash frames, grain and gate weave.
// Returns null when WebGL is unavailable so the caller can keep the still frame.
import { frameAt } from './indie-edit';

const VERT = `attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPhoto;
uniform vec2 uRes, uPhotoSize, uDir;
uniform vec3 uCam;
uniform float uTime, uLocal, uShot, uSource, uBlur, uBurn, uFlash;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= .5; } return v; }

// Dan's Fushimi Inari photo, cover-fitted and moved by the camera.
vec3 photo(vec2 uv) {
  float fa = uRes.x / uRes.y, pa = uPhotoSize.x / uPhotoSize.y;
  vec2 scale = fa > pa ? vec2(1., pa / fa) : vec2(fa / pa, 1.);
  vec2 p = (uv - .5) * scale / uCam.z + vec2(uCam.x, 1. - uCam.y);
  return texture2D(uPhoto, clamp(p, .001, .999)).rgb;
}

// Generated Tokyo night: neon bokeh that streaks along the camera move.
vec3 night(vec2 uv) {
  vec2 p = (uv - .5) / uCam.z + uCam.xy;
  vec3 col = mix(vec3(.01, .012, .035), vec3(.035, .02, .06), uv.y);
  for (int i = 0; i < 18; i++) {
    float fi = float(i);
    vec2 c = vec2(hash(vec2(fi, 1.)), hash(vec2(fi, 2.)));
    c.x = fract(c.x + uTime * .012 * (hash(vec2(fi, 3.)) - .5));
    float r = mix(.025, .1, hash(vec2(fi, 4.)));
    vec3 tint = mix(vec3(1., .22, .42), vec3(.15, .75, 1.), hash(vec2(fi, 5.)));
    tint = mix(tint, vec3(1., .66, .28), step(.68, hash(vec2(fi, 6.))));
    vec2 d = p - c;
    d -= uDir * dot(d, uDir) * clamp(uBlur * 1.7, 0., .92);
    col += tint * smoothstep(r, r * .55, length(d)) * .5;
  }
  return col;
}

vec3 scene(vec2 uv) { return uSource < .5 ? photo(uv) : night(uv); }

void main() {
  vec2 uv = vUv + vec2(sin(uTime * 13.) * .0016, cos(uTime * 9.) * .0013); // gate weave

  // Motion blur along the camera path, with a colour split that grows with speed.
  vec3 col = vec3(0.);
  for (int i = 0; i < 5; i++) col += scene(uv + uDir * (float(i) / 4. - .5) * uBlur * .07);
  col /= 5.;
  float ca = .0025 + uBlur * .007;
  col.r = mix(col.r, scene(uv + uDir * ca + vec2(ca, 0.)).r, .6);
  col.b = mix(col.b, scene(uv - uDir * ca - vec2(ca, 0.)).b, .6);

  // Night film: soft halation around highlights, crushed warm grade.
  float lum = dot(col, vec3(.299, .587, .114));
  col += vec3(1., .32, .12) * smoothstep(.45, 1., lum) * .45;
  col = pow(col, vec3(1.12)) * vec3(1.06, .97, .88);

  // Film burn: a light leak blooming from a corner at each cut.
  vec2 corner = vec2(step(.5, hash(vec2(uShot, 9.))), step(.5, hash(vec2(uShot, 4.))));
  float n = fbm(uv * 3. + vec2(uLocal * 1.7, uShot * 7.1));
  float leak = smoothstep(.35, .9, n + (1. - length(uv - corner)) * .6 - .55 + uBurn * .7);
  col += leak * uBurn * mix(vec3(1., .3, .03), vec3(1., .88, .55), leak) * 1.8;

  col += uFlash * .85;                                                 // flash frame
  col += (hash(uv * uRes + fract(uTime) * 91.) - .5) * .09;            // grain
  col *= smoothstep(1.25, .35, length(uv - .5));                       // vignette

  // Alpha < 1 leaves a trail of earlier frames (preserveDrawingBuffer + blending): the time-warp smear.
  gl_FragColor = vec4(col, 1. - uBlur * .55);
}`;

export type IndieEdit = { start(): void; stop(): void; running(): boolean };

const FRAME_MS = 1000 / 24; // film cadence: looks right and halves the GPU work

export function createIndieEdit(
  canvas: HTMLCanvasElement,
  photoUrl: string,
  onFirstFrame: () => void,
  { allowSoftware = false } = {},
): IndieEdit | null {
  // Hardware graphics only: on software rendering (no GPU) the edit would hog the CPU, so keep the still.
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: !allowSoftware,
  });
  if (!gl) return null;
  // Some browsers report software rasterisers (SwiftShader, llvmpipe, WARP) without the caveat flag.
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
  if (!allowSoftware && /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  };
  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const U = {
    res: u('uRes'), size: u('uPhotoSize'), dir: u('uDir'), cam: u('uCam'), time: u('uTime'), local: u('uLocal'),
    shot: u('uShot'), source: u('uSource'), blur: u('uBlur'), burn: u('uBurn'), flash: u('uFlash'),
  };

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 20, 20, 255]));
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]])
    gl.texParameteri(gl.TEXTURE_2D, k, v);
  gl.uniform2f(U.size, 1, 1);
  const img = new Image();
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.uniform2f(U.size, img.naturalWidth, img.naturalHeight);
  };
  img.src = photoUrl;

  // Render below device resolution: softer, more "film", and cheaper.
  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 1.25) * 0.8;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U.res, canvas.width, canvas.height);
  };
  resize();
  new ResizeObserver(resize).observe(canvas);

  let raf = 0;
  let clock = 0; // seconds of edit time; paused time does not count
  let last = 0;
  let first = true;
  const draw = (now: number) => {
    if (last && now - last < FRAME_MS) {
      raf = requestAnimationFrame(draw);
      return;
    }
    if (last) clock += Math.min(0.08, (now - last) / 1000);
    last = now;
    const f = frameAt(clock);
    gl.uniform1f(U.time, clock);
    gl.uniform1f(U.local, f.local);
    gl.uniform1f(U.shot, f.shot);
    gl.uniform1f(U.source, f.source === 'photo' ? 0 : 1);
    gl.uniform3f(U.cam, f.x, f.y, f.zoom);
    gl.uniform2f(U.dir, f.dir[0], f.dir[1]);
    gl.uniform1f(U.blur, f.blur);
    gl.uniform1f(U.burn, f.burn);
    gl.uniform1f(U.flash, f.flash);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (first) {
      first = false;
      onFirstFrame();
    }
    raf = requestAnimationFrame(draw);
  };

  return {
    start() {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(draw);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    running: () => raf !== 0,
  };
}
