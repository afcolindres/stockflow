import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ToastService],
    }).compileComponents();

    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show()', () => {
    it('should set toast with default type info', () => {
      service.show('Test message');
      expect(service.toast$().message).toBe('Test message');
      expect(service.toast$().type).toBe('info');
      expect(service.toast$().visible).toBe(true);
    });

    it('should set toast with success type', () => {
      service.show('Success message', 'success');
      expect(service.toast$().type).toBe('success');
    });

    it('should set toast with error type', () => {
      service.show('Error message', 'error');
      expect(service.toast$().type).toBe('error');
    });

    it('should hide toast after default duration', (done) => {
      service.show('Test message');
      expect(service.toast$().visible).toBe(true);

      setTimeout(() => {
        expect(service.toast$().visible).toBe(false);
        done();
      }, 3100);
    });

    it('should hide toast after custom duration', (done) => {
      service.show('Test message', 'info', 1000);
      expect(service.toast$().visible).toBe(true);

      setTimeout(() => {
        expect(service.toast$().visible).toBe(false);
        done();
      }, 1100);
    });
  });

  describe('hide()', () => {
    it('should hide toast immediately', () => {
      service.show('Test message');
      expect(service.toast$().visible).toBe(true);

      service.hide();
      expect(service.toast$().visible).toBe(false);
    });

    it('should clear message when hiding', () => {
      service.show('Test message');
      service.hide();
      expect(service.toast$().message).toBe('');
    });
  });
});