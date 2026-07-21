import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/config";

export default async function DashboardPage() {
  const { createServerClient } = await import("@supabase/ssr");
  const cookieStore = await cookies();

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as any),
            );
          } catch {
            // 在 Server Component 中调用 set 时会忽略错误
          }
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
        <p className="mt-2 text-sm text-gray-500">
          登录账号：{user.email}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 p-6">
          <h3 className="mb-2 font-semibold text-gray-900">我的报名</h3>
          <p className="text-sm text-gray-400">暂无报名记录</p>
        </div>

        <div className="rounded-2xl border border-gray-100 p-6">
          <h3 className="mb-2 font-semibold text-gray-900">我的团队</h3>
          <p className="text-sm text-gray-400">暂未加入团队</p>
        </div>

        <div className="rounded-2xl border border-gray-100 p-6">
          <h3 className="mb-2 font-semibold text-gray-900">提交记录</h3>
          <p className="text-sm text-gray-400">暂无提交</p>
        </div>

        <div className="rounded-2xl border border-gray-100 p-6">
          <h3 className="mb-2 font-semibold text-gray-900">消息通知</h3>
          <p className="text-sm text-gray-400">暂无新消息</p>
        </div>
      </div>
    </div>
  );
}
