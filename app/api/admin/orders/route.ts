import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { readOrders, setOrderStatus, type OrderStatus } from "@/lib/orders";

export const runtime = "nodejs";

export async function GET() {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Требуется вход." }, { status: 401 });
  try {
    return NextResponse.json({ orders: await readOrders() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать список заказов." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Требуется вход." }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректные данные." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Некорректные данные." }, { status: 400 });
  const { id, status } = body as Record<string, unknown>;
  if (typeof id !== "string" || !["new", "processing", "done"].includes(String(status))) {
    return NextResponse.json({ error: "Неизвестный заказ или статус." }, { status: 400 });
  }
  try {
    const updated = await setOrderStatus(id, status as OrderStatus);
    return updated
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "Заказ не найден." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Не удалось обновить заказ." }, { status: 500 });
  }
}
