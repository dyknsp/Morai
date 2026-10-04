"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/store/store-provider";

export function ProductActions({ slug, name }: { slug: string; name: string }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const favorite = isFavorite(slug);

  return (
    <div className="product-actions">
      <Button type="button" onClick={() => addToCart(slug)}>
        <ShoppingBag size={16} /> В корзину
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label={favorite ? "Убрать из избранного: " + name : "Добавить в избранное: " + name}
        aria-pressed={favorite}
        onClick={() => toggleFavorite(slug)}
      >
        <Heart size={17} fill={favorite ? "currentColor" : "none"} />
      </Button>
    </div>
  );
}
