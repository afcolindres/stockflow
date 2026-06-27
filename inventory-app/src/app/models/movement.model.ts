export interface IMovement {
  id: number;
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  timestamp: string;
}

export interface IMovementRequest {
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
}

export interface IMovementResponse {
  statusCode: number;
  message: string;
  data: IMovement;
}

export interface IMovementHistoryResponse {
  statusCode: number;
  message: string;
  data: IMovement[];
}