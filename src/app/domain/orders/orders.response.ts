export interface Bill {
  id: number;
  type: string;
  value: number;
  createdAt: string;
}

export interface CreateOrderResponse {
  bill: Bill;
}
