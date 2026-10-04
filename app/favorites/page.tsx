import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { StoreContents } from "@/components/store/store-contents";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Избранное", "Сохранённые ароматы MORAI AROMA.", "/favorites");

export default function FavoritesPage() {
  return <><Breadcrumbs items={[{ name: "Избранное", path: "/favorites" }]} /><section className="shell page-content"><header className="page-heading"><p className="eyebrow">Сохранённые ароматы</p><h1>Избранное</h1></header><StoreContents mode="favorites" /></section></>;
}
