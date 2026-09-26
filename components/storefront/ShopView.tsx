import { Product } from '@/lib/catalog'
import { CatalogSection } from './CatalogSection'
import { FeatureBanner } from './FeatureBanner'
import { Hero } from './Hero'
import { TrustRow } from './TrustRow'

interface ShopViewProps {
  filtered: Product[]
  category: string
  query: string
  wishlist: string[]
  onCategoryChange: (category: string) => void
  onQueryChange: (query: string) => void
  onWish: (id: string) => void
  onView: (product: Product) => void
  onAdd: (product: Product) => void
  onManageInventory: () => void
}

export function ShopView(props: ShopViewProps) {
  return (
    <main>
      <Hero />
      <TrustRow />
      <CatalogSection {...props} />
      <FeatureBanner onCtaClick={() => {}} />
    </main>
  )
}
