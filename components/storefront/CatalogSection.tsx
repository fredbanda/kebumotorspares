import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import { categories, Product, Special } from '@/lib/catalog'
import { ProductCard } from './ProductCard'
import { Pagination } from './Pagination'

interface CatalogSectionProps {
  filtered: Product[]
  allFiltered: Product[]
  specials: Special[]
  category: string
  query: string
  wishlist: string[]
  onCategoryChange: (category: string) => void
  onQueryChange: (query: string) => void
  onWish: (id: string) => void
  onView: (product: Product) => void
  onAdd: (product: Product) => void
  onManageInventory: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CatalogSection({
  filtered,
  allFiltered,
  specials,
  category,
  query,
  wishlist,
  onCategoryChange,
  onQueryChange,
  onWish,
  onView,
  onAdd,
  onManageInventory,
  currentPage,
  totalPages,
  onPageChange,
}: CatalogSectionProps) {
  return (
    <section className="catalog-section" id="catalog">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE GARAGE</p>
          <h2>Find your edge.</h2>
        </div>
      </div>

      <div className="category-bar">
        <div className="category-scroll">
          {['All parts', ...categories].map((item) => (
            <button
              key={item}
              className={category === item ? 'active' : ''}
              onClick={() => onCategoryChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="search-filter">
          <div className="search-box">
            <Search />
            <input
              id="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search parts"
            />
          </div>
          <button className="filter-button">
            <SlidersHorizontal /> Filter
          </button>
        </div>
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            special={specials.find((s) => s.productId === product.id)}
            wished={wishlist.includes(product.id)}
            onWish={() => onWish(product.id)}
            onView={() => onView(product)}
            onAdd={() => onAdd(product)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">No parts match that search. Try another term.</div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  )
}
