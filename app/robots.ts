import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const site = new URL(siteUrl);
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/favorites", "/admin", "/api"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.host,
  };
}
