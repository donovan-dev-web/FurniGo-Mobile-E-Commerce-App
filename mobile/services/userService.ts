import { api } from "./api";

export async function fetchOrderCount(): Promise<number> {
  const response = await api.get("/orders");
  return response.data.length;
}

export async function exportUserData(): Promise<object> {
  const response = await api.get("/user/export");
  return response.data;
}

export async function deleteAccount(): Promise<void> {
  await api.delete("/user");
}