create table if not exists public.product_orders (
  id uuid primary key default gen_random_uuid(),
  razorpay_order_id text not null unique,
  razorpay_payment_id text not null unique,
  product_id text not null,
  buyer_email text not null,
  amount integer not null,
  currency text not null default 'INR',
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  created_at timestamptz not null default now()
);

alter table public.product_orders enable row level security;

create policy "Buyers can read their orders"
on public.product_orders for select
to authenticated
using (auth.email() = buyer_email);