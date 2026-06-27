import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastService } from './services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    @if (toastService.toast$().visible) {
      <div
        class="toast"
        [class.toast-success]="toastService.toast$().type === 'success'"
        [class.toast-error]="toastService.toast$().type === 'error'"
        [attr.data-test-id]="'toast-notification'"
      >
        {{ toastService.toast$().message }}
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
    }
    .main-content {
      padding: 24px;
      background: #f5f7fa;
      min-height: calc(100vh - 60px);
    }
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 16px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }
    .toast-success {
      background: #28a745;
    }
    .toast-error {
      background: #dc3545;
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class AppComponent {
  constructor(public toastService: ToastService) {}
}