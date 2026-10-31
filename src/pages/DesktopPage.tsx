import type { ReactNode } from 'react'

/** Shared page wrapper for future desktop views and app pages. */
export default function DesktopPage({ children }: { children: ReactNode }) {
  return <div className="desktop-page">{children}</div>
}
