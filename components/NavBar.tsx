"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

async function getSupabase() {
  const { createBrowserClient } = await import("@supabase/ssr");
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export default function NavBar() {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    getSupabase().then((supabase) => {
      supabaseRef.current = supabase;

      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user?.email ?? null);
        setLoading(false);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setUser(session?.user?.email ?? null);
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    });
  }, []);

  const handleLogout = async () => {
    await supabaseRef.current?.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-green-700">
          SynBio Challenge
        </Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-gray-100" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 transition-colors hover:text-green-700"
              >
                个人中心
              </Link>
              <span className="text-sm text-gray-400">{user}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-600 transition-colors hover:border-red-200 hover:text-red-600"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 transition-colors hover:text-green-700"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white transition-colors hover:bg-green-700"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
