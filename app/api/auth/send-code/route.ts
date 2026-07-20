import { NextResponse } from "next/server";
import { generateCode } from "@/utils/verification-store";
import { sendVerificationCode } from "@/utils/mail";

const sendAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_SENDS = 3;
const SEND_WINDOW_MS = 60 * 1000;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
    }

    const key = email.toLowerCase().trim();
    const now = Date.now();
    let entry = sendAttempts.get(key);

    if (!entry || entry.resetAt < now) {
      entry = { count: 0, resetAt: now + SEND_WINDOW_MS };
      sendAttempts.set(key, entry);
    }

    entry.count++;

    if (entry.count > MAX_SENDS) {
      return NextResponse.json(
        { error: "发送过于频繁，请 1 分钟后重试" },
        { status: 429 },
      );
    }

    const { code, expiresAt, token } = generateCode(email);
    await sendVerificationCode(email, code);

    return NextResponse.json({ token, expiresAt });
  } catch {
    return NextResponse.json({ error: "发送失败，请稍后重试" }, { status: 500 });
  }
}
