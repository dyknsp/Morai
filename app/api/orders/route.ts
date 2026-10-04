import { NextResponse } from "next/server";
import products from "@/content/products.json";
import type { Product } from "@/lib/content";
import { createOrder } from "@/lib/orders";

export const runtime = "nodejs";

const catalog = new Map((products as Product[]).map((product) => [product.slug, product]));

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Проверьте заполнение формы." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Некорректный заказ." }, { status: 400 });

  const input = body as Record<string, unknown>;
  if (cleanText(input.website, 200)) return NextResponse.json({ ok: true }, { status: 201 });

  const familyName = cleanText(input.familyName, 80);
  const givenName = cleanText(input.givenName, 80);
  const phone = cleanText(input.phone, 32);
  const phoneDigits = phone.replace(/\D/g, "");
  if (familyName.length < 2 || givenName.length < 2 || phoneDigits.length < 10 || phoneDigits.length > 15) {
    return NextResponse.json({ error: "Укажите фамилию, имя и корректный номер телефона." }, { status: 400 });
  }
  if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 30) {
    return NextResponse.json({ error: "Корзина пуста или содержит слишком много позиций." }, { status: 400 });
  }

  const requestedItems = new Map<string, number>();
  for (const item of input.items) {
    if (!item || typeof item !== "object") return NextResponse.json({ error: "Некорректный состав заказа." }, { status: 400 });
    const { slug, quantity } = item as Record<string, unknown>;
    if (typeof slug !== "string" || !catalog.has(slug) || !Number.isInteger(quantity) || Number(quantity) < 1 || Number(quantity) > 99) {
      return NextResponse.json({ error: "Некорректный состав заказа." }, { status: 400 });
    }
    const nextQuantity = (requestedItems.get(slug) || 0) + Number(quantity);
    if (nextQuantity > 99) return NextResponse.json({ error: "Количество одного аромата не может превышать 99." }, { status: 400 });
    requestedItems.set(slug, nextQuantity);
  }

  const orderItems = [...requestedItems].map(([slug, quantity]) => {
    const product = catalog.get(slug)!;
    return { slug, name: product.name, quantity, unitPrice: product.price, lineTotal: product.price * quantity };
  });

  try {
    const order = await createOrder({
      familyName,
      givenName,
      phone,
      items: orderItems,
      total: orderItems.reduce((sum, item) => sum + item.lineTotal, 0),
    });
    return NextResponse.json({ ok: true, orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить заказ. Попробуйте ещё раз чуть позже." }, { status: 500 });
  }
}
