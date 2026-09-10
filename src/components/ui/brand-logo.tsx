import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  height?: number;
  href?: string;
  priority?: boolean;
  variant?: "header" | "footer" | "default";
}

const variantHeights = {
  header: { mobile: 64, desktop: 84 },
  footer: { mobile: 72, desktop: 88 },
  default: { mobile: 52, desktop: 64 },
} as const;

export function BrandLogo({
  className,
  height,
  href = "/",
  priority = false,
  variant = "default",
}: BrandLogoProps) {
  const sizes = variantHeights[variant];
  const mobileHeight = height ?? sizes.mobile;
  const desktopHeight = height ?? sizes.desktop;

  const image = (
    <>
      <Image
        src={siteConfig.logo}
        alt={`${siteConfig.name} — ${siteConfig.tagline}`}
        width={Math.round(mobileHeight * 2.6)}
        height={mobileHeight}
        className={cn(
          "h-auto w-auto object-contain md:hidden",
          className
        )}
        style={{ height: mobileHeight, width: "auto", maxWidth: "min(260px, 62vw)" }}
        priority={priority}
      />
      <Image
        src={siteConfig.logo}
        alt={`${siteConfig.name} — ${siteConfig.tagline}`}
        width={Math.round(desktopHeight * 2.6)}
        height={desktopHeight}
        className={cn(
          "hidden h-auto w-auto object-contain md:block",
          className
        )}
        style={{ height: desktopHeight, width: "auto", maxWidth: "320px" }}
        priority={priority}
      />
    </>
  );

  if (!href) return <div className="inline-flex shrink-0 items-center">{image}</div>;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center transition-opacity duration-200 hover:opacity-90"
      aria-label={`${siteConfig.name} — Inicio`}
    >
      {image}
    </Link>
  );
}
