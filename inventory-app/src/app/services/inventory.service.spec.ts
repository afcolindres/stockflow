import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;

  const mockProductResponse = {
    statusCode: 200,
    message: 'OK',
    data: {
      content: [
        { id: 1, sku: 'ELEC-001', name: 'Laptop', category: 'Electrónica', currentStock: 10, minStock: 5, unitPrice: 1000 }
      ],
      totalElements: 1,
      totalPages: 1,
      currentPage: 0,
      size: 10
    }
  };

  const mockAlertsResponse = {
    statusCode: 200,
    message: 'OK',
    data: [
      { productId: 1, productName: 'Laptop', currentStock: 3, minStock: 5, severity: 'LOW' }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InventoryService]
    });

    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getProducts', () => {
    it('should fetch products with pagination', (done) => {
      service.getProducts(0, 10).subscribe(response => {
        expect(response.statusCode).toBe(200);
        expect(response.data.content.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/products?page=0&size=10');
      req.flush(mockProductResponse);
    });

    it('should include category filter when provided', (done) => {
      service.getProducts(0, 10, 'Electrónica').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/products?page=0&size=10&category=Electr%C3%B3nica');
      req.flush(mockProductResponse);
    });
  });

  describe('getProductById', () => {
    it('should fetch product by id', (done) => {
      service.getProductById(1).subscribe(response => {
        expect(response.statusCode).toBe(200);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/products/1');
      req.flush({
        statusCode: 200,
        message: 'OK',
        data: mockProductResponse.data.content[0]
      });
    });
  });

  describe('createMovement', () => {
    it('should create movement', (done) => {
      service.createMovement({
        productId: 1,
        type: 'IN',
        quantity: 5,
        reason: 'Test'
      }).subscribe(response => {
        expect(response.statusCode).toBe(201);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/movements');
      req.flush({
        statusCode: 201,
        message: 'Movimiento registrado',
        data: { id: 1 }
      });
    });
  });

  describe('getAlerts', () => {
    it('should fetch alerts', (done) => {
      service.getAlerts().subscribe(response => {
        expect(response.statusCode).toBe(200);
        expect(response.data.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/alerts');
      req.flush(mockAlertsResponse);
    });
  });

  describe('getCategories', () => {
    it('should fetch categories', (done) => {
      service.getCategories().subscribe(response => {
        expect(response.statusCode).toBe(200);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/categories');
      req.flush({
        statusCode: 200,
        message: 'OK',
        data: ['Electrónica', 'Hogar']
      });
    });
  });

  describe('searchProducts', () => {
    it('should search products', (done) => {
      service.searchProducts('laptop', 10).subscribe(response => {
        expect(response.statusCode).toBe(200);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/products/search?q=laptop&limit=10');
      req.flush({
        statusCode: 200,
        message: 'OK',
        data: mockProductResponse.data.content
      });
    });
  });

  describe('getMovementHistory', () => {
    it('should fetch movement history', (done) => {
      service.getMovementHistory(1, 0, 10).subscribe(response => {
        expect(response.statusCode).toBe(200);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/movements/1/history?page=0&size=10');
      req.flush({
        statusCode: 200,
        message: 'OK',
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          currentPage: 0,
          size: 10
        }
      });
    });
  });

  describe('getProductStats', () => {
    it('should fetch product stats', (done) => {
      service.getProductStats(1).subscribe(response => {
        expect(response.statusCode).toBe(200);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/v1/products/1/stats');
      req.flush({
        statusCode: 200,
        message: 'OK',
        data: {
          productId: 1,
          productName: 'Laptop',
          totalMovements: 5,
          totalIn: 3,
          totalOut: 2,
          averagePerMonth: 1.5,
          lastMovement: new Date()
        }
      });
    });
  });
});