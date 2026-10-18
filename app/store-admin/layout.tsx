import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export default async function StoreAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session || role !== 'admin') redirect('/admin-login')

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
