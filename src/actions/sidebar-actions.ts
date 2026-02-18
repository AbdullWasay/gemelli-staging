
"use server";

import { cookies } from "next/headers";

export async function toggleSidebar() {
  const cookieStore = await cookies();
  const currentState = cookieStore.get("sidebar-open")?.value === "true";
  cookieStore.set("sidebar-open", String(!currentState));
}

export async function getSidebarState() {
  const cookieStore = await cookies();
  return cookieStore.get("sidebar-open")?.value === "true";
}