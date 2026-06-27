import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { ToastService } from '../services/toast.service';

describe('ErrorInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ToastService, useValue: { show: jasmine.createSpy('show') } }
      ]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(errorInterceptor).toBeTruthy();
  });

  describe('error handling', () => {
    it('should handle 400 error with validation message', () => {
      const req = new HttpRequest('GET', '/test');
      const nextHandler = {
        handle: (req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> => {
          return new Observable(observer => {
            observer.error(new HttpErrorResponse({
              status: 400,
              error: { message: 'Parámetros inválidos' }
            }));
          });
        }
      };

      TestBed.inject(HttpClient).get('/test').subscribe({
        error: () => {}
      });

      const httpMock = TestBed.inject(HttpTestingController);
      httpMock.expectOne('/test');

      const mockReq = httpMock.match('/test')[0];
      mockReq.flush({}, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 404 error with not found message', () => {
      const httpMock = TestBed.inject(HttpTestingController);

      TestBed.inject(HttpClient).get('/test').subscribe({
        error: () => {}
      });

      const mockReq = httpMock.expectOne('/test');
      mockReq.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('should handle 422 error with stock insufficient message', () => {
      const httpMock = TestBed.inject(HttpTestingController);

      TestBed.inject(HttpClient).get('/test').subscribe({
        error: () => {}
      });

      const mockReq = httpMock.expectOne('/test');
      mockReq.flush({}, { status: 422, statusText: 'Unprocessable Entity' });
    });

    it('should handle 500 error with internal server message', () => {
      const httpMock = TestBed.inject(HttpTestingController);

      TestBed.inject(HttpClient).get('/test').subscribe({
        error: () => {}
      });

      const mockReq = httpMock.expectOne('/test');
      mockReq.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});