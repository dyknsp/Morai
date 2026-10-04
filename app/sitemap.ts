import type { MetadataRoute } from "next";
import { getBlogPosts, getCollections, getProducts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, posts] = await Promise.all([getProducts(), getCollections(), getBlogPosts()]);
  const pages = ["/", "/catalog", "/about", "/delivery", "/contacts", "/blog"];
  return [
    ...pages.map((path) => ({ url: absoluteUrl(path), lastModified: new Date(), changeFrequency: "weekly" as const })),
    ...products.map((product) => ({ url: absoluteUrl("/catalog/" + product.slug), lastModified: new Date(), changeFrequency: "weekly" as const })),
    ...collections.map((collection) => ({ url: absoluteUrl("/collections/" + collection.slug), lastModified: new Date(), changeFrequency: "weekly" as const })),
    ...posts.map((post) => ({ url: absoluteUrl("/blog/" + post.slug), lastModified: new Date(post.publishedAt), changeFrequency: "monthly" as const })),
  ];
}
