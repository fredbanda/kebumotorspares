import { Product } from "@/lib/catalog";

export function mapDbProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    costPrice: p.costPrice ?? undefined,
    rating: 5,
    stock: p.active ? 1 : 0,
    sku: p.sku,
    badge: undefined,
    description: p.description ?? "",
    image: p.imageUrl ?? "",
    active: p.active,
  };
}
