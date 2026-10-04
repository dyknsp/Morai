import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { ProductActions } from "@/components/products/product-actions";
import { assetPath } from "@/lib/site";

const priceFormatter = new Intl.NumberFormat("ru-RU");

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="product-card">
      <Link className="product-image-wrap" href={"/catalog/" + product.slug}>
        <Image src={assetPath(product.image)} alt={product.name} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw" />
      </Link>
      <div className="product-card-copy">
        <p className="eyebrow">{product.brand}</p>
        <Link className="product-title" href={"/catalog/" + product.slug}>{product.shortName}</Link>
        <div className="product-price-row">
          <span>от {priceFormatter.format(product.price)} ₽</span>
          <ProductActions slug={product.slug} name={product.name} />
        </div>
      </div>
    </Card>
  );
}
