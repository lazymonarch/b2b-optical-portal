"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export function CartSummary() {
  const { items, clearCart } = useCart();
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <section className="grid gap-4 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-medium">Order request</h2>
          <p className="text-sm text-muted-foreground">
            {items.length} items, {totalQuantity} total pieces
          </p>
        </div>
        <ShoppingCart className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      {items.length === 0 ? (
        <p className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
          Your cart is empty. Add products from the catalog before placing an order.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.variantId} className="rounded-md border p-3 text-sm">
              <div className="font-medium">{item.productName}</div>
              <div className="text-muted-foreground">
                {item.modelCode} · {item.colorName} · Qty {item.quantity}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={clearCart} disabled={items.length === 0}>
          Clear
        </Button>
        <Button disabled={items.length === 0}>Place order</Button>
      </div>
    </section>
  );
}
