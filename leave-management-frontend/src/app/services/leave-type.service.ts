
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveType {
  LEAVETYPEID?: number;
  LEAVETYPE: string;
  DESCRIPTION?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  private apiUrl = 'http://0.0.0.0:5000/api/leave-types';

  constructor(private http: HttpClient) {}

  getAllLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(this.apiUrl);
  }

  getLeaveTypeById(id: number): Observable<LeaveType> {
    return this.http.get<LeaveType>(`${this.apiUrl}/${id}`);
  }

  createLeaveType(leaveType: LeaveType): Observable<any> {
    return this.http.post(this.apiUrl, leaveType);
  }

  updateLeaveType(id: number, leaveType: LeaveType): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, leaveType);
  }

  deleteLeaveType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LeaveType {
  LEAVETYPEID?: number;
  LEAVETYPE: string;
  LEAVEDAYS: number;
  LEAVETYPESTATUS?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {
  private apiUrl = 'http://localhost:5000/api/leave-types';

  constructor(private http: HttpClient) {}

  getAllLeaveTypes(): Observable<LeaveType[]> {
    return this.http.get<LeaveType[]>(this.apiUrl);
  }

  getLeaveTypeById(id: number): Observable<LeaveType> {
    return this.http.get<LeaveType>(`${this.apiUrl}/${id}`);
  }

  createLeaveType(leaveType: LeaveType): Observable<any> {
    return this.http.post(this.apiUrl, leaveType);
  }

  updateLeaveType(id: number, leaveType: LeaveType): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, leaveType);
  }

  deleteLeaveType(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
