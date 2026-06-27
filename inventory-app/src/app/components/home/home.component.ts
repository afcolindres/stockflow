import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home">
      <h2>Hola Mundo - StockFlow</h2>
      <p>Bienvenido a inventory-app</p>
    </div>
  `,
  styles: [`
    .home {
      padding: 20px;
      text-align: center;
    }
    h2 {
      color: #183473;
    }
    p {
      color: #666;
    }
  `]
})
export class HomeComponent {}