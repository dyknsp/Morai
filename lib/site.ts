export const siteName = "MORAI AROMA";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const basePath = process.env.GITHUB_PAGES === "true" ? "/Morai" : "";
export const siteDescription =
  "MORAI AROMA — селективная парфюмерия: уникальные композиции, характер в каждой ноте, доставка по всей России.";

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  const pathBase = new URL(siteUrl).pathname.replace(/\/$/, "");
  const isFile = /\/[^/]+\.[a-z\d]+$/i.test(normalizedPath);
  const routePath = isFile || normalizedPath === "/" ? normalizedPath : normalizedPath.replace(/\/$/, "") + "/";
  return new URL(pathBase + routePath, new URL(siteUrl).origin).toString();
}

export function assetPath(path: string) {
  if (/^(?:https?:)?\/\//.test(path)) return path;
  return basePath + (path.startsWith("/") ? path : "/" + path);
}
