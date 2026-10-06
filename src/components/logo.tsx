import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * WiseTap mark: a bold "W" for Wise, struck at its middle vertex by a tap
 * point with a ripple arc — "think before you tap." Renders on light and
 * dark themes. WiseTap is a CyberWise learning project.
 */
const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradientId = `wt-g-${rawId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={cn("size-6", className)}
      role="img"
      aria-label="WiseTap logo"
      {...props}
    >
      <title>WiseTap</title>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="15" fill={`url(#${gradientId})`} />
      {/* ripple arc above the tap point */}
      <path
        d="M22 18 A13 13 0 0 1 42 18"
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* W */}
      <path
        d="M16 22 L24 44 L32 28 L40 44 L48 22"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* tap point on the middle vertex */}
      <circle cx="32" cy="28" r="4.5" fill="#5EEAD4" />
    </svg>
  );
};

export default Logo;
