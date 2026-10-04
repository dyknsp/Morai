"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const values = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: values.get("username"), password: values.get("password") }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Не удалось войти.");
      window.location.assign("/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Не удалось войти.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label htmlFor="admin-username">Логин</label>
      <Input id="admin-username" name="username" autoComplete="username" required />
      <label htmlFor="admin-password">Пароль</label>
      <Input id="admin-password" name="password" type="password" autoComplete="current-password" required />
      {error && <p className="admin-error" role="alert">{error}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Входим…" : "Войти"}</Button>
    </form>
  );
}
