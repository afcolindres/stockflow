export interface IProduct {
  id: number;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
}

export interface IProductPage {
  content: IProduct[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface IProductResponse {
  statusCode: number;
  message: string;
  data: IProductPage;
}

export interface IProductDetailResponse {
  statusCode: number;
  message: string;
  data: IProduct;
}