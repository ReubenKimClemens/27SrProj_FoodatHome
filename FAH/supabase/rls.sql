-- Access rules (row level security) for Food at Home.
-- These already ran as part of the households migration. This file is a copy
-- for reference, so don't run it again: the create statements would fail.
--
-- The rule: you can only see and change data from households you belong to.
-- public."user".auth_id links a row to the Supabase login (auth.uid()).

-- Helper functions -------------------------------------------------------------

-- The signed-in person's public."user".id
create or replace function public.current_app_user_id()
returns uuid
language sql stable security definer set search_path = public
as $$
  select id from public."user" where auth_id = auth.uid()
$$;

create or replace function public.is_household_member(hid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.household_members
    where household_id = hid and user_id = public.current_app_user_id()
  )
$$;

create or replace function public.is_household_owner(hid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.household_members
    where household_id = hid and user_id = public.current_app_user_id() and role = 'owner'
  )
$$;

-- Create a household and join it as owner. The app calls this on first login.
create or replace function public.create_household(household_name text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  me uuid := public.current_app_user_id();
  new_id uuid;
begin
  if me is null then raise exception 'Not signed in'; end if;
  insert into households (name, created_by) values (household_name, me) returning id into new_id;
  insert into household_members (household_id, user_id, role) values (new_id, me, 'owner');
  return new_id;
end;
$$;

-- Join a household with its invite code.
create or replace function public.join_household(code text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  me uuid := public.current_app_user_id();
  hid uuid;
begin
  if me is null then raise exception 'Not signed in'; end if;
  select id into hid from households where invite_code = upper(trim(code));
  if hid is null then raise exception 'Invalid invite code'; end if;
  insert into household_members (household_id, user_id) values (hid, me)
  on conflict do nothing;
  return hid;
end;
$$;

-- Turn on access rules -----------------------------------------------------------

alter table public.households          enable row level security;
alter table public.household_members   enable row level security;
alter table public.receipts            enable row level security;
alter table public.receipt_items       enable row level security;
alter table public.budgets             enable row level security;
alter table public.shopping_list       enable row level security;
alter table public.shopping_list_items enable row level security;
alter table public."user"              enable row level security;

-- Households -------------------------------------------------------------------

create policy "members read household" on public.households
  for select using (public.is_household_member(id));
create policy "owners update household" on public.households
  for update using (public.is_household_owner(id));
create policy "owners delete household" on public.households
  for delete using (public.is_household_owner(id));

create policy "members read members" on public.household_members
  for select using (public.is_household_member(household_id));
create policy "leave or owner removes" on public.household_members
  for delete using (user_id = public.current_app_user_id() or public.is_household_owner(household_id));

-- Household data ------------------------------------------------------------------

create policy "household access" on public.receipts
  for all using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));
create policy "household access" on public.receipt_items
  for all using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));
create policy "household access" on public.budgets
  for all using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));
create policy "household access" on public.shopping_list
  for all using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));

-- Shopping list items follow their list's household
create policy "household access" on public.shopping_list_items
  for all using (exists (
    select 1 from public.shopping_list l
    where l.id = shopping_list_id and public.is_household_member(l.household_id)
  ))
  with check (exists (
    select 1 from public.shopping_list l
    where l.id = shopping_list_id and public.is_household_member(l.household_id)
  ));

-- Users ----------------------------------------------------------------------------

-- You see yourself and your housemates
create policy "read self and housemates" on public."user"
  for select using (
    auth_id = auth.uid()
    or exists (
      select 1 from public.household_members mine
      join public.household_members theirs on theirs.household_id = mine.household_id
      where mine.user_id = public.current_app_user_id() and theirs.user_id = "user".id
    )
  );
-- The app creates your row on first login
create policy "insert self" on public."user"
  for insert with check (auth_id = auth.uid());
create policy "update self" on public."user"
  for update using (auth_id = auth.uid());
