import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsPanelComponent } from './alerts-panel.component';
import { InventoryStore } from '../../services/inventory.store';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { IStockAlert } from '../../models/alert.model';

describe('AlertsPanelComponent', () => {
  let component: AlertsPanelComponent;
  let fixture: ComponentFixture<AlertsPanelComponent>;
  let mockStore: jest.Mocked<InventoryStore>;

  const mockAlerts: IStockAlert[] = [
    { productId: 1, productName: 'Laptop', currentStock: 3, minStock: 5, severity: 'LOW' },
    { productId: 2, productName: 'Mouse', currentStock: 1, minStock: 5, severity: 'CRITICAL' },
  ];

  beforeEach(async () => {
    mockStore = {
      loadAlerts: jest.fn().mockResolvedValue(undefined),
      alerts$: jest.fn().mockReturnValue(mockAlerts) as any,
      loading$: jest.fn().mockReturnValue(false) as any,
    } as any;

    await TestBed.configureTestingModule({
      imports: [AlertsPanelComponent, SkeletonLoaderComponent],
      providers: [{ provide: InventoryStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display alerts panel container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('[data-test-id="alerts-panel-container"]');
    expect(container).toBeTruthy();
  });

  it('should display alerts list', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const list = compiled.querySelector('[data-test-id="alerts-panel-list"]');
    expect(list).toBeTruthy();
  });

  it('should display alert items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.alert-item');
    expect(items.length).toBe(2);
  });

  it('should display alert severity for each alert', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const severity = compiled.querySelector('[data-test-id="alert-severity-1"]');
    expect(severity?.textContent).toContain('LOW');
  });

  it('should apply correct severity class for LOW', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const item = compiled.querySelector('[data-test-id="alert-item-1"]');
    expect(item?.classList.contains('alert-low')).toBe(true);
  });

  it('should apply correct severity class for CRITICAL', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const item = compiled.querySelector('[data-test-id="alert-item-2"]');
    expect(item?.classList.contains('alert-critical')).toBe(true);
  });

  it('should show no alerts message when empty', () => {
    mockStore.alerts$.mockReturnValue([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const noAlerts = compiled.querySelector('.no-alerts');
    expect(noAlerts).toBeTruthy();
  });

  it('should call loadAlerts on init', () => {
    expect(mockStore.loadAlerts).toHaveBeenCalled();
  });

  it('should show skeleton when loading', () => {
    mockStore.loading$.mockReturnValue(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('[data-test-id="skeleton-loader"]');
    expect(skeleton).toBeTruthy();
  });
});