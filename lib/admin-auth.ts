import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "morai_admin_session";
const sessionLifetime = 8 * 60 * 60;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function matchesSecret(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME || "";
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  return Boolean(expectedUsername && expectedPassword && secret()) &&
    matchesSecret(username, expectedUsername) && matchesSecret(password, expectedPassword);
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createAdminSession(username: string) {
  if (!secret()) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const payload = Buffer.from(JSON.stringify({ username, expiresAt: Date.now() + sessionLifetime * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function isValidSession(value: string) {
  if (!secret()) return false;
  const [payload, signature, extra] = value.split(".");
  if (!payload || !signature || extra) return false;
  if (!matchesSecret(signature, sign(payload))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { username?: string; expiresAt?: number };
    return session.username === process.env.ADMIN_USERNAME && typeof session.expiresAt === "number" && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(cookieName)?.value || "");
}

export function setAdminSessionCookie(response: Response, value: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionLifetime}${secure}`,
  );
}

export function clearAdminSessionCookie(response: Response) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append("Set-Cookie", `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`);
}

export function adminIsConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && secret());
}
