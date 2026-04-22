-- Fix function search_path
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tighten public insert policies
drop policy "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (
    length(trim(customer_name)) > 0
    and length(trim(customer_phone)) > 0
    and length(trim(customer_address)) > 0
    and length(trim(customer_city)) > 0
    and length(trim(product_name)) > 0
    and quantity > 0 and quantity <= 1000
  );

drop policy "Anyone can create contact messages" on public.contact_messages;
create policy "Anyone can create contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (
    length(trim(name)) > 0
    and length(trim(email)) > 0
    and length(trim(subject)) > 0
    and length(trim(message)) > 0
    and length(message) <= 5000
  );