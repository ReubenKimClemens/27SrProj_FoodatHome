import { useSyncExternalStore } from "react";

import type { ReceiptItem } from "./receiptParser";

export type ReceiptDraft = {
  storeName: string;
  date: string;
  total: number | null;
  items: ReceiptItem[];
};

const emptyDraft = (): ReceiptDraft => ({
  storeName: "",
  date: "",
  total: null,
  items: [],
});

let draft: ReceiptDraft = emptyDraft();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setReceiptDraft(next: Partial<ReceiptDraft>) {
  draft = { ...draft, ...next };
  emit();
}

export function resetReceiptDraft(next: Partial<ReceiptDraft> = {}) {
  draft = { ...emptyDraft(), ...next };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useReceiptDraft(): ReceiptDraft {
  return useSyncExternalStore(subscribe, () => draft, () => draft);
}
