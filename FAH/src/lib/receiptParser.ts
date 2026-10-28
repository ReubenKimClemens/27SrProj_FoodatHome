export type ReceiptItem = {
  id: number;
  itemName: string;
  quantity: number;
  price: number;
  category: string;
  unit: string;
  date: string;
  note: string;
};

export type ParsedReceipt = {
  storeName: string;
  date: string;
  total: number;
  items: ReceiptItem[];
};

const round = (n: number) => Math.round(n * 100) / 100;

export function parseReceipt(receiptText: string): ParsedReceipt {
  const lines = receiptText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return {
    storeName: getStoreName(lines),
    date: getDate(lines),
    total: getTotal(lines),
    items: getItems(lines),
  };
}

function getStoreName(lines: string[]): string {
  const junk = ["expect more", "pay less", "save money", "live better"];
  for (let i = 0; i < 5 && i < lines.length; i++) {
    let name = lines[i].replace(/^[^a-zA-Z]+/, "");
    for (const j of junk) {
      const at = name.toLowerCase().indexOf(j);
      if (at > -1) name = name.slice(0, at);
    }
    name = name.replace(/[^a-zA-Z\s']/g, "").trim();
    if (name.length >= 3) return name;
  }
  return lines[0] || "Unknown Store";
}

function getDate(lines: string[]): string {
  for (const l of lines) {
    const m = l.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    if (m) return m[1];
  }
  return new Date().toLocaleDateString();
}

function grabPrice(line: string): number | null {
  const m = line.match(/\$?\s?(\d+\.\d{2})/);
  return m ? parseFloat(m[1]) : null;
}

function getTotal(lines: string[]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    const low = lines[i].toLowerCase();
    if (/\btotal\b/.test(low) && !low.includes("subtotal") && !low.includes("tax")) {
      const val = grabPrice(lines[i]);
      if (val) return val;
    }
  }
  return addUpParts(lines);
}

function addUpParts(lines: string[]): number {
  const parts = { subtotal: 0, tax: 0, tip: 0 };

  for (let i = 0; i < lines.length; i++) {
    const low = lines[i].toLowerCase();
    let key: keyof typeof parts | null = null;
    if (low.includes("subtotal") || low.includes("sub total")) key = "subtotal";
    else if (low.includes("tax")) key = "tax";
    else if (low.includes("tip") || low.includes("gratuity")) key = "tip";
    if (!key) continue;

    let val = grabPrice(lines[i]);
    if (!val && i + 1 < lines.length) {
      val = grabPrice(lines[i + 1]);
      if (val) i++;
    }
    if (!val) continue;

    if (key === "tax") parts.tax += val;
    else parts[key] = val;
  }
  if (!parts.subtotal) return 0;
  return round(parts.subtotal + parts.tax + parts.tip);
}

function getItems(lines: string[]): ReceiptItem[] {
  const ignore = [
    "total", "subtotal", "tax", "tip", "gratuity", "change",
    "cash", "visa", "mastercard", "debit", "credit", "tend",
  ];
  const items: ReceiptItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const low = line.toLowerCase();
    if (ignore.some((w) => low.includes(w))) continue;

    const pm = line.match(/\$?\s?(\d+\.\d{2})\s*[A-Z]?\s*$/);
    if (!pm || pm.index === undefined) continue;

    const price = parseFloat(pm[1]);
    let name = line.slice(0, pm.index).trim();
    if (name.length < 2) continue;

    name = name
      .replace(/\s*\d{8,}\s*/g, " ")
      .replace(/\s+[A-Z]$/, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    let qty = 1;
    const frontMatch = name.match(/^(\d+)\s*[x@]\s+(.+)/i);
    if (frontMatch) {
      qty = parseInt(frontMatch[1], 10);
      name = frontMatch[2].trim();
    } else {
      const colMatch = name.match(/^(.+?)\s{2,}(\d+)\s*$/);
      if (colMatch && parseInt(colMatch[2], 10) <= 99) {
        qty = parseInt(colMatch[2], 10);
        name = colMatch[1].trim();
      }
    }

    if (i + 1 < lines.length) {
      const nxt = lines[i + 1].match(/^(\d+)\s*@\s*\$?(\d+\.\d{2})/);
      if (nxt) {
        qty = parseInt(nxt[1], 10);
        i++;
      }
    }

    items.push({
      id: Date.now() + items.length,
      itemName: name,
      quantity: qty,
      price,
      category: "Misc",
      unit: "",
      date: "",
      note: "",
    });
  }
  return items;
}
