import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@/styles/globals.css";
import { ShopChrome } from "@/components/layout/shop-chrome";
import { CartToastProvider } from "@/features/cart/toast";
import { AuthProvider } from "@/components/providers/auth-provider";
import { siteConfig } from "@/config/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: [
      { url: siteConfig.icons.favicon, sizes: "any" },
      { url: siteConfig.icons.icon16, sizes: "16x16", type: "image/png" },
      { url: siteConfig.icons.icon32, sizes: "32x32", type: "image/png" },
      { url: siteConfig.icons.icon48, sizes: "48x48", type: "image/png" },
      { url: siteConfig.icons.icon192, sizes: "192x192", type: "image/png" },
      { url: siteConfig.icons.icon512, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: siteConfig.icons.apple, sizes: "180x180", type: "image/png" },
    ],
    shortcut: siteConfig.icons.favicon,
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartToastProvider>
            <ShopChrome>
              <main className="flex-1">{children}</main>
            </ShopChrome>
          </CartToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
