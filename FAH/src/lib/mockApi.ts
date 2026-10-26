import type { ReceiptItem } from "./receiptParser";

const SAMPLE_RECEIPT_TEXT = `WALMART
Save money. Live better.
10/21/2026 14:32
GREAT VALUE 2% MILK      3.48 F
BANANAS                  1.24 N
2 x LARGE EGGS 12CT      5.96 F
WHITE BREAD              2.18 F
CHICKEN BREAST           8.97 F
SUBTOTAL                21.83
TAX 1                    0.00
TOTAL                   21.83
VISA TEND               21.83`;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTextFromImage(imageUri: string): Promise<string> {
  await wait(1200);
  if (!imageUri) throw new Error("No image to read.");
  return SAMPLE_RECEIPT_TEXT;
}

export async function saveReceiptItems(items: ReceiptItem[]): Promise<void> {
  await wait(500);
  console.log(`[mockApi] Would save ${items.length} receipt item(s):`, items);
}
