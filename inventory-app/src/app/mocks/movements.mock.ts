import { IMovement, IProductStats } from '../models/movement.model';

export const MOCK_MOVEMENTS: IMovement[] = [
  { id: 1, productId: 1, productName: 'Laptop Dell XPS 15', type: 'IN', quantity: 5, reason: 'Compra inicial', timestamp: '2024-01-15T10:00:00Z' },
  { id: 2, productId: 1, productName: 'Laptop Dell XPS 15', type: 'OUT', quantity: 2, reason: 'Venta realizada', timestamp: '2024-01-20T14:30:00Z' },
  { id: 3, productId: 1, productName: 'Laptop Dell XPS 15', type: 'IN', quantity: 7, reason: 'Reposición de stock', timestamp: '2024-01-25T09:15:00Z' },
];

export const MOCK_MOVEMENT: IMovement = MOCK_MOVEMENTS[0];

export const MOCK_MOVEMENT_HISTORY = {
  content: MOCK_MOVEMENTS,
  totalElements: MOCK_MOVEMENTS.length,
  totalPages: 1,
  currentPage: 0,
  size: 10,
};

export const MOCK_MOVEMENT_RESPONSE = {
  statusCode: 201,
  message: 'Movimiento registrado',
  data: MOCK_MOVEMENT,
};

export const MOCK_MOVEMENT_HISTORY_RESPONSE = {
  statusCode: 200,
  message: 'OK',
  data: MOCK_MOVEMENT_HISTORY,
};

export const MOCK_PRODUCT_STATS: IProductStats = {
  productId: 1,
  productName: 'Laptop Dell XPS 15',
  totalMovements: 3,
  totalIn: 2,
  totalOut: 1,
  averagePerMonth: 1.5,
  lastMovement: '2024-01-25T09:15:00Z',
};

export const MOCK_PRODUCT_STATS_RESPONSE = {
  statusCode: 200,
  message: 'OK',
  data: MOCK_PRODUCT_STATS,
};