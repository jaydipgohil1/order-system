import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpService) { }

  getCustomersList(): Observable<any> {
    return this.http.get(`customer`);
  }

  addCustomer(payload: any): Observable<any> {
    return this.http.post(`customer`, payload);
  }

  updateCustomer(id: string, payload: any): Observable<any> {
    return this.http.patch(`customer/${id}`, payload);
  }

  deleteCustomer(id: String): Observable<any> {
    return this.http.delete(`customer/${id}`);
  }

}
