import { execFileSync } from "node:child_process";
import products from "../content/products.json" with { type: "json" };
import collections from "../content/collections.json" with { type: "json" };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const key = process.env.INDEXNOW_KEY;

if (!siteUrl || new URL(siteUrl).protocol !== "https:") {
  console.error("Set NEXT_PUBLIC_SITE_URL to the deployed HTTPS site URL.");
  process.exit(1);
}

if (!key) {
  console.error("INDEXNOW_KEY is required.");
  process.exit(1);
}

const base = process.env.DEPLOY_BASE;
const head = process.env.DEPLOY_HEAD || "HEAD";
let changed = [];

if (base && !/^0+$/.test(base)) {
  try {
    changed = execFileSync("git", ["diff", "--name-only", base + "...", head], { encoding: "utf8" })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    changed = [];
  }
}

const urls = new Set();
for (const file of changed) {
  if (file === "app/page.tsx" || file.startsWith("components/sections/") || file === "content/home.json") urls.add(siteUrl + "/");
  if (file === "app/catalog/page.tsx" || file === "content/products.json") {
    urls.add(siteUrl + "/catalog");
    for (const product of products) urls.add(siteUrl + "/catalog/" + product.slug);
  }
  if (file === "app/collections/[slug]/page.tsx" || file === "content/collections.json") {
    for (const collection of collections) urls.add(siteUrl + "/collections/" + collection.slug);
  }
  if (file === "app/about/page.tsx") urls.add(siteUrl + "/about");
  if (file === "app/delivery/page.tsx") urls.add(siteUrl + "/delivery");
  if (file === "app/contacts/page.tsx" || file === "content/navigation.json") urls.add(siteUrl + "/contacts");
  if (file === "app/blog/page.tsx" || file.startsWith("content/blog/")) urls.add(siteUrl + "/blog");
  if (file.startsWith("content/blog/") && file.endsWith(".mdx")) {
    urls.add(siteUrl + "/blog/" + file.split("/").at(-1).replace(/\.mdx$/, ""));
  }
}

if (urls.size === 0) urls.add(siteUrl + "/");
if (urls.size > 10000) throw new Error("IndexNow allows up to 10,000 URLs per request.");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(siteUrl).host,
    key,
    keyLocation: siteUrl + "/" + key + ".txt",
    urlList: [...urls],
  }),
});

if (!response.ok) {
  throw new Error("IndexNow returned HTTP " + response.status + ": " + await response.text());
}
console.log("IndexNow accepted " + urls.size + " updated URL(s).");
