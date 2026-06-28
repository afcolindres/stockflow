import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { InventoryStore } from '../../services/inventory.store';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { MovementFormComponent } from '../movement-form/movement-form.component';
import { IProduct } from '../../models/product.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockStore: jest.Mocked<InventoryStore>;

  const mockProducts: IProduct[] = [
    { id: 1, sku: 'ELEC-001', name: 'Laptop', category: 'Electrónica', currentStock: 10, minStock: 5, unitPrice: 1000 },
    { id: 2, sku: 'HOME-001', name: 'Silla', category: 'Hogar', currentStock: 3, minStock: 5, unitPrice: 200 },
  ];

  const mockCategories = ['Electrónica', 'Hogar'];

  beforeEach(async () => {
    mockStore = {
      loadProducts: jest.fn().mockResolvedValue(undefined),
      loadCategories: jest.fn().mockResolvedValue(undefined),
      setFilters: jest.fn(),
      products$: jest.fn().mockReturnValue(mockProducts) as any,
      loading$: jest.fn().mockReturnValue(false) as any,
      filters$: jest.fn().mockReturnValue({ category: '', page: 0 }) as any,
      pagination$: jest.fn().mockReturnValue({ totalPages: 1 }) as any,
      categories$: jest.fn().mockReturnValue(mockCategories) as any,
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, SkeletonLoaderComponent, MovementFormComponent],
      providers: [{ provide: InventoryStore, useValue: mockStore }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product list container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('[data-test-id="product-list-container"]');
    expect(container).toBeTruthy();
  });

  it('should display product table', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('[data-test-id="product-list-table"]');
    expect(table).toBeTruthy();
  });

  it('should display table headers', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('th');
    const headerTexts = Array.from(headers).map(h => h.textContent);

    expect(headerTexts).toContain('SKU');
    expect(headerTexts).toContain('Nombre');
    expect(headerTexts).toContain('Categoría');
    expect(headerTexts).toContain('Stock');
  });

  it('should display product rows', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('[data-test-id^="product-row-"]');
    expect(rows.length).toBe(2);
  });

  it('should display stock badge for each product', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('[data-test-id="product-stock-badge-ELEC-001"]');
    expect(badge).toBeTruthy();
  });

  it('should display stock status OK when stock > minStock', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('[data-test-id="product-stock-badge-ELEC-001"]');
    expect(badge?.textContent).toContain('OK');
  });

  it('should display stock status BAJO when stock <= minStock', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('[data-test-id="product-stock-badge-HOME-001"]');
    expect(badge?.textContent).toContain('BAJO');
  });

  it('should display category filter', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const filter = compiled.querySelector('[data-test-id="filter-category"]');
    expect(filter).toBeTruthy();
  });

  it('should display register movement button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('[data-test-id="btn-open-movement-form"]');
    expect(button).toBeTruthy();
  });

  it('should show skeleton loader when loading', () => {
    mockStore.loading$.mockReturnValue(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('[data-test-id="skeleton-loader"]');
    expect(skeleton).toBeTruthy();
  });

  it('should show detail button for each product', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('[data-test-id="product-btn-detail-ELEC-001"]');
    expect(button).toBeTruthy();
  });

  it('should call loadProducts on init', () => {
    expect(mockStore.loadProducts).toHaveBeenCalled();
  });

  it('should call loadCategories on init', () => {
    expect(mockStore.loadCategories).toHaveBeenCalled();
  });

  it('should update category on filter change', () => {
    component.selectedCategory = 'Electrónica';
    component.onCategoryChange();

    expect(mockStore.setFilters).toHaveBeenCalledWith({ category: 'Electrónica', page: 0 });
  });

  it('should return correct stock class for OK status', () => {
    const product = mockProducts[0];
    const result = component.getStockClass(product);
    expect(result).toContain('stock-ok');
  });

  it('should return correct stock class for LOW status', () => {
    const product = mockProducts[1];
    const result = component.getStockClass(product);
    expect(result).toContain('stock-low');
  });

  it('should return OK for stock greater than minStock', () => {
    const product = mockProducts[0];
    expect(component.getStockStatus(product)).toBe('OK');
  });

  it('should return BAJO for stock less than or equal to minStock', () => {
    const product = mockProducts[1];
    expect(component.getStockStatus(product)).toBe('BAJO');
  });

  it('should return CRÍTICO for stock less than or equal to minStock/2', () => {
    const criticalProduct: IProduct = { id: 3, sku: 'CRIT-001', name: 'Critical', category: 'Test', currentStock: 2, minStock: 5, unitPrice: 100 };
    expect(component.getStockStatus(criticalProduct)).toBe('CRÍTICO');
  });

  it('should return correct class for CRÍTICO status', () => {
    const criticalProduct: IProduct = { id: 3, sku: 'CRIT-001', name: 'Critical', category: 'Test', currentStock: 2, minStock: 5, unitPrice: 100 };
    const result = component.getStockClass(criticalProduct);
    expect(result).toContain('stock-critical');
  });

  it('should update stock badge in real time when stock changes', () => {
    const product = mockProducts[0];
    expect(component.getStockStatus(product)).toBe('OK');
    product.currentStock = 2;
    expect(component.getStockStatus(product)).toBe('CRÍTICO');
  });
});