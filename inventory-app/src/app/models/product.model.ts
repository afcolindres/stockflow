export interface IProduct {
  id: number;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
}

export interface IProductResponse {
  statusCode: number;
  message: string;
  data: IProduct[];
}

export interface IProductDetailResponse {
  statusCode: number;
  message: string;
  data: IProduct;
}