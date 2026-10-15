// Indie edit renderer: one WebGL fragment shader that cuts between shots with speed ramps,
// motion blur and trails, halation, film burns and grain, then lays it all behind shoji paper:
// a charcoal-to-gold split tone, paper fibres and soft diffusion, so the footage reads as light
// moving behind a screen rather than video pasted onto the page.
// Returns null when WebGL is unavailable so the caller can keep the still frame.
import { frameAt, shots, type Clip, type Frame } from './indie-edit';

const VERT = `attribute vec2 a; varying vec2 vUv; void main(){ vUv = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImage;
uniform vec2 uRes, uImageSize, uDir;
uniform vec3 uCam;
uniform float uTime, uLocal, uShot, uSource, uBlur, uBurn, uFlash;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= .5; } return v; }

// The current frame of footage, cover-fitted and moved by the camera.
vec3 image(vec2 uv) {
  float fa = uRes.x / uRes.y, pa = uImageSize.x / uImageSize.y;
  vec2 scale = fa > pa ? vec2(1., pa / fa) : vec2(fa / pa, 1.);
  vec2 p = (uv - .5) * scale / uCam.z + vec2(uCam.x, 1. - uCam.y);
  return texture2D(uImage, clamp(p, .001, .999)).rgb;
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
    col += tint * smoothstep(r, r * .55, length(d)) * .26;
  }
  return col;
}

vec3 scene(vec2 uv) { return uSource < .5 ? image(uv) : night(uv); }

void main() {
  vec2 uv = vUv + vec2(sin(uTime * 13.) * .0016, cos(uTime * 9.) * .0013); // gate weave

  // Motion blur along the camera path, with a colour split that grows with speed.
  vec3 col = vec3(0.);
  for (int i = 0; i < 5; i++) col += scene(uv + uDir * (float(i) / 4. - .5) * uBlur * .07);
  col /= 5.;
  float ca = .0025 + uBlur * .007;
  col.r = mix(col.r, scene(uv + uDir * ca + vec2(ca, 0.)).r, .6);
  col.b = mix(col.b, scene(uv - uDir * ca - vec2(ca, 0.)).b, .6);

  // Soft halation around highlights.
  float lum = dot(col, vec3(.299, .587, .114));
  col += vec3(1., .5, .2) * smoothstep(.5, 1., lum) * .25;

  // House look over each clip's own grade: a light split tone toward the site's charcoal and gold,
  // then an S-curve so blacks stay dense and highlights glow. Colour and contrast come from the clip.
  lum = dot(col, vec3(.299, .587, .114));
  vec3 tone = mix(vec3(.08, .08, .085), vec3(1., .84, .58), smoothstep(.0, 1., lum));
  col = mix(col, col * tone * 1.6, .22);
  col = clamp(col, 0., 1.);
  col = col * col * (3. - 2. * col) * .35 + col * .65;

  // Film burn: a light leak blooming from a corner at each cut.
  vec2 corner = vec2(step(.5, hash(vec2(uShot, 9.))), step(.5, hash(vec2(uShot, 4.))));
  float n = fbm(uv * 3. + vec2(uLocal * 1.7, uShot * 7.1));
  float leak = smoothstep(.35, .9, n + (1. - length(uv - corner)) * .6 - .55 + uBurn * .7);
  col += leak * uBurn * mix(vec3(.9, .45, .15), vec3(1., .88, .6), leak) * .8;

  col += uFlash * vec3(.9, .78, .55);                                  // flash frame: warm, soft

  // Washi fibres: long horizontal strands and a fine tooth, as if the light comes through paper.
  float fibre = fbm(vec2(uv.x * 9., uv.y * 70.)) * .6 + noise(uv * uRes * .35) * .4;
  col *= .95 + fibre * .08;
  col += (hash(uv * uRes + fract(uTime) * 91.) - .5) * .05;            // grain
  col *= smoothstep(1.25, .35, length(uv - .5));                       // vignette

  // Alpha < 1 leaves a trail of earlier frames (preserveDrawingBuffer + blending): the time-warp smear.
  gl_FragColor = vec4(col, 1. - uBlur * .55);
}`;

export type IndieEdit = { start(): void; stop(): void; running(): boolean };

const FRAME_MS = 1000 / 24; // film cadence: looks right and halves the GPU work

export function createIndieEdit(
  canvas: HTMLCanvasElement,
  onFirstFrame: () => void,
  {
    allowSoftware = false,
    clipBase = '',
    onFrame,
  }: { allowSoftware?: boolean; clipBase?: string; onFrame?: (clock: number, f: Frame) => void } = {},
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
    res: u('uRes'), size: u('uImageSize'), dir: u('uDir'), cam: u('uCam'), time: u('uTime'), local: u('uLocal'),
    shot: u('uShot'), source: u('uSource'), blur: u('uBlur'), burn: u('uBurn'), flash: u('uFlash'),
  };

  const texture = () => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 20, 20, 255]));
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]])
      gl.texParameteri(gl.TEXTURE_2D, k, v);
    return t;
  };
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const videoTex = texture();

  // Footage: one muted, off-DOM video per cut, fetched a shot or two ahead of when it plays, never
  // during first load.
  const videos: Partial<Record<Clip, HTMLVideoElement>> = {};
  const prime = (from: number) => {
    if (!clipBase) return;
    for (const k of [0, 1, 2]) {
      const c = shots[(from + k) % shots.length].clip;
      if (c && !videos[c])
        videos[c] = Object.assign(document.createElement('video'), {
          src: `${clipBase}${c}.mp4`, muted: true, playsInline: true, preload: 'auto',
        });
    }
  };
  let shown = -1;
  let playing: HTMLVideoElement | null = null;
  // Picks this frame's image and returns the shader source: 0 = image, 1 = generated night.
  // A cut whose footage cannot play yet holds the last frame (a freeze frame), or the night scene
  // before any footage has arrived, so the edit never stalls.
  let hasFrame = false;
  const bindSource = (f: Frame): number => {
    if (f.shot !== shown) {
      shown = f.shot;
      prime(f.shot);
      playing?.pause();
      playing = f.clip ? (videos[f.clip] ?? null) : null;
      if (playing) {
        playing.currentTime = 0;
        playing.play().catch(() => {});
      }
    }
    if (f.source === 'night') return 1;
    if (!playing || playing.readyState < 2) return hasFrame ? 0 : 1;
    playing.playbackRate = f.rate;
    gl.bindTexture(gl.TEXTURE_2D, videoTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, playing);
    hasFrame = true;
    gl.uniform2f(U.size, playing.videoWidth, playing.videoHeight);
    return 0;
  };

  // Render below device resolution: softer, more "film", and cheaper.
  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 1) * 0.6; // full bleed: soft, film-like and cheap
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
    gl.uniform1f(U.source, bindSource(f));
    gl.uniform3f(U.cam, f.x, f.y, f.zoom);
    gl.uniform2f(U.dir, f.dir[0], f.dir[1]);
    gl.uniform1f(U.blur, f.blur);
    gl.uniform1f(U.burn, f.burn);
    gl.uniform1f(U.flash, f.flash);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    onFrame?.(clock, f);
    if (first) {
      first = false;
      onFirstFrame();
    }
    raf = requestAnimationFrame(draw);
  };

  return {
    start() {
      if (raf) return;
      shown = -1; // restart the current cut's footage
      last = 0;
      raf = requestAnimationFrame(draw);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
      playing?.pause();
    },
    running: () => raf !== 0,
  };
}
