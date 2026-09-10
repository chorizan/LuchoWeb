export const colors = {
  olive: "#556B2F",
  oliveLight: "#6B8240",
  oliveDark: "#3D4F22",
  beige: "#F5F1E8",
  beigeDark: "#E8E0D0",
  cream: "#FAF8F4",
  grayLight: "#F8F8F8",
  text: "#222222",
  textMuted: "#666666",
  gold: "#C9A227",
  sale: "#D63C2F",
  white: "#FFFFFF",
} as const;

export const fonts = {
  serif: "Playfair Display",
  sans: "Inter",
} as const;

export const animation = {
  fadeIn: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  stagger: {
    staggerChildren: 0.12,
    delayChildren: 0.1,
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  float: {
    animate: { y: [-8, 8, -8] },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
} as const;
