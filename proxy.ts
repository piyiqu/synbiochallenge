import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const publicPaths = ["/", "/login", "/register", "/auth/callback"];
  const isPublicApi = req.nextUrl.pathname.startsWith("/api/");
  const isPublicPath =
    publicPaths.includes(req.nextUrl.pathname) ||
    isPublicApi ||
    req.nextUrl.pathname.startsWith("/_next/");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    return NextResponse.next({ request: req });
  }

  let supabaseResponse = NextResponse.next({ request: req });

  try {
    const { createServerClient } = await import("@supabase/ssr");

    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              req.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isPublicPath) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (user && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return supabaseResponse;
  } catch {
    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
