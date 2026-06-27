import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductResponse, IProductDetailResponse } from '../models/product.model';
import { IMovementRequest, IMovementResponse, IMovementHistoryResponse } from '../models/movement.model';
import { IAlertsResponse } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/v1';

  getProducts(page = 0, size = 10, category?: string): Observable<IProductResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<IProductResponse>(`${this.baseUrl}/products`, { params });
  }

  getProductById(id: number): Observable<IProductDetailResponse> {
    return this.http.get<IProductDetailResponse>(`${this.baseUrl}/products/${id}`);
  }

  createMovement(request: IMovementRequest): Observable<IMovementResponse> {
    return this.http.post<IMovementResponse>(`${this.baseUrl}/movements`, request);
  }

  getAlerts(): Observable<IAlertsResponse> {
    return this.http.get<IAlertsResponse>(`${this.baseUrl}/alerts`);
  }

  getMovementHistory(productId: number): Observable<IMovementHistoryResponse> {
    return this.http.get<IMovementHistoryResponse>(`${this.baseUrl}/movements/${productId}/history`);
  }

  getCategories(): Observable<ICategoriesResponse> {
    return this.http.get<ICategoriesResponse>(`${this.baseUrl}/categories`);
  }
}

export interface ICategoriesResponse {
  statusCode: number;
  message: string;
  data: string[];
}