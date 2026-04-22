import type { Product } from "@/lib/products-data";

export interface DbProductRow {
  id: string;
  slug: string;
  name: string;
  category: "tricycle" | "moto" | "piece";
  subcategory: string | null;
  price: number | string;
  old_price: number | string | null;
  description: string;
  short_description: string;
  specifications: unknown;
  features: unknown;
  images: unknown;
  in_stock: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  rating: number | string;
  reviews: number;
}

export function mapDbProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    description: row.description,
    shortDescription: row.short_description,
    specifications: (row.specifications as { label: string; value: string }[]) ?? [],
    features: (row.features as string[]) ?? [],
    images: (row.images as string[]) ?? [],
    inStock: row.in_stock,
    isBestSeller: row.is_best_seller,
    isNew: row.is_new,
    rating: Number(row.rating),
    reviews: row.reviews,
  };
}
