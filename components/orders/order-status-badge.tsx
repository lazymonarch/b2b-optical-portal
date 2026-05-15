import type { OrderStatus } from "@/types/orders";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className="inline-flex rounded-md border px-2 py-1 text-xs font-medium">
      {statusLabels[status]}
    </span>
  );
}
