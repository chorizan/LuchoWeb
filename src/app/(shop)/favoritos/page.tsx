import { getPublishedProducts } from "@/lib/catalog";
import FavoritosClient from "./favoritos-client";

export default async function FavoritosPage() {
  const products = await getPublishedProducts();
  return <FavoritosClient products={products} />;
}
