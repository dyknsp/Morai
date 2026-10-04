import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  brand: string;
  price: number;
  image: string;
  collection: string;
  featured: boolean;
  description: string;
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

export type Review = {
  name: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  featuredImage: string;
  categories: string[];
  content: string;
};

const contentDir = path.join(process.cwd(), "content");

export async function getProducts(): Promise<Product[]> {
  return (await import("@/content/products.json")).default as Product[];
}

export async function getCollections(): Promise<Collection[]> {
  return (await import("@/content/collections.json")).default as Collection[];
}

export async function getReviews(): Promise<Review[]> {
  return (await import("@/content/reviews.json")).default as Review[];
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug);
}

export async function getCollection(slug: string) {
  return (await getCollections()).find((collection) => collection.slug === slug);
}

export async function getCollectionProducts(slug: string) {
  const products = await getProducts();
  if (slug === "gift") return products.slice(0, 3);
  return products.filter((product) => product.collection === slug);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const directory = path.join(contentDir, "blog");
  const files = (await fs.readdir(directory)).filter((file) => file.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const source = await fs.readFile(path.join(directory, file), "utf8");
      const { content, data } = matter(source);
      return { slug: file.replace(/\.mdx$/, ""), content, ...data } as BlogPost;
    }),
  );
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getBlogPost(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}
