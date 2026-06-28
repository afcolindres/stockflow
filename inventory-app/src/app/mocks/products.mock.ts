import { IProduct } from '../models/product.model';

export const MOCK_PRODUCTS: IProduct[] = [
  { id: 1, sku: 'ELEC-001', name: 'Laptop Dell XPS 15', category: 'Electrónica', currentStock: 10, minStock: 5, unitPrice: 1000 },
  { id: 2, sku: 'ELEC-002', name: 'Mouse Inalámbrico', category: 'Electrónica', currentStock: 25, minStock: 10, unitPrice: 25 },
  { id: 3, sku: 'HOME-001', name: 'Silla Ergonométrica', category: 'Hogar', currentStock: 3, minStock: 5, unitPrice: 200 },
  { id: 4, sku: 'HOME-002', name: 'Mesa de Centro', category: 'Hogar', currentStock: 0, minStock: 3, unitPrice: 150 },
  { id: 5, sku: 'OFFC-001', name: 'Escritorio Oficina', category: 'Oficina', currentStock: 8, minStock: 5, unitPrice: 350 },
  { id: 6, sku: 'OFFC-002', name: 'Silla de Oficina', category: 'Oficina', currentStock: 2, minStock: 5, unitPrice: 180 },
];

export const MOCK_PRODUCT: IProduct = MOCK_PRODUCTS[0];

export const MOCK_PRODUCTS_PAGE = {
  content: MOCK_PRODUCTS,
  totalElements: MOCK_PRODUCTS.length,
  totalPages: 1,
  currentPage: 0,
  size: 10,
};

export const MOCK_PRODUCT_SEARCH = {
  statusCode: 200,
  message: 'OK',
  data: MOCK_PRODUCTS,
};

export const MOCK_PRODUCT_DETAIL = {
  statusCode: 200,
  message: 'OK',
  data: MOCK_PRODUCT,
};

export const MOCK_CATEGORIES = ['Electrónica', 'Hogar', 'Oficina'];