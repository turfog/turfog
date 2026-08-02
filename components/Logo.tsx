import { cn } from "@/lib/utils";

// Drop your logo at public/logo.png (or public/logo.svg, then update this path).
// Best result: transparent PNG/SVG with colored artwork (visible on white).
const LOGO_SRC = "/logo.png";

interface LogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
  chip?: boolean;
}

export default function Logo({
  size = 32,
  className = "",
  priority = false,
  chip = false,
}: LogoProps) {
  const image = (
    <img
      src={LOGO_SRC}
      alt="Turfog"
      style={{ height: size, width: "auto" }}
      className="object-contain select-none block"
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      draggable={false}
    />
  );

  if (chip) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-2xl bg-white shadow-card",
          className
        )}
        style={{ padding: Math.round(size * 0.35) }}
      >
        {image}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>{image}</span>
  );
}