# Specials Feature - Visual Reference Guide

## 🎨 Red Sticker Badge Design

### Location on Product Card
```
┌─ Product Card ────────────────────┐
│  ┌──────────────────────────────┐  │
│  │ Product Image                │  │
│  │  ┌──────────┐                │  │
│  │  │   R299   │ ← Red Sticker   │  │
│  │  │    No    │   (Top-left)    │  │
│  │  │  R199.99 │                │  │
│  │  │  -34%    │                │  │
│  │  └──────────┘                │  │
│  │  ♡ (wishlist)                │  │
│  └──────────────────────────────┘  │
│ Product Name                       │
│ Category | ★★★★★ 4.8             │
│ R199.99  [+]                       │
└───────────────────────────────────┘
```

### Location on Product Detail
```
┌─ Product Detail Page ──────────────────────────┐
│                                                │
│ ← Back to parts                                │
│                                                │
│ ┌──────────────────┐  ┌─────────────────────┐ │
│ │                  │  │ Engine / SKU-123    │ │
│ │  Product Image   │  │ Product Name        │ │
│ │  ┌──────────┐    │  │ ★★★★★ 4.8 (18...)  │ │
│ │  │   R299   │    │  │                     │ │
│ │  │    No    │    │  │ Product description │
│ │  │  R199.99 │    │  │ ...                 │ │
│ │  │  -34%    │    │  │ R199.99             │ │
│ │  └──────────┘    │  │ ✓ You save R100     │ │
│ │                  │  │   (50%)             │ │
│ │                  │  │                     │ │
│ └──────────────────┘  │ ✓ In stock - ships  │
│                       │   today             │ │
│                       │ [Add to cart] [♡]   │ │
│                       │ Fitment checker...  │ │
│                       └─────────────────────┘ │
│                                                │
│ ─── Related Products ───                       │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│ │ Image   │  │ Image   │  │ Image   │        │
│ │ Product │  │ Product │  │ Product │        │
│ │ Category│  │ Category│  │ Category│        │
│ │ R199.99 │  │ R149.99 │  │ R249.99 │        │
│ └─────────┘  └─────────┘  └─────────┘        │
│                                                │
└────────────────────────────────────────────────┘
```

## 📱 Admin Interface - Specials Tab

### Tab Navigation
```
┌─ Store Admin Tabs ──────────────────────────────────────────┐
│ Products | Orders | Returns | Sales | Inventory | Discounts │ Promotions | [Specials] | Customers
└─────────────────────────────────────────────────────────────┘
```

### Create Special Form
```
┌─ CREATE SPECIAL FORM ─────────────────────────────────────┐
│                                                            │
│ Product *                                                  │
│ [▼ Select a product: Brake Pads (R299.99)       ]         │
│                                                            │
│ Original Price *                  Sale Price *            │
│ [299.99       ]                   [199.99       ]         │
│                                                            │
│ Discount Percentage               Active                  │
│ [34.4%        ] (disabled)        [☑ checked]             │
│                                                            │
│ Starts At                         Ends At                  │
│ [2026-11-01 ──:── ]              [2026-11-30 ──:── ]      │
│                                                            │
│ [📥 Save Special]  [✕ Cancel]                             │
│                                                            │
└─ Pricing Calculation Information ────────────────────────┘
│                                                            │
│ Original:    R 299.99                                      │
│ Sale:        R 199.99                                      │
│ Savings:     R 100.00                                      │
│ Discount %:  33.4%                                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Specials List View
```
┌─ SPECIALS LIST ───────────────────────────────────────────┐
│                                                            │
│ ┌─ Brake Pads ──────────────────────────────────────────┐ │
│ │ R299.99  →  R199.99  -34%           [✎ Edit] [✕ Del] │ │
│ │ Active | Jan 1 - Jan 31, 2026                         │ │
│ │                                                        │ │
│ │ RELATED PRODUCTS:                                      │ │
│ │ ✓ Brake Fluid (R45.99)          [✕]                   │ │
│ │ ✓ Brake Cleaner (R25.50)        [✕]                   │ │
│ │                                                        │ │
│ │ [▼ Add related product: Choose...    ]                │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ ┌─ Oil Filter ──────────────────────────────────────────┐ │
│ │ R89.99  →  R59.99  -33%             [✎ Edit] [✕ Del] │ │
│ │ Draft | Jan 10 - Jan 20, 2026                         │ │
│ │                                                        │ │
│ │ RELATED PRODUCTS:                                      │ │
│ │ ✓ Engine Oil 5W-30 (R199.99)    [✕]                   │ │
│ │                                                        │ │
│ │ [▼ Add related product: Choose...    ]                │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 🔄 User Journey

