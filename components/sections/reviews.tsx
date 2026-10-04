import Image from "next/image";
import { Star } from "lucide-react";
import { getReviews } from "@/lib/content";
import { absoluteUrl, assetPath } from "@/lib/site";
import { JsonLd } from "@/lib/json-ld";

export async function Reviews() {
  const reviews = await getReviews();
  const structuredReviews = reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: review.name },
    datePublished: review.date,
    reviewBody: review.text,
    reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    itemReviewed: { "@type": "Organization", name: "MORAI AROMA", url: absoluteUrl("/") },
  }));

  return (
    <section className="reviews-section section-space">
      <JsonLd data={structuredReviews} />
      <div className="shell section-stack">
        <div className="section-heading">
          <p className="eyebrow">Отзывы</p>
          <h2>Что говорят о нас</h2>
        </div>
        <div className="review-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="review-author">
                <Image src={assetPath(review.avatar)} alt="" width={44} height={44} />
                <div><strong>{review.name}</strong><time dateTime={review.date}>{new Date(review.date).toLocaleDateString("ru-RU")}</time></div>
              </div>
              <p>{review.text}</p>
              <div className="review-stars" aria-label={"Оценка " + review.rating + " из 5"}>
                {Array.from({ length: review.rating }, (_, index) => <Star size={14} fill="currentColor" key={index} />)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
