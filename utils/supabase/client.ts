let createBrowserClient: typeof import("@supabase/ssr").createBrowserClient;

export async function createClient() {
  if (!createBrowserClient) {
    const mod = await import("@supabase/ssr");
    createBrowserClient = mod.createBrowserClient;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
