import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Каталог селективной парфюмерии",
  "Каталог MORAI AROMA: селективная парфюмерия для неё, для него и унисекс-композиции.",
  "/catalog",
);

export default async function CatalogPage() {
  const products = await getProducts();
  return (
    <>
      <Breadcrumbs items={[{ name: "Каталог", path: "/catalog" }]} />
      <section className="shell page-content">
        <header className="page-heading">
          <p className="eyebrow">MORAI AROMA</p>
          <h1>Каталог ароматов</h1>
          <p>Селективная парфюмерия и знаковые композиции. Наличие и доступные объёмы уточняйте у консультанта.</p>
        </header>
        <div className="product-grid">
          {products.map((product) => <ProductCard product={product} key={product.slug} />)}
        </div>
      </section>
    </>
  );
}
