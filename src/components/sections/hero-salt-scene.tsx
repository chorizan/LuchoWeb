"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { MarasalBadge } from "@/components/ui/marasal-logo-badge";

/** Design space for the orbit system; scaled to fit the stage. */
const BOX = 600;
const C = BOX / 2;
const TAU = Math.PI * 2;

type Tone = "salt" | "gold" | "rose";

interface CrystalDef {
  phase: number;
  size: number;
  tone: Tone;
}

interface OrbitDef {
  rx: number;
  ry: number;
  tilt: number;
  duration: number;
  dir: 1 | -1;
  crystals: CrystalDef[];
}

const ORBITS: OrbitDef[] = [
  {
    rx: 272,
    ry: 90,
    tilt: 0,
    duration: 32,
    dir: 1,
    crystals: [
      { phase: 0.03, size: 16, tone: "salt" },
      { phase: 0.36, size: 10, tone: "gold" },
      { phase: 0.7, size: 19, tone: "salt" },
    ],
  },
  {
    rx: 238,
    ry: 56,
    tilt: -16,
    duration: 46,
    dir: -1,
    crystals: [
      { phase: 0.17, size: 11, tone: "rose" },
      { phase: 0.62, size: 13, tone: "salt" },
    ],
  },
];

const toneStyles: Record<Tone, { background: string; shadow: string }> = {
  salt: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #fdf3ef 42%, #e9c3b7 100%)",
    shadow:
      "0 3px 14px rgba(200,130,120,0.45), inset 0 1px 2px rgba(255,255,255,0.95)",
  },
  gold: {
    background:
      "linear-gradient(135deg, #fff8e2 0%, #f0dca4 45%, #c9a227 100%)",
    shadow:
      "0 3px 14px rgba(201,162,39,0.5), inset 0 1px 2px rgba(255,255,255,0.9)",
  },
  rose: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #fbdfe6 45%, #db7093 100%)",
    shadow:
      "0 3px 14px rgba(219,112,147,0.45), inset 0 1px 2px rgba(255,255,255,0.9)",
  },
};

function ellipseArc(rx: number, ry: number, half: "top" | "bottom") {
  return half === "top"
    ? `M ${C - rx} ${C} A ${rx} ${ry} 0 0 1 ${C + rx} ${C}`
    : `M ${C + rx} ${C} A ${rx} ${ry} 0 0 1 ${C - rx} ${C}`;
}

/**
 * A crystal riding an elliptical orbit. Rendered twice — once in the layer
 * behind the product and once in front — with complementary opacity, so it
 * reads as a single crystal passing behind and in front of the pack. The
 * handover happens at the horizontal extremes, clear of the product circle.
 */
function OrbitCrystal({
  time,
  orbit,
  crystal,
  layer,
}: {
  time: MotionValue<number>;
  orbit: OrbitDef;
  crystal: CrystalDef;
  layer: "front" | "back";
}) {
  const progress = useTransform(time, (t) => {
    const raw = (t / orbit.duration) * orbit.dir + crystal.phase;
    return ((raw % 1) + 1) % 1;
  });

  const x = useTransform(progress, (v) => C + orbit.rx * Math.cos(v * TAU));
  const y = useTransform(progress, (v) => C + orbit.ry * Math.sin(v * TAU));
  /** +1 closest to viewer, -1 farthest. */
  const depth = useTransform(progress, (v) => Math.sin(v * TAU));

  const scale = useTransform(depth, [-1, 1], [0.48, 1.28]);
  const filter = useTransform(
    depth,
    (d) => `blur(${(((1 - d) / 2) * 2.4).toFixed(2)}px)`
  );
  const opacity = useTransform(depth, (d) => {
    const belongsHere = layer === "front" ? d >= 0 : d < 0;
    if (!belongsHere) return 0;
    return 0.3 + ((d + 1) / 2) * 0.7;
  });

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{
        width: crystal.size,
        height: crystal.size,
        marginLeft: -crystal.size / 2,
        marginTop: -crystal.size / 2,
        x,
        y,
        scale,
        opacity,
        filter,
      }}
    >
      <div
        className="h-full w-full rotate-45 rounded-[28%]"
        style={{
          background: toneStyles[crystal.tone].background,
          boxShadow: toneStyles[crystal.tone].shadow,
        }}
      />
    </motion.div>
  );
}

