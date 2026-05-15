export type OrderStatus = "pending" | "confirmed" | "dispatched" | "delivered";

export type Shop = {
  id: string;
  user_id: string;
  shop_name: string;
  owner_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  shop_id: string;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  quantity: number;
  item_note: string | null;
};
