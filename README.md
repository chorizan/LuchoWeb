# Raíces & Artesanía — E-commerce Premium

Plataforma e-commerce premium para productos artesanales del Perú.

## Stack

- **Next.js 15** (App Router)
- **TypeScript** + **TailwindCSS 4**
- **Prisma** + **PostgreSQL**
- **Auth.js** + **Zustand** + **Framer Motion**
- **Shadcn/UI** patterns + **Supabase Storage**

## Inicio rápido

```bash
cp .env.example .env
npm install
npm run db:generate
npm run dev
```

## Arquitectura

```
src/
├── app/
│   ├── (admin)/admin/     # Panel administrativo protegido
│   ├── (shop)/            # Rutas públicas de la tienda
│   ├── (auth)/            # Login / registro
│   └── api/               # API routes
├── components/
│   ├── ui/                # Componentes base (Button, Input, Motion)
│   ├── layout/            # Header, Footer
│   └── sections/          # Secciones de página
├── features/              # Lógica por dominio (cart, products, orders)
├── hooks/                 # Custom hooks
├── actions/               # Server Actions
├── services/              # Servicios externos (Supabase, email)
├── lib/                   # Utilidades (prisma, utils)
├── config/                # Configuración del sitio
├── constants/             # Datos estáticos y tema
└── types/                 # Tipos TypeScript
```

## Paleta

| Color | Hex |
|-------|-----|
| Verde Oliva | `#556B2F` |
| Beige | `#F5F1E8` |
| Dorado | `#C9A227` |
| Oferta | `#D63C2F` |

## Fases de desarrollo

- [x] Fase 1-4: Arquitectura, carpetas, Prisma, rutas
- [x] Fase 6-8: Layout + Home con animaciones
- [ ] Fase 5: Autenticación Auth.js
- [ ] Fase 9: Catálogo de productos
- [ ] Fase 10: Carrito y checkout
- [ ] Fase 11: Panel administrativo
- [ ] Fase 12: Supabase Storage
- [ ] Fase 13-14: SEO, rendimiento, pruebas
