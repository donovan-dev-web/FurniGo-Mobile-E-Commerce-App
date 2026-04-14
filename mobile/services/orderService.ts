import { api } from "./api";
import { CartItem } from "@/store/cartStore";

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export interface CheckoutSessionResponse {
  orderId: string;
  checkoutSessionId: string;
  checkoutUrl: string;
}

export function getOrderStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "PAID":
      return "Payee";
    case "FAILED":
      return "Echouee";
    default:
      return status;
  }
}

export function formatOrderDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// POST /orders
export async function createOrder(cartItems: CartItem[]): Promise<Order> {
  const response = await api.post<Order>("/orders", {
    items: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  });
  return response.data;
}

// POST /payments/checkout-session
export async function createCheckoutSession(
  orderId: string
): Promise<CheckoutSessionResponse> {
  const response = await api.post<CheckoutSessionResponse>(
    "/payments/checkout-session",
    { orderId }
  );
  return response.data;
}

// GET /orders
export async function fetchOrders(): Promise<Order[]> {
  const response = await api.get<Order[]>("/orders");
  return response.data;
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const orders = await fetchOrders();
  return orders.find((order) => order.id === orderId) ?? null;
}
