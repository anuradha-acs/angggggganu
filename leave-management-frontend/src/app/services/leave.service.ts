
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Leave {
  LEAVEID?: number;
  EMPLOYID: string;
  EMPNAME?: string;
  DATESTART: string;
  DATEEND: string;
  NODAYS: number;
  SHIFTTIME: string;
  TYPEOFLEAVE: string;
  REASON: string;
  LEAVESTATUS: string;
  ADMINREMARKS?: string;
  DATEPOSTED?: string;
  COMPANY?: string;
  DEPARTMENT?: string;
}

export interface LeaveRequest {
  EMPLOYID: string;
  DATESTART: string;
  DATEEND: string;
  NODAYS: number;
  SHIFTTIME: string;
  TYPEOFLEAVE: string;
  REASON: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://0.0.0.0:5000/api/leaves';

  constructor(private http: HttpClient) {}

  getAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(this.apiUrl);
  }

  getMyLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/my-leaves`);
  }

  getPendingLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/pending`);
  }

  getApprovedLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/approved`);
  }

  getRejectedLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/rejected`);
  }

  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.apiUrl}/${id}`);
  }

  createLeave(leaveRequest: LeaveRequest): Observable<any> {
    return this.http.post(this.apiUrl, leaveRequest);
  }

  updateLeave(id: number, leaveData: Partial<Leave>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, leaveData);
  }

  updateLeaveStatus(id: number, status: string, remarks: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      LEAVESTATUS: status,
      ADMINREMARKS: remarks
    });
  }

  approveLeave(id: number, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, { remarks });
  }

  rejectLeave(id: number, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, { remarks });
  }

  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Leave {
  LEAVEID?: number;
  EMPID: string;
  LEAVETYPE: string;
  LEAVEDAYS: number;
  STARTDATE: string;
  ENDDATE: string;
  REASON: string;
  STATUS?: string;
  REMARKS?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:5000/api/leaves';

  constructor(private http: HttpClient) {}

  getAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(this.apiUrl);
  }

  getMyLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/my-leaves`);
  }

  getPendingLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/pending`);
  }

  getApprovedLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/approved`);
  }

  getRejectedLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/rejected`);
  }

  getLeaveById(id: number): Observable<Leave> {
    return this.http.get<Leave>(`${this.apiUrl}/${id}`);
  }

  createLeave(leave: Leave): Observable<any> {
    return this.http.post(this.apiUrl, leave);
  }

  updateLeave(id: number, leave: Leave): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, leave);
  }

  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  approveLeave(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectLeave(id: number, remarks?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, { remarks });
  }
}
