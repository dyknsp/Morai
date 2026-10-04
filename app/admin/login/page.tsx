import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { adminIsConfigured, hasAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Вход администратора",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");
  return (
    <section className="shell page-content admin-login-page">
      <div className="admin-login-card">
        <p className="eyebrow">Управление магазином</p>
        <h1>Вход администратора</h1>
        {adminIsConfigured() ? (
          <AdminLoginForm />
        ) : (
          <p className="admin-error" role="alert">Вход не настроен. Добавьте ADMIN_USERNAME, ADMIN_PASSWORD и ADMIN_SESSION_SECRET в окружение приложения.</p>
        )}
      </div>
    </section>
  );
}
