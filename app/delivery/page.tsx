import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import brand from "@/content/brand.json";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Доставка и оплата",
  "Условия доставки и оплаты парфюмерии MORAI AROMA. Подтвердите детали заказа с консультантом.",
  "/delivery",
);

export default function DeliveryPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Доставка и оплата", path: "/delivery" }]} />
      <section className="shell page-content">
        <header className="page-heading"><p className="eyebrow">Покупателям</p><h1>Доставка и оплата</h1><p>Выберите удобный способ получения заказа. Если ваш город или сумма заказа не указаны ниже, напишите мне — договоримся об условиях индивидуально.</p></header>
        <div className="contact-grid">
          {brand.shipping.map((detail) => (
            <Card key={detail.title}><CardContent className="contact-card"><span className="eyebrow">MORAI AROMA</span><h2>{detail.title}</h2><p>{detail.text}</p></CardContent></Card>
          ))}
        </div>
        <p className="shipping-note">{brand.shippingNote}</p>
        <div className="delivery-contact"><p>Текущую коллекцию и наличие можно посмотреть в профиле или уточнить у меня.</p><Link href="/contacts">Связаться с MORAI AROMA <ArrowRight size={16} /></Link></div>
      </section>
    </>
  );
}
