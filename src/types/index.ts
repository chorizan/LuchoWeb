export interface ProductBenefit {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  price: number;
  salePrice?: number;
  mainImage: string;
  category: string;
  categorySlug: string;
  tags: string[];
  weight?: string;
  origin?: string;
  brand?: string;
  brandLogo?: string;
  highlights?: string[];
  sku: string;
  stock: number;
  benefits: ProductBenefit[];
  uses?: string[];
  nutritionalInfo?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  blockPurchaseWhenOutOfStock?: boolean;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  sortOrder?: number;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
}

export interface FavoriteItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface NavItem {
  href: string;
  label: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  district: string;
  province: string;
  department: string;
  reference?: string;
  notes?: string;
  deliveryMethod: "pickup" | "standard" | "express";
  paymentMethod: "transfer" | "cash_on_delivery";
}
