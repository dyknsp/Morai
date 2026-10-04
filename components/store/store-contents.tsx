"use client";

import Image from "next/image";
import Link from "next/link";
import products from "@/content/products.json";
import type { Product } from "@/lib/content";
import { useStore } from "@/components/store/store-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductActions } from "@/components/products/product-actions";
import { Trash2 } from "lucide-react";
import { assetPath } from "@/lib/site";

const items = products as Product[];
const priceFormatter = new Intl.NumberFormat("ru-RU");

export function StoreContents({ mode }: { mode: "cart" | "favorites" }) {
  const { cart, favorites, removeFromCart } = useStore();
  const selected = mode === "cart"
    ? items.filter((product) => cart[product.slug])
    : items.filter((product) => favorites.includes(product.slug));

  if (selected.length === 0) {
    return (
      <div className="empty-state">
        <h2>{mode === "cart" ? "Корзина пока пуста" : "В избранном пока пусто"}</h2>
        <p>Выберите аромат из каталога, чтобы он появился здесь.</p>
        <Link className={buttonVariants()} href="/catalog">Перейти в каталог</Link>
      </div>
    );
  }

  const total = selected.reduce((sum, product) => sum + product.price * (cart[product.slug] ?? 1), 0);

  function requestOrder() {
    const lines = selected.map((product) => {
      const count = cart[product.slug] ?? 1;
      return `• ${product.name} — ${count} шт. × ${priceFormatter.format(product.price)} ₽`;
    });
    const message = [
      "Здравствуйте! Хочу уточнить заказ в MORAI AROMA:",
      ...lines,
      `Предварительная сумма по сайту: ${priceFormatter.format(total)} ₽.`,
      "Пожалуйста, подтвердите наличие, формат и условия доставки.",
    ].join("\n");

    window.open(`https://t.me/morai_aroma?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="store-list">
      {selected.map((product) => (
        <article className="store-row" key={product.slug}>
          <Link className="store-row-image" href={"/catalog/" + product.slug}>
            <Image src={assetPath(product.image)} alt="" fill sizes="92px" />
          </Link>
          <div className="store-row-copy">
            <Link className="product-title" href={"/catalog/" + product.slug}>{product.name}</Link>
            <p>от {priceFormatter.format(product.price)} ₽ · {mode === "cart" ? "Количество: " + cart[product.slug] : "В избранном"}</p>
          </div>
          <div className="store-row-actions">
            <strong>{priceFormatter.format(product.price * (cart[product.slug] ?? 1))} ₽</strong>
            {mode === "cart" ? (
              <Button type="button" variant="secondary" size="icon" aria-label={"Убрать " + product.shortName + " из корзины"} onClick={() => removeFromCart(product.slug)}>
                <Trash2 size={16} />
              </Button>
            ) : <ProductActions slug={product.slug} name={product.name} />}
          </div>
        </article>
      ))}
      {mode === "cart" && (
        <div className="cart-total">
          <strong>Итого: {priceFormatter.format(total)} ₽</strong>
          <Button onClick={requestOrder}>Заказать в Telegram</Button>
          <p>В Telegram откроется черновик заказа. Наличие, формат, доставка и итоговая сумма подтверждаются с консультантом.</p>
        </div>
      )}
    </div>
  );
}
