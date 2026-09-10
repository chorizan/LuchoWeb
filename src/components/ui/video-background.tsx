"use client";

import { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  className?: string;
}

export function VideoBackground({ src, poster, className = "" }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      // Autoplay blocked — poster/fallback remains visible
    });
  }, []);

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
