'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthModal } from './storefront/AuthModal'
import { CartView } from './storefront/CartView'
import { CheckoutView } from './storefront/CheckoutView'
import { Header } from './storefront/Header'
import { ProductDetail } from './storefront/ProductDetail'
import { ShopView } from './storefront/ShopView'
import { Ticker } from './storefront/Ticker'
import { useStorefront } from './storefront/hooks/useStorefront'

export function Storefront({ initialProducts, initialSpecials, initialCategory }: { initialProducts?: import('@/lib/catalog').Product[]; initialSpecials?: import('@/lib/catalog').Special[]; initialCategory?: string }) {
  const storefront = useStorefront({ initialProducts, initialSpecials, initialCategory })
  const { selected, setCart, setView, setNotice } = storefront

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const payment = searchParams.get('payment')
    if (!payment) return

    if (payment === 'success') {
      setCart([])
      setView('shop')
      setNotice('Payment submitted. Your order will be confirmed shortly.')
    } else if (payment === 'cancelled') {
      setView('cart')
      setNotice('Payment cancelled. You can try again.')
    }

    const t = setTimeout(() => setNotice(''), 4000)
    router.replace('/', { scroll: false })
    return () => clearTimeout(t)
  }, [searchParams, router, setCart, setView, setNotice])

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
          allFiltered={storefront.allFiltered}
          specials={storefront.specials}
          category={storefront.category}
          query={storefront.query}
          wishlist={storefront.wishlist}
          onCategoryChange={storefront.setCategory}
          onQueryChange={storefront.setQuery}
          onWish={storefront.toggleWish}
          onView={storefront.showProduct}
          onAdd={storefront.addToCart}
          onManageInventory={() => router.push('/store-admin')}
          currentPage={storefront.currentPage}
          totalPages={storefront.totalPages}
          onPageChange={storefront.setPage}
        />
      )}

      {storefront.view === 'product' && selected ? (
        <ProductDetail
          product={selected}
          special={storefront.specials.find((s) => s.productId === selected.id)}
          wished={storefront.wishlist.includes(selected.id)}
          inCart={storefront.cart.some((line) => line.product.id === selected.id)}
          onWish={() => storefront.toggleWish(selected.id)}
          onAdd={() => storefront.addToCart(selected)}
          onGoToCart={() => storefront.setView('cart')}
          onContinueShopping={() => storefront.setView('shop')}
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
          onSuccess={() => {
            storefront.setCart([])
            storefront.setView('shop')
          }}
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
