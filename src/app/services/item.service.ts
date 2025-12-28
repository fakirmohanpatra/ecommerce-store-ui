import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ItemResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends ApiService {

  getAllItems(): Observable<ItemResponse[]> {
    return this.get<ItemResponse[]>('/api/items');
  }

  getItemById(itemId: string): Observable<ItemResponse> {
    return this.get<ItemResponse>(`/api/items/${itemId}`);
  }
}