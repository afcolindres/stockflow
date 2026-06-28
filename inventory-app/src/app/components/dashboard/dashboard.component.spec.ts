import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { InventoryStore } from '../../services/inventory.store';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { IProduct } from '../../models/product.model';
import { IStockAlert } from '../../models/alert.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockStore: jest.Mocked<InventoryStore>;

  const mockProducts: IProduct[] = [
    { id: 1, sku: 'ELEC-001', name: 'Laptop', category: 'Electrónica', currentStock: 10, minStock: 5, unitPrice: 1000 },
  ];

  const mockAlerts: IStockAlert[] = [
    { productId: 1, productName: 'Laptop', currentStock: 10, minStock: 5, severity: 'LOW' },
  ];

  beforeEach(async () => {
    mockStore = {
      loadProducts: jest.fn().mockResolvedValue(undefined),
      loadAlerts: jest.fn().mockResolvedValue(undefined),
      products$: jest.fn().mockReturnValue(mockProducts) as any,
      alerts$: jest.fn().mockReturnValue(mockAlerts) as any,
      loading$: jest.fn().mockReturnValue(false) as any,
      totalProducts: jest.fn().mockReturnValue(1) as any,
      activeAlerts: jest.fn().mockReturnValue(1) as any,
      criticalAlerts: jest.fn().mockReturnValue(0) as any,
      totalValue: jest.fn().mockReturnValue(10000) as any,
    } as any;

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, SkeletonLoaderComponent],
      providers: [{ provide: InventoryStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display dashboard container with data-test-id', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('[data-test-id="dashboard-container"]');
    expect(container).toBeTruthy();
  });

  it('should display total products from store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const element = compiled.querySelector('[data-test-id="dashboard-total-products"]');
    expect(element).toBeTruthy();
  });

  it('should display active alerts from store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const element = compiled.querySelector('[data-test-id="dashboard-total-alerts"]');
    expect(element).toBeTruthy();
  });

  it('should display critical alerts from store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const element = compiled.querySelector('[data-test-id="dashboard-critical-alerts"]');
    expect(element).toBeTruthy();
  });

  it('should display total inventory value from store', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const element = compiled.querySelector('[data-test-id="dashboard-total-value"]');
    expect(element).toBeTruthy();
  });

  it('should call loadProducts and loadAlerts on init', async () => {
    const store = TestBed.inject(InventoryStore);
    await TestBed.flushEffects();

    expect(store.loadProducts).toHaveBeenCalled();
    expect(store.loadAlerts).toHaveBeenCalled();
  });

  it('should show skeleton loader when loading', () => {
    mockStore.loading$.mockReturnValue(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('[data-test-id="skeleton-loader"]');
    expect(skeleton).toBeTruthy();
  });

  it('should show kpi cards when not loading', () => {
    mockStore.loading$.mockReturnValue(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const kpiCards = compiled.querySelectorAll('.kpi-card');
    expect(kpiCards.length).toBe(4);
  });

  it('should have correct kpi card labels', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const labels = compiled.querySelectorAll('.kpi-label');
    const labelTexts = Array.from(labels).map(l => l.textContent);

    expect(labelTexts).toContain('Total Productos');
    expect(labelTexts).toContain('Alertas Activas');
    expect(labelTexts).toContain('Alertas Críticas');
    expect(labelTexts).toContain('Valor Inventario');
  });
});