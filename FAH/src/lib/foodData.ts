// All Supabase reads and writes for the inventory, home and scan screens.
// Data belongs to a household, so every query is scoped to the user's household.
import { CATEGORIES, type Category } from "@/lib/categories";
import type { InventoryItem } from "@/lib/mockInventory";
import type { ReceiptItem } from "@/lib/receiptParser";
import { supabase } from "@/lib/supabase";

// Logs the real Supabase error for us and throws a short one for the screen
function fail(error: { message: string }, message: string): never {
  console.warn(`[foodData] ${message}`, error.message);
  throw new Error(message);
}

// Account -----------------------------------------------------------------

type Account = { authId: string; userId: string; householdId: string };

let account: Account | null = null;

async function findOrCreateUserId(authId: string, email: string | undefined): Promise<string> {
  const message = "Couldn't load your account.";

  const found = await supabase.from("user").select("id").eq("auth_id", authId).maybeSingle();
  if (found.error) fail(found.error, message);
  if (found.data) return found.data.id;

  const created = await supabase.from("user").insert({ auth_id: authId, email }).select("id").single();
  if (created.error) fail(created.error, message);
  return created.data.id;
}

async function findOrCreateHouseholdId(userId: string): Promise<string> {
  const message = "Couldn't load your household.";

  const found = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", userId)
    .order("joined_at")
    .limit(1)
    .maybeSingle();
  if (found.error) fail(found.error, message);
  if (found.data) return found.data.household_id;

  const created = await supabase.rpc("create_household", { household_name: "My Household" });
  if (created.error) fail(created.error, message);
  return created.data as string;
}

// Finds (or on first login creates) the user's row and household
export async function getAccount(): Promise<Account> {
  const { data } = await supabase.auth.getSession();
  const authUser = data.session?.user;
  if (!authUser) throw new Error("Please log in again.");

  // Cached per login, so switching accounts looks it up again
  if (account?.authId === authUser.id) return account;

  const userId = await findOrCreateUserId(authUser.id, authUser.email);
  const householdId = await findOrCreateHouseholdId(userId);
  account = { authId: authUser.id, userId, householdId };
  return account;
}

// Inventory ---------------------------------------------------------------

type ItemRow = {
  id: string;
  item_name: string;
  quantity: number | null;
  unit_name: string | null;
  unit_price: number | null;
  category: string | null;
  notes: string | null;
  created_at: string;
};

const ITEM_COLUMNS = "id, item_name, quantity, unit_name, unit_price, category, notes, created_at";

// The database defaults unit_name to "Quantity", which the app shows as no unit
function toInventoryItem(row: ItemRow): InventoryItem {
  return {
    id: row.id,
    itemName: row.item_name,
    quantity: Number(row.quantity ?? 1),
    unit: row.unit_name === "Quantity" ? "" : (row.unit_name ?? ""),
    category: row.category ?? "Misc",
    price: Number(row.unit_price ?? 0),
    note: row.notes ?? "",
    createdAt: row.created_at,
  };
}

function toItemColumns(item: Omit<InventoryItem, "id">) {
  return {
    item_name: item.itemName,
    quantity: item.quantity,
    unit_name: item.unit || "Quantity",
    unit_price: item.price,
    total_price: item.price * item.quantity,
    category: item.category,
    notes: item.note,
    created_at: item.createdAt,
  };
}

export async function getInventory(): Promise<InventoryItem[]> {
  const { householdId } = await getAccount();
  const { data, error } = await supabase
    .from("receipt_items")
    .select(ITEM_COLUMNS)
    .eq("household_id", householdId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .overrideTypes<ItemRow[], { merge: false }>();
  if (error) fail(error, "Couldn't load your inventory.");
  return data.map(toInventoryItem);
}

export async function addInventoryItem(item: Omit<InventoryItem, "id">): Promise<InventoryItem> {
  const { userId, householdId } = await getAccount();
  const { data, error } = await supabase
    .from("receipt_items")
    .insert({ ...toItemColumns(item), user_id: userId, household_id: householdId })
    .select(ITEM_COLUMNS)
    .single()
    .overrideTypes<ItemRow, { merge: false }>();
  if (error) fail(error, "Couldn't add the item.");
  return toInventoryItem(data);
}

export async function updateInventoryItem(item: InventoryItem): Promise<void> {
  const { id, ...fields } = item;
  const { error } = await supabase.from("receipt_items").update(toItemColumns(fields)).eq("id", id);
  if (error) fail(error, "Couldn't save your changes.");
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const { error } = await supabase.from("receipt_items").delete().eq("id", id);
  if (error) fail(error, "Couldn't remove the item.");
}

// Home --------------------------------------------------------------------

export type Budget = { id: number; amount: number; spent: number };

type BudgetRow = { id: number; budget_amount: number | null; total_spent: number | null };

const BUDGET_COLUMNS = "id, budget_amount, total_spent";

function toBudget(row: BudgetRow): Budget {
  return { id: row.id, amount: Number(row.budget_amount ?? 0), spent: Number(row.total_spent ?? 0) };
}

function startOfMonth(monthsAgo = 0): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
}

