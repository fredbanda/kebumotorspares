'use client'

import { useRouter } from 'next/navigation'
import { AuthModal } from './storefront/AuthModal'
import { CartView } from './storefront/CartView'
import { CheckoutView } from './storefront/CheckoutView'
import { Header } from './storefront/Header'
import { ProductDetail } from './storefront/ProductDetail'
import { ShopView } from './storefront/ShopView'
import { Ticker } from './storefront/Ticker'
import { useStorefront } from './storefront/hooks/useStorefront'

export function Storefront({ initialProducts, initialCategory }: { initialProducts?: import('@/lib/catalog').Product[]; initialCategory?: string }) {
  const storefront = useStorefront({ initialProducts, initialCategory })
  const { selected } = storefront

  const router = useRouter()

  function handleAccountClick() {
    if (storefront.session) {
      storefront.signOut()
    } else {
      storefront.setAuthOpen(true)
    }
  }

  function handleCheckout() {
    if (!storefront.session) {
      storefront.setAuthOpen(true)
    } else {
      storefront.setView('checkout')
    }
  }

  function handlePaymentSuccess() {
    storefront.setCart([])
    storefront.setView('shop')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Ticker />

      <Header
        cartCount={storefront.cartCount}
        mobileOpen={storefront.mobileOpen}
        onToggleMobile={() => storefront.setMobileOpen(!storefront.mobileOpen)}
        onLogoClick={() => { storefront.setView('shop'); storefront.setMobileOpen(false) }}
        onCartClick={() => storefront.setView('cart')}
        onAccountClick={handleAccountClick}
        session={storefront.session}
      />

      {storefront.view === 'shop' && (
        <ShopView
          filtered={storefront.filtered}
          category={storefront.category}
          query={storefront.query}
          wishlist={storefront.wishlist}
          onCategoryChange={storefront.setCategory}
          onQueryChange={storefront.setQuery}
          onWish={storefront.toggleWish}
          onView={storefront.showProduct}
          onAdd={storefront.addToCart}
          onManageInventory={() => router.push('/store-admin')}
        />
      )}

      {storefront.view === 'product' && selected ? (
        <ProductDetail
          product={selected}
          wished={storefront.wishlist.includes(selected.id)}
          onWish={() => storefront.toggleWish(selected.id)}
          onAdd={() => storefront.addToCart(selected)}
          onBack={() => storefront.setView('shop')}
        />
      ) : null}

      {storefront.view === 'cart' && (
        <CartView
          cart={storefront.cart}
          total={storefront.cartTotal}
          onBack={() => storefront.setView('shop')}
          onChange={storefront.updateCartLine}
          onCheckout={handleCheckout}
        />
      )}

      {storefront.view === 'checkout' && storefront.session && (
        <CheckoutView
          cart={storefront.cart}
          total={storefront.cartTotal}
          userId={storefront.session.user.id}
          onBack={() => storefront.setView('cart')}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {storefront.authOpen && (
        <AuthModal
          onClose={() => storefront.setAuthOpen(false)}
          onSuccess={async () => {
            const { createAuthClient } = await import('better-auth/client')
            const client = createAuthClient()
            const { data } = await client.getSession()
            storefront.setSession(data as typeof storefront.session)
            storefront.setAuthOpen(false)
          }}
        />
      )}

      {storefront.notice && (
        <div className="toast" role="status">
          {storefront.notice}
        </div>
      )}
    </div>
  )
}
