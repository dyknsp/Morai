"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "@/lib/orders";

const money = new Intl.NumberFormat("ru-RU");
const dateTime = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Yekaterinburg" });
const statuses: Record<OrderStatus, string> = { new: "Новый", processing: "В работе", done: "Завершён" };

export function AdminOrderDashboard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [notice, setNotice] = useState("");
  const [busyOrder, setBusyOrder] = useState("");

  async function changeStatus(id: string, status: OrderStatus) {
    setBusyOrder(id);
    setNotice("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Не удалось обновить заказ.");
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
      setNotice("Статус заказа обновлён.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Не удалось обновить заказ.");
    } finally {
      setBusyOrder("");
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.assign("/admin/login");
  }

  return (
    <section className="admin-orders">
      <div className="admin-toolbar">
        <p>{orders.length} {orders.length === 1 ? "заказ" : "заказов"}</p>
        <div>
          <Link className="admin-shop-link" href="/">На сайт</Link>
          <Button type="button" variant="secondary" size="sm" onClick={logout}>Выйти</Button>
        </div>
      </div>
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {orders.length === 0 ? (
        <div className="admin-empty">Новых заказов пока нет.</div>
      ) : (
        <div className="admin-order-list">
          {orders.map((order) => (
            <article className="admin-order-card" key={order.id}>
              <header className="admin-order-header">
                <div>
                  <p className="eyebrow">Заказ № {order.id.slice(0, 8).toUpperCase()}</p>
                  <time dateTime={order.createdAt}>{dateTime.format(new Date(order.createdAt))}</time>
                </div>
                <label className="admin-status-label">
                  <span className="sr-only">Статус заказа</span>
                  <select
                    value={order.status}
                    disabled={busyOrder === order.id}
                    onChange={(event) => void changeStatus(order.id, event.target.value as OrderStatus)}
                  >
                    {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              </header>
              <div className="admin-customer">
                <strong>{order.familyName} {order.givenName}</strong>
                <a href={`tel:${order.phone.replace(/[^+\d]/g, "")}`}>{order.phone}</a>
              </div>
              <ul className="admin-order-items">
                {order.items.map((item) => (
                  <li key={item.slug}>
                    <span>{item.name} × {item.quantity}</span>
                    <strong>{money.format(item.lineTotal)} ₽</strong>
                  </li>
                ))}
              </ul>
              <p className="admin-order-total"><span>Итого</span><strong>{money.format(order.total)} ₽</strong></p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
