import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
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
