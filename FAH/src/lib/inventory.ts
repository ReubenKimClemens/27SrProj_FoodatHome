export type InventoryItem = {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  category: string;
  price: number;
  note: string;
  createdAt: string;
};

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
