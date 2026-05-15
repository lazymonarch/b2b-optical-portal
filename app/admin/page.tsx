import { AdminOrdersTable } from "@/components/orders/admin-orders-table";

export default function AdminPage() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Admin</p>
        <h1 className="text-3xl font-semibold tracking-tight">Incoming orders</h1>
        <p className="max-w-2xl text-muted-foreground">
          This dashboard is ready for live order data after Supabase queries are connected.
        </p>
      </div>
      <AdminOrdersTable orders={[]} />
    </main>
  );
}
