import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton rows based on rows input', () => {
    component.rows = 5;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('.skeleton-row');
    expect(rows.length).toBe(5);
  });

  it('should use default row height', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const row = compiled.querySelector('.skeleton-row') as HTMLElement;
    expect(row?.style.height).toBe('48px');
  });

  it('should use custom row height when provided', () => {
    component.rowHeight = '100px';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const row = compiled.querySelector('.skeleton-row') as HTMLElement;
    expect(row?.style.height).toBe('100px');
  });

  it('should have data-test-id attribute', () => {
    component.dataTestId = 'custom-skeleton';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const element = compiled.querySelector('[data-test-id="custom-skeleton"]');
    expect(element).toBeTruthy();
  });

  it('should have default data-test-id', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const element = compiled.querySelector('[data-test-id="skeleton-loader"]');
    expect(element).toBeTruthy();
  });

  it('should generate correct rows array', () => {
    component.rows = 3;
    expect(component.rowsArray).toEqual([0, 1, 2]);
  });

  it('should render 0 rows when rows is 0', () => {
    component.rows = 0;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('.skeleton-row');
    expect(rows.length).toBe(0);
  });
});