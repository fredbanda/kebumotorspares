import Link from 'next/link'

export default function StoreAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="admin-shell-header">
        <div className="admin-shell-inner">
          <Link href="/" className="admin-shell-logo">
            KEBU MOTOR PARTS
            <span>ADMIN</span>
          </Link>
          <nav className="admin-shell-nav">
            <Link href="/">← Back to store</Link>
          </nav>
        </div>
      </header>
      <div className="admin-shell-body">
        {children}
      </div>
    </div>
  )
}
