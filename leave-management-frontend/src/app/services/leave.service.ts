import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Leave {
  LEAVEID: number;
  EMPLOYID: string;
  DATESTART: string;
  DATEEND: string;
  NODAYS: number;
  SHIFTTIME: string;
  TYPEOFLEAVE: string;
  REASON: string;
  LEAVESTATUS: string;
  ADMINREMARKS: string;
  DATEPOSTED: string;
  employee_name?: string;
}

export interface LeaveRequest {
  employeeId: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  shiftTime: string;
  noDays: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/leaves`);
  }

  getMyLeaves(empId: string): Observable<Leave[]> {
    const params = new HttpParams().set('empId', empId);
    return this.http.get<Leave[]>(`${this.apiUrl}/leaves/my-leaves`, { params });
  }

  getPendingLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/leaves/pending`);
  }

  createLeave(leave: LeaveRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/leaves`, leave);
  }

  updateLeaveStatus(leaveId: number, status: string, remarks: string = ''): Observable<any> {
    return this.http.put(`${this.apiUrl}/leaves/${leaveId}`, { status, remarks });
  }

  deleteLeave(leaveId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/leaves/${leaveId}`);
  }
}