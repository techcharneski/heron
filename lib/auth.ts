import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "admin_session";

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ADMIN_JWT_SECRET precisa ser definido obrigatoriamente no ambiente de produção!"
      );
    }
    return "heron_charneski_admin_secret_key_2026_x89";
  }
  return secret;
}

function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || "admin";
}

async function createSignature(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(getJwtSecret());
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(username: string): Promise<string> {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
  const payload = `${username}:${expiresAt}`;
  const sig = await createSignature(payload);
  return `${payload}:${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return false;
    const [username, expiresAtStr, sig] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const payload = `${username}:${expiresAtStr}`;
    const expectedSig = await createSignature(payload);
    return sig === expectedSig;
  } catch (err) {
    return false;
  }
}

export async function validateCredentials(username: string, pass: string): Promise<boolean> {
  const expectedUsername = getAdminUsername();
  if (username !== expectedUsername) {
    return false;
  }

  const envPass = process.env.ADMIN_PASSWORD;
  const envHash = process.env.ADMIN_PASSWORD_HASH;

  // 1. Comparação com ADMIN_PASSWORD
  if (envPass) {
    if (pass === envPass) return true;
    try {
      if (await bcrypt.compare(pass, envPass)) return true;
    } catch {}
  }

  // 2. Comparação com ADMIN_PASSWORD_HASH
  if (envHash) {
    try {
      if (await bcrypt.compare(pass, envHash)) return true;
    } catch {}
  }

  // 3. Fallback seguro para ambiente de desenvolvimento se nenhuma env foi definida
  if (!envPass && !envHash) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_PASSWORD ou ADMIN_PASSWORD_HASH é obrigatório em produção!");
    }
    return pass === "heron2026admin";
  }

  return false;
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie?.value) return false;
  return verifySessionToken(sessionCookie.value);
}

export async function setSessionCookie(username: string): Promise<void> {
  const token = await createSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60, // 1 dia
  });
}

export async function removeSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
