import type React from "react"
export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-background text-white">{children}</div>
}
