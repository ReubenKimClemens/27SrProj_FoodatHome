// Placeholder data for the home screen.
// TODO: Replace with Supabase queries once the client is set up. The shapes
// match what the web app loaded in src/routes/+page.server.js:
//   - activeBudget: `budgets` row where active_budget = true
//   - category counts: count of `receipt_items` per category for the user

export type ActiveBudget = {
  id: number | null;
  budget_amount: number;
  total_spent: number;
};

export type InventoryCounts = {
  protein: number;
  produce: number;
  bread: number;
  dairy: number;
  drinks: number;
  snacks: number;
  pantry: number;
  sauces: number;
  spices: number;
  leftover: number;
  frozen: number;
  misc: number;
};

export const activeBudget: ActiveBudget = {
  id: null,
  budget_amount: 400,
  total_spent: 142.18,
};

export const lastMonthSpent = 300;

export const inventoryCounts: InventoryCounts = {
  protein: 4,
  produce: 6,
  bread: 2,
  dairy: 3,
  drinks: 0,
  snacks: 5,
  pantry: 7,
  sauces: 2,
  spices: 0,
  leftover: 1,
  frozen: 3,
  misc: 0,
};
