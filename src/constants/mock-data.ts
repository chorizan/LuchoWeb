import type { Feature, Testimonial } from "@/types";
import { getPopularProducts, getRecommendedProducts, categories } from "@/constants/products";

export const heroFeatures = [
  { icon: "leaf", label: "100% Natural" },
  { icon: "heart", label: "Hecho con amor" },
  { icon: "award", label: "Calidad premium" },
] as const;

export const features: Feature[] = [
  {
    icon: "bean",
    title: "Ingredientes seleccionados",
    description:
      "Sal de Maras y panela orgánica, seleccionados directamente de productores artesanales.",
  },
  {
    icon: "flame",
    title: "Proceso artesanal",
    description:
      "Evaporación solar, recolección manual y procesos ancestrales sin químicos.",
  },
  {
    icon: "users",
    title: "Maestros artesanos",
    description:
      "Trabajamos con familias productoras que preservan tradiciones milenarias.",
  },
  {
    icon: "home",
    title: "Beneficios naturales",
    description:
      "Productos ricos en minerales: calcio, magnesio, potasio y más de 80 oligoelementos.",
  },
];

export const popularProducts = getPopularProducts();
export const recommendedProducts = getRecommendedProducts();

export const featuredCategories = categories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  image: cat.image,
  description: cat.description,
}));

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "María González",
    role: "Cliente frecuente",
    content:
      "La Sal de Maras es incomparable. El sabor que le da a mis platos es único y se nota la calidad premium desde el primer uso.",
    rating: 5,
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    role: "Chef ejecutivo",
    content:
      "Uso la panela y la sal de Maras en mi restaurante. Mis clientes preguntan qué endulzante uso — el sabor caramelizado es excepcional.",
    rating: 5,
  },
  {
    id: "3",
    name: "Ana Torres",
    role: "Nutricionista",
    content:
      "Recomiendo estos productos por su contenido mineral. La sal de Maras y la panela son alternativas mucho más saludables.",
    rating: 5,
  },
];

export const instagramPosts = [
  "/products/sal-de-maras.png",
  "/products/panela.png",
  "/products/sal-marina-artesanal.png",
  "/products/sal-de-roca.png",
  "/products/cafe-mountain.png",
  "/products/sal-de-maras.png",
];
