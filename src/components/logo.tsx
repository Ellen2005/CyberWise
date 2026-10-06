import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * CyberWise monogram: a "C" arc cradling a "W" cut from the same continuous
 * gesture — "see the threat, decide wisely." Renders on light and dark themes.
 */
const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradientId = `cw-g-${rawId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={cn("size-6", className)}
      role="img"
      aria-label="CyberWise logo"
      {...props}
    >
      <title>CyberWise</title>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="15" fill={`url(#${gradientId})`} />
      {/* C arc, opening to the right */}
      <path
        d="M44 21 A17 17 0 1 0 44 43"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* W nested in the opening */}
      <polyline
        points="26,26 30,38 34,29 38,38 42,26"
        fill="none"
        stroke="#5EEAD4"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
