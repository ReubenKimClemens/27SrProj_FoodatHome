// Mock auth store. Not connected to Supabase yet.
// TODO: Replace each function body with the matching supabase.auth call and
// set `user` from supabase.auth.onAuthStateChange:
//   sendPhoneCode   -> signInWithOtp({ phone })
//   verifyPhoneCode -> verifyOtp({ phone, token: code, type: "sms" })
//   signOut         -> signOut()
// signInWithOtp creates the account on first use, so sign up and log in are the same flow.
import { useSyncExternalStore } from "react";

// Mirrors the fields we use from Supabase's auth user. `id` is auth.users.id,
// which maps to public.user.auth_id.
export type AuthUser = {
  id: string;
  phone: string;
};

let user: AuthUser | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// `phone` is E.164, e.g. "+15551234567".
export async function sendPhoneCode(phone: string): Promise<void> {
  await wait(500);
  console.log(`[auth] Would text a code to ${phone}`);
}

export async function verifyPhoneCode(phone: string, code: string): Promise<void> {
  await wait(500);
  if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code.");
  user = { id: `mock-${Date.now()}`, phone };
  emit();
}

export async function signOut(): Promise<void> {
  user = null;
  emit();
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
