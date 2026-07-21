import { createHmac } from "crypto";
import { QQ_EMAIL_AUTH_CODE } from "@/utils/config";

const CODE_EXPIRY_MS = 5 * 60 * 1000;

function getSecret(): string {
  return QQ_EMAIL_AUTH_CODE;
}

function signPayload(email: string, code: string, expiresAt: number): string {
  return createHmac("sha256", getSecret())
    .update(`${email}:${code}:${expiresAt}`)
    .digest("hex");
}

export function generateCode(email: string) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + CODE_EXPIRY_MS;
  const token = signPayload(email.toLowerCase().trim(), code, expiresAt);

  return { code, expiresAt, token };
}

export function verifyCode(
  email: string,
  code: string,
  token: string,
  expiresAt: number,
): boolean {
  if (Date.now() > expiresAt) return false;
  const expected = signPayload(email.toLowerCase().trim(), code, expiresAt);
  return token === expected;
}
