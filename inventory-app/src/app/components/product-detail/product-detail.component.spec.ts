import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailPage } from './product-detail.component';
import { InventoryStore } from '../../services/inventory.store';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { IProduct } from '../../models/product.model';
import { IMovement, IProductStats } from '../../models/movement.model';
import { of } from 'rxjs';

describe('ProductDetailPage', () => {
  let component: ProductDetailPage;
  let fixture: ComponentFixture<ProductDetailPage>;
  let mockStore: any;
  let mockProduct: IProduct;
  let mockMovements: IMovement[];
  let mockStats: IProductStats;

  beforeEach(async () => {
    mockProduct = { id: 1, sku: 'ELEC-001', name: 'Laptop Dell XPS', category: 'Electrónica', currentStock: 10, minStock: 5, unitPrice: 1000 };
    mockMovements = [
      { id: 1, productId: 1, type: 'IN', quantity: 5, reason: 'Compra', timestamp: '2024-01-15T10:00:00Z' },
      { id: 2, productId: 1, type: 'OUT', quantity: 2, reason: 'Venta', timestamp: '2024-01-20T14:30:00Z' },
    ];
    mockStats = { productId: 1, productName: 'Laptop', totalMovements: 2, totalIn: 1, totalOut: 1, averagePerMonth: 1, lastMovement: '2024-01-20T14:30:00Z' };

    mockStore = {
      loading$: () => false,
      getProductById: jest.fn().mockResolvedValue(mockProduct),
      getMovementHistory: jest.fn().mockResolvedValue({
        content: mockMovements,
        totalPages: 2,
        totalElements: 2,
      }),
      getProductStats: jest.fn().mockResolvedValue(mockStats),
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailPage, SkeletonLoaderComponent],
      providers: [
        { provide: InventoryStore, useValue: mockStore },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('product loading', () => {
    it('should load product on init', async () => {
      await component.ngOnInit();
      expect(mockStore.getProductById).toHaveBeenCalledWith(1);
    });

    it('should set loading to false after load', async () => {
      await component.ngOnInit();
      expect(component.loading()).toBe(false);
    });

    it('should set product when found', async () => {
      await component.ngOnInit();
      expect(component.product()).toEqual(mockProduct);
    });

    it('should set null when product not found', async () => {
      mockStore.getProductById.mockResolvedValue(null);
      await component.ngOnInit();
      expect(component.product()).toBeNull();
    });

    it('should handle invalid id', async () => {
      (TestBed.inject(ActivatedRoute) as any).snapshot.paramMap.get = () => 'invalid';
      await component.ngOnInit();
      expect(component.loading()).toBe(false);
    });
  });

  describe('movement history', () => {
    it('should load history data', async () => {
      await component.loadHistoryData();

      expect(mockStore.getMovementHistory).toHaveBeenCalledWith(1, 0, 10);
      expect(component.history()).toEqual(mockMovements);
    });

    it('should set loading states', async () => {
      const loadPromise = component.loadHistoryData();

      expect(component.loadingHistory()).toBe(true);
      expect(component.historyLoaded()).toBe(true);

      await loadPromise;
      expect(component.loadingHistory()).toBe(false);
    });

    it('should calculate total pages', async () => {
      await component.loadHistoryData();

      expect(component.historyTotalPages()).toBe(2);
    });

    it('should not load if no product', async () => {
      component.product.set(null);

      await component.loadHistoryData();

      expect(mockStore.getMovementHistory).not.toHaveBeenCalled();
    });
  });

  describe('pagination', () => {
    it('should change page forward', async () => {
      await component.loadHistoryData(0);

      await component.changeHistoryPage(1);

      expect(component.historyPage()).toBe(1);
    });

    it('should not go below page 0', async () => {
      await component.loadHistoryData(0);

      await component.changeHistoryPage(-1);

      expect(component.historyPage()).toBe(0);
    });

    it('should not exceed total pages', async () => {
      await component.loadHistoryData(0);

      await component.changeHistoryPage(1);

      expect(mockStore.getMovementHistory).toHaveBeenCalledWith(1, 1, 10);
    });
  });

  describe('stats', () => {
    it('should load stats', async () => {
      await component.loadStats();

      expect(mockStore.getProductStats).toHaveBeenCalledWith(1);
      expect(component.stats()).toBeDefined();
    });

    it('should transform stats data', async () => {
      await component.loadStats();

      const stats = component.stats();
      expect(stats?.totalMovements).toBe(2);
      expect(stats?.totalIn).toBe(1);
      expect(stats?.totalOut).toBe(1);
    });

    it('should not load if already loaded', async () => {
      component.statsLoaded.set(true);

      await component.loadStats();

      expect(mockStore.getProductStats).not.toHaveBeenCalled();
    });

    it('should not load if no product', async () => {
      component.product.set(null);

      await component.loadStats();

      expect(mockStore.getProductStats).not.toHaveBeenCalled();
    });

    it('should handle stats error', async () => {
      mockStore.getProductStats.mockResolvedValue(null);

      await component.loadStats();

      expect(component.stats()).toBeNull();
    });
  });

  describe('signals', () => {
    it('should initialize with default signals', async () => {
      expect(component.history()).toEqual([]);
      expect(component.stats()).toBeNull();
      expect(component.historyPage()).toBe(0);
      expect(component.historyTotalPages()).toBe(0);
    });

    it('should track loading states', async () => {
      await component.ngOnInit();
      expect(component.loading()).toBe(false);
      expect(component.loadingHistory()).toBe(false);
      expect(component.loadingStats()).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should cleanup observer', () => {
      component.ngOnDestroy();

      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});