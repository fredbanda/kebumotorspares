'use client'

import { AdminView } from './storefront/AdminView'
import { AuthModal } from './storefront/AuthModal'
import { CartView } from './storefront/CartView'
import { CheckoutView } from './storefront/CheckoutView'
import { Header } from './storefront/Header'
import { ProductDetail } from './storefront/ProductDetail'
import { ShopView } from './storefront/ShopView'
import { Ticker } from './storefront/Ticker'
import { useStorefront } from './storefront/hooks/useStorefront'

export function Storefront() {
  const {
    products,
    category, setCategory,
    query, setQuery,
    cart, setCart,
    wishlist,
    view, setView,
    selected,
    mobileOpen, setMobileOpen,
    notice,
    filtered,
    cartCount,
    cartTotal,
    addToCart,
    toggleWish,
    showProduct,
    updateCartLine,
    addProduct,
    session, setSession,
    authOpen, setAuthOpen,
    signOut,
  } = useStorefront()

  function handleAccountClick() {
    if (session) {
      signOut()
    } else {
      setAuthOpen(true)
    }
  }

  function handleCheckout() {
    if (!session) {
      setAuthOpen(true)
    } else {
      setView('checkout')
    }
  }

  function handlePaymentSuccess() {
    setCart([])
    setView('shop')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Ticker />

      <Header
        cartCount={cartCount}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen(!mobileOpen)}
        onLogoClick={() => { setView('shop'); setMobileOpen(false) }}
        onCartClick={() => setView('cart')}
        onAccountClick={handleAccountClick}
        session={session}
      />

      {view === 'shop' && (
        <ShopView
          filtered={filtered}
          category={category}
          query={query}
          wishlist={wishlist}
          onCategoryChange={setCategory}
          onQueryChange={setQuery}
          onWish={toggleWish}
          onView={showProduct}
          onAdd={addToCart}
          onManageInventory={() => setView('admin')}
        />
      )}

      {view === 'product' && selected && (
        <ProductDetail
          product={selected}
          wished={wishlist.includes(selected.id)}
          onWish={() => toggleWish(selected.id)}
          onAdd={() => addToCart(selected)}
          onBack={() => setView('shop')}
        />
      )}

      {view === 'cart' && (
        <CartView
          cart={cart}
          total={cartTotal}
          onBack={() => setView('shop')}
          onChange={updateCartLine}
          onCheckout={handleCheckout}
        />
      )}

      {view === 'checkout' && session && (
        <CheckoutView
          cart={cart}
          total={cartTotal}
          userId={session.user.id}
          onBack={() => setView('cart')}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {view === 'admin' && (
        <AdminView
          initialProducts={products}
          initialOrders={[]}
          initialReturns={[]}
          initialSales={[]}
          initialDiscounts={[]}
          initialPromotions={[]}
          initialCustomers={[]}
        />
      )}

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={async () => {
            const { createAuthClient } = await import('better-auth/client')
            const client = createAuthClient()
            const { data } = await client.getSession()
            setSession(data as typeof session)
            setAuthOpen(false)
          }}
        />
      )}

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </div>
  )
}
