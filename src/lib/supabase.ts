import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase =
  url && anonKey
    ? createBrowserClient(url, anonKey)
    : createClient(
        "https://placeholder.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
      );
