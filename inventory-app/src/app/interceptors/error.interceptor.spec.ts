import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { errorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let toastServiceMock: any;
  let next: jest.Mock;

  beforeEach(() => {
    toastServiceMock = {
      show: jest.fn(),
    };

    next = jest.fn().mockImplementation(() => {
      throw new Error('Error');
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: ToastService, useValue: toastServiceMock },
      ],
    });
  });

  const createErrorResponse = (status: number, message: string, statusText: string = 'OK') => {
    return new HttpErrorResponse({
      status,
      statusText,
      error: { message },
    });
  };

  describe('error handling by status code', () => {
    it('should handle 400 Bad Request and show validation message', (done) => {
      const errorResponse = createErrorResponse(400, 'Parámetros inválidos');
      next.mockReturnValue(() => { throw errorResponse; });

      errorInterceptor(new HttpRequest('GET', '/api/test'), next).subscribe({
        error: () => {
          expect(toastServiceMock.show).toHaveBeenCalledWith('Parámetros inválidos', 'error');
          done();
        },
      });
    });

    it('should handle 404 Not Found and show not found message', (done) => {
      const errorResponse = createErrorResponse(404, 'Producto no encontrado');
      next.mockReturnValue(() => { throw errorResponse; });

      errorInterceptor(new HttpRequest('GET', '/api/test'), next).subscribe({
        error: () => {
          expect(toastServiceMock.show).toHaveBeenCalledWith('Producto no encontrado', 'error');
          done();
        },
      });
    });

    it('should handle 422 Unprocessable Entity and show stock message', (done) => {
      const errorResponse = createErrorResponse(422, 'Stock insuficiente');
      next.mockReturnValue(() => { throw errorResponse; });

      errorInterceptor(new HttpRequest('GET', '/api/test'), next).subscribe({
        error: () => {
          expect(toastServiceMock.show).toHaveBeenCalledWith('Stock insuficiente', 'error');
          done();
        },
      });
    });

    it('should handle 500 Internal Server Error and show error message', (done) => {
      const errorResponse = createErrorResponse(500, 'Error interno del servidor');
      next.mockReturnValue(() => { throw errorResponse; });

      errorInterceptor(new HttpRequest('GET', '/api/test'), next).subscribe({
        error: () => {
          expect(toastServiceMock.show).toHaveBeenCalledWith('Error interno del servidor', 'error');
          done();
        },
      });
    });

    it('should show default message when error has no message', (done) => {
      const errorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });
      next.mockReturnValue(() => { throw errorResponse; });

      errorInterceptor(new HttpRequest('GET', '/api/test'), next).subscribe({
        error: () => {
          expect(toastServiceMock.show).toHaveBeenCalledWith('Error de conexión', 'error');
          done();
        },
      });
    });

    it('should re-throw error after handling', (done) => {
      const errorResponse = createErrorResponse(400, 'Test error');
      next.mockReturnValue(() => { throw errorResponse; });

      errorInterceptor(new HttpRequest('GET', '/api/test'), next).subscribe({
        error: (err) => {
          expect(err).toBe(errorResponse);
          done();
        },
      });
    });
  });
});