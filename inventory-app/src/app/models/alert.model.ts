export interface IStockAlert {
  productId: number;
  productName: string;
  currentStock: number;
  minStock: number;
  severity: 'LOW' | 'CRITICAL';
}

export interface IAlertsResponse {
  statusCode: number;
  message: string;
  data: IStockAlert[];
}