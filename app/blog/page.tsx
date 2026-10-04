import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { assetPath } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Журнал об ароматах",
  "Статьи MORAI AROMA о парфюмерии, выборе ароматов и личном стиле.",
  "/blog",
);

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <Breadcrumbs items={[{ name: "Журнал", path: "/blog" }]} />
      <section className="shell page-content">
        <header className="page-heading"><p className="eyebrow">Журнал MORAI AROMA</p><h1>Заметки об ароматах</h1><p>Разговор о парфюмерии, выборе композиций и деталях, которые помогают найти свой аромат.</p></header>
        <div className="blog-grid">
          {posts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <Link className="blog-image" href={"/blog/" + post.slug}>
                <Image src={assetPath(post.featuredImage)} alt="" fill sizes="(max-width: 700px) 90vw, 45vw" />
              </Link>
              <div className="blog-card-copy">
                <div className="blog-categories">{post.categories.map((category) => <Badge key={category}>{category}</Badge>)}</div>
                <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("ru-RU")}</time>
                <Link href={"/blog/" + post.slug}><h2>{post.title}</h2></Link>
                <p>{post.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
