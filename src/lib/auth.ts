"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ADMIN_EMAIL } from "@/lib/mock-data";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const email = user?.email?.toLowerCase() ?? "";
  const isAdmin = email === ADMIN_EMAIL;

  return { user, email, isAdmin, loading };
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "/login";
}
