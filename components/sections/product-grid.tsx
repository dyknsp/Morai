import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/content";
import { ProductCard } from "@/components/products/product-card";

export async function ProductGrid({ limit = 5 }: { limit?: number }) {
  const products = (await getProducts()).slice(0, limit);
  return (
    <div className="section-stack">
      <div className="section-heading section-heading-row">
        <div>
          <p className="eyebrow">Популярные ароматы</p>
          <h2>Бестселлеры</h2>
        </div>
        <Link className="text-link" href="/catalog">Весь каталог <ArrowRight size={16} /></Link>
      </div>
      <div className="product-grid">
        {products.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </div>
  );
}