export async function getActiveBudget(): Promise<Budget | null> {
  const { householdId } = await getAccount();
  const { data, error } = await supabase
    .from("budgets")
    .select(BUDGET_COLUMNS)
    .eq("household_id", householdId)
    .eq("active_budget", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .overrideTypes<BudgetRow[], { merge: false }>();
  if (error) fail(error, "Couldn't load your budget.");
  return data[0] ? toBudget(data[0]) : null;
}

export async function updateBudgetAmount(id: number, amount: number): Promise<void> {
  const { error } = await supabase.from("budgets").update({ budget_amount: amount }).eq("id", id);
  if (error) fail(error, "Couldn't update your budget.");
}

export async function createBudget(amount: number): Promise<Budget> {
  const { userId, householdId } = await getAccount();
  const message = "Couldn't create your budget.";

  // Only one budget should be active at a time
  const old = await supabase
    .from("budgets")
    .update({ active_budget: false })
    .eq("household_id", householdId)
    .eq("active_budget", true);
  if (old.error) fail(old.error, message);

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      user_id: userId,
      household_id: householdId,
      date: startOfMonth().toISOString().slice(0, 10),
      budget_amount: amount,
      total_spent: 0,
      active_budget: true,
    })
    .select(BUDGET_COLUMNS)
    .single()
    .overrideTypes<BudgetRow, { merge: false }>();
  if (error) fail(error, message);
  return toBudget(data);
}

export async function getLastMonthSpent(): Promise<number> {
  const { householdId } = await getAccount();
  const { data, error } = await supabase
    .from("receipts")
    .select("total_amount")
    .eq("household_id", householdId)
    .gte("purchased_at", startOfMonth(1).toISOString())
    .lt("purchased_at", startOfMonth(0).toISOString())
    .overrideTypes<{ total_amount: number | null }[], { merge: false }>();
  if (error) fail(error, "Couldn't load last month's spending.");
  return data.reduce((sum, row) => sum + Number(row.total_amount ?? 0), 0);
}

export async function getCategoryCounts(): Promise<Record<Category, number>> {
  const { householdId } = await getAccount();
  const { data, error } = await supabase
    .from("receipt_items")
    .select("category")
    .eq("household_id", householdId)
    .is("deleted_at", null)
    .overrideTypes<{ category: string | null }[], { merge: false }>();
  if (error) fail(error, "Couldn't load your inventory counts.");

  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
  for (const { category } of data) {
    const key = CATEGORIES.find((c) => c === category) ?? "Misc";
    counts[key] += 1;
  }
  return counts;
}

// Scan --------------------------------------------------------------------

type NewReceipt = {
  storeName: string;
  date: string;
  total: number | null;
  items: ReceiptItem[];
};

export async function saveReceipt({ storeName, date, total, items }: NewReceipt): Promise<void> {
  const { userId, householdId } = await getAccount();
  const message = "Couldn't save your receipt.";

  const parsedDate = new Date(date);
  const purchasedAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const receiptTotal = total ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const receipt = await supabase
    .from("receipts")
    .insert({
      user_id: userId,
      household_id: householdId,
      store_name: storeName || null,
      total_amount: receiptTotal,
      purchased_at: purchasedAt.toISOString(),
    })
    .select("id")
    .single();
  if (receipt.error) fail(receipt.error, message);
  const receiptId = receipt.data.id;

  const { error } = await supabase.from("receipt_items").insert(
    items.map((item) => ({
      receipt_id: receiptId,
      user_id: userId,
      household_id: householdId,
      item_name: item.itemName,
      quantity: item.quantity,
      unit_name: item.unit || "Quantity",
      unit_price: item.price,
      total_price: item.price * item.quantity,
      category: item.category,
      notes: item.note,
    })),
  );
  if (error) {
    // Don't leave a receipt with no items behind
    await supabase.from("receipts").delete().eq("id", receiptId);
    fail(error, message);
  }

  // The receipt is already saved, so a budget problem shouldn't show as a failed save
  try {
    const budget = await getActiveBudget();
    if (budget) await updateBudgetSpent(budget.id, budget.spent + receiptTotal);
  } catch {
    // Already logged by fail()
  }
}

async function updateBudgetSpent(id: number, spent: number): Promise<void> {
  const { error } = await supabase.from("budgets").update({ total_spent: spent }).eq("id", id);
  if (error) fail(error, "Couldn't update your budget.");
}
