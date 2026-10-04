import Link from "next/link";
import { breadcrumbJsonLd, type BreadcrumbItem } from "@/lib/seo";
import { JsonLd } from "@/lib/json-ld";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Главная", path: "/" }, ...items])} />
      <nav className="breadcrumbs shell" aria-label="Навигационная цепочка">
        <Link href="/">Главная</Link>
        {items.map((item) => (
          <span key={item.path}>
            <span aria-hidden="true">/</span>
            <Link href={item.path}>{item.name}</Link>
          </span>
        ))}
      </nav>
    </>
  );
}
