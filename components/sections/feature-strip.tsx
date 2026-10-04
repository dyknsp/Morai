import { Gem, Gift, PackageCheck, Sparkles } from "lucide-react";
import home from "@/content/home.json";

const icons = [Gem, Gift, PackageCheck, Sparkles];

export function FeatureStrip() {
  return (
    <section className="feature-strip" aria-label="Преимущества">
      <div className="shell feature-grid">
        {home.features.map((feature, index) => {
          const Icon = icons[index];
          return (
            <article className="feature-item" key={feature.title}>
              <span className="feature-icon"><Icon size={19} strokeWidth={1.4} /></span>
              <div>
                <h2>{feature.title}</h2>
                <p>{feature.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
