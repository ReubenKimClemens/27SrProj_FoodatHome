export const ACTIVE_BUDGET = { budget: 400, spent: 142.18, lastMonthSpent: 300 };

export const NUMBER_OF_ITEMS = 31;
export const NUMBER_OF_RECEIPTS = 4;
export const TOTAL_SPENT = 158.62;
export const HIGHEST_RECEIPT = { amount: 56.8, date: "12/04/2025" };
export const LOWEST_RECEIPT = { amount: 27.4, date: "12/08/2025" };
export const TOTAL_TOSS = 10;
export const TOTAL_CHOMP = 100;

export const STORE_VISITS = [
  { name: "Trader Joe's", date: "12/09/2025", items: 8, price: 42.18 },
  { name: "Walmart", date: "12/08/2025", items: 8, price: 27.4 },
  { name: "Whole Foods", date: "12/06/2025", items: 5, price: 32.24 },
  { name: "Costco", date: "12/04/2025", items: 10, price: 56.8 },
];

export const TOP_CATEGORIES = [
  { name: "Produce", amount: 50.76, percentage: 32 },
  { name: "Protein", amount: 39.65, percentage: 25 },
  { name: "Snacks", amount: 28.55, percentage: 18 },
  { name: "Pantry", amount: 23.79, percentage: 15 },
];

export const SPENT_PER_DAY = [
  56.8, 0, 0, 32.24, 27.4, 0, 42.18, 0, 81.67, 0, 0, 0, 0, 55.6, 0, 0,
  60.0, 64.82, 29.0, 0, 0, 80.9, 0, 0, 45.7, 10.27, 0, 61.78, 27.45, 0, 0,
].map((amount, i) => ({ day: i + 1, amount }));

export const BUDGET_HISTORY = [
  { month: "Aug", amount: 169.5, goal: 300 },
  { month: "Sep", amount: 220.73, goal: 300 },
  { month: "Oct", amount: 549.0, goal: 300 },
  { month: "Nov", amount: 326, goal: 300 },
  { month: "Dec", amount: 295, goal: 400 },
  { month: "Jan", amount: 0, goal: null },
];
