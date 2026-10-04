import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductActions } from "@/components/products/product-actions";
import { getProduct, getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { assetPath } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
const money = new Intl.NumberFormat("ru-RU");

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return pageMetadata("Товар не найден", "Страница товара не найдена.", "/catalog");
  return pageMetadata(product.name, product.description, "/catalog/" + slug, product.image);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return (
    <>
      <Breadcrumbs items={[{ name: "Каталог", path: "/catalog" }, { name: product.shortName, path: "/catalog/" + slug }]} />
      <section className="shell product-detail">
        <div className="product-detail-image"><Image src={assetPath(product.image)} alt={product.name} fill sizes="(max-width: 700px) 100vw, 50vw" priority /></div>
        <div className="product-detail-copy">
          <p className="eyebrow">{product.brand}</p>
          <h1>{product.shortName}</h1>
          <p>{product.description}</p>
          <strong className="product-detail-price">от {money.format(product.price)} ₽</strong>
          <ProductActions slug={product.slug} name={product.name} />
          <p className="detail-note">Актуальную стоимость и доступный объём можно уточнить у консультанта.</p>
        </div>
      </section>
    </>
  );
}
