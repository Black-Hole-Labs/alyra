import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface AddEmailDto {
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendEmail(email: string): Observable<any> {
    const payload: AddEmailDto = { email };
    return this.http.post(`${this.apiUrl}/sheets/email`, payload);
  }
}
