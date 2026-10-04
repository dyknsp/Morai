import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminOrderDashboard } from "@/components/admin/admin-order-dashboard";
import { hasAdminSession } from "@/lib/admin-auth";
import { readOrders } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Заказы — админ-панель",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");
  const orders = await readOrders();
  return (
    <section className="shell page-content admin-page">
      <header className="page-heading">
        <p className="eyebrow">MORAI AROMA</p>
        <h1>Заказы</h1>
      </header>
      <AdminOrderDashboard initialOrders={orders} />
    </section>
  );
}
