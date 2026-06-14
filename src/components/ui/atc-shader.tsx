'use client';

import { useEffect, useRef } from 'react';

const vertSrc = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos,0.0,1.0); }`;

// Desktop shader - 50 iterations (high quality)
const fragSrcDesktop = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;

float tanh1(float x){ float e = exp(2.0*x); return (e-1.0)/(e+1.0); }
vec4 tanh4(vec4 v){ return vec4(tanh1(v.x), tanh1(v.y), tanh1(v.z), tanh1(v.w)); }

void main(){
  vec3 FC = vec3(gl_FragCoord.xy, 0.0);
  vec3 r  = vec3(u_res, max(u_res.x, u_res.y));
  float t = u_time;

  vec4 o = vec4(0.0);

  vec3 p = vec3(0.0);
  vec3 v = vec3(1.0, 2.0, 6.0);
  float i = 0.0, z = 1.0, d = 1.0, f = 1.0;

  for ( ; i++ < 5e1;
        o.rgb += (cos((p.x + z + v) * 0.1) + 1.0) / d / f / z )
  {
    p = z * normalize(FC * 2.0 - r.xyy);

    vec4 m = cos((p + sin(p)).y * 0.4 + vec4(0.0, 33.0, 11.0, 0.0));
    p.xz = mat2(m) * p.xz;

    p.x += t / 0.2;

    z += ( d = length(cos(p / v) * v + v.zxx / 7.0) /
           ( f = 2.0 + d / exp(p.y * 0.2) ) );
  }

  o = tanh4(0.2 * o);
  vec3 bg = vec3(0.08, 0.02, 0.05); // deep romantic purple/black
  vec3 pink = vec3(0.95, 0.25, 0.50); // sweet pink
  vec3 violet = vec3(0.45, 0.15, 0.70); // lavender violet
  vec3 rose = vec3(0.85, 0.10, 0.30); // deep rose red
  vec3 gold = vec3(1.0, 0.65, 0.40); // warm gold glow
  vec3 col = bg;
  col = mix(col, pink, o.r * 0.8);
  col = mix(col, violet, o.b * 0.6);
  col = mix(col, rose, o.g * 0.7);
  col = mix(col, gold, (o.r * o.g) * 0.5);
  o.rgb = col;
  o.a = 1.0;
  fragColor = o;
}`;

// Mobile shader - 20 iterations (smooth performance)
const fragSrcMobile = `#version 300 es
precision mediump float;
out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;

float tanh1(float x){ float e = exp(2.0*x); return (e-1.0)/(e+1.0); }
vec4 tanh4(vec4 v){ return vec4(tanh1(v.x), tanh1(v.y), tanh1(v.z), tanh1(v.w)); }

void main(){
  vec3 FC = vec3(gl_FragCoord.xy, 0.0);
  vec3 r  = vec3(u_res, max(u_res.x, u_res.y));
  float t = u_time;

  vec4 o = vec4(0.0);

  vec3 p = vec3(0.0);
  vec3 v = vec3(1.0, 2.0, 6.0);
  float i = 0.0, z = 1.0, d = 1.0, f = 1.0;

  for ( ; i++ < 2e1;
        o.rgb += (cos((p.x + z + v) * 0.1) + 1.0) / d / f / z )
  {
    p = z * normalize(FC * 2.0 - r.xyy);

    vec4 m = cos((p + sin(p)).y * 0.4 + vec4(0.0, 33.0, 11.0, 0.0));
    p.xz = mat2(m) * p.xz;

    p.x += t / 0.2;

    z += ( d = length(cos(p / v) * v + v.zxx / 7.0) /
           ( f = 2.0 + d / exp(p.y * 0.2) ) );
  }

  o = tanh4(0.2 * o);
  vec3 bg = vec3(0.08, 0.02, 0.05); // deep romantic purple/black
  vec3 pink = vec3(0.95, 0.25, 0.50); // sweet pink
  vec3 violet = vec3(0.45, 0.15, 0.70); // lavender violet
  vec3 rose = vec3(0.85, 0.10, 0.30); // deep rose red
  vec3 gold = vec3(1.0, 0.65, 0.40); // warm gold glow
  vec3 col = bg;
  col = mix(col, pink, o.r * 0.8);
  col = mix(col, violet, o.b * 0.6);
  col = mix(col, rose, o.g * 0.7);
  col = mix(col, gold, (o.r * o.g) * 0.5);
  o.rgb = col;
  o.a = 1.0;
  fragColor = o;
}`;

function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function ShaderDemoATC() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const errorRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const errorEl = errorRef.current!;
    const gl = canvas.getContext('webgl2', {
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      errorEl.textContent = 'WebGL2 not available';
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(sh) || 'compile error');
      return sh;
    };

    const link = (vs: string, fs: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(p) || 'link error');
      return p;
    };

    const mobile = isMobile();
    const fragSrc = mobile ? fragSrcMobile : fragSrcDesktop;

    let prog: WebGLProgram;
    try {
      prog = link(vertSrc, fragSrc);
    } catch (e: any) {
      errorEl.textContent = 'Shader error:\n' + e.message;
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');

    const resize = () => {
      // Lower DPR on mobile for smoother performance
      const maxDpr = mobile ? 1 : 2;
      const dpr = Math.max(1, Math.min(maxDpr, window.devicePixelRatio || 1));
      const w = Math.floor(
        (canvas.clientWidth || window.innerWidth) * dpr
      );
      const h = Math.floor(
        (canvas.clientHeight || window.innerHeight) * dpr
      );
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const onResize = () => resize();
    window.addEventListener('resize', onResize, { passive: true });
    resize();

    let raf = 0;
    const t0 = performance.now();
    const draw = () => {
      const t = (performance.now() - t0) / 1000;
      gl.uniform1f(uTime, t);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="block w-full h-screen"
        style={{
          display: 'block',
          background: '#000',
          willChange: 'contents',
          transform: 'translateZ(0)',
        }}
      />
      <pre
        ref={errorRef}
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          color: '#0f0',
          whiteSpace: 'pre-wrap',
          fontSize: '10px',
        }}
      />
    </div>
  );
}
