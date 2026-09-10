import type { Product, Category } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Sales Gourmet",
    slug: "sales-gourmet",
    image: "/products/sal-de-maras.png",
    description: "Sales artesanales del Perú y el mundo",
  },
  {
    id: "2",
    name: "Endulzantes Naturales",
    slug: "endulzantes-naturales",
    image: "/products/panela-organica-dulce-vida.png",
    description: "Panela orgánica y azúcares sin refinar",
  },
  {
    id: "3",
    name: "Cafés de Especialidad",
    slug: "cafes",
    image: "/products/cafe-mountain.png",
    description: "Granos seleccionados de altura",
  },
];

export const products: Product[] = [
  {
    id: "sal-de-maras",
    name: "Sal de Maras Gourmet",
    slug: "sal-de-maras",
    shortDesc: "Sal rosada milenaria de los Incas — Cusco, Perú",
    longDesc:
      "La Sal de Maras es un tesoro gastronómico del Perú, extraída desde la época inca de las salineras de Maras en el Valle Sagrado de Cusco. Cada cristal es evaporado naturalmente por el sol andino y recolectado a mano por familias locales que preservan una tradición milenaria. Su tono rosado proviene de los minerales naturales del suelo, lo que le confiere un sabor único y complejo, ideal para realzar cualquier preparación gourmet.",
    price: 45,
    mainImage: "/products/sal-de-maras.png",
    category: "Sales Gourmet",
    categorySlug: "sales-gourmet",
    tags: ["Natural", "Gourmet", "Cusco", "Artesanal"],
    weight: "1 kg",
    origin: "Maras, Cusco — Perú",
    sku: "MARAS-001",
    stock: 50,
    benefits: [
      {
        title: "Rica en minerales naturales",
        description:
          "Contiene calcio, magnesio, hierro y zinc en formas biodisponibles que el cuerpo absorbe mejor que la sal refinada.",
      },
      {
        title: "Sin aditivos químicos",
        description:
          "No contiene antiaglomerantes, yoduro artificial ni blanqueadores. Es sal pura tal como la naturaleza la creó.",
      },
      {
        title: "Menor contenido de sodio",
        description:
          "Por su estructura cristalina y mineral, se percibe más sabrosa con menos cantidad, ayudando a reducir el consumo de sodio.",
      },
      {
        title: "Tradición inca milenaria",
        description:
          "Producida en las mismas terrazas de evaporación usadas desde el Imperio Inca, patrimonio cultural vivo del Perú.",
      },
      {
        title: "Apoyo a comunidades andinas",
        description:
          "Cada compra beneficia directamente a las familias productoras de Maras que mantienen viva esta tradición ancestral.",
      },
      {
        title: "Versatilidad gourmet",
        description:
          "Ideal para carnes, pescados, ensaladas, postres y cócteles. Realza sabores sin enmascararlos.",
      },
    ],
    uses: [
      "Sazonar carnes y pescados a la parrilla",
      "Finishing salt en ensaladas y verduras",
      "Rim de cócteles premium",
      "Repostería y chocolates artesanales",
      "Conservas y salmueras naturales",
    ],
    nutritionalInfo: [
      "100% sal de maras natural",
      "Sin gluten",
      "Sin conservantes",
      "Grano semigrueso",
      "Evaporación solar",
    ],
  },
  {
    id: "panela-organica",
    name: "Panela Orgánica",
    slug: "panela-organica",
    brand: "Dulce & Vida",
    brandLogo: "/brand/logo-dulce-vida.png",
    shortDesc: "Energía natural — sin refinar, sin aditivos — 1 kg",
    longDesc:
      "Panela orgánica elaborada de forma artesanal a partir del jugo de caña de azúcar, sin procesos químicos, conservando todos sus nutrientes naturales. Un endulzante con sabor profundo y origen limpio, directo del campo a tu mesa.",
    price: 58,
    mainImage: "/products/panela-organica-dulce-vida.png",
    category: "Endulzantes Naturales",
    categorySlug: "endulzantes-naturales",
    tags: [
      "100% Natural",
      "Orgánico",
      "Artesanal",
      "Sostenible",
      "Hecho en Perú",
    ],
    highlights: ["Energía Natural", "Sin Refinar", "Sin Aditivos"],
    weight: "1 kg",
    origin: "Perú — Hecho en Perú",
    sku: "DV-PAN-001",
    stock: 60,
    benefits: [
      {
        title: "Rica en minerales y antioxidantes",
        description:
          "Conserva trazas de calcio, magnesio, potasio e hierro propias del jugo de caña, además de compuestos antioxidantes de la melaza natural.",
      },
      {
        title: "Producto orgánico y sostenible",
        description:
          "Elaborada sin agroquímicos ni procesos de blanqueamiento industrial. Un endulzante que respeta la tierra y quienes la cultivan.",
      },
      {
        title: "Directo del campo a tu mesa",
        description:
          "Proceso artesanal que evapora el jugo de caña lentamente, sin refinar ni añadir aditivos. Sabor auténtico, origen transparente.",
      },
      {
        title: "Sin refinar ni aditivos",
        description:
          "No contiene antiaglomerantes, colorantes ni edulcorantes artificiales. Panela pura tal como sale del trapiche artesanal.",
      },
      {
        title: "Energía natural",
        description:
          "Endulzante calórico de origen vegetal, ideal para quienes buscan alternativas al azúcar blanco refinado en su cocina diaria.",
      },
      {
        title: "Hecho en Perú",
        description:
          "Producto peruano elaborado con caña de azúcar local, apoyando la cadena productiva nacional y la tradición latinoamericana de la panela.",
      },
    ],
    uses: [
      "Endulzar café, té, jugos y bebidas calientes",
      "Repostería: tortas, galletas, panes y postres",
      "Salsas, aderezos y marinados caseros",
      "Bebidas artesanales y cócteles",
      "Cocina tradicional peruana y latinoamericana",
    ],
    nutritionalInfo: [
      "100% jugo de caña deshidratado",
      "Sin refinar",
      "Sin aditivos químicos",
      "Orgánico y artesanal",
      "Presentación: 1 kg",
    ],
  },
  {
    id: "panela-pura",
    name: "Panela Pura Orgánica",
    slug: "panela-pura",
    shortDesc: "Jugo de caña deshidratado 100% natural — 454g",
    longDesc:
      "La panela es el endulzante natural por excelencia de América Latina. Elaborada mediante un proceso artesanal que evapora el jugo de caña de azúcar sin refinar, quemar ni blanquear, conserva todos sus nutrientes y un sabor caramelizado incomparable. Es la alternativa saludable al azúcar refinado, perfecta para quienes buscan endulzar de forma consciente.",
    price: 32,
    mainImage: "/products/panela.png",
    category: "Endulzantes Naturales",
    categorySlug: "endulzantes-naturales",
    tags: ["100% Natural", "Orgánico", "Sin refinar", "Artesanal"],
    weight: "454 g",
    origin: "Colombia — Proceso artesanal",
    sku: "PAN-001",
    stock: 80,
    benefits: [
      {
        title: "Fuente de minerales esenciales",
        description:
          "Aporta calcio, magnesio y potasio de forma natural, minerales que se pierden en el azúcar refinado industrial.",
      },
      {
        title: "Sin químicos de blanqueamiento",
        description:
          "No pasa por procesos de refinería ni decoloración. Es azúcar de caña en su estado más puro y nutritivo.",
      },
      {
        title: "Sabor caramelizado único",
        description:
          "Su proceso artesanal de evaporación lenta crea un perfil de sabor profundo con notas a caramelo y miel.",
      },
      {
        title: "Energía de liberación gradual",
        description:
          "Por contener micronutrientes, proporciona energía de forma más sostenida que el azúcar blanco refinado.",
      },
      {
        title: "Versatilidad culinaria",
        description:
          "Perfecta para café, té, repostería, salsas, bebidas calientes y postres tradicionales.",
      },
      {
        title: "Empaque biodegradable",
        description:
          "Envase exterior fabricado con caña de azúcar biodegradable, cuidando el planeta en cada detalle.",
      },
    ],
    uses: [
      "Endulzar café, té y bebidas calientes",
      "Repostería: tortas, galletas y panes",
      "Salsas y aderezos caseros",
      "Cócteles y bebidas artesanales",
      "Postres tradicionales latinoamericanos",
    ],
    nutritionalInfo: [
      "100% jugo de caña deshidratado",
      "Sin refinar ni blanquear",
      "Fuente de calcio, magnesio y potasio",
      "Sin gluten",
      "Proceso artesanal",
    ],
  },
  {
    id: "sal-marina-artesanal",
    name: "Sal Marina Artesanal",
    slug: "sal-marina-artesanal",
    shortDesc: "Sal marina virgen evaporada por viento y sol",
    longDesc:
      "Sal marina virgen obtenida exclusivamente por evaporación natural del agua de mar mediante la acción del viento y el sol. Recolectada y envasada a mano, sin procesos industriales que eliminen sus minerales traza.",
    price: 28,
    mainImage: "/products/sal-marina-artesanal.png",
    category: "Sales Gourmet",
    categorySlug: "sales-gourmet",
    tags: ["Virgen", "Artesanal", "Marina"],
    weight: "500 g",
    origin: "Costa — Perú",
    sku: "SMA-001",
    stock: 40,
    benefits: [
      {
        title: "Evaporación 100% natural",
        description: "Producida solo con viento y sol, sin intervención química.",
      },
      {
        title: "Recolección manual",
        description: "Cada grano es seleccionado y envasado a mano por artesanos.",
      },
      {
        title: "Minerales marinos",
        description: "Conserva los oligoelementos del océano en cada cristal.",
      },
    ],
    uses: ["Cocina diaria", "Marinados", "Conservas caseras"],
  },
  {
    id: "sal-de-roca",
    name: "Sal de Roca Premium",
    slug: "sal-de-roca",
    shortDesc: "Sal de roca de grano grueso para molinillo",
    longDesc:
      "Sal de roca de origen mineral, de grano grueso y cristalino. Ideal para molinillos de sal y para sazonar platos en el momento, liberando aroma y sabor en cada molienda.",
    price: 35,
    mainImage: "/products/sal-de-roca.png",
    category: "Sales Gourmet",
    categorySlug: "sales-gourmet",
    tags: ["Premium", "Grano grueso", "Gourmet"],
    weight: "330 g",
    origin: "México — Artesanal",
    sku: "SR-001",
    stock: 30,
    benefits: [
      {
        title: "Textura cristalina",
        description: "Grano grueso que se muele fresco, intensificando el sabor.",
      },
      {
        title: "Origen mineral puro",
        description: "Extraída de depósitos naturales sin procesamiento industrial.",
      },
    ],
    uses: ["Molinillo de sal", "Parrilla", "Verduras al horno"],
  },
  {
    id: "cafe-mountain",
    name: "Café Mountain Bean",
    slug: "cafe-mountain-bean",
    shortDesc: "Café de altura con notas florales y frutales",
    longDesc:
      "Café de especialidad cultivado en las montañas, con un perfil de taza complejo que combina notas florales, frutales y un cuerpo sedoso. Tostado artesanalmente para resaltar su origen.",
    price: 48,
    mainImage: "/products/cafe-mountain.png",
    category: "Cafés de Especialidad",
    categorySlug: "cafes",
    tags: ["Specialty", "Altura", "Tostado artesanal"],
    weight: "250 g",
    origin: "Montañas — Perú",
    sku: "CAF-001",
    stock: 25,
    benefits: [
      {
        title: "Grano de altura",
        description: "Cultivado sobre 1,800 msnm para mayor densidad y sabor.",
      },
      {
        title: "Tostado artesanal",
        description: "Perfil de taza equilibrado con notas florales y frutales.",
      },
    ],
    uses: ["Espresso", "Pour over", "French press", "Cold brew"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getPopularProducts(): Product[] {
  return products.filter((p) =>
    ["sal-de-maras", "panela-organica", "panela-pura"].includes(p.id)
  );
}

export function getRecommendedProducts(): Product[] {
  return products.filter((p) =>
    ["panela-organica", "sal-de-maras", "cafe-mountain"].includes(p.id)
  );
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.benefits.some(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      )
  );
}
