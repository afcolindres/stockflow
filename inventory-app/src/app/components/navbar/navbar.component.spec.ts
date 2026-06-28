import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should render brand text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.brand-text')?.textContent).toContain('StockFlow');
    });

    it('should render dashboard link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const dashboardLink = compiled.querySelector('[data-test-id="nav-dashboard"]');
      expect(dashboardLink).toBeTruthy();
    });

    it('should render products link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const productsLink = compiled.querySelector('[data-test-id="nav-products"]');
      expect(productsLink).toBeTruthy();
    });

    it('should render alerts link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const alertsLink = compiled.querySelector('[data-test-id="nav-alerts"]');
      expect(alertsLink).toBeTruthy();
    });

    it('should have navigation container', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const nav = compiled.querySelector('[data-test-id="main-navigation"]');
      expect(nav).toBeTruthy();
    });
  });

  describe('links', () => {
    it('should have correct href for dashboard', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const link = compiled.querySelector('[data-test-id="nav-dashboard"]');
      expect(link?.getAttribute('routerlink')).toBe('/dashboard');
    });

    it('should have correct href for products', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const link = compiled.querySelector('[data-test-id="nav-products"]');
      expect(link?.getAttribute('routerlink')).toBe('/products');
    });

    it('should have correct href for alerts', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const link = compiled.querySelector('[data-test-id="nav-alerts"]');
      expect(link?.getAttribute('routerlink')).toBe('/alerts');
    });
  });

  describe('routerLinkActive', () => {
    it('should have routerLinkActive directive', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const links = compiled.querySelectorAll('[routerlinkactive]');
      expect(links.length).toBe(3);
    });
  });
});