import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });

    service = TestBed.inject(ToastService);
  });

  describe('initial state', () => {
    it('should not be visible initially', () => {
      expect(service.toast$().visible).toBe(false);
    });

    it('should have empty message initially', () => {
      expect(service.toast$().message).toBe('');
    });

    it('should have info type initially', () => {
      expect(service.toast$().type).toBe('info');
    });
  });

  describe('show', () => {
    it('should set message and type', () => {
      service.show('Test message', 'success');

      expect(service.toast$().message).toBe('Test message');
      expect(service.toast$().type).toBe('success');
      expect(service.toast$().visible).toBe(true);
    });

    it('should default to info type', () => {
      service.show('Test message');

      expect(service.toast$().type).toBe('info');
    });

    it('should support error type', () => {
      service.show('Error message', 'error');

      expect(service.toast$().type).toBe('error');
    });

    it('should support warning type', () => {
      service.show('Warning message', 'warning');

      expect(service.toast$().type).toBe('warning');
    });
  });

  describe('hide', () => {
    it('should hide toast', () => {
      service.show('Test message', 'success');
      service.hide();

      expect(service.toast$().visible).toBe(false);
    });

    it('should clear message on hide', () => {
      service.show('Test message', 'success');
      service.hide();

      expect(service.toast$().message).toBe('');
    });
  });

  describe('auto hide', () => {
    it('should auto hide after default duration', async () => {
      jest.useFakeTimers();
      service.show('Test message');

      expect(service.toast$().visible).toBe(true);

      jest.advanceTimersByTime(10000);

      expect(service.toast$().visible).toBe(false);
      jest.useRealTimers();
    });

    it('should auto hide after custom duration', async () => {
      jest.useFakeTimers();
      service.show('Test message', 'success', 5000);

      expect(service.toast$().visible).toBe(true);

      jest.advanceTimersByTime(5000);

      expect(service.toast$().visible).toBe(false);
      jest.useRealTimers();
    });
  });
});