"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface MarasalSealProps {
  size?: number;
  className?: string;
}

export function MarasalSeal({ size = 44, className }: MarasalSealProps) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Sello Sal de Maras de los Incas"
    >
      <defs>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0DCA4" />
          <stop offset="30%" stopColor="#C9A227" />
          <stop offset="58%" stopColor="#F6EBC4" />
          <stop offset="100%" stopColor="#A87F16" />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="34%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="52%" stopColor="#FCF6EE" />
          <stop offset="100%" stopColor="#EFE3D2" />
        </radialGradient>
        <linearGradient id={`${uid}-peak`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B8240" />
          <stop offset="100%" stopColor="#3D4F22" />
        </linearGradient>
        <path
          id={`${uid}-arc`}
          d="M 50 50 m -33.5 0 a 33.5 33.5 0 0 1 67 0"
          fill="none"
        />
      </defs>

      <circle cx="50" cy="50" r="48" fill={`url(#${uid}-ring)`} />
      <circle cx="50" cy="50" r="44.5" fill={`url(#${uid}-face)`} />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#C9A227"
        strokeWidth="0.7"
        opacity="0.55"
      />

      <text
        fill="#556B2F"
        fontSize="7.4"
        fontWeight="700"
        letterSpacing="1.1"
        style={{ textTransform: "uppercase" }}
      >
        <textPath href={`#${uid}-arc`} startOffset="50%" textAnchor="middle">
          Sal de Maras
        </textPath>
      </text>

      {/* Andean peaks */}
      <path
        d="M24 64 L36 43 L44 53 L54 36 L76 64 Z"
        fill={`url(#${uid}-peak)`}
      />
      <path d="M36 43 L41 51 L31 52 Z" fill="#FFFFFF" opacity="0.75" />
      <path d="M54 36 L61 45 L47 47 Z" fill="#FFFFFF" opacity="0.8" />

      {/* Sun disc */}
      <circle cx="67" cy="33" r="5.4" fill="#DB7093" opacity="0.9" />
      <circle cx="67" cy="33" r="5.4" fill="none" stroke="#C9A227" strokeWidth="0.6" />

      {/* Salt pond line */}
      <path
        d="M22 67.5 H78"
        stroke="#C9A227"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <g fill="#556B2F" opacity="0.7">
        <rect x="46.5" y="72" width="3" height="3" transform="rotate(45 48 73.5)" />
        <rect x="38" y="72.6" width="2" height="2" transform="rotate(45 39 73.6)" />
        <rect x="58" y="72.6" width="2" height="2" transform="rotate(45 59 73.6)" />
      </g>

      <text
        x="50"
        y="87"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        letterSpacing="1.4"
        fill="#8B7355"
      >
        INCAS
      </text>
    </svg>
  );
}

interface MarasalBadgeProps {
  className?: string;
}

export function MarasalBadge({ className }: MarasalBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-3.5 py-2.5 backdrop-blur-xl",
        className
      )}
      style={{
        boxShadow:
          "0 22px 45px -16px rgba(85,107,47,0.45), 0 3px 10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
      }}
    >
      <MarasalSeal size={42} />
      <div className="leading-none">
        <p className="font-serif text-[15px] font-bold tracking-[0.16em] text-text">
          MARASAL
        </p>
        <p className="mt-1.5 text-[8.5px] font-medium uppercase tracking-[0.2em] text-text-muted">
          Milenaria y natural
        </p>
      </div>
    </div>
  );
}
