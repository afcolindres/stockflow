export interface IMovement {
  id: number;
  productId: number;
  productName?: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  timestamp: string;
  alert?: {
    productId: number;
    productName: string;
    currentStock: number;
    minStock: number;
    severity: 'LOW' | 'CRITICAL';
  };
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
  data: {
    content: IMovement[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
  };
}

export interface IProductStats {
  productId: number;
  productName: string;
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  averagePerMonth: number;
  lastMovement: string | null;
}

export interface IProductStatsResponse {
  statusCode: number;
  message: string;
  data: IProductStats;
}