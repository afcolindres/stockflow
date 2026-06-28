import { IStockAlert } from '../models/alert.model';

export const MOCK_ALERTS: IStockAlert[] = [
  { productId: 3, productName: 'Silla Ergonométrica', currentStock: 3, minStock: 5, severity: 'LOW' },
  { productId: 4, productName: 'Mesa de Centro', currentStock: 0, minStock: 3, severity: 'CRITICAL' },
  { productId: 6, productName: 'Silla de Oficina', currentStock: 2, minStock: 5, severity: 'CRITICAL' },
];

export const MOCK_ALERT: IStockAlert = MOCK_ALERTS[0];

export const MOCK_ALERTS_RESPONSE = {
  statusCode: 200,
  message: 'OK',
  data: MOCK_ALERTS,
};

export const MOCK_CRITICAL_ALERTS = MOCK_ALERTS.filter(a => a.severity === 'CRITICAL');
export const MOCK_LOW_ALERTS = MOCK_ALERTS.filter(a => a.severity === 'LOW');