export type InventoryItem = {
  id: number;
  itemName: string;
  quantity: number;
  unit: string;
  category: string;
  price: number;
  note: string;
  createdAt: string;
};

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const SAMPLE_INVENTORY: InventoryItem[] = [
  { id: 1, itemName: "Chicken Thighs", quantity: 2, unit: "lbs", category: "Protein", price: 6.49, note: "", createdAt: daysAgo(2) },
  { id: 2, itemName: "2% Milk", quantity: 1, unit: "gal", category: "Dairy", price: 3.48, note: "", createdAt: daysAgo(0) },
  { id: 3, itemName: "Bananas", quantity: 6, unit: "", category: "Produce", price: 0.25, note: "", createdAt: daysAgo(1) },
  { id: 4, itemName: "Sourdough Bread", quantity: 1, unit: "loaf", category: "Wheat", price: 4.99, note: "", createdAt: daysAgo(4) },
  { id: 5, itemName: "Frozen Peas", quantity: 2, unit: "bags", category: "Frozen", price: 1.89, note: "", createdAt: daysAgo(9) },
  { id: 6, itemName: "Orange Juice", quantity: 1, unit: "", category: "Drinks", price: 3.99, note: "", createdAt: daysAgo(3) },
  { id: 7, itemName: "Pretzels", quantity: 1, unit: "bag", category: "Snacks", price: 2.5, note: "", createdAt: daysAgo(6) },
  { id: 8, itemName: "Rice", quantity: 1, unit: "bag", category: "Pantry", price: 5.29, note: "", createdAt: daysAgo(14) },
];

export function getDaysSinceAdded(date: string): number {
  const diffInTime = Date.now() - new Date(date).getTime();
  return Math.floor(diffInTime / (1000 * 3600 * 24));
}

export function addedText(createdAt: string): string {
  const days = getDaysSinceAdded(createdAt);
  if (days === 0) return "Added Today";
  if (days === 1) return "Added Yesterday";
  return `Added ${days} Days Ago`;
}
