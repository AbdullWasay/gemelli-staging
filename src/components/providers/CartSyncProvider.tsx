// src/components/providers/CartSyncProvider.tsx
"use client";

import { useCartSync } from "@/hooks/useCartSync";

export default function CartSyncProvider({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}