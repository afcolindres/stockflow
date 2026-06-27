import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <h1>inventory-app</h1>
      <p>Hola Mundo - StockFlow</p>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      font-family: 'Poppins', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    h1 {
      color: #183473;
    }
    p {
      color: #666;
    }
  `]
})
export class AppComponent {}