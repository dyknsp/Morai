import type { MetadataRoute } from "next";
import { absoluteUrl, basePath, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const site = new URL(siteUrl);
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [basePath + "/cart", basePath + "/favorites"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.host,
  };
}
