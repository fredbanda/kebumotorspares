'use client'

import { useEffect, useMemo, useState } from 'react'
import { createAuthClient } from 'better-auth/client'
import { CartLine, Product } from '@/lib/catalog'
import { useProducts } from '@/components/products/ProductProvider'

const authClient = createAuthClient()

export type View = 'shop' | 'product' | 'cart' | 'checkout'

export function useStorefront({ initialProducts }: { initialProducts?: Product[] }) {
  const { products: contextProducts, setProducts, addProduct: addProductToContext } = useProducts()
  const [category, setCategory] = useState('All parts')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [view, setView] = useState<View>('shop')
  const [selected, setSelected] = useState<Product | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [session, setSession] = useState<{ user: { id: string; name?: string | null; email: string } } | null>(null)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    if (initialProducts && contextProducts.length === 0) {
      setProducts(initialProducts)
    }
    authClient.getSession().then(({ data }) => setSession(data as typeof session))
  }, [])

  async function signOut() {
    await authClient.signOut()
    setSession(null)
    setView('shop')
  }

  const products = contextProducts

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === 'All parts' || p.category === category) &&
          p.name.toLowerCase().includes(query.toLowerCase())
      ),
    [products, category, query]
  )

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)
  const cartTotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0)

  function addToCart(product: Product) {
    setCart((lines) => {
      const found = lines.find((line) => line.product.id === product.id)
      return found
        ? lines.map((line) =>
            line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line
          )
        : [...lines, { product, quantity: 1 }]
    })
    setNotice(`${product.name} added to cart`)
    setTimeout(() => setNotice(''), 2200)
  }

  function toggleWish(id: string) {
    setWishlist((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
    )
  }

  function showProduct(product: Product) {
    setSelected(product)
    setView('product')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateCartLine(id: string, quantity: number) {
    setCart((lines) =>
      lines.map((line) => (line.product.id === id ? { ...line, quantity } : line)).filter((line) => line.quantity > 0)
    )
  }

  async function addProduct(product: Omit<Product, 'id'>) {
    try {
      const newProduct = await addProductToContext(product)
      if (newProduct) {
        setView('shop')
        setNotice('Product added to inventory')
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return {
    products,
    setProducts,
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
  }
}
