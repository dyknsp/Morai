import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/products/product-card";
import { getCollection, getCollections, getCollectionProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { assetPath } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getCollections()).map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return pageMetadata("Коллекция не найдена", "Страница коллекции не найдена.", "/catalog");
  return pageMetadata(collection.title + " — коллекция ароматов", collection.description, "/collections/" + slug, collection.image);
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();
  const products = await getCollectionProducts(slug);

  return (
    <>
      <Breadcrumbs items={[{ name: "Коллекции", path: "/#collections" }, { name: collection.title, path: "/collections/" + slug }]} />
      <section className="shell page-content">
        <div className="collection-cover">
          <Image src={assetPath(collection.image)} alt="" fill sizes="100vw" priority />
          <div><p className="eyebrow">MORAI AROMA</p><h1>{collection.title}</h1><p>{collection.description}</p></div>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard product={product} key={product.slug} />)}
        </div>
        {products.length === 0 && <p className="empty-state">Коллекция скоро пополнится.</p>}
      </section>
    </>
  );
}
