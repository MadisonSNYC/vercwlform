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
      <path d="M21 8V5h-3a2 2 0 0 0-2 2v1.5a.5.5 0 0 1-1 0V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-1.5a.5.5 0 0 1 1 0V19a2 2 0 0 0 2 2h3v-3" />
      <path d="M16 17v-5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2Z" />
    </svg>
  )
}
