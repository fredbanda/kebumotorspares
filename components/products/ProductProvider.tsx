'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { Product } from '@/lib/catalog'

type ProductContextType = {
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])

  async function addProduct(product: Omit<Product, 'id'>) {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })
      if (!res.ok) throw new Error('Failed to add product')
      const raw = await res.json()
      const newProduct: Product = {
        id: raw.id,
        name: raw.name,
        category: raw.category,
        price: raw.price,
        costPrice: raw.costPrice ?? undefined,
        rating: 5,
        stock: raw.active ? 1 : 0,
        sku: raw.sku,
        badge: undefined,
        description: raw.description ?? '',
        image: raw.imageUrl ?? '',
        active: raw.active,
      }
      setProducts((prev) => [newProduct, ...prev])
      return newProduct
    } catch (error) {
      console.error('Error adding product:', error)
      return null
    }
  }

  return (
    <ProductContext.Provider value={{ products, setProducts, addProduct }}>
      {children}
    </ProductContext.Provider>
  )
}
