import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import type { Order } from "@/types/orders";

type AdminOrdersTableProps = {
  orders: Order[];
};

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Incoming shop orders will appear here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{order.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