### Admin Creating a Special

```
1. NAVIGATE
   Store Admin → Specials tab

2. CREATE BUTTON
   Click "Create Special"
   ↓
   Form appears

3. SELECT PRODUCT
   Choose product from dropdown
   Original price auto-fills
   Sale price auto-fills (80% default)
   Discount % auto-calculates
   ↓

4. ADJUST PRICES (Optional)
   Change sale price
   Discount % updates automatically
   ↓

5. SET DATES (Optional)
   Starts At: 2026-11-01
   Ends At: 2026-11-30
   ↓

6. TOGGLE ACTIVE
   Checkbox for active status
   ↓

7. ADD RELATED PRODUCTS
   Click dropdown
   Select related products one by one
   (e.g., Brake Fluid, Brake Cleaner)
   ↓

8. SAVE
   Click "Save Special"
   Special created in database
   Related products linked
   ↓

9. VERIFY
   Navigate to storefront
   View product
   See red badge with special pricing
   See related products section
```

### Customer Viewing Special

```
1. BROWSE PRODUCTS
   Visit catalog
   ↓
   See red badge "R299 No R199 -33%"

2. VIEW PRODUCT CARD
   Badge shows:
   - Original price (struck through)
   - "No" (Portuguese for "Now")
   - Sale price (prominent)
   - Discount percentage

3. CLICK PRODUCT
   Navigate to product detail
   ↓

4. VIEW DETAIL PAGE
   See larger red badge
   See green "You save R100 (33%)"
   Browse related products

5. VIEW RELATED PRODUCTS
   See 3-column grid with:
   - Product image
   - Product name
   - Category
   - Regular price

6. CLICK RELATED PRODUCT
   Navigate to that product's detail
   See its own pricing/specials
```

## 💾 Database Structure Visualization

```
┌────────────────────────────────────────────────────────────┐
│                         PRODUCTS                           │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ id | name | slug | price | imageUrl | active | ...  │   │
│ │ 1  │ Brake Pads │ ... │ 299.99 │ ... │ true │ ...   │   │
│ │ 2  │ Oil Filter │ ... │ 89.99  │ ... │ true │ ...   │   │
│ └──────────────────────────────────────────────────────┘   │
│                          ↓ (relation)                       │
├────────────────────────────────────────────────────────────┤
│                         SPECIALS                           │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ id | productId | originalPrice | salePrice | ... |  │   │
│ │ a  │ 1          │ 299.99        │ 199.99   │ ... │  │   │
│ │ b  │ 2          │ 89.99         │ 59.99    │ ... │  │   │
│ └──────────────────────────────────────────────────────┘   │
│                          ↓ (relation)                       │
├────────────────────────────────────────────────────────────┤
│                 SPECIAL_RELATED_PRODUCTS                   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ id | specialId | productId │ createdAt │ updatedAt  │   │
│ │ 1  │ a          │ 5         │ ... │ ... │            │   │
│ │ 2  │ a          │ 7         │ ... │ ... │            │   │
│ │ 3  │ b          │ 3         │ ... │ ... │            │   │
│ └──────────────────────────────────────────────────────┘   │
│                          ↓ (relation)                       │
│                     Related PRODUCTS                        │
│              (Fluid, Cleaner, Oil, etc.)                    │
└────────────────────────────────────────────────────────────┘
```

## 🎯 Key Styling Elements

### Colors
- **Red Badge Background:** `#ef3b31` (error/alert red)
- **Savings Green:** `#22c55e` (success green)
- **Text:** White on badge, matches theme otherwise
- **Shadow:** `rgba(239, 59, 49, 0.3)` on badge

### Typography
- **Badge Label:** 10px, bold, letter-spaced
- **Original Price:** 10px, muted, struck-through
- **"No" Label:** 10px bold
- **Sale Price:** 14px, bold (most prominent)
- **Discount %:** 12px, bold

### Layout
- **Badge Position:** Absolute, top-left of image
- **Badge Size:** ~80px width, vertical stack
- **Related Products:** 3-column grid (responsive)
- **Border Radius:** 4px on badge and form elements
- **Spacing:** 12-24px gaps between elements

---

## 🚀 Next Steps

1. **Run Migration:** `pnpm prisma migrate dev`
2. **Start App:** `pnpm dev`
3. **Test Admin:** Create a special in Store Admin
4. **Verify Storefront:** View product with badge
5. **Test Related:** Add related products and verify display

---

**Version:** 1.0  
**Last Updated:** 2026-10-27  
**Status:** Ready to Deploy
