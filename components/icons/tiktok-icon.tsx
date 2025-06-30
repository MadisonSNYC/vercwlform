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
      <path d="M9 12v6a2 2 0 0 0 2 2h4v-6a2 2 0 0 0-2-2H9z" />
      <path d="M12 10V4a2 2 0 0 1 2-2h4v6a2 2 0 0 1-2 2h-4z" />
    </svg>
  )
}
