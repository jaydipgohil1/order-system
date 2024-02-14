import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpService) { }

  getOrdersList(): Observable<any> {
    return this.http.get(`order`);
  }

  addOrder(payload: any): Observable<any> {
    return this.http.post(`order`, payload);
  }

  updateOrder(id: string, payload: any): Observable<any> {
    return this.http.patch(`order/${id}`, payload);
  }

  deleteOrder(id: String): Observable<any> {
    return this.http.delete(`order/${id}`);
  }

}
