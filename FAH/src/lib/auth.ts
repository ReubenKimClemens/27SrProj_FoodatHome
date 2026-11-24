// Fake phone login until real texts are set up: any 6-digit code works.
// Each number gets its own account, so the same number always opens the same data.
// Later, sendPhoneCode and verifyPhoneCode switch to signInWithOtp / verifyOtp.
import type { Session } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";

import { supabase } from "@/lib/supabase";

// `id` is auth.users.id, which maps to public.user.auth_id.
export type AuthUser = {
  id: string;
  phone: string;
};

const DEV_PASSWORD = "fah-dev-login";

let user: AuthUser | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function setSession(session: Session | null) {
  user = session ? { id: session.user.id, phone: session.user.user_metadata.phone ?? "" } : null;
  loaded = true;
  listeners.forEach((listener) => listener());
}

// Also fires once on startup with the saved login, if there is one
supabase.auth.onAuthStateChange((_event, session) => setSession(session));

function fakeEmail(phone: string) {
  return `${phone.slice(1)}@fah.test`; // "+15551234567" -> "15551234567@fah.test"
}

// `phone` is E.164, e.g. "+15551234567".
export async function sendPhoneCode(phone: string): Promise<void> {
  if (!/^\+1\d{10}$/.test(phone)) throw new Error("Enter a 10-digit US phone number.");
}

export async function verifyPhoneCode(phone: string, code: string): Promise<void> {
  if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code.");
  const email = fakeEmail(phone);

  const { error } = await supabase.auth.signInWithPassword({ email, password: DEV_PASSWORD });
  if (!error) return;

  // First time with this number, so create the account
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password: DEV_PASSWORD,
    options: { data: { phone } },
  });
  // No session means "Confirm email" is still on in the Supabase dashboard
  if (signUpError || !data.session) {
    console.warn("[auth] login failed:", signUpError?.message ?? "no session, is Confirm email on?");
    throw new Error("Couldn't log in. Try again.");
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAuthUser(): AuthUser | null {
  return useSyncExternalStore(subscribe, () => user, () => user);
}

export function useAuthLoaded(): boolean {
  return useSyncExternalStore(subscribe, () => loaded, () => loaded);
}
