import { NextResponse } from "next/server";
import { verifyCode } from "@/utils/verification-store";

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000;

export async function POST(request: Request) {
  const { email, code, token, expiresAt } = await request.json();

  if (!email || !code || !token || !expiresAt) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }

  const key = email.toLowerCase().trim();
  const now = Date.now();
  let entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(key, entry);
  }

  entry.count++;

  if (entry.count > MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "验证次数过多，请 1 分钟后重试" },
      { status: 429 },
    );
  }

  if (verifyCode(email, code, token, expiresAt)) {
    attempts.delete(key);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "验证码错误或已过期" }, { status: 400 });
}
