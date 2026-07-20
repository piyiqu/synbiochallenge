import { cookies } from "next/headers";

let createServerClient: typeof import("@supabase/ssr").createServerClient;

export async function createClient() {
  if (!createServerClient) {
    const mod = await import("@supabase/ssr");
    createServerClient = mod.createServerClient;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 在 Server Component 中调用 set 时会忽略错误
          }
        },
      },
    },
  );
}
