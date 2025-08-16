
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Company {
  COMPANYID: number;
  COMPANYNAME: string;
  COMPANYLOCATION: string;
  COMPANYCONTACT: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/companies`);
  }

  getCompany(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/companies/${id}`);
  }

  createCompany(company: Partial<Company>): Observable<any> {
    return this.http.post(`${this.apiUrl}/companies`, company);
  }

  updateCompany(id: number, company: Partial<Company>): Observable<any> {
    return this.http.put(`${this.apiUrl}/companies/${id}`, company);
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/companies/${id}`);
  }
}
