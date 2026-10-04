import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const products = JSON.parse(readFileSync(join(root, "content/products.json"), "utf8"));
const collections = JSON.parse(readFileSync(join(root, "content/collections.json"), "utf8"));
const reviews = JSON.parse(readFileSync(join(root, "content/reviews.json"), "utf8"));

function uniqueSlugs(items) {
  const slugs = items.map((item) => item.slug);
  assert.equal(new Set(slugs).size, slugs.length, "slugs must be unique");
}

test("product data has unique slugs and local images", () => {
  uniqueSlugs(products);
  for (const product of products) {
    assert.ok(product.name && product.price > 0);
    assert.ok(existsSync(join(root, "public", product.image.replace(/^\//, ""))), product.image);
  }
});

test("collections have unique slugs and local images", () => {
  uniqueSlugs(collections);
  for (const collection of collections) {
    assert.ok(existsSync(join(root, "public", collection.image.replace(/^\//, ""))), collection.image);
  }
});

test("reviews use valid ratings and blog posts declare the required metadata", () => {
  assert.ok(reviews.every((review) => review.rating >= 1 && review.rating <= 5));
  const articles = readdirSync(join(root, "content/blog")).filter((file) => file.endsWith(".mdx"));
  assert.ok(articles.length > 0);
  for (const article of articles) {
    const source = readFileSync(join(root, "content/blog", article), "utf8");
    for (const field of ["title", "description", "publishedAt", "featuredImage", "categories"]) {
      assert.match(source, new RegExp("^" + field + ":", "m"), article + " missing " + field);
    }
  }
});
