import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import home from "@/content/home.json";
import { assetPath } from "@/lib/site";

export function AboutTeaser() {
  return (
    <section className="about-teaser">
      <Image src={assetPath("/images/owl-eye.jpg")} alt="" fill sizes="100vw" />
      <div className="about-overlay" />
      <div className="shell about-content">
        <p className="eyebrow">О бренде</p>
        <h2>MORAI AROMA</h2>
        <p>{home.brandStory}</p>
        <Link className="text-link" href="/about">Познакомиться с брендом <ArrowRight size={16} /></Link>
      </div>
      <span className="about-signature" aria-hidden="true">MORAI<br /><small>AROMA</small></span>
    </section>
  );
}
