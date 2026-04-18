export interface CartItem {
  productId: string;
  quantity: number;
}
export interface OrderPayload {
  clientId: string;
  tableNumber: string;
  guestName: string;
  items: CartItem[];
}