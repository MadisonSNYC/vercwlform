import type React from "react"

export function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8V5h-3V2h-3v3h-3v3h3v3h3v-3h3z" />
      <path d="M12 3v18" />
      <path d="M12 3h-3a6 6 0 0 0-6 6v3a6 6 0 0 0 6 6h3" />
    </svg>
  )
}
