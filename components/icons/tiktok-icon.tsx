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
      <path d="M21 8v6c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2z" />
      <path d="M12 10v4" />
      <path d="M9 10v4" />
      <path d="M15 10v4" />
      <path d="M12 6v2" />
      <path d="M9 6v2" />
      <path d="M15 6v2" />
      <path d="M12 16v2" />
      <path d="M9 16v2" />
      <path d="M15 16v2" />
    </svg>
  )
}
