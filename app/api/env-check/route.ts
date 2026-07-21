import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length ?? 0,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}
