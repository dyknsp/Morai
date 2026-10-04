import type { Metadata } from "next";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { JsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, assetPath, siteName } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getBlogPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return pageMetadata("Статья не найдена", "Статья не найдена.", "/blog");
  return pageMetadata(post.title, post.description, "/blog/" + slug, post.featuredImage);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const url = absoluteUrl("/blog/" + slug);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    image: absoluteUrl(post.featuredImage),
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
    articleSection: post.categories,
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <Breadcrumbs items={[{ name: "Журнал", path: "/blog" }, { name: post.title, path: "/blog/" + slug }]} />
      <article className="shell page-content">
        <header className="page-heading">
          <div className="blog-categories">{post.categories.map((category) => <Badge key={category}>{category}</Badge>)}</div>
          <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("ru-RU")}</time>
          <h1>{post.title}</h1><p>{post.description}</p>
        </header>
        <div className="article-cover"><Image src={assetPath(post.featuredImage)} alt="" fill sizes="100vw" priority /></div>
        <div className="article-body"><MDXRemote source={post.content} /></div>
      </article>
    </>
  );
}
