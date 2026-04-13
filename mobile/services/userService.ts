import { api } from "./api";

export interface PersonalData {
  nom: string;
  email: string;
  provider: string;
  dateCreation: string;
}

export interface PseudonymizedOrder {
  orderId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface AnonymizedStats {
  nombreCommandes: number;
  montantTotalHistorique: number;
}

export interface UserExportData {
  donneesPersonnelles: PersonalData;
  donneesPseudonymisees: PseudonymizedOrder[];
  donneesAnonymisees: AnonymizedStats;
}

export async function fetchOrderCount(): Promise<number> {
  const response = await api.get("/orders");
  return response.data.length;
}

export async function exportUserData(): Promise<UserExportData> {
  const response = await api.get<UserExportData>("/user/export");
  return response.data;
}

export async function deleteAccount(): Promise<void> {
  await api.delete("/user");
}