"use client";

import { useState, type FormEvent, type MouseEvent } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CheckoutItem = { slug: string; name: string; quantity: number; price: number };
const formatPrice = new Intl.NumberFormat("ru-RU");

export function CheckoutDialog({
  items,
  onClose,
  onComplete,
}: {
  items: CheckoutItem[];
  onClose: () => void;
  onComplete: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const values = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyName: values.get("familyName"),
          givenName: values.get("givenName"),
          phone: values.get("phone"),
          website: values.get("website"),
          items: items.map(({ slug, quantity }) => ({ slug, quantity })),
        }),
      });
      const result = (await response.json()) as { orderId?: string; error?: string };
      if (!response.ok || !result.orderId) throw new Error(result.error || "Не удалось оформить заказ.");
      setOrderId(result.orderId.slice(0, 8).toUpperCase());
      onComplete();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось оформить заказ. Попробуйте ещё раз.");
    } finally {
      setPending(false);
    }
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !pending) onClose();
  }

  return (
    <div className="checkout-backdrop" onClick={handleBackdropClick}>
      <section className="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="checkout-close" type="button" aria-label="Закрыть оформление" onClick={onClose} disabled={pending}>
          <X size={18} />
        </button>
        {orderId ? (
          <div className="checkout-success" role="status">
            <p className="eyebrow">Заказ принят</p>
            <h2 id="checkout-title">Спасибо за заказ</h2>
            <p>Заказ № {orderId} сохранён. Мы свяжемся с вами, чтобы подтвердить наличие и доставку.</p>
            <Button type="button" onClick={onClose}>Продолжить покупки</Button>
          </div>
        ) : (
          <>
            <button className="checkout-back" type="button" onClick={onClose} disabled={pending}>
              <ArrowLeft size={15} /> Вернуться в корзину
            </button>
            <p className="eyebrow">Оформление</p>
            <h2 id="checkout-title">Контактные данные</h2>
            <div className="checkout-summary">
              {items.map((item) => (
                <p key={item.slug}><span>{item.name} × {item.quantity}</span><strong>{formatPrice.format(item.price * item.quantity)} ₽</strong></p>
              ))}
              <p className="checkout-total"><span>Итого</span><strong>{formatPrice.format(total)} ₽</strong></p>
            </div>
            <form className="checkout-form" onSubmit={submitOrder}>
              <label htmlFor="order-family-name">Фамилия</label>
              <Input id="order-family-name" name="familyName" autoComplete="family-name" maxLength={80} required />
              <label htmlFor="order-given-name">Имя</label>
              <Input id="order-given-name" name="givenName" autoComplete="given-name" maxLength={80} required />
              <label htmlFor="order-phone">Номер телефона</label>
              <Input id="order-phone" name="phone" type="tel" autoComplete="tel" placeholder="+7 900 000-00-00" maxLength={32} required />
              <label className="checkout-honeypot" aria-hidden="true">
                Сайт <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              {error && <p className="checkout-error" role="alert">{error}</p>}
              <Button type="submit" disabled={pending}>{pending ? "Отправляем…" : "Подтвердить заказ"}</Button>
              <p className="checkout-note">После отправки мы свяжемся с вами по указанному номеру и подтвердим заказ.</p>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
