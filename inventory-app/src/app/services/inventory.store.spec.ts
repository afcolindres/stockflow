import { TestBed } from '@angular/core/testing';
import { InventoryStore, FilterState } from './inventory.store';
import { InventoryService } from './inventory.service';
import { ToastService } from './toast.service';
import { IProduct } from '../models/product.model';
import { IStockAlert } from '../models/alert.model';
import { of, throwError } from 'rxjs';

describe('InventoryStore', () => {
  let store: InventoryStore;
  let mockInventoryService: any;
  let mockToastService: any;

  const mockProducts: IProduct[] = [
    { id: 1, sku: 'ELEC-001', name: 'Laptop', category: 'Electrónica', currentStock: 10, minStock: 5, unitPrice: 1000 },
    { id: 2, sku: 'HOME-001', name: 'Silla', category: 'Hogar', currentStock: 3, minStock: 5, unitPrice: 200 },
  ];

  const mockAlerts: IStockAlert[] = [
    { productId: 2, productName: 'Silla', currentStock: 3, minStock: 5, severity: 'LOW' },
  ];

  beforeEach(() => {
    mockInventoryService = {
      getProducts: () => of({ statusCode: 200, message: 'OK', data: { content: mockProducts, totalElements: 2, totalPages: 1, currentPage: 0, size: 10 } }),
      getAlerts: () => of({ statusCode: 200, message: 'OK', data: mockAlerts }),
      getCategories: () => of({ statusCode: 200, message: 'OK', data: ['Electrónica', 'Hogar'] }),
      createMovement: () => of({ statusCode: 201, message: 'Movimiento registrado', data: { id: 1 } }),
      searchProducts: () => of({ statusCode: 200, message: 'OK', data: mockProducts }),
      getMovementHistory: () => of({ statusCode: 200, message: 'OK', data: { content: [], totalElements: 0, totalPages: 0, currentPage: 0, size: 10 } }),
      getProductById: () => of({ statusCode: 200, message: 'OK', data: mockProducts[0] }),
      getProductStats: () => of({ statusCode: 200, message: 'OK', data: { totalMovements: 1, totalIn: 1, totalOut: 0 } }),
    };

    mockToastService = {
      show: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        InventoryStore,
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: ToastService, useValue: mockToastService },
      ],
    });

    store = TestBed.inject(InventoryStore);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should have empty products', () => {
      expect(store.products$()).toEqual([]);
    });

    it('should have empty alerts', () => {
      expect(store.alerts$()).toEqual([]);
    });

    it('should not be loading initially', () => {
      expect(store.loading$()).toBe(false);
    });

    it('should have no error initially', () => {
      expect(store.error$()).toBeNull();
    });

    it('should have default filters', () => {
      const filters = store.filters$();
      expect(filters.category).toBe('');
      expect(filters.page).toBe(0);
      expect(filters.size).toBe(10);
    });
  });

  describe('computed signals', () => {
    it('should compute totalProducts from pagination', async () => {
      await store.loadProducts();
      expect(store.totalProducts()).toBe(2);
    });

    it('should compute activeAlerts from alerts length', async () => {
      await store.loadAlerts();
      expect(store.activeAlerts()).toBe(1);
    });

    it('should compute totalValue from products', async () => {
      await store.loadProducts();
      expect(store.totalValue()).toBe(10600);
    });
  });

  describe('setFilters', () => {
    it('should update partial filters', () => {
      store.setFilters({ category: 'Electrónica' });
      const filters = store.filters$();
      expect(filters.category).toBe('Electrónica');
    });

    it('should persist filters to localStorage', async () => {
      store.setFilters({ category: 'Test' });
      await Promise.resolve();
      await Promise.resolve();
      const stored = localStorage.getItem('inventory-filters');
      expect(stored).toContain('Test');
    });
  });

  describe('loadProducts', () => {
    it('should load products successfully', async () => {
      await store.loadProducts();
      expect(store.products$()).toEqual(mockProducts);
    });
  });

  describe('loadAlerts', () => {
    it('should load alerts successfully', async () => {
      await store.loadAlerts();
      expect(store.alerts$()).toEqual(mockAlerts);
    });
  });

  describe('createMovement', () => {
    it('should create movement successfully', async () => {
      const result = await store.createMovement({
        productId: 1,
        type: 'IN',
        quantity: 5,
        reason: 'Test',
      });
      expect(result).toBe(true);
    });
  });

  describe('selectProduct', () => {
    it('should set selected product', () => {
      store.selectProduct(mockProducts[0]);
      expect(store.selectedProduct$()).toEqual(mockProducts[0]);
    });

    it('should clear selected product when null', () => {
      store.selectProduct(mockProducts[0]);
      store.selectProduct(null);
      expect(store.selectedProduct$()).toBeNull();
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const result = await store.getProductById(1);
      expect(result).toEqual(mockProducts[0]);
    });
  });

  describe('clearError', () => {
    it('should clear error signal', () => {
      store.clearError();
      expect(store.error$()).toBeNull();
    });
  });

  describe('loadCategories', () => {
    it('should load categories successfully', async () => {
      await store.loadCategories();
      expect(store.categories$()).toEqual(['Electrónica', 'Hogar']);
    });

    it('should handle error and return empty array', async () => {
      mockInventoryService.getCategories = () => throwError(() => new Error('Error'));
      await store.loadCategories();
      expect(store.categories$()).toEqual([]);
    });
  });

  describe('searchProducts', () => {
    it('should search products and return results', async () => {
      const results = await store.searchProducts('laptop', 10);
      expect(results).toEqual(mockProducts);
    });

    it('should return empty array on error', async () => {
      mockInventoryService.searchProducts = () => throwError(() => new Error('Error'));
      const results = await store.searchProducts('test');
      expect(results).toEqual([]);
    });

    it('should return empty array when no data', async () => {
      mockInventoryService.searchProducts = () => of({ statusCode: 200, message: 'OK', data: null });
      const results = await store.searchProducts('test');
      expect(results).toEqual([]);
    });
  });

  describe('getMovementHistory', () => {
    it('should return movement history', async () => {
      const history = await store.getMovementHistory(1);
      expect(history.content).toEqual([]);
    });

    it('should return empty on error', async () => {
      mockInventoryService.getMovementHistory = () => throwError(() => new Error('Error'));
      const history = await store.getMovementHistory(1);
      expect(history.content).toEqual([]);
    });
  });

  describe('getProductStats', () => {
    it('should return product stats', async () => {
      const stats = await store.getProductStats(1);
      expect(stats).toEqual({ totalMovements: 1, totalIn: 1, totalOut: 0 });
    });

    it('should return null on error', async () => {
      mockInventoryService.getProductStats = () => throwError(() => new Error('Error'));
      const stats = await store.getProductStats(1);
      expect(stats).toBeNull();
    });
  });

  describe('loadProducts error handling', () => {
    it('should set error on failure', async () => {
      mockInventoryService.getProducts = () => throwError(() => new Error('Network error'));
      await store.loadProducts();
      expect(store.error$()).toBe('Network error');
    });

    it('should set error with default message on non-Error exception', async () => {
      mockInventoryService.getProducts = () => throwError(() => 'String error');
      await store.loadProducts();
      expect(store.error$()).toBe('Error al cargar productos');
    });

    it('should set loading to false after error', async () => {
      mockInventoryService.getProducts = () => throwError(() => new Error('Error'));
      await store.loadProducts();
      expect(store.loading$()).toBe(false);
    });
  });

  describe('loadAlerts error handling', () => {
    it('should set error on failure', async () => {
      mockInventoryService.getAlerts = () => throwError(() => new Error('Network error'));
      await store.loadAlerts();
      expect(store.error$()).toBe('Network error');
    });

    it('should set loading to false after error', async () => {
      mockInventoryService.getAlerts = () => throwError(() => new Error('Error'));
      await store.loadAlerts();
      expect(store.loading$()).toBe(false);
    });
  });

  describe('createMovement error handling', () => {
    it('should return false on error', async () => {
      mockInventoryService.createMovement = () => throwError(() => new Error('Error'));
      const result = await store.createMovement({ productId: 1, type: 'IN', quantity: 5, reason: 'Test' });
      expect(result).toBe(false);
    });

    it('should set error on failure', async () => {
      mockInventoryService.createMovement = () => throwError(() => new Error('Error'));
      await store.createMovement({ productId: 1, type: 'IN', quantity: 5, reason: 'Test' });
      expect(store.error$()).toBe('Error');
    });

    it('should set loading to false after error', async () => {
      mockInventoryService.createMovement = () => throwError(() => new Error('Error'));
      await store.createMovement({ productId: 1, type: 'IN', quantity: 5, reason: 'Test' });
      expect(store.loading$()).toBe(false);
    });

    it('should return false when statusCode is not 200 or 201', async () => {
      mockInventoryService.createMovement = () => of({ statusCode: 400, message: 'Error', data: null });
      const result = await store.createMovement({ productId: 1, type: 'IN', quantity: 5, reason: 'Test' });
      expect(result).toBe(false);
    });
  });

  describe('computed signals - additional', () => {
    it('should compute criticalAlerts', async () => {
      const criticalAlerts: IStockAlert[] = [
        { productId: 1, productName: 'Product 1', currentStock: 1, minStock: 5, severity: 'CRITICAL' },
        { productId: 2, productName: 'Product 2', currentStock: 2, minStock: 5, severity: 'LOW' },
      ];
      mockInventoryService.getAlerts = () => of({ statusCode: 200, message: 'OK', data: criticalAlerts });
      await store.loadAlerts();
      expect(store.criticalAlerts()).toBe(1);
    });

    it('should compute totalStock', async () => {
      await store.loadProducts();
      expect(store.totalStock()).toBe(13);
    });
  });
});