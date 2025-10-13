import type { CSSProperties } from 'react'

interface StarLogoProps {
  className?: string
  style?: CSSProperties
}

export function StarLogo({ className, style }: StarLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Star shape */}
      <path d="M50 10 L61 38 L90 38 L67 55 L77 83 L50 66 L23 83 L33 55 L10 38 L39 38 Z" />

      <text
        x="50"
        y="56"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
        fill="white"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        M
      </text>
    </svg>
  )
}
