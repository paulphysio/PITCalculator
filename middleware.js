import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request) {
  const supabase = createClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  const protectedPaths = ["/dashboard", "/calculator", "/reports"];
  if (!user && protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/calculator/:path*", "/reports/:path*"] };
