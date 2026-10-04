import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import navigation from "@/content/navigation.json";
import { pageMetadata } from "@/lib/seo";
import { FeedbackForm } from "@/components/contacts/feedback-form";

export const metadata: Metadata = pageMetadata(
  "Контакты MORAI AROMA",
  "Свяжитесь с консультантами MORAI AROMA, чтобы уточнить наличие парфюмерии и получить помощь с выбором.",
  "/contacts",
);

export default function ContactsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Контакты", path: "/contacts" }]} />
      <section className="shell page-content">
        <header className="page-heading"><p className="eyebrow">Мы на связи</p><h1>Контакты</h1><p>Напишите нам, чтобы уточнить наличие, доступные объёмы и условия доставки.</p></header>
        <div className="contact-grid">
          {navigation.social.map((item) => (
            <a className="contact-card" href={item.href} key={item.label} target="_blank" rel="noreferrer">
              <span className="eyebrow">MORAI AROMA</span><h2>{item.label}</h2><p>Связаться с консультантом</p><ArrowUpRight size={18} color="var(--primary)" />
            </a>
          ))}
          <Link className="contact-card" href="/delivery"><span className="eyebrow">Информация</span><h2>Доставка и оплата</h2><p>Условия заказа и доставки парфюмерии.</p><ArrowUpRight size={18} color="var(--primary)" /></Link>
        </div>
        <FeedbackForm />
      </section>
    </>
  );
}
