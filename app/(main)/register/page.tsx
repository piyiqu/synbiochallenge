"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/config";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<"form" | "code">("form");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [token, setToken] = useState("");
  const [expiresAt, setExpiresAt] = useState(0);

  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = useCallback(async () => {
    setError("");
    setCodeError("");

    if (password.length < 6) {
      setError("密码至少需要 6 位");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "发送失败");
        return;
      }
      setToken(data.token);
      setExpiresAt(data.expiresAt);
      setStep("code");
      setCountdown(60);
      codeRefs.current[0]?.focus();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setSending(false);
    }
  }, [email, password, confirmPassword]);

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      codeRefs.current[5]?.focus();
    }
  };

  const handleVerifyAndRegister = async () => {
    const codeStr = code.join("");
    if (codeStr.length < 6) {
      setCodeError("请输入完整的 6 位验证码");
      return;
    }

    setCodeLoading(true);
    setCodeError("");

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: codeStr, token, expiresAt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCodeError(data.error || "验证失败");
        return;
      }

      const { createBrowserClient } = await import("@supabase/ssr");
      const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setCodeError(signUpError.message || "注册失败");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setCodeError("网络错误，请重试");
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">注册</h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          创建你的账号，开始参赛
        </p>

        {step === "form" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCode();
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位密码"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-gray-700">
                确认密码
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-green-600 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "发送中..." : "发送验证码"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray-500">
              验证码已发送至 <span className="font-medium text-gray-700">{email}</span>
            </p>

            <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { codeRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeInput(i, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  className="h-12 w-12 rounded-lg border border-gray-200 text-center text-lg font-semibold outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              ))}
            </div>

            {codeError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{codeError}</p>
            )}

            <button
              onClick={handleVerifyAndRegister}
              disabled={codeLoading}
              className="rounded-lg bg-green-600 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {codeLoading ? "验证中..." : "验证并注册"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-gray-500 hover:text-gray-700"
              >
                修改邮箱
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0}
                className="text-green-600 hover:text-green-700 disabled:text-gray-300"
              >
                {countdown > 0 ? `${countdown}s 后重发` : "重新发送"}
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          已有账号？{" "}
          <Link href="/login" className="font-medium text-green-600 hover:underline">
            去登录
          </Link>
        </p>
      </div>
    </div>
  );
}
