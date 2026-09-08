"use client";
import { play } from "cuelume";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const vertex = `attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=(a_position+1.0)*0.5;gl_Position=vec4(a_position,0.0,1.0);}`;
const fragment = `precision mediump float; uniform sampler2D u_image; uniform float u_grid; varying vec2 v_uv;
void main(){vec2 uv=(floor(v_uv*u_grid)+0.5)/u_grid; vec4 color=texture2D(u_image,uv); float luma=dot(color.rgb,vec3(0.299,0.587,0.114));color.rgb=mix(vec3(luma),color.rgb,0.65);gl_FragColor=color;}`;

export function PixelPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animateRef = useRef<(detailed: boolean) => void>(() => {});
  const pinned = useRef(false);
  const requested = useRef(false);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    let frame = 0;
    let disposed = false;
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      shaders.push(shader);
      return gl!.getShaderParameter(shader, gl!.COMPILE_STATUS) ? shader : null;
    }
    const vs = compile(gl.VERTEX_SHADER, vertex),
      fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) {
      shaders.forEach((s) => gl.deleteShader(s));
      return;
    }
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((s) => gl.deleteShader(s));
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const grid = gl.getUniformLocation(program, "u_grid");
    let current = 0;
    function draw(value: number) {
      gl!.uniform1f(grid, 28 + Math.pow(value, 3) * 692);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      // Readiness never replaces the server-rendered poster; only interaction does.
      const active = String(value > 0);
      if (canvas!.dataset.active !== active) canvas!.dataset.active = active;
    }
    const photo = new window.Image();
    photo.onload = () => {
      if (disposed || gl.isContextLost()) return;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, photo);
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(0);
      canvas.dataset.ready = "true";
      animateRef.current = (detailed) => {
        cancelAnimationFrame(frame);
        const to = detailed ? 1 : 0;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          current = to;
          draw(to);
          return;
        }
        const start = performance.now(),
          from = current;
        const tick = (now: number) => {
          const t = Math.min((now - start) / 420, 1);
          current = from + (to - from) * (1 - Math.pow(1 - t, 3));
          draw(current);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      };
      if (requested.current) animateRef.current(true);
    };
    photo.onerror = () => {
      canvas.dataset.active = "false";
    };
    photo.src = "/media/marcio.jpg";
    const contextLost = (event: Event) => {
      event.preventDefault();
      canvas.dataset.ready = "false";
      canvas.dataset.active = "false";
      cancelAnimationFrame(frame);
      animateRef.current = () => {};
    };
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => {
      disposed = true;
      photo.onload = null;
      photo.onerror = null;
      cancelAnimationFrame(frame);
      animateRef.current = () => {};
      canvas.removeEventListener("webglcontextlost", contextLost);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((s) => gl.deleteShader(s));
    };
  }, []);
  function requestDetail(detailed: boolean, audible = false) {
    const changed = requested.current !== detailed;
    requested.current = detailed;
    animateRef.current(detailed);
    if (audible && changed) play(detailed ? "ready" : "droplet");
  }
  function toggle() {
    pinned.current = !pinned.current;
    setRevealed(pinned.current);
    requestDetail(pinned.current, true);
  }
  return (
    <button
      className="portrait group/portrait relative size-[88px] shrink-0 max-[600px]:size-[76px] max-[360px]:size-[66px]"
      type="button"
      onClick={toggle}
      aria-label={revealed ? "Pixelate portrait" : "Reveal portrait"}
      aria-pressed={revealed}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") requestDetail(true, true);
      }}
      onPointerLeave={() => requestDetail(pinned.current, true)}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) requestDetail(true, true);
      }}
      onBlur={() => requestDetail(pinned.current, true)}
    >
      <span className="portrait-visual pointer-events-none relative block size-full -rotate-3 rounded-[11px] bg-muted shadow-[0_0_0_1px_#00000009,0_3px_5px_#202c2110] transition-transform duration-150 ease-[cubic-bezier(0.19,1,0.22,1)] motion-safe:pointer-fine:group-hover/portrait:-translate-y-0.5 motion-safe:pointer-fine:group-hover/portrait:rotate-0 motion-reduce:transition-none">
        <Image
          className="size-full rounded-[inherit] object-cover"
          src="/media/marcio-pixelated.svg"
          alt="Marcio Barrios"
          width={96}
          height={96}
          preload
          unoptimized
        />
        <canvas
          className="absolute inset-0 size-full rounded-[inherit] object-cover opacity-0 data-[active=true]:opacity-100"
          ref={canvasRef}
          width={288}
          height={288}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
