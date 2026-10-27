# Specials Layer Implementation

## Overview
A complete "Specials" management system has been added to the store admin, allowing admins to create and manage product specials with a red sticker badge showing original price (crossed out), sale price, and discount percentage. Related products can be added to each special and displayed on the product detail page.

## Database Schema

### New Tables

#### `special` (specials)
- `id` (UUID, PK)
- `productId` (UUID, FK to Product)
- `originalPrice` (Float) - Regular product price
- `salePrice` (Float) - Discounted price
- `discountPercentage` (Float) - Auto-calculated (can be overridden)
- `active` (Boolean, default: true)
- `startsAt` (DateTime, optional)
- `endsAt` (DateTime, optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### `special_related_product` (special_related_products)
- `id` (UUID, PK)
- `specialId` (UUID, FK to Special)
- `productId` (UUID, FK to Product)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Updated Tables

#### `product`
- Added relations:
  - `specials` - One-to-many with Special table
  - `relatedProducts` - Many-to-many with Special table through special_related_products

## API Endpoints

### Specials Management

#### `GET /api/admin/specials`
Retrieves all specials with product and related product details
```json
{
  "id": "uuid",
  "productId": "uuid",
  "originalPrice": 299.99,
  "salePrice": 199.99,
  "discountPercentage": 33.3,
  "active": true,
  "startsAt": "2026-11-01T00:00:00Z",
  "endsAt": "2026-11-30T23:59:59Z",
  "product": {
    "id": "uuid",
    "name": "Product Name",
    "price": 299.99,
    "imageUrl": "..."
  },
  "relatedProducts": [...]
}
```

#### `POST /api/admin/specials`
Create a new special
```json
{
  "productId": "uuid",
  "originalPrice": 299.99,
  "salePrice": 199.99,
  "discountPercentage": 33.3,
  "active": true,
  "startsAt": "2026-11-01T00:00:00Z",
  "endsAt": "2026-11-30T23:59:59Z"
}
```

#### `PATCH /api/admin/specials`
Update an existing special
```json
{
  "id": "uuid",
  "originalPrice": 299.99,
  "salePrice": 199.99,
  "discountPercentage": 33.3,
  "active": false,
  "startsAt": "2026-11-01T00:00:00Z",
  "endsAt": "2026-11-30T23:59:59Z"
}
```

#### `DELETE /api/admin/specials?id=<special-id>`
Delete a special and its related products

### Related Products Management

#### `POST /api/admin/specials/related`
Add a related product to a special
```json
{
  "specialId": "uuid",
  "productId": "uuid"
}
```

#### `DELETE /api/admin/specials/related?id=<related-product-id>`
Remove a related product from a special

## Components

### 1. `SpecialBadge.tsx`
Displays the red sticker badge with:
- Original price (struck through)
- "No" label (Portuguese for "Now")
- Sale price (prominent)
- Discount percentage

**Props:**
```typescript
{
  originalPrice: number
  salePrice: number
  discountPercentage: number
  className?: string
}
```

### 2. `SpecialsManager.tsx`
Full-featured admin interface for managing specials:
- Create/edit/delete specials
- Auto-calculate discount percentage from prices
- Manage related products
- Set active status and date ranges

**Features:**
- Form validation
- Real-time discount calculation
- Related products picker
- Visual status badges

### 3. Updated `ProductCard.tsx`
- Added `special` prop (optional)
- Shows `SpecialBadge` if special is active
- Displays sale price instead of regular price

**Props:**
```typescript
{
  product: Product
  special?: Special  // NEW
  wished: boolean
  onWish: () => void
  onView: () => void
  onAdd: () => void
}
```

### 4. Updated `ProductDetail.tsx`
- Added `special` and `relatedProducts` props
- Shows `SpecialBadge` on detail page
- Displays savings amount
- Shows related products section at bottom

**Props:**
```typescript
{
  product: Product
  special?: Special  // NEW
  relatedProducts?: Product[]  // NEW
  wished: boolean
  onWish: () => void
  onAdd: () => void
  onViewProduct?: (product: Product) => void  // NEW
  onBack: () => void
}
```

### 5. Updated `AdminView.tsx`
- Added "Specials" tab with `Sparkles` icon
- Integrated `SpecialsManager` component
- Tab order: Products → Orders → Returns → Sales → Inventory → Discounts → Promotions → **Specials** → Customers

## Type Definitions

### `lib/catalog.ts`

```typescript
export type Special = {
  id: string
  productId: string
  originalPrice: number
  salePrice: number
  discountPercentage: number
  active: boolean
  startsAt?: string
  endsAt?: string
  relatedProductIds?: string[]
}
```

## Styling

### CSS Classes

**Special Badge:**
- `.special-badge` - Main container
- `.special-badge-content` - Content wrapper
- `.special-badge-old` - Original price area
- `.strikethrough` - Struck-through text
- `.special-badge-new` - Sale price area
- `.discount-label` - "No" text
- `.new-price` - Sale price display
- `.discount-percent` - Percentage display
- `.product-special` - Badge on product card
- `.detail-special` - Badge on detail page

**Related Products:**
- `.related-products-section` - Container
- `.related-products-grid` - Grid layout (3 columns)
- `.related-product-item` - Individual item
- `.related-product-image` - Image container
- `.related-product-info` - Info section

**Specials Manager:**
- `.specials-manager` - Main container
- `.specials-header` - Header with title and button
- `.special-form` - Form container
- `.form-group` - Form field group
- `.form-actions` - Form buttons
- `.specials-list` - List of specials
- `.special-card` - Individual special card
- `.special-card-header` - Card header
- `.special-card-prices` - Price display
- `.related-products` - Related products section
- `.icon-button` - Icon buttons (edit/delete)

### Colors
- Primary red: `#ef3b31`
- Savings green: `#22c55e`
- Strikethrough: `var(--muted-foreground)`

## Database Migration Steps

```bash
# 1. Run Prisma migration
pnpm prisma migrate dev

# 2. Generate Prisma Client
pnpm prisma generate

# 3. (Optional) Seed with sample data
pnpm prisma db seed
```

## Usage Workflow

### As Admin:
1. Navigate to Store Admin → **Specials** tab
2. Click **Create Special**
3. Select a product
4. Enter original and sale prices (discount % auto-calculates)
5. Set active status and date range (optional)
6. Add related products using the picker
7. Save

### On Storefront:
1. **Product Grid:** Red sticker badge shows sale price with strikethrough original
2. **Product Detail:** 
   - Larger badge display
   - Savings amount highlighted in green
   - Related products carousel at bottom

## Example Usage in Components

### Fetching Specials with Products:
```typescript
// In a page or component
const response = await fetch('/api/admin/specials')
const specials = await response.json()

// Find special for a product
const productSpecial = specials.find(s => s.productId === product.id)
const relatedProductIds = productSpecial?.relatedProductIds || []
const relatedProducts = products.filter(p => relatedProductIds.includes(p.id))

// Render with props
<ProductDetail
  product={product}
  special={productSpecial}
  relatedProducts={relatedProducts}
  {...otherProps}
/>
```

## Notes

- Discount percentage is auto-calculated from prices but can be manually adjusted
- Date ranges are optional; leave blank for always-active specials
- Related products must be different from the main product
- Deleting a special cascades and removes all its related product associations
- Specials are sorted newest first
- All prices are in ZAR (South African Rand)

## Future Enhancements

- Bulk special creation/editing
- Special templates
- Special analytics (views, conversion rate)
- Automatic special expiration notifications
- Special scheduling with drafts
- Related products analytics
