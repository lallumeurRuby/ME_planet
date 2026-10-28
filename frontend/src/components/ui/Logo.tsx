import Link from 'next/link'

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link className="logo" href={href} aria-label="ME Planet 首頁">
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="7" fill="#dbe6ff" />
        <ellipse cx="16" cy="16" rx="14" ry="4.5" transform="rotate(-24 16 16)" stroke="#dbe6ff" strokeWidth="1.6" />
      </svg>
      Ruby Oz
    </Link>
  )
}
