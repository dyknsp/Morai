"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import home from "@/content/home.json";
import { Button, buttonVariants } from "@/components/ui/button";
import { assetPath } from "@/lib/site";

const slides = home.slides;

export function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  const change = (delta: number) => setActive((index) => (index + delta + slides.length) % slides.length);
  const slide = slides[active];

  return (
    <section className="hero" aria-label="Главный баннер">
      <Image
        key={slide.image}
        className={active === 1 ? "hero-image hero-image--portrait" : "hero-image"}
        src={assetPath(slide.image)}
        alt=""
        fill
        priority={active === 0}
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="hero-shade" />
      <div className="shell hero-content" key={slide.title}>
        <p className="eyebrow">{slide.eyebrow}</p>
        <h1>{slide.title}</h1>
        <p className="hero-copy">{slide.text}</p>
        <Link className={buttonVariants({ className: "hero-button" })} href={slide.href}>
          {slide.action}<ArrowRight size={16} />
        </Link>
      </div>
      <div className="shell hero-controls">
        <span>{String(active + 1).padStart(2, "0")} <i>/ {String(slides.length).padStart(2, "0")}</i></span>
        <div className="hero-arrows">
          <Button type="button" variant="secondary" size="icon" aria-label="Предыдущий слайд" onClick={() => change(-1)}><ArrowLeft size={16} /></Button>
          <Button type="button" variant="secondary" size="icon" aria-label="Следующий слайд" onClick={() => change(1)}><ArrowRight size={16} /></Button>
        </div>
      </div>
    </section>
  );
}
