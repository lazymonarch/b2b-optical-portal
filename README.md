# Lakshan Enterprises B2B Optical Portal

A secure, high-performance wholesale ordering portal built for Lakshan Enterprises. Optical shops can browse the catalog, build a cart, and place enquiry orders. Admins manage order fulfillment and receive instant notifications via email and WhatsApp.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** Zustand (with Next.js SSR-safe localStorage)
- **Database & Auth:** Supabase (PostgreSQL + RLS)
- **Notifications:** Resend (Email) & Twilio (WhatsApp)

## 📦 Features

- **Public Storefront:** Browse categories, view products, and see color variants.
- **Persistent Cart:** Items remain in the cart even if the user refreshes or closes the tab.
- **Secure Shop Accounts:** B2B customers must register and log in to checkout and view order history.
- **Admin Dashboard:** Private command center for admins to view metrics and instantly update order statuses (`Pending` → `Confirmed` → `Dispatched` → `Delivered`).
- **Real-time Notifications:** Automated routing of new order alerts directly to the Admin's phone and inbox.

## 🛠️ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/b2b-optical-portal.git
cd b2b-optical-portal
npm install
```

### 2. Environment Variables
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env.local
```

### 3. Supabase Database Setup
Run the following SQL queries in your Supabase SQL Editor to generate the schema and enforce Row Level Security (RLS):

<details>
<summary><b>Click to expand SQL Schema & RLS Policies</b></summary>

```sql
-- 1. Create Tables
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  model_code TEXT UNIQUE NOT NULL,
  material TEXT,
  size TEXT,
  packing_info TEXT,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  color_name TEXT NOT NULL,
  color_hex TEXT,
  image_url TEXT
);

CREATE TABLE shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  shop_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  item_note TEXT
);

-- 2. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Public read access for catalog
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);

-- Shops can manage their own profile
CREATE POLICY "Shops read own profile" ON shops FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Shops insert own profile" ON shops FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Shops update own profile" ON shops FOR UPDATE USING (auth.uid() = user_id);

-- Shops can read their own orders
CREATE POLICY "Shops read own orders" ON orders FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid())
);
CREATE POLICY "Shops read own order items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE shop_id IN (SELECT id FROM shops WHERE user_id = auth.uid()))
);

-- Admin Override (Admins bypass RLS for all tables)
-- Assumes auth.users.raw_user_meta_data->>'role' = 'admin'
-- (Apply similar policy to all tables if needed)
```
</details>

### 4. Create the Admin User
To grant an account admin privileges, register a normal account in the app, then run this in the Supabase SQL Editor:
```sql
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin-email@example.com';
```

### 5. Run the Dev Server
```bash
npm run dev
```
Visit `http://localhost:3000` to view the application.

## 📂 Project Structure

- `/app`: Next.js App Router (Pages, Layouts, API Routes)
- `/components`: React components grouped by feature (`/admin`, `/products`, `/orders`, etc.)
- `/hooks`: Custom React hooks (e.g., Zustand `useCart`)
- `/lib`: Utility functions, Supabase clients, and Notification triggers.
- `/types`: TypeScript interfaces for database rows.

## 🏁 Phase 1 Complete
Core wholesale ordering loop is finalized. 
*Next steps:* Add shop-facing automated emails and create an admin page to view a master list of registered shop customers.
