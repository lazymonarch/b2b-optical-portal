"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "pending" | "confirmed" | "dispatched" | "delivered";

export type AdminOrder = {
  id: string;
  status: Status;
  notes: string | null;
  created_at: string;
  shops: {
    shop_name: string | null;
    city: string | null;
    phone: string | null;
  } | null;
  order_items: {
    quantity: number;
  }[];
};

const statusStyles: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  dispatched: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
};

export default function AdminOrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  async function updateStatus(orderId: string, status: Status) {
    setUpdating(orderId);

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = (await res.json()) as { error?: string };
        console.error(data.error ?? "Failed to update order status.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center text-sm text-neutral-400">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
          <tr>
            <th className="px-5 py-3 text-xs font-medium">Order</th>
            <th className="px-5 py-3 text-xs font-medium">Shop</th>
            <th className="px-5 py-3 text-xs font-medium">Items</th>
            <th className="px-5 py-3 text-xs font-medium">Date</th>
            <th className="px-5 py-3 text-xs font-medium">Status</th>
            <th className="px-5 py-3 text-xs font-medium">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {orders.map((order) => {
            const totalPkts = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
            const date = new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            });
            const currentStatus = order.status;

            return (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="px-5 py-4 font-mono text-xs text-neutral-600">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-5 py-4 font-medium text-neutral-900">
                  {order.shops?.shop_name ?? "Unknown shop"}
                </td>
                <td className="px-5 py-4 text-xs text-neutral-600">{totalPkts} pkts</td>
                <td className="px-5 py-4 text-xs text-neutral-500">{date}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded border px-2 py-1 text-[11px] font-medium uppercase ${statusStyles[currentStatus]}`}
                  >
                    {currentStatus}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={currentStatus}
                    disabled={updating === order.id}
                    onChange={(event) => updateStatus(order.id, event.target.value as Status)}
                    className="cursor-pointer rounded border border-neutral-200 px-2 py-1.5 text-xs disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
