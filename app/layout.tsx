import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { inter, playfair } from "@/lib/fonts";
import { absoluteUrl, assetPath, siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName + " — селективная парфюмерия", template: "%s | " + siteName },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName,
    title: siteName + " — селективная парфюмерия",
    description: siteDescription,
    url: absoluteUrl("/"),
    images: [{ url: absoluteUrl("/images/hero-og.jpg"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName + " — селективная парфюмерия",
    description: siteDescription,
    images: [absoluteUrl("/images/hero-og.jpg")],
  },
  icons: { icon: assetPath("/images/favicon.svg") },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080d09",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.variable + " " + playfair.variable}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
