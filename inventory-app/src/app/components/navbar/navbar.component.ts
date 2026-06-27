import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" data-test-id="main-navigation">
      <div class="navbar-brand">
        <span class="brand-icon">📦</span>
        <span class="brand-text">StockFlow</span>
      </div>
      <ul class="navbar-menu">
        <li>
          <a routerLink="/home" routerLinkActive="active" data-test-id="nav-home">
            Inicio
          </a>
        </li>
        <li>
          <a routerLink="/products" routerLinkActive="active" data-test-id="nav-products">
            Productos
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      background: #183473;
      color: white;
      height: 60px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
    }
    .brand-icon {
      font-size: 24px;
    }
    .navbar-menu {
      display: flex;
      list-style: none;
      gap: 24px;
      margin: 0;
      padding: 0;
    }
    .navbar-menu a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 4px;
      transition: all 0.2s ease;
      font-size: 14px;
    }
    .navbar-menu a:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    .navbar-menu a.active {
      color: white;
      background: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class NavbarComponent {}