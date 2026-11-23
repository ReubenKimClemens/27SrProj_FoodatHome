// Phone auth. Codes are texted and checked by Twilio Verify through our Twilio
// Functions (see /sms-api). Not connected to Supabase yet.
// If EXPO_PUBLIC_SMS_API_URL isn't set, no text is sent and any 6-digit code works.
// TODO (Supabase task): replace each function body with the matching supabase.auth call and
// set `user` from supabase.auth.onAuthStateChange:
//   sendPhoneCode   -> signInWithOtp({ phone })
//   verifyPhoneCode -> verifyOtp({ phone, token: code, type: "sms" })
//   signOut         -> signOut()
// signInWithOtp creates the account on first use, so sign up and log in are the same flow.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";

// Mirrors the fields we use from Supabase's auth user. `id` is auth.users.id,
// which maps to public.user.auth_id.
export type AuthUser = {
  id: string;
  phone: string;
};

let user: AuthUser | null = null;
// False until we've checked storage for a saved login.
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

// Keep users logged in across app restarts, so each restart doesn't cost a text.
const STORAGE_KEY = "authUser";

function setUser(next: AuthUser | null) {
  user = next;
  emit();
  (next ? AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)) : AsyncStorage.removeItem(STORAGE_KEY)).catch(
    console.warn,
  );
}

if (typeof window !== "undefined") {
  AsyncStorage.getItem(STORAGE_KEY)
    .then((saved) => {
      if (saved) user = JSON.parse(saved);
    })
    .catch(console.warn)
    .finally(() => {
      loaded = true;
      emit();
    });
}

const SMS_API_URL = process.env.EXPO_PUBLIC_SMS_API_URL;

// Throws an Error with a message that's safe to show on screen.
async function postToSmsApi(path: string, body: Record<string, string>): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${SMS_API_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(body).toString(),
    });
  } catch {
    throw new Error("Couldn't connect. Check your internet and try again.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Something went wrong. Try again.");
  }
}

// `phone` is E.164, e.g. "+15551234567".
export async function sendPhoneCode(phone: string): Promise<void> {
  if (!SMS_API_URL) {
    console.log(`[auth] EXPO_PUBLIC_SMS_API_URL not set. Would text a code to ${phone}`);
    return;
  }
  await postToSmsApi("send-code", { phone });
}

export async function verifyPhoneCode(phone: string, code: string): Promise<void> {
  if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code.");
  if (SMS_API_URL) await postToSmsApi("check-code", { phone, code });
  // Placeholder id until Supabase gives us a real auth user.
  setUser({ id: `local-${phone}`, phone });
}

export async function signOut(): Promise<void> {
  setUser(null);
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
