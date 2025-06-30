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
      <path d="M21 8v2c0 4.418-3.582 8-8 8h-2V8h2c4.418 0 8-3.582 8-8z" />
      <path d="M12 8v10H3V8h9z" />
    </svg>
  )
}
