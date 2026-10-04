import { NextResponse } from "next/server";
import { adminIsConfigured, clearAdminSessionCookie, createAdminSession, setAdminSessionCookie, verifyAdminCredentials } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!adminIsConfigured()) return NextResponse.json({ error: "Вход администратора ещё не настроен." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Проверьте логин и пароль." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Проверьте логин и пароль." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const username = typeof input.username === "string" ? input.username : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!verifyAdminCredentials(username, password)) return NextResponse.json({ error: "Неверный логин или пароль." }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookie(response, createAdminSession(username));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAdminSessionCookie(response);
  return response;
}
