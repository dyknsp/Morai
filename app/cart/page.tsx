import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { StoreContents } from "@/components/store/store-contents";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("Корзина", "Ароматы, выбранные вами в MORAI AROMA.", "/cart");

export default function CartPage() {
  return <><Breadcrumbs items={[{ name: "Корзина", path: "/cart" }]} /><section className="shell page-content"><header className="page-heading"><p className="eyebrow">Ваш выбор</p><h1>Корзина</h1></header><StoreContents mode="cart" /></section></>;
}
