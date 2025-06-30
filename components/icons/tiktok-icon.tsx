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
      <path d="M21 8v2h-3V8h3ZM12.5 8H10v8c0 2.76 2.24 5 5 5h2v-3h-2c-1.66 0-3-1.34-3-3V8z" />
      <path d="M12 3v18" />
      <path d="M16 3v18" />
      <path d="M8 3v18" />
    </svg>
  )
}
