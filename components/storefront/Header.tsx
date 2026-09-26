import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'

const navItems = ['Shop parts', 'Performance', 'Brands', 'How it works']

interface HeaderProps {
  cartCount: number
  mobileOpen: boolean
  onToggleMobile: () => void
  onLogoClick: () => void
  onCartClick: () => void
  onAccountClick: () => void
  session?: { user: { name?: string | null; email: string } } | null
}

export function Header({ cartCount, mobileOpen, onToggleMobile, onLogoClick, onCartClick, onAccountClick, session }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="mobile-menu" aria-label="Open menu" onClick={onToggleMobile}>
          {mobileOpen ? <X /> : <Menu />}
        </button>

        <button className="wordmark" onClick={onLogoClick}>
          KEBU MOTOR PARTS
        </button>

        <nav className={mobileOpen ? 'main-nav mobile-visible' : 'main-nav'}>
          {navItems.map((item) => (
            <button key={item} onClick={onLogoClick}>
              {item}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button aria-label="Search" onClick={() => document.getElementById('search')?.focus()}>
            <Search />
          </button>
          <button aria-label="Account" onClick={onAccountClick} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <UserRound />
            {session?.user && <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user.name ?? session.user.email.split('@')[0]}</span>}
          </button>
          <button className="cart-button" aria-label={`Cart with ${cartCount} items`} onClick={onCartClick}>
            <ShoppingBag />
            <b>{cartCount}</b>
          </button>
        </div>
      </div>
    </header>
  )
}
