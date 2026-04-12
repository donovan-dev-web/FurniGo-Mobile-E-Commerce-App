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