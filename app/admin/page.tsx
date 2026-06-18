import StatCard from "@/components/admin/StatCard";
import AdminOrdersTable, { type AdminOrder } from "@/components/orders/admin-orders-table";
import { createClient } from "@/lib/supabase/server";

interface SearchParams {
  status?: string;
}

const orderStatuses = ["pending", "confirmed", "dispatched", "delivered"] as const;
const statuses = ["all", ...orderStatuses] as const;

function isOrderStatus(status: string): status is (typeof orderStatuses)[number] {
  return orderStatuses.includes(status as (typeof orderStatuses)[number]);
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select(
      `
      id,
      status,
      notes,
      created_at,
      shops ( shop_name, city, phone ),
      order_items ( quantity )
    `,
    )
    .order("created_at", { ascending: false });

  if (status && status !== "all" && isOrderStatus(status)) {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error("Admin orders fetch error:", error);
  }

  const allOrders = (orders ?? []) as unknown as AdminOrder[];
  const todayStr = new Date().toDateString();
  const todayCount = allOrders.filter(
    (order) => new Date(order.created_at).toDateString() === todayStr,
  ).length;
  const pendingCount = allOrders.filter((order) => order.status === "pending").length;
  const confirmedCount = allOrders.filter((order) => order.status === "confirmed").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">Orders Dashboard</h1>
        <p className="text-sm text-neutral-500">
          Manage and update incoming shop orders
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="New orders today" value={todayCount} />
        <StatCard label="Pending confirmation" value={pendingCount} accent="warning" />
        <StatCard label="Confirmed" value={confirmedCount} accent="success" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {statuses.map((item) => {
          const isActive = (status ?? "all") === item;

          return (
            <a
              key={item}
              href={item === "all" ? "/admin" : `/admin?status=${item}`}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                isActive
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {item}
            </a>
          );
        })}
      </div>

      <AdminOrdersTable orders={allOrders} />
    </div>
  );
}
