import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import brand from "@/content/brand.json";
import { pageMetadata } from "@/lib/seo";
import { assetPath } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "О бренде MORAI AROMA",
  "История MORAI AROMA: духи ручной работы небольшими партиями, масляные ароматы и диффузоры.",
  "/about",
  "/images/owl-eye.jpg",
);

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "О бренде", path: "/about" }]} />
      <section className="shell page-content">
        <header className="page-heading brand-intro">
          <p className="eyebrow">История MORAI AROMA</p>
          <h1>Аромат — это личная история</h1>
          <p>{brand.intro}</p>
        </header>

        <div className="article-cover brand-cover">
          <Image src={assetPath("/images/owl-eye.jpg")} alt="Атмосфера бренда MORAI AROMA" fill sizes="100vw" priority />
        </div>

        <div className="brand-story article-body">
          <h2>Небольшие партии, внимание к деталям</h2>
          <p>{brand.story}</p>
          <p>{brand.positioning}</p>
          <p>Для меня MORAI AROMA — это возможность делиться любимым парфюмерным настроением и лично отвечать на вопросы. Буду рада помочь вам с выбором.</p>
        </div>

        <section className="brand-values section-space">
          <div className="section-heading">
            <p className="eyebrow">Наш подход</p>
            <h2>Что важно в MORAI AROMA</h2>
          </div>
          <ul>
            {brand.features.map((feature) => (
              <li key={feature}><Check size={17} aria-hidden="true" /><span>{feature}</span></li>
            ))}
          </ul>
        </section>

        <section className="brand-formats">
          <div className="section-heading">
            <p className="eyebrow">Ассортимент</p>
            <h2>Выберите свой формат</h2>
          </div>
          <div className="format-grid">
            {brand.formats.map((format) => (
              <Card key={format.name}>
                <CardContent className="format-card">
                  <span className="eyebrow">MORAI AROMA</span>
                  <h3>{format.name}</h3>
                  <p>{format.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="brand-small-note">Текущую коллекцию, объёмы и наличие публикую в профиле. Напишите мне — расскажу о нотах и помогу подобрать аромат.</p>
          <div className="brand-cta">
            <Link className={buttonVariants()} href="/contacts">Спросить о коллекции <ArrowRight size={16} /></Link>
            <Link className={buttonVariants({ variant: "secondary" })} href="/delivery">Условия доставки</Link>
          </div>
        </section>
      </section>
    </>
  );
}
