-- Roles enum + table (Lovable secure pattern)
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Products table
create type public.product_category as enum ('tricycle', 'moto', 'piece');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category product_category not null,
  subcategory text,
  price numeric(12,2) not null,
  old_price numeric(12,2),
  description text not null,
  short_description text not null,
  specifications jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  in_stock boolean not null default true,
  is_best_seller boolean not null default false,
  is_new boolean not null default false,
  rating numeric(3,2) not null default 5,
  reviews integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view products"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Admins can manage products"
  on public.products for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Orders table
create type public.order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  quantity integer not null default 1,
  unit_price numeric(12,2),
  total_price numeric(12,2),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_address text not null,
  customer_city text not null,
  message text,
  status order_status not null default 'pending',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.orders enable row level security;

create policy "Anyone can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view all orders"
  on public.orders for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage orders"
  on public.orders for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Contact messages table
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can create contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view all contact messages"
  on public.contact_messages for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage contact messages"
  on public.contact_messages for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();