function OrbitLayer({
  time,
  layer,
  scale,
}: {
  time: MotionValue<number>;
  layer: "front" | "back";
  scale: number;
}) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: BOX,
        height: BOX,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: layer === "front" ? 30 : 3,
      }}
    >
      {ORBITS.map((orbit, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ transform: `rotate(${orbit.tilt}deg)` }}
        >
          <svg
            viewBox={`0 0 ${BOX} ${BOX}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient
                id={`orbit-${layer}-${i}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#C9A227" stopOpacity="0" />
                <stop
                  offset="28%"
                  stopColor="#C9A227"
                  stopOpacity={layer === "front" ? 0.55 : 0.28}
                />
                <stop
                  offset="72%"
                  stopColor="#556B2F"
                  stopOpacity={layer === "front" ? 0.5 : 0.24}
                />
                <stop offset="100%" stopColor="#556B2F" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={ellipseArc(orbit.rx, orbit.ry, layer === "front" ? "bottom" : "top")}
              fill="none"
              stroke={`url(#orbit-${layer}-${i})`}
              strokeWidth={layer === "front" ? 1.6 : 1.2}
              strokeLinecap="round"
            />
          </svg>

          {orbit.crystals.map((crystal, j) => (
            <OrbitCrystal
              key={j}
              time={time}
              orbit={orbit}
              crystal={crystal}
              layer={layer}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface Grain {
  x: number;
  y: number;
  z: number;
  size: number;
  rotation: number;
  spin: number;
  vx: number;
  vy: number;
  twinkle: number;
  twinkleSpeed: number;
}

/** Fine salt dust drifting to the left, with depth-based blur and twinkle. */
function SaltDust({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainsRef = useRef<Grain[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(Math.round((width * height) / 9000), 70);
      grainsRef.current = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          size: 1.2 + z * 3.4,
          rotation: Math.random() * TAU,
          spin: (Math.random() - 0.5) * 0.015,
          vx: -(0.12 + z * 0.5),
          vy: (Math.random() - 0.5) * 0.16,
          twinkle: Math.random() * TAU,
          twinkleSpeed: 0.015 + Math.random() * 0.03,
        };
      });
    };

    setup();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const g of grainsRef.current) {
        if (!reduced) {
          g.x += g.vx;
          g.y += g.vy;
          g.rotation += g.spin;
          g.twinkle += g.twinkleSpeed;

          if (g.x < -12) {
            g.x = width + 12;
            g.y = Math.random() * height;
          }
          if (g.y < -12) g.y = height + 12;
          if (g.y > height + 12) g.y = -12;
        }

        const shimmer = 0.55 + Math.sin(g.twinkle) * 0.45;
        const alpha = (0.12 + g.z * 0.4) * shimmer;

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rotation);
        ctx.globalAlpha = alpha;

        const s = g.size;
        const grad = ctx.createLinearGradient(-s, -s, s, s);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.55, "#fbeae4");
        grad.addColorStop(1, "#e2b3a6");

        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.72, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.72, 0);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        if (g.z > 0.75) {
          ctx.globalAlpha = alpha * 0.7;
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(-s * 1.9, 0);
          ctx.lineTo(s * 1.9, 0);
          ctx.moveTo(0, -s * 1.9);
          ctx.lineTo(0, s * 1.9);
          ctx.stroke();
        }

        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    const observer = new ResizeObserver(setup);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

export function HeroSaltScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const reduceMotion = useReducedMotion();

  const time = useMotionValue(0);
  useAnimationFrame((t) => {
    if (!reduceMotion) time.set(t / 1000);
  });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / BOX);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 55, damping: 18, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 55, damping: 18, mass: 0.6 });

  const stageRotateY = useTransform(smoothX, [-1, 1], [-11, 11]);
  const stageRotateX = useTransform(smoothY, [-1, 1], [7, -7]);
  const glowX = useTransform(smoothX, [-1, 1], [-38, 38]);
  const glowY = useTransform(smoothY, [-1, 1], [-26, 26]);
  const productX = useTransform(smoothX, [-1, 1], [14, -14]);
  const productY = useTransform(smoothY, [-1, 1], [10, -10]);
  const badgeX = useTransform(smoothX, [-1, 1], [26, -26]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
      pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [pointerX, pointerY]
  );

  const resetPointer = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-[380px] sm:max-w-[520px] md:max-w-[600px] lg:mx-0 lg:ml-auto lg:-mr-6 lg:max-w-[min(700px,68vh)] xl:-mr-10 xl:max-w-[min(790px,74vh)]"
      style={{ perspective: 1400 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.div
        className="absolute inset-0"
        style={{ rotateX: stageRotateX, rotateY: stageRotateY }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Ambient light — drifts left */}
        <motion.div
          className="absolute -inset-[18%] z-[1]"
          style={{ x: glowX, y: glowY }}
          animate={reduceMotion ? undefined : { x: [0, -26, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 blur-3xl"
            style={{
              background:
                "radial-gradient(50% 50% at 58% 46%, rgba(255,255,255,0.9) 0%, rgba(250,240,232,0.55) 38%, transparent 72%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(38% 38% at 30% 72%, rgba(219,112,147,0.28) 0%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Halo behind the pack */}
        <div
          className="absolute left-1/2 top-1/2 z-[2] h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(85,107,47,0.22) 0%, rgba(201,162,39,0.12) 52%, transparent 74%)",
          }}
        />

        {scale > 0 && (
          <OrbitLayer time={time} layer="back" scale={scale} />
        )}

        {/* Product */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-10 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2"
          style={{ x: productX, y: productY }}
        >
          <motion.div
            className="relative h-full w-full"
            animate={reduceMotion ? undefined : { y: [-7, 7, -7] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Contact shadow */}
            <div
              className="absolute -bottom-[9%] left-1/2 h-[14%] w-[78%] -translate-x-1/2 rounded-[50%] blur-xl"
              style={{ background: "rgba(61,79,34,0.32)" }}
            />

            <div
              className="relative h-full w-full overflow-hidden rounded-full"
              style={{
                boxShadow:
                  "0 40px 80px -28px rgba(61,79,34,0.55), 0 12px 30px -12px rgba(0,0,0,0.18), inset 0 0 0 1.5px rgba(255,255,255,0.85)",
              }}
            >
              <Image
                src="/products/sal-de-maras.png"
                alt="Sal de Maras Marasal, sal rosada gourmet del Perú"
                fill
                className="scale-105 object-cover"
                priority
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 400px, 520px"
              />

              {/* Volume shading */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(70% 62% at 30% 24%, rgba(255,255,255,0.42) 0%, transparent 58%), radial-gradient(90% 90% at 74% 82%, rgba(45,55,25,0.34) 0%, transparent 62%)",
                }}
              />

              {/* Light sweep */}
              {!reduceMotion && (
                <motion.div
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2"
                  style={{ mixBlendMode: "soft-light" }}
                  animate={{ x: ["0%", "420%"] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    repeatDelay: 4.6,
                    ease: "easeInOut",
                  }}
                >
                  <div className="h-full w-full -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent" />
                </motion.div>
              )}

              {/* Glass rim */}
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  boxShadow:
                    "inset 0 2px 10px rgba(255,255,255,0.6), inset 0 -14px 28px rgba(61,79,34,0.28)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {scale > 0 && (
          <OrbitLayer time={time} layer="front" scale={scale} />
        )}

        {/* Salt dust */}
        <SaltDust className="pointer-events-none absolute inset-0 z-[35] h-full w-full" />

        {/* Brand seal */}
        <motion.div
          className="absolute bottom-[3%] left-0 z-40 origin-bottom-left scale-[0.8] sm:scale-95 lg:scale-105 xl:scale-[1.15]"
          style={{ x: badgeX }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [-4, 4, -4] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <MarasalBadge />
          </motion.div>
        </motion.div>

        {/* Companion product chip */}
        <motion.div
          className="absolute left-[2%] top-[6%] z-40 hidden h-[19%] w-[19%] sm:block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-2xl border border-white/70 bg-white/65 backdrop-blur-xl"
            style={{
              boxShadow:
                "0 20px 40px -16px rgba(61,79,34,0.45), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
            animate={reduceMotion ? undefined : { y: [-6, 6, -6], rotate: [-2.5, 2.5, -2.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/products/panela-organica-dulce-vida.png"
              alt="Panela orgánica Dulce & Vida"
              fill
              className="object-contain p-2"
              sizes="100px"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
