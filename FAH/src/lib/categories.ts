export const CATEGORIES = [
  "Produce",
  "Protein",
  "Wheat",
  "Dairy",
  "Drinks",
  "Snacks",
  "Pantry",
  "Sauces",
  "Spices",
  "Leftover",
  "Frozen",
  "Misc",
] as const;

export type Category = (typeof CATEGORIES)[number];

type CategoryColor = { light: string; dark: string };

const CATEGORY_COLORS: Record<Category, CategoryColor> = {
  Produce: { light: "#FFE1CC", dark: "#FF6B00" },
  Protein: { light: "#FCE9E9", dark: "#DC2626" },
  Wheat: { light: "#FFEFB0", dark: "#B59100" },
  Dairy: { light: "#EAEAFC", dark: "#3030E0" },
  Drinks: { light: "#ECF3FE", dark: "#3C82F6" },
  Snacks: { light: "#E6F9FD", dark: "#00C0E8" },
  Pantry: { light: "#EFEEFE", dark: "#6155F5" },
  Sauces: { light: "#FAEAFC", dark: "#CB30E0" },
  Spices: { light: "#FFE5E5", dark: "#FF0000" },
  Leftover: { light: "#E6FAF7", dark: "#00C8B3" },
  Frozen: { light: "#B0DAFF", dark: "#007CE8" },
  Misc: { light: "#DADBDD", dark: "#444955" },
};

const ALL_CATEGORY_COLOR: CategoryColor = { light: "#E7F6F1", dark: "#0FA376" };
const DEFAULT_CATEGORY_COLOR: CategoryColor = { light: "#F7F7F7", dark: "#111215" };

export function getCategoryColor(category: string): CategoryColor {
  if (category === "All") return ALL_CATEGORY_COLOR;
  return CATEGORY_COLORS[category as Category] ?? DEFAULT_CATEGORY_COLOR;
}
