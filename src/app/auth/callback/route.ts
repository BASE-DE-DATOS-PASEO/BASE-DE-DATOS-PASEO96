import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAIL = "paseodelsur96@gmail.com";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  const response = NextResponse.redirect(new URL("/login", origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  const email = (data.session.user.email ?? "").trim().toLowerCase();

  if (email === ADMIN_EMAIL) {
    response.headers.set("Location", new URL("/admin", origin).toString());
    return response;
  }

  const { data: puesteros } = await supabase
    .from("puesteros")
    .select("id")
    .ilike("gmail_acceso", email)
    .limit(1);

  if (puesteros && puesteros.length > 0) {
    response.headers.set("Location", new URL("/mi-puesto", origin).toString());
    return response;
  }

  const { data: solicitudes } = await supabase
    .from("solicitudes")
    .select("id")
    .ilike("gmail_acceso", email)
    .limit(1);

  if (solicitudes && solicitudes.length > 0) {
    response.headers.set("Location", new URL("/mi-puesto", origin).toString());
    return response;
  }

  response.headers.set("Location", new URL("/planes", origin).toString());
  return response;
}
