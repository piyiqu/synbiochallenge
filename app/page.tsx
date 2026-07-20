import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <section className="flex w-full flex-col items-center bg-gradient-to-b from-green-50 to-white px-4 py-24">
        <h1 className="max-w-2xl text-center text-5xl font-bold leading-tight tracking-tight text-gray-900">
          合成生物学创新赛
        </h1>
        <p className="mt-6 max-w-xl text-center text-lg leading-relaxed text-gray-600">
          汇聚全球合成生物学领域的创新力量，推动前沿科学研究与产业应用。
          在这里展示你的研究成果，与顶尖团队交流碰撞。
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
          >
            立即报名
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:border-green-300 hover:text-green-700"
          >
            已有账号？登录
          </Link>
        </div>
      </section>

      <section className="w-full max-w-5xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 p-8 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl text-green-700">
              🧬
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">创新研究</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              展示你在合成生物学领域的最新研究成果，涵盖基因编辑、代谢工程、无细胞系统等多个方向。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-8 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl text-blue-700">
              🤝
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">团队协作</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              组队参赛，与来自高校、科研院所和企业的优秀团队同台竞技，互相学习。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 p-8 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl text-purple-700">
              🏆
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">权威评审</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              由国内外合成生物学领域知名专家组成的评审团，确保比赛的公平与专业。
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">赛事日程</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { date: "2024.06.01", title: "报名开始" },
              { date: "2024.07.31", title: "报名截止" },
              { date: "2024.08.15", title: "线上评审" },
              { date: "2024.09.10", title: "决赛 & 颁奖" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-lg font-bold text-green-600">{item.date}</p>
                <p className="mt-2 text-gray-600">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        &copy; 2024 合成生物学创新赛. 保留所有权利.
      </footer>
    </div>
  );
}
