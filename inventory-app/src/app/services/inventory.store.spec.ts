import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryStore } from './inventory.store';
import { ToastService } from './toast.service';
import { IProduct } from '../models/product.model';
import { IStockAlert } from '../models/alert.model';

describe('InventoryStore', () => {
  let store: InventoryStore;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InventoryStore, ToastService],
    }).compileComponents();

    store = TestBed.inject(InventoryStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('Signals', () => {
    it('should initialize products as empty array', () => {
      expect(store.products$()).toEqual([]);
    });

    it('should initialize alerts as empty array', () => {
      expect(store.alerts$()).toEqual([]);
    });

    it('should initialize selectedProduct as null', () => {
      expect(store.selectedProduct$()).toBeNull();
    });

    it('should initialize loading as false', () => {
      expect(store.loading$()).toBe(false);
    });

    it('should initialize error as null', () => {
      expect(store.error$()).toBeNull();
    });

    it('should initialize filters with default values', () => {
      expect(store.filters$()).toEqual({
        category: '',
        page: 0,
        size: 10,
      });
    });
  });

  describe('computed()', () => {
    it('should calculate totalProducts from products signal', () => {
      const products: IProduct[] = [
        { id: 1, sku: 'SKU-1', name: 'Product 1', category: 'A', currentStock: 10, minStock: 5, unitPrice: 100 },
        { id: 2, sku: 'SKU-2', name: 'Product 2', category: 'B', currentStock: 20, minStock: 10, unitPrice: 200 },
      ];
      (store as any).products.set(products);
      expect(store.totalProducts()).toBe(2);
    });

    it('should calculate totalProducts as 0 when no products', () => {
      (store as any).products.set([]);
      expect(store.totalProducts()).toBe(0);
    });

    it('should calculate criticalAlerts from alerts signal', () => {
      const alerts: IStockAlert[] = [
        { productId: 1, productName: 'Product 1', currentStock: 2, minStock: 10, severity: 'CRITICAL' },
        { productId: 2, productName: 'Product 2', currentStock: 5, minStock: 10, severity: 'LOW' },
        { productId: 3, productName: 'Product 3', currentStock: 3, minStock: 6, severity: 'CRITICAL' },
      ];
      (store as any).alerts.set(alerts);
      expect(store.criticalAlerts()).toBe(2);
    });

    it('should calculate totalValue correctly', () => {
      const products: IProduct[] = [
        { id: 1, sku: 'SKU-1', name: 'Product 1', category: 'A', currentStock: 10, minStock: 5, unitPrice: 100 },
        { id: 2, sku: 'SKU-2', name: 'Product 2', category: 'B', currentStock: 5, minStock: 10, unitPrice: 50 },
      ];
      (store as any).products.set(products);
      expect(store.totalValue()).toBe(10 * 100 + 5 * 50);
    });

    it('should calculate totalStock correctly', () => {
      const products: IProduct[] = [
        { id: 1, sku: 'SKU-1', name: 'Product 1', category: 'A', currentStock: 10, minStock: 5, unitPrice: 100 },
        { id: 2, sku: 'SKU-2', name: 'Product 2', category: 'B', currentStock: 20, minStock: 10, unitPrice: 200 },
      ];
      (store as any).products.set(products);
      expect(store.totalStock()).toBe(30);
    });
  });

  describe('selectProduct', () => {
    it('should set selectedProduct', () => {
      const product: IProduct = { id: 1, sku: 'SKU-1', name: 'Product 1', category: 'A', currentStock: 10, minStock: 5, unitPrice: 100 };
      store.selectProduct(product);
      expect(store.selectedProduct$()).toEqual(product);
    });

    it('should clear selectedProduct when null', () => {
      const product: IProduct = { id: 1, sku: 'SKU-1', name: 'Product 1', category: 'A', currentStock: 10, minStock: 5, unitPrice: 100 };
      store.selectProduct(product);
      store.selectProduct(null);
      expect(store.selectedProduct$()).toBeNull();
    });
  });

  describe('setFilters', () => {
    it('should update filters partially', () => {
      store.setFilters({ category: 'electronics' });
      expect(store.filters$().category).toBe('electronics');
      expect(store.filters$().page).toBe(0);
    });

    it('should preserve existing filter values', () => {
      store.setFilters({ category: 'electronics' });
      store.setFilters({ page: 2 });
      expect(store.filters$().category).toBe('electronics');
      expect(store.filters$().page).toBe(2);
    });
  });

  describe('clearError', () => {
    it('should clear error signal', () => {
      (store as any).error.set('Some error');
      store.clearError();
      expect(store.error$()).toBeNull();
    });
  });
});