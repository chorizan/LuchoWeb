interface WaveProps {
  className?: string;
  flip?: boolean;
  color?: string;
}

export function WaveDivider({
  className = "",
  flip = false,
  color = "#556B2F",
}: WaveProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""} ${className}`}
    >
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

export function OrganicBlob({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M300 50C450 50 550 150 550 300C550 450 450 550 300 550C150 550 50 450 50 300C50 150 150 50 300 50Z"
        fill="#556B2F"
        opacity="0.15"
      />
    </svg>
  );
}
