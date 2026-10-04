import type { Metadata } from "next";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { FeatureStrip } from "@/components/sections/feature-strip";
import { HeroSlider } from "@/components/sections/hero-slider";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Reviews } from "@/components/sections/reviews";
import { JsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteDescription, siteName } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Селективная парфюмерия",
  siteDescription,
  "/",
);

export default function HomePage() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/favicon.svg"),
    image: absoluteUrl("/images/hero-og.jpg"),
    description: siteDescription,
    sameAs: ["https://vk.ru/morai_aroma", "https://t.me/morai_aroma"],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
    inLanguage: "ru-RU",
  };

  return (
    <>
      <JsonLd data={[organization, website]} />
      <HeroSlider />
      <FeatureStrip />
      <section className="section-space" id="collections">
        <div className="shell section-stack">
          <div className="section-heading">
            <p className="eyebrow">Коллекции MORAI AROMA</p>
            <h2>Найдите свой идеальный аромат</h2>
          </div>
          <CollectionGrid />
        </div>
      </section>
      <section className="section-space section-soft" id="catalog"><div className="shell"><ProductGrid /></div></section>
      <AboutTeaser />
      <Reviews />
      <Newsletter />
    </>
  );
}
