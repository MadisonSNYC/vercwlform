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
      <path d="M21 7.919v4.034A9.948 9.948 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2c2.41 0 4.648.81 6.419 2.188l-1.536 1.536A7.954 7.954 0 0 0 12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8c2.01 0 3.85-.74 5.26-1.966V7.919h-3.536V12h-2.464V7.919H12V4h3.536V7.919H21z" />
    </svg>
  )
}
