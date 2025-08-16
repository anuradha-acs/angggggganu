import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveType {
  LEAVETYPEID: number;
  LEAVETYPE: string;
  DESCRIPTION: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(`${this.apiUrl}/leave-types`);
  }

  getLeaveType(id: number): Observable<LeaveType> {
    return this.http.get<LeaveType>(`${this.apiUrl}/leave-types/${id}`);
  }

  createLeaveType(leaveType: Partial<LeaveType>): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave-types`, leaveType);
  }

  updateLeaveType(id: number, leaveType: Partial<LeaveType>): Observable<any> {
    return this.http.put(`${this.apiUrl}/leave-types/${id}`, leaveType);
  }

  deleteLeaveType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/leave-types/${id}`);
  }
}